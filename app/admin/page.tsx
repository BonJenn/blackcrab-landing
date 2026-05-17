import { redirect } from "next/navigation";
import type { DownloadStats } from "../lib/tracking";
import { getDownloadStats } from "../lib/tracking";
import { getSql } from "../lib/db";

export const dynamic = "force-dynamic";

const PLATFORMS: Record<string, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (!secret || key !== secret) {
    redirect("/");
  }

  const configured = getSql() !== null;
  const stats = await getDownloadStats();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <header>
          <p className="text-xs font-mono uppercase tracking-wider text-[#e5663a]">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Product analytics
          </h1>
        </header>

        {!configured && (
          <Notice color="yellow">
            Database is not configured. Set{" "}
            <code className="font-mono">DATABASE_URL</code> to start tracking.
          </Notice>
        )}

        {configured && stats === null && (
          <Notice color="red">
            Failed to fetch stats. Make sure the migration has been applied to
            your Neon database.
          </Notice>
        )}

        {stats !== null && <Dashboard stats={stats} />}
      </div>
    </main>
  );
}

function Dashboard({ stats }: { stats: DownloadStats }) {
  const successfulUpdateChecks = countUpdateEvent(stats, "update_check");
  const updateStarts = countUpdateEvent(stats, "update_started");
  const updateCompletions = countUpdateEvent(stats, "update_completed");
  const updateFailures = countUpdateEvent(stats, "update_failed");
  const checkFailures = countUpdateFailures(stats, "check");
  const installFailures = countUpdateFailures(stats, "install");
  const hasFailureDetails = stats.update_failures != null;
  const otherFailures = Math.max(
    0,
    updateFailures - checkFailures - installFailures,
  );
  const updateCheckAttempts = hasFailureDetails
    ? successfulUpdateChecks + checkFailures
    : successfulUpdateChecks;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Download redirects"
          value={stats.total_download_redirects ?? stats.total}
        />
        <StatCard
          label="Active installs, 30 days"
          value={stats.active_installs_total ?? 0}
        />
      </div>

      <Section title="Update health summary">
        {hasFailureDetails ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Check attempts" value={updateCheckAttempts} />
            <StatCard
              label="Successful checks"
              value={successfulUpdateChecks}
            />
            <StatCard label="Check failures" value={checkFailures} />
            <StatCard label="Install starts" value={updateStarts} />
            <StatCard label="Completed installs" value={updateCompletions} />
            <StatCard label="Install failures" value={installFailures} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Successful checks"
              value={successfulUpdateChecks}
            />
            <StatCard label="Install starts" value={updateStarts} />
            <StatCard label="Completed installs" value={updateCompletions} />
            <StatCard label="Failed events" value={updateFailures} />
          </div>
        )}
        {stats.detail_rollups_available === false && (
          <div className="mt-4">
            <Notice color="yellow">
              Detailed update rollups were not fully available. The aggregate
              counts are still loaded from the database stats function.
            </Notice>
          </div>
        )}
        {checkFailures > 0 && installFailures === 0 && otherFailures === 0 && (
          <div className="mt-4">
            <Notice color="yellow">
              Recorded update failures are check-stage failures, not failed
              installs. No install failure has been recorded yet.
            </Notice>
          </div>
        )}
        {otherFailures > 0 && (
          <div className="mt-4">
            <Notice color="yellow">
              {otherFailures} update failure
              {otherFailures === 1 ? "" : "s"} did not include a recognized
              stage. Inspect the failure table before treating them as check or
              install failures.
            </Notice>
          </div>
        )}
      </Section>

      {stats.daily_last_30 && stats.daily_last_30.length > 0 && (
        <Section title="Download redirects, last 30 days">
          <TrendChart rows={stats.daily_last_30} />
        </Section>
      )}

      <Section title="Download redirects by platform">
        <Table
          headers={["Platform", "Downloads"]}
          rows={Object.entries(PLATFORMS).map(([key, label]) => [
            label,
            String(stats.by_platform?.[key] ?? 0),
          ])}
        />
      </Section>

      <Section title="Download redirects by version">
        {!stats.by_version || stats.by_version.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Version", "Downloads"]}
            rows={stats.by_version.map((r) => [r.version, String(r.count)])}
          />
        )}
      </Section>

      <Section title="Download redirects by platform + version">
        {!stats.by_combo || stats.by_combo.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Platform", "Version", "Downloads"]}
            rows={stats.by_combo.map((r) => [
              PLATFORMS[r.platform] ?? r.platform,
              r.version,
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Update event funnel">
        {!stats.update_funnel || stats.update_funnel.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Event", "Count"]}
            rows={stats.update_funnel.map((r) => [
              formatEventType(r.event_type),
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Update checks by version path">
        {!stats.update_checks_detailed ||
        stats.update_checks_detailed.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={[
              "Platform",
              "Current version",
              "Detected update",
              "Available",
              "Trigger",
              "Checks",
            ]}
            rows={stats.update_checks_detailed.map((r) => [
              formatNullablePlatform(r.platform),
              r.from_version,
              r.detected_version,
              r.available,
              r.manual,
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Update failures by stage + error">
        {!stats.update_failures || stats.update_failures.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={[
              "Platform",
              "Current",
              "From",
              "Target",
              "Stage",
              "Trigger",
              "Error",
              "First seen",
              "Last seen",
              "Events",
            ]}
            rows={stats.update_failures.map((r) => [
              PLATFORMS[r.platform] ?? r.platform,
              r.current_version,
              r.from_version,
              r.to_version,
              r.stage,
              r.manual,
              r.error,
              formatTimestamp(r.first_seen),
              formatTimestamp(r.last_seen),
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Recent update failures">
        {!stats.recent_update_failures ||
        stats.recent_update_failures.length === 0 ? (
          <Empty />
        ) : (
          <Table
            accentLastColumn={false}
            headers={[
              "When",
              "Platform",
              "Current",
              "From",
              "Target",
              "Stage",
              "Trigger",
              "Error",
            ]}
            rows={stats.recent_update_failures.map((r) => [
              formatTimestamp(r.created_at),
              formatNullablePlatform(r.platform),
              formatNullable(r.current_version),
              formatNullable(r.from_version),
              formatNullable(r.to_version),
              formatNullable(r.stage),
              formatNullable(r.manual),
              formatNullable(r.error),
            ])}
          />
        )}
      </Section>

      <Section title="Update outcomes by unique install-target">
        {!stats.update_outcomes_by_install ||
        stats.update_outcomes_by_install.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={[
              "Target version",
              "Install targets",
              "Started",
              "Completed",
              "Failed",
            ]}
            rows={stats.update_outcomes_by_install.map((r) => [
              r.to_version,
              String(r.install_targets),
              String(r.started_installs),
              String(r.completed_installs),
              String(r.failed_installs),
            ])}
          />
        )}
      </Section>

      <Section title="Completed updates by target version">
        {!stats.updates_completed_by_version ||
        stats.updates_completed_by_version.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Target version", "Completed updates"]}
            rows={stats.updates_completed_by_version.map((r) => [
              r.version,
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Completed updates by version path">
        {!stats.updates_completed_by_combo ||
        stats.updates_completed_by_combo.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["From version", "To version", "Completed updates"]}
            rows={stats.updates_completed_by_combo.map((r) => [
              r.from_version,
              r.to_version,
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Active installs by version, 30 days">
        {!stats.active_by_version || stats.active_by_version.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Version", "Active installs"]}
            rows={stats.active_by_version.map((r) => [
              r.version,
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="All events by type">
        {!stats.events_by_type || stats.events_by_type.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Event", "Count"]}
            rows={stats.events_by_type.map((r) => [
              formatEventType(r.event_type),
              String(r.count),
            ])}
          />
        )}
      </Section>

      <Section title="Data notes">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
          <p>
            Successful checks are emitted only after the desktop updater returns
            from <code className="font-mono text-white/80">check()</code>.
            Failed check attempts are stored as{" "}
            <code className="font-mono text-white/80">update_failed</code>{" "}
            events with <code className="font-mono text-white/80">stage</code>{" "}
            set to <code className="font-mono text-white/80">check</code>.
          </p>
          <p className="mt-3">
            Install outcomes are grouped by anonymous install and target
            version, so repeat events from the same install-target pair count
            once in that table.
          </p>
        </div>
      </Section>
    </div>
  );
}

function TrendChart({
  rows,
}: {
  rows: Array<{ day: string; count: number }>;
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="divide-y divide-white/5">
        {rows.map((row) => (
          <div key={row.day} className="flex items-center gap-4 px-4 py-2">
            <span className="w-24 shrink-0 font-mono text-xs text-white/40">
              {new Date(row.day).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="flex-1 h-4 rounded-sm bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-sm bg-[#e5663a]/70"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right tabular-nums text-sm text-white/60">
              {row.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-5xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-mono uppercase tracking-wider text-white/40">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({
  headers,
  rows,
  accentLastColumn = true,
}: {
  headers: string[];
  rows: string[][];
  accentLastColumn?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-white/40"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`max-w-[28rem] break-words px-4 py-3 align-top tabular-nums ${
                    accentLastColumn && j === row.length - 1
                      ? "text-[#e5663a] font-medium"
                      : "text-white/80"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Notice({
  color,
  children,
}: {
  color: "yellow" | "red";
  children: React.ReactNode;
}) {
  const styles =
    color === "yellow"
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-red-500/30 bg-red-500/10 text-red-300";
  return (
    <div className={`rounded-lg border p-4 text-sm ${styles}`}>{children}</div>
  );
}

function Empty() {
  return (
    <p className="rounded-xl border border-white/10 px-4 py-6 text-center text-sm text-white/40">
      No data yet.
    </p>
  );
}

function formatEventType(eventType: string) {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function countUpdateEvent(stats: DownloadStats, eventType: string) {
  return (
    stats.update_funnel?.find((row) => row.event_type === eventType)?.count ?? 0
  );
}

function countUpdateFailures(stats: DownloadStats, stage: string) {
  return (
    stats.update_failures?.reduce(
      (total, row) => total + (row.stage === stage ? row.count : 0),
      0,
    ) ?? 0
  );
}

function formatTimestamp(value: string | Date | null | undefined) {
  if (!value) return "unknown";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatNullable(value: string | null | undefined) {
  return value && value.trim() ? value : "unknown";
}

function formatNullablePlatform(value: string | null | undefined) {
  const platform = formatNullable(value);
  return PLATFORMS[platform] ?? platform;
}
