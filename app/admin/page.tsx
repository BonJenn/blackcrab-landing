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

      <Section title="Update funnel">
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
        {!stats.update_checks || stats.update_checks.length === 0 ? (
          <Empty />
        ) : (
          <Table
            headers={["Current version", "Latest version", "Checks"]}
            rows={stats.update_checks.map((r) => [
              r.from_version,
              r.to_version,
              String(r.count),
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

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
                  className={`px-4 py-3 tabular-nums ${
                    j === row.length - 1
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
