import { NextResponse } from "next/server";

const LATEST_RELEASE_API =
  "https://api.github.com/repos/BonJenn/blackcrab/releases/latest";
const RELEASES_FALLBACK =
  "https://github.com/BonJenn/blackcrab/releases/latest";

type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

type GitHubRelease = {
  assets?: ReleaseAsset[];
};

export async function GET() {
  try {
    const res = await fetch(LATEST_RELEASE_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "blackcrab_landing",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.redirect(RELEASES_FALLBACK, 302);
    }

    const release = (await res.json()) as GitHubRelease;
    const assets = release.assets ?? [];
    const dmgAssets = assets.filter((asset) => {
      const name = asset.name?.toLowerCase() ?? "";
      return name.endsWith(".dmg") && !!asset.browser_download_url;
    });

    const preferred =
      dmgAssets.find((asset) =>
        /universal|aarch64|arm64/.test(asset.name?.toLowerCase() ?? ""),
      ) ?? dmgAssets[0];

    return NextResponse.redirect(
      preferred?.browser_download_url ?? RELEASES_FALLBACK,
      302,
    );
  } catch {
    return NextResponse.redirect(RELEASES_FALLBACK, 302);
  }
}
