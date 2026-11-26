# Blackcrab Landing

Next.js landing site for Blackcrab.

## Development

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Downloads

The platform download buttons point to stable redirect routes:

```text
/download/macos
/download/windows
/download/linux
```

Each route queries the latest GitHub Release for `BonJenn/blackcrab`, finds the
best installer for that platform, and redirects the user to the asset's GitHub
download URL. If no matching asset is available, it redirects to the latest
release page.

This keeps the landing page URL stable across app versions.

## Analytics

The site uses Vercel Analytics and Google Analytics 4. Production defaults to
the Blackcrab GA4 stream, and this environment variable can override it:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Download buttons call:

```ts
download_clicked({
  platform: "macos" | "windows" | "linux",
  source: "landing" | "releases",
});
```

Use Vercel Analytics, Google Analytics, or the Neon admin page to count website
download clicks. The download redirect routes also write `download_redirect`
events to Neon when `DATABASE_URL` is configured.

Apply the SQL migrations in `supabase/migrations` to the Neon database. The
admin dashboard is available at:

```text
/admin?key=ADMIN_SECRET
```

Use GitHub Releases asset `download_count` to count actual installer downloads:

```sh
gh api repos/BonJenn/blackcrab/releases \
  --jq '.[] | {tag: .tag_name, assets: [.assets[] | {name, downloads: .download_count}]}'
```

Those numbers will not always match. A click can fail, bots may download
assets, and users may download directly from GitHub without visiting the site.

### App and updater events

The desktop app can report anonymous product events to:

```text
POST /api/events
```

Accepted event types:

```text
app_launch
update_check
update_started
update_completed
update_failed
```

Recommended payloads:

```json
{
  "event_type": "app_launch",
  "platform": "macos",
  "current_version": "v0.1.0",
  "anonymous_install_id": "locally-generated-uuid"
}
```

```json
{
  "event_type": "update_completed",
  "platform": "macos",
  "from_version": "v0.1.0",
  "to_version": "v0.1.1",
  "anonymous_install_id": "locally-generated-uuid"
}
```

`anonymous_install_id` is hashed before storage. The endpoint does not store IP
addresses. If `EVENT_INGEST_SECRET` is set, clients must send it as either a
Bearer token or `X-Blackcrab-Events-Key` header.

The Neon admin page reports download redirects, update funnel counts, completed
updates by target version and version path, and active installs by version from
the latest `app_launch` event per anonymous install in the last 30 days.

## Billing (Blackcrab Remote)

Hosted remote access is $5/month or $48/year with a 14-day trial, charged by
Stripe Checkout on the web. The desktop app starts checkout; the iOS app only
signs in and reads the plan, with no purchase path. Everything runs in this
site's routes and its Postgres database (the same `DATABASE_URL` as analytics).

- `supabase/migrations/003_billing.sql`: `billing_accounts`,
  `billing_subscriptions`, `stripe_webhook_events`. Apply it to the Neon
  database like the earlier migrations.
- `POST /api/billing/checkout` `{interval: "month"|"year"}` returns a Checkout
  URL. `POST /api/billing/portal` returns a customer portal URL.
  `GET /api/billing/entitlement` returns `{plan: "free"|"remote", ...}`.
  All three take the caller's Clerk session token as a bearer token. The
  entitlement route also accepts `BILLING_ENTITLEMENT_SECRET` plus
  `?account_id=` for the relay.
- `POST /api/stripe/webhook` verifies the signature, ignores duplicates, and
  re-reads the subscription from Stripe before storing it.
- `scripts/stripe-setup.mjs` creates the product, prices, portal configuration
  and webhook in whichever Stripe account the key belongs to. Run it once per
  account (sandbox, then live).

Server env vars (none are printed or committed): `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `CLERK_ISSUER`, `BILLING_ENTITLEMENT_SECRET`, and
optionally `CLERK_AUTHORIZED_PARTIES`, `STRIPE_PORTAL_CONFIGURATION_ID`,
`BILLING_SITE_URL`. Every route returns 503 until its variables exist, and the
Stripe key decides sandbox or live: a sandbox subscription never grants access
in live mode. `npm run test:billing` runs the logic tests.

## Deployment

Deploy this project on Vercel. The download route uses the public GitHub API and
does not require a token. Set `DATABASE_URL`, `ADMIN_SECRET`, and optionally
`INSTALL_ID_SALT` and `EVENT_INGEST_SECRET` for Neon-backed analytics.
