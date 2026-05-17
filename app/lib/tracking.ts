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
type UpdateCheckDetail = {
  platform: string;
  from_version: string;
  detected_version: string;
  available: string;
  manual: string;
  count: number;
};
type UpdateFailureDetail = {
  platform: string;
  current_version: string;
  from_version: string;
  to_version: string;
  stage: string;
  manual: string;
  error: string;
  count: number;
  first_seen: string | Date;
  last_seen: string | Date;
};
type RecentUpdateFailure = {
  created_at: string | Date;
  platform: string | null;
  current_version: string | null;
  from_version: string | null;
  to_version: string | null;
  stage: string | null;
  manual: string | null;
  error: string | null;
};
type UpdateOutcomeByInstall = {
  to_version: string;
  install_targets: number;
  started_installs: number;
  completed_installs: number;
  failed_installs: number;
};

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
  update_checks_detailed?: UpdateCheckDetail[] | null;
  update_failures?: UpdateFailureDetail[] | null;
  recent_update_failures?: RecentUpdateFailure[] | null;
  update_outcomes_by_install?: UpdateOutcomeByInstall[] | null;
  detail_rollups_available?: boolean;
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
    const stats = rows[0]?.get_event_stats as DownloadStats | undefined;
    if (!stats) return null;

    const detailResults = await Promise.allSettled([
      sql`
        SELECT
          coalesce(platform, 'unknown') AS platform,
          coalesce(from_version, version, 'unknown') AS from_version,
          coalesce(to_version, 'none detected') AS detected_version,
          CASE metadata->>'available'
            WHEN 'true' THEN 'available'
            WHEN 'false' THEN 'none'
            ELSE 'unknown'
          END AS available,
          CASE metadata->>'manual'
            WHEN 'true' THEN 'manual'
            WHEN 'false' THEN 'automatic'
            ELSE 'unknown'
          END AS manual,
          count(*)::int AS count
        FROM events
        WHERE event_type = 'update_check'
        GROUP BY 1, 2, 3, 4, 5
        ORDER BY count DESC, platform, from_version, detected_version
      `,
      sql`
        SELECT
          coalesce(platform, 'unknown') AS platform,
          coalesce(version, from_version, 'unknown') AS current_version,
          coalesce(from_version, 'unknown') AS from_version,
          coalesce(to_version, 'none') AS to_version,
          coalesce(metadata->>'stage', 'unknown') AS stage,
          CASE metadata->>'manual'
            WHEN 'true' THEN 'manual'
            WHEN 'false' THEN 'automatic'
            ELSE 'unknown'
          END AS manual,
          coalesce(metadata->>'error', 'unknown') AS error,
          count(*)::int AS count,
          min(created_at) AS first_seen,
          max(created_at) AS last_seen
        FROM events
        WHERE event_type = 'update_failed'
        GROUP BY 1, 2, 3, 4, 5, 6, 7
        ORDER BY count DESC, last_seen DESC
      `,
      sql`
        SELECT
          created_at,
          platform,
          coalesce(version, from_version) AS current_version,
          from_version,
          to_version,
          metadata->>'stage' AS stage,
          CASE metadata->>'manual'
            WHEN 'true' THEN 'manual'
            WHEN 'false' THEN 'automatic'
            ELSE NULL
          END AS manual,
          metadata->>'error' AS error
        FROM events
        WHERE event_type = 'update_failed'
        ORDER BY created_at DESC
        LIMIT 20
      `,
      sql`
        WITH update_events AS (
          SELECT
            install_hash,
            coalesce(to_version, 'none/unknown') AS to_version,
            bool_or(event_type = 'update_started') AS started,
            bool_or(event_type = 'update_completed') AS completed,
            bool_or(event_type = 'update_failed') AS failed
          FROM events
          WHERE event_type IN (
            'update_started',
            'update_completed',
            'update_failed'
          )
            AND install_hash IS NOT NULL
          GROUP BY install_hash, coalesce(to_version, 'none/unknown')
        )
        SELECT
          to_version,
          count(*)::int AS install_targets,
          count(*) FILTER (WHERE started)::int AS started_installs,
          count(*) FILTER (WHERE completed)::int AS completed_installs,
          count(*) FILTER (WHERE failed)::int AS failed_installs
        FROM update_events
        GROUP BY 1
        ORDER BY install_targets DESC, to_version
      `,
    ]);
    const [
      updateChecksDetailed,
      updateFailures,
      recentUpdateFailures,
      updateOutcomesByInstall,
    ] = detailResults;

    return {
      ...stats,
      detail_rollups_available: detailResults.every(
        (result) => result.status === "fulfilled",
      ),
      update_checks_detailed: settledRows<UpdateCheckDetail>(
        "update check details",
        updateChecksDetailed,
      ),
      update_failures: settledRows<UpdateFailureDetail>(
        "update failure details",
        updateFailures,
      ),
      recent_update_failures: settledRows<RecentUpdateFailure>(
        "recent update failures",
        recentUpdateFailures,
      ),
      update_outcomes_by_install: settledRows<UpdateOutcomeByInstall>(
        "update outcomes by install-target",
        updateOutcomesByInstall,
      ),
    };
  } catch (error) {
    console.error("Failed to load aggregate analytics stats", error);
    return null;
  }
}

function settledRows<T>(
  label: string,
  result: PromiseSettledResult<unknown>,
): T[] | null {
  if (result.status === "fulfilled") return result.value as T[];
  console.error(`Failed to load ${label}`, result.reason);
  return null;
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
