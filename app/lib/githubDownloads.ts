export type GitHubDownloadCounts = {
  byPlatform: Record<"macos" | "windows" | "linux", number>;
  byRelease: Array<{
    tag: string;
    macos: number;
    windows: number;
    linux: number;
  }>;
};

type Release = {
  tag_name?: string;
  draft?: boolean;
  assets?: Array<{ name?: string; download_count?: number }>;
};

function platformOf(name: string): "macos" | "windows" | "linux" | null {
  const n = name.toLowerCase();
  if (n.endsWith(".sig") || n.endsWith(".json")) return null;
  if (n.endsWith(".dmg")) return "macos";
  if (n.endsWith(".exe") || n.endsWith(".msi")) return "windows";
  if (n.endsWith(".deb") || n.endsWith(".appimage") || n.endsWith(".rpm")) {
    return "linux";
  }
  return null;
}

/**
 * Installer downloads as GitHub counts them, which includes people who used a
 * direct release link and never touched blackcrab.app/download. The in-app
 * updater's archives are not installers and are left out.
 */
export async function getGitHubDownloadCounts(): Promise<GitHubDownloadCounts | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "blackcrab_landing",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const response = await fetch(
      "https://api.github.com/repos/BonJenn/blackcrab/releases?per_page=100",
      { headers, next: { revalidate: 300 } },
    );
    if (!response.ok) return null;
    const releases = (await response.json()) as Release[];
    const byPlatform = { macos: 0, windows: 0, linux: 0 };
    const byRelease: GitHubDownloadCounts["byRelease"] = [];
    for (const release of releases) {
      if (release.draft) continue;
      const row = {
        tag: release.tag_name ?? "unknown",
        macos: 0,
        windows: 0,
        linux: 0,
      };
      for (const asset of release.assets ?? []) {
        const platform = platformOf(asset.name ?? "");
        if (!platform) continue;
        const count = asset.download_count ?? 0;
        row[platform] += count;
        byPlatform[platform] += count;
      }
      if (row.macos + row.windows + row.linux > 0) byRelease.push(row);
    }
    return { byPlatform, byRelease };
  } catch {
    return null;
  }
}
