import { getSql } from "./db";

export type DownloadStats = {
  total: number;
  by_platform: Record<string, number> | null;
  by_version: Array<{ version: string; count: number }> | null;
  by_combo: Array<{ platform: string; version: string; count: number }> | null;
  daily_last_30: Array<{ day: string; count: number }> | null;
};

export async function trackDownload(platform: string, version: string) {
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`INSERT INTO downloads (platform, version) VALUES (${platform}, ${version})`;
  } catch {
    // Never let tracking failures break a download redirect
  }
}

export async function getDownloadStats(): Promise<DownloadStats | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT get_download_stats()`;
    return rows[0]?.get_download_stats as DownloadStats ?? null;
  } catch {
    return null;
  }
}
