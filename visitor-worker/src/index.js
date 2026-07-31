/**
 * Unique-visitor notifier.
 *
 * Receives a ping from the portfolio front-end, works out whether this is a
 * visitor we've seen before, and emails a one-off notification if it isn't.
 *
 * Dedupe is keyed on a salted SHA-256 of (IP + user-agent) stored in KV, so
 * the raw IP never gets written to storage.
 */

// Flip to true if you'd rather see the complete IP in the email than a masked
// one. The dedupe key is a salted hash either way.
const SHOW_FULL_IP = false;

// Running total of unique visitors, kept alongside the visitor keys in KV.
const COUNT_KEY = 'meta:unique-count';

// Crawlers, link unfurlers and uptime checks. These hit the site constantly
// (every Slack/LinkedIn/WhatsApp paste triggers one) and are not people.
const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|preview|fetcher|scrape|monitor|curl|wget|python-requests|axios|headless|lighthouse|pingdom|uptime|facebookexternalhit|whatsapp|telegram|discord|slackbot|twitterbot|linkedinbot|embedly|quora link|bitlybot|vkshare|redditbot|applebot|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexity/i;

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method not allowed' }, 405, cors);
    }

    const userAgent = request.headers.get('User-Agent') || '';
    if (BOT_PATTERN.test(userAgent)) {
      return json({ status: 'ignored', reason: 'bot' }, 200, cors);
    }

    // Sent as text/plain by the client so the browser skips the CORS preflight.
    let payload = {};
    try {
      payload = JSON.parse(await request.text());
    } catch {
      // A malformed body isn't worth failing over; the headers carry the
      // parts we actually care about.
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';
    if (!ip) {
      return json({ error: 'no client ip' }, 400, cors);
    }

    const visitorId = await hash(`${ip}|${userAgent}`, env.HASH_SALT || '');
    const key = `visitor:${visitorId}`;

    if (await env.VISITORS.get(key)) {
      return json({ status: 'known' }, 200, cors);
    }

    // Where this person falls in the all-time sequence.
    const visitNumber = (Number(await env.VISITORS.get(COUNT_KEY)) || 0) + 1;

    const visit = buildVisit({ request, payload, ip, userAgent, visitorId, visitNumber, env });

    // Email first, then record. If the send fails we'd rather get a duplicate
    // notification later than silently lose this visitor forever.
    const sent = await sendEmail(visit, env);
    if (!sent.ok) {
      return json({ error: 'email failed', detail: sent.detail }, 502, cors);
    }

    await Promise.all([
      env.VISITORS.put(
        key,
        JSON.stringify({ firstSeen: visit.isoTime, city: visit.city, country: visit.country }),
      ),
      env.VISITORS.put(COUNT_KEY, String(visitNumber)),
    ]);

    return json({ status: 'new', visitNumber }, 200, cors);
  },
};

function buildVisit({ request, payload, ip, userAgent, visitorId, visitNumber, env }) {
  const cf = request.cf || {};
  const now = new Date();
  const zone = env.REPORT_TIMEZONE || 'UTC';

  return {
    visitorId,
    visitNumber,
    ip: SHOW_FULL_IP ? ip : maskIp(ip),
    ipIsMasked: !SHOW_FULL_IP,
    city: cf.city || 'Unknown',
    region: cf.region || '',
    country: cf.country || request.headers.get('CF-IPCountry') || '',
    postalCode: cf.postalCode || '',
    network: cf.asOrganization || '',
    visitorTimezone: cf.timezone || '',
    ...describeClient(userAgent),
    userAgent,
    page: cleanUrl(payload.path) || '/',
    referrer: cleanUrl(payload.referrer) || 'Direct / none',
    language: String(payload.language || '').slice(0, 35),
    screen: String(payload.screen || '').slice(0, 20),
    isoTime: now.toISOString(),
    localTime: formatTime(now, zone),
    zone,
  };
}

