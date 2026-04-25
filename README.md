# Blackcrab Landing

Next.js landing site for Blackcrab.

## Development

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Downloads

The primary macOS download button points to:

```text
/download/macos
```

That route queries the latest GitHub Release for `BonJenn/blackcrab`, finds the
first `.dmg` asset, and redirects the user to the asset's GitHub download URL.
If no `.dmg` is available, it redirects to the latest release page.

This keeps the landing page URL stable across app versions.

## Analytics

The site uses Vercel Analytics.

Download buttons call:

```ts
track("download_clicked", {
  platform: "macos",
  source: "landing",
});
```

Use Vercel Analytics to count landing-page download clicks. Use GitHub Releases
asset `download_count` to count actual installer downloads:

```sh
gh api repos/BonJenn/blackcrab/releases \
  --jq '.[] | {tag: .tag_name, assets: [.assets[] | {name, downloads: .download_count}]}'
```

Those numbers will not always match. A click can fail, bots may download
assets, and users may download directly from GitHub without visiting the site.

## Deployment

Deploy this project on Vercel. The download route uses the public GitHub API and
does not require a token.
