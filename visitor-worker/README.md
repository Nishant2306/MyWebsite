# Visitor notifier

Emails `nishantchaudhary0512@gmail.com` the **first** time a person opens
nishcodes.com. Repeat visits are silent.

Each email is subject-lined `Visitor #47 - Bloomington, Indiana, US` and ends
with the all-time unique-visitor total.

- Runs on Cloudflare Workers (free tier), independent of GitHub Pages.
- No DNS changes - the worker lives on its own `*.workers.dev` URL.
- Dedupe key is a salted SHA-256 of IP + user-agent, stored in Workers KV.
  The raw IP is never written to storage, and the email shows a masked IP by
  default (`203.0.113.•••`).

## Setup

Everything below is one-time.

### 1. Resend account + API key

Sign up at [resend.com](https://resend.com) **using nishantchaudhary0512@gmail.com**,
then create an API key. The free tier is 3,000 emails/month.

The default sender `onboarding@resend.dev` works with no domain verification,
but Resend only allows it to send to your own account address - which is exactly
the address we want. If you later verify `nishcodes.com` in Resend, update
`EMAIL_FROM` in `wrangler.toml`.

### 2. Install and log in

```bash
cd visitor-worker && npm install && npx wrangler login
```

### 3. Create the KV namespace

```bash
npx wrangler kv namespace create VISITORS
```

Copy the printed `id` into `wrangler.toml`, replacing `PASTE_KV_NAMESPACE_ID_HERE`.

### 4. Set the two secrets

```bash
npx wrangler secret put RESEND_API_KEY
```

```bash
npx wrangler secret put HASH_SALT
```

`HASH_SALT` is any long random string - it's what stops the stored hashes from
being reversible back to an IP. Generate one with `openssl rand -hex 32`.
Never change it later or every visitor looks new again.

### 5. Deploy

```bash
npx wrangler deploy
```

This prints your worker URL, e.g. `https://visitor-notifier.nishant.workers.dev`.

### 6. Point the site at it

Put that URL in `ENDPOINT` at the top of [`../src/visitorPing.js`](../src/visitorPing.js),
then commit and push - the existing GitHub Actions workflow redeploys the site.

## Checking on it

```bash
npx wrangler tail
```

Streams live requests. Useful if emails aren't arriving.

To see stored keys (one `visitor:<hash>` per person, plus `meta:unique-count`):

```bash
npx wrangler kv key list --binding VISITORS
```

Deleting a `visitor:` key makes that person count as new again. To correct the
running total, overwrite it directly:

```bash
npx wrangler kv key put --binding VISITORS meta:unique-count 0
```

## Notes

- **Uniqueness is approximate.** Mobile carriers put many users behind one IP,
  and home IPs rotate. You'll get close, not exact.
- **Geo is city-level** and VPN users will show the wrong city.
- Crawlers and link unfurlers are filtered by user-agent in `src/index.js`.
- Ad blockers may block the request for some visitors; those visits go unseen.
- KV entries never expire, so "unique" means all-time. Add `expirationTtl` to
  the `.put()` call if you'd rather it reset after N seconds.
- The total is a read-then-write on one KV key. Two brand-new visitors landing
  in the same instant could share a number. At portfolio traffic that's
  effectively never, and it only affects the displayed count, not who gets
  emailed.
