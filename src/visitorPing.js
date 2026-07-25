/**
 * Tells the visitor-notifier worker that someone opened the site.
 *
 * Nothing is rendered and nothing is stored beyond a single localStorage flag.
 * The worker does the real dedupe; this just avoids a pointless request on
 * every subsequent visit from the same browser.
 *
 * Worker source lives in /visitor-worker.
 */

// Set after deploying the worker (`npm run deploy` in visitor-worker/ prints it).
const ENDPOINT =
  process.env.REACT_APP_VISITOR_PING_URL ||
  'https://visitor-notifier.<your-subdomain>.workers.dev';

const STORAGE_KEY = 'np:seen';

export default function pingVisitor() {
  if (!ENDPOINT || ENDPOINT.includes('<your-subdomain>')) return;

  // Don't notify on local development runs.
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }

  let alreadySeen = false;
  try {
    alreadySeen = window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // Private mode or blocked storage — fall through and let the worker dedupe.
  }
  if (alreadySeen) return;

  const body = JSON.stringify({
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || '',
    language: navigator.language || '',
    screen: `${window.screen.width}x${window.screen.height}`,
  });

  // text/plain keeps this a "simple" request, so there's no CORS preflight.
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body,
    keepalive: true,
  })
    .then(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // Nothing to do; the worker still won't double-notify.
      }
    })
    .catch(() => {
      // A failed ping must never affect the page.
    });
}
