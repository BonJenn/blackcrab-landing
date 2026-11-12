export type DownloadPlatform = "macos" | "windows" | "linux";

export type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

export type GitHubRelease = {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: ReleaseAsset[];
};

export function selectReleaseDownload(releases: GitHubRelease[], platform: DownloadPlatform) {
  for (const release of releases) {
    if (release.draft || release.prerelease) continue;
    const asset = selectPlatformAsset(release.assets ?? [], platform);
    if (asset) return { asset, version: release.tag_name ?? "unknown" };
  }
  return null;
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
