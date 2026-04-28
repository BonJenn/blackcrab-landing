import type { Metadata } from "next";
import { Footer, GITHUB_RELEASES_URL, MAC_DOWNLOAD_URL, Nav } from "../site";
import { DownloadLink } from "../DownloadLink";

const RELEASES_API =
  "https://api.github.com/repos/BonJenn/blackcrab/releases?per_page=20";

type GitHubReleaseAsset = {
  id?: number;
  name?: string;
  browser_download_url?: string;
  size?: number;
};

type GitHubRelease = {
  id?: number;
  tag_name?: string;
  name?: string | null;
  body?: string | null;
  html_url?: string;
  published_at?: string | null;
  created_at?: string | null;
  prerelease?: boolean;
  assets?: GitHubReleaseAsset[];
};

type ReleaseAsset = {
  id: string;
  name: string;
  url: string;
  sizeLabel: string | null;
  isDmg: boolean;
};

type Release = {
  id: string;
  version: string;
  title: string;
  url: string;
  displayDate: string;
  isPrerelease: boolean;
  notes: string[];
  assets: ReleaseAsset[];
};

export const metadata: Metadata = {
  title: "Blackcrab Releases",
  description:
    "Automatic Blackcrab release history with version notes and installer downloads from GitHub Releases.",
};

