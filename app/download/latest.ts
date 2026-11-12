import { NextResponse } from "next/server";
import { trackDownload } from "../lib/tracking";
import { selectReleaseDownload, type DownloadPlatform, type GitHubRelease } from "./assets";

const RELEASES_API = "https://api.github.com/repos/BonJenn/blackcrab/releases";
const RELEASES_FALLBACK = "https://github.com/BonJenn/blackcrab/releases";

async function fetchReleaseData(suffix: string) {
  return fetch(RELEASES_API + suffix, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "blackcrab_landing" },
    next: { revalidate: 300 },
  });
}

export async function redirectToLatestDownload(platform: DownloadPlatform) {
  try {
    const latest = await fetchReleaseData("/latest");
    let selected = latest.ok
      ? selectReleaseDownload([await latest.json() as GitHubRelease], platform)
      : null;
    // Mac-only releases must not strand existing Windows/Linux download links.
    if (!selected) {
      const history = await fetchReleaseData("?per_page=100");
      if (history.ok) selected = selectReleaseDownload(await history.json() as GitHubRelease[], platform);
    }
    if (!selected) return NextResponse.redirect(RELEASES_FALLBACK, 302);
    await trackDownload(platform, selected.version);
    return NextResponse.redirect(selected.asset.browser_download_url!, 302);
  } catch {
    return NextResponse.redirect(RELEASES_FALLBACK, 302);
  }
}
