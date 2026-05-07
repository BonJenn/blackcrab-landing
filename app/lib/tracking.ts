import { getSql } from "./db";
import { createHash } from "crypto";

export type EventType =
  | "download_redirect"
  | "app_launch"
  | "update_check"
  | "update_started"
  | "update_completed"
  | "update_failed";

export type AnalyticsEventInput = {
  eventType: EventType;
  platform?: string | null;
  version?: string | null;
  fromVersion?: string | null;
  toVersion?: string | null;
  installId?: string | null;
  source?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
};

type VersionCount = { version: string; count: number };
type VersionPairCount = {
  from_version: string;
  to_version: string;
  count: number;
};
type EventTypeCount = { event_type: EventType; count: number };

export type DownloadStats = {
  total: number;
  total_download_redirects: number;
  by_platform: Record<string, number> | null;
  by_version: VersionCount[] | null;
  by_combo: Array<{ platform: string; version: string; count: number }> | null;
  daily_last_30: Array<{ day: string; count: number }> | null;
  events_by_type: EventTypeCount[] | null;
  update_funnel: EventTypeCount[] | null;
  update_checks: VersionPairCount[] | null;
  updates_completed_by_version: VersionCount[] | null;
  updates_completed_by_combo: VersionPairCount[] | null;
  active_installs_total: number;
  active_by_version: VersionCount[] | null;
};

export async function trackDownload(platform: string, version: string) {
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`INSERT INTO downloads (platform, version) VALUES (${platform}, ${version})`;
  } catch {
    // Never let tracking failures break a download redirect
  }

  await trackEvent({
    eventType: "download_redirect",
    platform,
    version,
    source: "download_route",
  });
}

export async function trackEvent(event: AnalyticsEventInput) {
  const sql = getSql();
  if (!sql) return false;

  const metadataJson = JSON.stringify(normalizeMetadata(event.metadata));
  const installHash = hashInstallId(event.installId);

  try {
    await sql`
      INSERT INTO events (
        event_type,
        platform,
        version,
        from_version,
        to_version,
        install_hash,
        source,
        user_agent,
        metadata
      )
      VALUES (
        ${event.eventType},
        ${cleanText(event.platform)},
        ${cleanText(event.version)},
        ${cleanText(event.fromVersion)},
        ${cleanText(event.toVersion)},
        ${installHash},
        ${cleanText(event.source)},
        ${cleanText(event.userAgent, 300)},
        ${metadataJson}::jsonb
      )
    `;
    return true;
  } catch {
    // Telemetry should never break app or download flows.
    return false;
  }
}

export async function getDownloadStats(): Promise<DownloadStats | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT get_event_stats()`;
    return rows[0]?.get_event_stats as DownloadStats ?? null;
  } catch {
    return null;
  }
}

function cleanText(value: string | null | undefined, maxLength = 80) {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  if (!clean) return null;
  return clean.slice(0, maxLength);
}

function normalizeMetadata(value: Record<string, unknown> | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const json = JSON.stringify(value);
  if (json.length > 4000) {
    return { truncated: true };
  }

  return value;
}

function hashInstallId(installId: string | null | undefined) {
  const clean = cleanText(installId, 200);
  if (!clean) return null;

  const salt = process.env.INSTALL_ID_SALT ?? "blackcrab-install-id";
  return createHash("sha256").update(`${salt}:${clean}`).digest("hex");
}