/** Mask the host portion so the address stays useful but stops being an identifier. */
function maskIp(ip) {
  if (ip.includes(':')) {
    const groups = ip.split(':').filter(Boolean);
    return `${groups.slice(0, 3).join(':')}:••••`;
  }
  const octets = ip.split('.');
  return octets.length === 4 ? `${octets.slice(0, 3).join('.')}.•••` : '•••';
}

async function hash(value, salt) {
  const bytes = new TextEncoder().encode(`${salt}|${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Rough browser/OS/device read from the user-agent. Order matters: several
 * browsers impersonate Chrome and Safari in their UA string.
 */
function describeClient(ua) {
  const browser =
    /Edg\//.test(ua) ? 'Edge'
    : /OPR\/|Opera/.test(ua) ? 'Opera'
    : /SamsungBrowser/.test(ua) ? 'Samsung Internet'
    : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari'
    : 'Unknown browser';

  const os =
    /Windows NT 10/.test(ua) ? 'Windows 10/11'
    : /Windows/.test(ua) ? 'Windows'
    : /iPhone|iPad|iPod/.test(ua) ? 'iOS'
    : /Android/.test(ua) ? 'Android'
    : /Mac OS X/.test(ua) ? 'macOS'
    : /Linux/.test(ua) ? 'Linux'
    : 'Unknown OS';

  const device =
    /iPad|Tablet/.test(ua) ? 'Tablet'
    : /Mobi|iPhone|Android.*Mobile/.test(ua) ? 'Mobile'
    : 'Desktop';

  return { browser, os, device };
}

function cleanUrl(value) {
  const str = String(value || '').trim();
  if (!str || str.length > 300) return '';
  return str;
}

function formatTime(date, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return date.toUTCString();
  }
}

function location(v) {
  const parts = [v.city, v.region, v.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Unknown location';
}

async function sendEmail(v, env) {
  if (!env.RESEND_API_KEY) {
    return { ok: false, detail: 'RESEND_API_KEY is not set' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [env.EMAIL_TO],
      subject: `Visitor #${v.visitNumber} - ${location(v)}`,
      html: emailHtml(v),
    }),
  });

  if (!response.ok) {
    return { ok: false, detail: `${response.status} ${await response.text()}` };
  }
  return { ok: true };
}

function emailHtml(v) {
  const rows = [
    ['Location', location(v)],
    ['Network', v.network],
    ['IP', v.ipIsMasked ? `${v.ip} <span style="opacity:.6">(masked)</span>` : v.ip],
    ['Visitor ID', `<code style="font-size:12px">${v.visitorId.slice(0, 16)}</code>`],
    ['Device', `${v.browser} on ${v.os} · ${v.device}`],
    ['Screen', v.screen],
    ['Language', v.language],
    ['Page', v.page],
    ['Referrer', v.referrer],
    ['Time', `${v.localTime} (${v.zone})`],
    ['Visitor local time', v.visitorTimezone],
  ].filter(([, value]) => value);

  const cells = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:9px 16px 9px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f3">${label}</td>
        <td style="padding:9px 0;color:#111827;font-size:14px;vertical-align:top;border-bottom:1px solid #f0f0f3;word-break:break-word">${value}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e6e7eb;border-radius:12px;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid #f0f0f3">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280">New unique visitor</div>
        <div style="font-size:20px;font-weight:600;color:#111827;margin-top:4px">${location(v)}</div>
      </div>
      <div style="padding:8px 24px 20px">
        <table style="width:100%;border-collapse:collapse">${cells}</table>
      </div>
      <div style="padding:16px 24px;background:#fafafb;border-top:1px solid #f0f0f3">
        <div style="font-size:26px;font-weight:700;color:#111827;line-height:1">${v.visitNumber}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">
          unique visitors to date · repeat visits don't email you again
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = request.headers.get('Origin') || '';
  const allow = allowed.includes(origin) ? origin : allowed[0] || '';

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
