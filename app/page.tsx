import Link from "next/link";
import { DownloadLink } from "./DownloadLink";
import {
  APP_REPO_URL,
  Footer,
  LINUX_DOWNLOAD_URL,
  MAC_DOWNLOAD_URL,
  Nav,
  WINDOWS_DOWNLOAD_URL,
} from "./site";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="flex flex-col items-start gap-6 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Power to the prompter
        </span>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          A desktop workspace
          <br />
          <span className="text-muted">for </span>
          <span className="text-accent">coding agents</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
          Manage projects, agent threads, Git, terminals, and approvals in one
          Mac workspace. Blackcrab 0.4.3 opens directly into the new interface,
          with automatic background-service setup and recovery controls.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <DownloadLink
            href={MAC_DOWNLOAD_URL}
            platform="macos"
            className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition"
          >
            Download for Apple silicon
          </DownloadLink>
          <DownloadLink
            href={WINDOWS_DOWNLOAD_URL}
            platform="windows"
            className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
          >
            Windows (previous)
          </DownloadLink>
          <DownloadLink
            href={LINUX_DOWNLOAD_URL}
            platform="linux"
            className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
          >
            Linux (previous)
          </DownloadLink>
          <a
            href={APP_REPO_URL}
            className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
          >
            View source
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
  {
    "title": "Projects and agent threads",
    "body": "Organize coding work by project and thread, with conversations, tool activity and approvals together."
  },
  {
    "title": "Git and worktrees",
    "body": "Review changes, manage branches and use separate worktrees for parallel tasks."
  },
  {
    "title": "Integrated terminals",
    "body": "Run commands and inspect output alongside the conversation you are working on."
  },
  {
    "title": "Models and approvals",
    "body": "Choose an available provider and model, and respond to approval requests in context."
  },
  {
    "title": "Automatic workspace launch",
    "body": "Open Blackcrab to enter the new workspace. Startup prepares the service and offers recovery controls if something fails."
  },
  {
    "title": "Background service",
    "body": "Manage the host from the app menu. Workspace identity and existing data are retained when the service helper is updated."
  },
  {
    "title": "Signed Mac updates",
    "body": "Install signed Apple-silicon releases using the built-in updater or the downloadable DMG."
  },
  {
    "title": "Blackcrab accounts",
    "body": "Onboarding, environment selection and account screens use Blackcrab branding and owned service configuration."
  },
  {
    "title": "Remote beta",
    "body": "Blackcrab Remote is in private iOS TestFlight testing. Remote connections and notifications are still being validated."
  }
];
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
    >
      <div className="max-w-2xl mb-14">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          One workspace for the whole task.
        </h2>
        <p className="mt-4 text-muted text-lg">
          Projects, agents, source control and terminals share the new desktop
          interface. Version 0.4.3 improves pane controls and imported monitor
          messages while preserving existing data on disk.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
        {items.map((f) => (
          <div key={f.title} className="bg-background p-6 min-h-[178px]">
            <h3 className="font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      id="download"
      className="mx-auto max-w-6xl px-6 py-24 border-t border-border"
    >
      <div className="relative rounded-2xl border border-border bg-gradient-to-b from-white/[0.03] to-transparent p-10 sm:p-16 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Try Blackcrab.
          </h2>
          <p className="mt-3 text-muted text-lg">
            Download Blackcrab 0.4.3 for Apple-silicon Macs. Intel Mac, Windows and Linux builds remain available in previous releases.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <DownloadLink
              href={MAC_DOWNLOAD_URL}
              platform="macos"
              className="rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Apple-silicon .dmg
            </DownloadLink>
            <DownloadLink
              href={WINDOWS_DOWNLOAD_URL}
              platform="windows"
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              Windows (previous release)
            </DownloadLink>
            <DownloadLink
              href={LINUX_DOWNLOAD_URL}
              platform="linux"
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              Linux (previous release)
            </DownloadLink>
            <Link
              href="/releases"
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              All releases
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