export default async function ReleasesPage() {
  const releases = await getReleases();
  const latest = releases[0];

  return (
    <main className="flex-1 w-full">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
          <aside className="lg:sticky lg:top-20">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Releases
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Version history and downloads.
            </h1>
            <p className="mt-4 text-muted leading-relaxed">
              This page is generated from GitHub Releases for the Blackcrab app.
              Each published release can include notes and downloadable assets.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 lg:grid">
              <DownloadLink
                href={MAC_DOWNLOAD_URL}
                platform="macos"
                className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent/90 transition text-center"
              >
                Download latest
              </DownloadLink>
              <a
                href={GITHUB_RELEASES_URL}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition text-center"
              >
                View on GitHub
              </a>
            </div>
          </aside>

          <div className="space-y-6">
            {latest ? (
              <ReleaseCard release={latest} latest />
            ) : (
              <EmptyReleases />
            )}

            {releases.length > 1 ? (
              <section className="space-y-6">
                <h2 className="text-sm font-mono uppercase tracking-wider text-muted">
                  Previous releases
                </h2>
                {releases.slice(1).map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </section>
            ) : null}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

async function getReleases(): Promise<Release[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "blackcrab_landing",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(RELEASES_API, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const releases = (await response.json()) as GitHubRelease[];
    return releases.map(normalizeRelease);
  } catch {
    return [];
  }
}

function normalizeRelease(release: GitHubRelease): Release {
  const version = release.tag_name?.trim() || "untagged";
  const title = release.name?.trim() || version;
  const publishedAt = release.published_at ?? release.created_at ?? null;
  const assets = (release.assets ?? [])
    .map(normalizeAsset)
    .filter((asset): asset is ReleaseAsset => asset !== null)
    .sort(sortAssets);

  return {
    id: String(release.id ?? version),
    version,
    title,
    url: release.html_url ?? GITHUB_RELEASES_URL,
    displayDate: formatDate(publishedAt),
    isPrerelease: release.prerelease ?? false,
    notes: extractNotes(release.body),
    assets,
  };
}

function normalizeAsset(asset: GitHubReleaseAsset): ReleaseAsset | null {
  if (!asset.name || !asset.browser_download_url) {
    return null;
  }

  return {
    id: String(asset.id ?? asset.browser_download_url),
    name: asset.name,
    url: asset.browser_download_url,
    sizeLabel: formatBytes(asset.size),
    isDmg: asset.name.toLowerCase().endsWith(".dmg"),
  };
}

function sortAssets(a: ReleaseAsset, b: ReleaseAsset) {
  if (a.isDmg !== b.isDmg) {
    return a.isDmg ? -1 : 1;
  }

  return a.name.localeCompare(b.name);
}

function extractNotes(body: string | null | undefined) {
  const notes =
    body
      ?.split(/\r?\n/)
      .map((line) => cleanMarkdownLine(line))
      .filter(isReleaseNoteLine)
      .filter((line) => line.length > 0)
      .slice(0, 6) ?? [];

  return notes.length > 0 ? notes : ["No release notes published yet."];
}

function cleanMarkdownLine(line: string) {
  return line
    .trim()
    .replace(/^#{1,6}\s+/, "")
    .replace(/^>\s*/, "")
    .replace(/^[-*+]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/^\[[ xX]\]\s+/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(
      /\s+by\s+@\S+\s+in\s+https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/,
      " (#$1)",
    )
    .replace(/[*_`~]/g, "")
    .trim();
}

function isReleaseNoteLine(line: string) {
  const normalized = line.toLowerCase();
  return (
    normalized.length > 0 &&
    normalized !== "what's changed" &&
    normalized !== "new contributors" &&
    !normalized.startsWith("full changelog")
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unpublished";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatBytes(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size >= 10 ? size.toFixed(0) : size.toFixed(1)} ${units[unitIndex]}`;
}

function ReleaseCard({
  release,
  latest = false,
}: {
  release: Release;
  latest?: boolean;
}) {
  const visibleAssets = release.assets.filter(isVisibleDownloadAsset);
  const primaryAsset =
    visibleAssets.find((asset) => asset.isDmg) ?? visibleAssets[0];
  const secondaryAssets = visibleAssets.filter(
    (asset) => asset.id !== primaryAsset?.id,
  );

  return (
    <article className="rounded-xl border border-border bg-white/[0.02] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted">
        <span className="text-accent">{release.version}</span>
        {latest ? <span>Latest</span> : null}
        {release.isPrerelease ? <span>Prerelease</span> : null}
        <span>{release.displayDate}</span>
      </div>

      <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
        {release.title}
      </h2>

      <ul className="mt-5 space-y-3 list-disc pl-5 text-muted leading-relaxed">
        {release.notes.map((note, index) => (
          <li key={`${release.id}-${index}`}>{note}</li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        {primaryAsset ? (
          <DownloadAssetLink asset={primaryAsset} primary />
        ) : null}
        <a
          href={release.url}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
        >
          Full release notes
        </a>
      </div>

      {secondaryAssets.length > 0 ? (
        <details className="mt-6 rounded-lg border border-border bg-background/60 p-4">
          <summary className="cursor-pointer text-sm font-medium text-muted hover:text-foreground transition">
            {`Show ${secondaryAssets.length} additional download ${
              secondaryAssets.length === 1 ? "artifact" : "artifacts"
            }`}
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {secondaryAssets.map((asset) => (
              <DownloadAssetLink key={asset.id} asset={asset} />
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}

function isVisibleDownloadAsset(asset: ReleaseAsset) {
  const name = asset.name.toLowerCase();
  return !name.endsWith(".sig") && name !== "latest.json";
}

function DownloadAssetLink({
  asset,
  primary = false,
}: {
  asset: ReleaseAsset;
  primary?: boolean;
}) {
  return (
    <a
      href={asset.url}
      className={
        primary
          ? "rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          : "rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition min-w-0"
      }
    >
      <span className="break-all">
        {asset.isDmg ? "Download macOS .dmg" : asset.name}
      </span>
      {asset.sizeLabel ? (
        <span className={primary ? "ml-2 opacity-70" : "ml-2 text-muted"}>
          {asset.sizeLabel}
        </span>
      ) : null}
    </a>
  );
}

function EmptyReleases() {
  return (
    <section className="rounded-xl border border-border bg-white/[0.02] p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Releases are not available right now.
      </h2>
      <p className="mt-4 text-muted leading-relaxed">
        GitHub Releases did not return published release data. The latest
        installer link still points to the official Blackcrab release channel.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <DownloadLink
          href={MAC_DOWNLOAD_URL}
          platform="macos"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Download latest
        </DownloadLink>
        <a
          href={GITHUB_RELEASES_URL}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
        >
          View GitHub releases
        </a>
      </div>
    </section>
  );
}
