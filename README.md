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

## Deployment

Deploy this project on Vercel. The download route uses the public GitHub API and
does not require a token. Set `DATABASE_URL`, `ADMIN_SECRET`, and optionally
`INSTALL_ID_SALT` and `EVENT_INGEST_SECRET` for Neon-backed analytics.
