import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Nav } from "../site";
import { changelogEntries, type ChangelogEntry } from "../blog/posts";

export const metadata: Metadata = {
  title: "Blackcrab Changelog",
  description:
    "Release notes and near-term development updates for Blackcrab.",
};

export default function ChangelogPage() {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16 items-start">
          <aside className="lg:sticky lg:top-20">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Changelog
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Releases and product notes.
            </h1>
            <p className="mt-4 text-muted leading-relaxed">
              Short, factual updates for what changed in Blackcrab and what is
              currently being tightened up.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 lg:grid">
              <Link
                href="/releases"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
              >
                Release downloads
              </Link>
              <Link
                href="/blog"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
              >
                Devlog
              </Link>
            </div>
          </aside>

          <div className="space-y-6">
            {changelogEntries.map((entry) => (
              <ReleaseEntry key={entry.version} entry={entry} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ReleaseEntry({ entry }: { entry: ChangelogEntry }) {
  return (
    <article className="rounded-xl border border-border bg-white/[0.02] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted">
        <span className="text-accent">{entry.version}</span>
        <span>{entry.label}</span>
        <span>{entry.displayDate}</span>
      </div>
      <p className="mt-4 text-lg text-muted leading-relaxed">{entry.summary}</p>
      <ul className="mt-6 space-y-3 list-disc pl-5 text-muted leading-relaxed">
        {entry.changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </article>
  );
}
