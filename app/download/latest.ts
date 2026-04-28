import { NextResponse } from "next/server";

const LATEST_RELEASE_API =
  "https://api.github.com/repos/BonJenn/blackcrab/releases/latest";
const RELEASES_FALLBACK =
  "https://github.com/BonJenn/blackcrab/releases/latest";

export type DownloadPlatform = "macos" | "windows" | "linux";

type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

type GitHubRelease = {
  assets?: ReleaseAsset[];
};

export async function redirectToLatestDownload(platform: DownloadPlatform) {
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
    const preferred = selectPlatformAsset(release.assets ?? [], platform);

    return NextResponse.redirect(
      preferred?.browser_download_url ?? RELEASES_FALLBACK,
      302,
    );
  } catch {
    return NextResponse.redirect(RELEASES_FALLBACK, 302);
  }
}

function selectPlatformAsset(
  assets: ReleaseAsset[],
  platform: DownloadPlatform,
) {
  return assets
    .filter((asset) => asset.browser_download_url)
    .map((asset) => ({ asset, score: scoreAsset(asset.name ?? "", platform) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.asset;
}

function scoreAsset(assetName: string, platform: DownloadPlatform) {
  const name = assetName.toLowerCase();

  if (name.endsWith(".sig") || name === "latest.json") {
    return 0;
  }

  if (platform === "macos") {
    if (name.endsWith(".dmg") && name.includes("universal")) {
      return 30;
    }
    if (name.endsWith(".dmg")) {
      return 20;
    }
    if (name.endsWith(".app.tar.gz")) {
      return 10;
    }
  }

  if (platform === "windows") {
    if (name.endsWith("-setup.exe")) {
      return 30;
    }
    if (name.endsWith(".exe")) {
      return 20;
    }
    if (name.endsWith(".msi")) {
      return 10;
    }
  }

  if (platform === "linux") {
    if (name.endsWith(".appimage")) {
      return 30;
    }
    if (name.endsWith(".deb")) {
      return 20;
    }
    if (name.endsWith(".rpm")) {
      return 10;
    }
  }

  return 0;
}
