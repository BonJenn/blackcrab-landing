import Image from "next/image";
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
      <Preview />
      <FeatureHighlights />
      <Features />
      <Shortcuts />
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
          A native desktop GUI
          <br />
          <span className="text-muted">for </span>
          <span className="text-accent">Claude Code</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
          Run, resume, search, and verify Claude Code sessions from one native
          workspace with a grid, terminal, preview pane, usage dashboards, and
          local transcript history.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <DownloadLink
            href={MAC_DOWNLOAD_URL}
            platform="macos"
            className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition"
          >
            Download for macOS
          </DownloadLink>
          <DownloadLink
            href={WINDOWS_DOWNLOAD_URL}
            platform="windows"
            className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
          >
            Windows
          </DownloadLink>
          <DownloadLink
            href={LINUX_DOWNLOAD_URL}
            platform="linux"
            className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
          >
            Linux
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

function Preview() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-xl border border-border bg-[#0c0c0c] overflow-hidden shadow-[0_20px_80px_-20px_rgba(233,69,69,0.25)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-muted font-mono truncate">
            ~/code/acme · blackcrab
          </span>
        </div>
        <Image
          src="/hero.png"
          alt="Blackcrab running four Claude Code sessions in a 2×2 grid"
          width={3834}
          height={2160}
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
}

function FeatureHighlights() {
  return (
    <section
      id="highlights"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border space-y-20 sm:space-y-28"
    >
      <Highlight
        eyebrow="Sessions"
        title="Your Claude Code history becomes a workspace."
        body="Blackcrab indexes saved Claude Code JSONL files, groups sessions by project, and lets you resume, rename, archive, delete, search, and export conversations without digging through ~/.claude/projects."
        visual={<SessionCard />}
      />
      <Highlight
        eyebrow="Usage"
        title="See usage before it surprises you."
        body="Every session tracks context, output tokens, and estimated cost. The usage dashboard rolls that up by day, month, project, model, and session, with CSV/JSON export and optional monthly budgets."
        visual={<UsageCard />}
        flip
      />
      <Highlight
        eyebrow="Git"
        title="Keep parallel agent work out of each other's way."
        body="Pin up to six live sessions, start new panels from the same repo, and let Blackcrab create git worktrees when a panel needs its own checkout. A branch picker keeps the current repo state visible in the header."
        visual={<BranchCard />}
      />
      <Highlight
        eyebrow="Verification"
        title="Terminal and preview stay attached to the task."
        body="A PTY-backed terminal drawer, native side preview, local URL detection, and transcript link routing keep verification in the same window. Run the server, watch the page, and jump back to the agent without losing context."
        visual={<TerminalCard />}
        flip
      />
      <Highlight
        eyebrow="Computer use"
        title="Hand off GUI tasks when text is not enough."
        body="Open an interactive Claude Code computer-use session, send a prepared handoff from the composer, and keep the sidecar terminal visible with /mcp controls when a task needs browser or desktop interaction."
        visual={<ComputerUseCard />}
      />
    </section>
  );
}

function Highlight({
  eyebrow,
  title,
  body,
  visual,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={flip ? "lg:order-2" : undefined}>
        <span className="text-xs font-mono uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-4 text-muted text-lg leading-relaxed">{body}</p>
      </div>
      <div className={flip ? "lg:order-1" : undefined}>{visual}</div>
    </div>
  );
}

function HighlightFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-[#0c0c0c] overflow-hidden shadow-[0_10px_40px_-20px_rgba(233,69,69,0.3)]">
      {children}
    </div>
  );
}

function SessionCard() {
  const sessions: Array<[string, string, string, boolean?]> = [
    ["release updater", "blackcrab", "needs attention", true],
    ["usage dashboard", "blackcrab", "streaming", false],
    ["landing blog", "blackcrab_landing", "ready", false],
    ["windows installer", "blackcrab", "archived", false],
  ];
  return (
    <HighlightFrame>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between font-mono text-xs text-muted">
        <span>sessions</span>
        <span className="text-accent">⌘K search</span>
      </div>
      <div className="p-2 font-mono text-[12px]">
        {sessions.map(([title, project, state, active]) => (
          <div
            key={title}
            className={`rounded px-3 py-2.5 ${
              active ? "bg-accent/10 border border-accent/30" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={active ? "text-foreground" : "text-muted"}>
                {title}
              </span>
              <span className="text-muted/70 text-[11px]">{state}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted/60">
              <span>{project}</span>
              <span>ctx 64k · out 1.9k</span>
            </div>
          </div>
        ))}
      </div>
    </HighlightFrame>
  );
}

function UsageCard() {
  return (
    <HighlightFrame>
      <div className="p-5 space-y-4 font-mono text-[12px]">
        <div className="flex items-center justify-between text-muted">
          <span>refactor auth middleware</span>
          <span className="text-accent">streaming</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-muted">
            <span>context</span>
            <span className="text-foreground">128,412 / 200,000</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[64%] bg-accent" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          <Stat label="in" value="126.2k" />
          <Stat label="out" value="2,184" />
          <Stat label="cost" value="$0.47" accent />
        </div>
      </div>
    </HighlightFrame>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted/70">
        {label}
      </div>
      <div className={`mt-1 ${accent ? "text-accent" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function BranchCard() {
  const branches: Array<[string, string, boolean?]> = [
    ["main", "origin/main", false],
    ["auth-middleware", "worktree · wt-auth", true],
    ["users-migration", "worktree · wt-mig", false],
    ["flaky-e2e-fix", "local only", false],
  ];
  return (
    <HighlightFrame>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 font-mono text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span>acme · switch branch</span>
      </div>
      <div className="p-2 font-mono text-[12px]">
        {branches.map(([name, sub, active]) => (
          <div
            key={name}
            className={`flex items-center justify-between rounded px-3 py-2 ${
              active ? "bg-accent/10 border border-accent/30" : ""
            }`}
          >
            <span className={active ? "text-foreground" : "text-muted"}>
              {name}
            </span>
            <span className="text-muted/70 text-[11px]">{sub}</span>
          </div>
        ))}
      </div>
    </HighlightFrame>
  );
}

function TerminalCard() {
  return (
    <HighlightFrame>
      <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs font-mono text-muted">
        <span>zsh</span>
        <span className="opacity-50">·</span>
        <span>pnpm</span>
        <span className="opacity-50">·</span>
        <span className="text-accent">bun run dev</span>
        <span className="ml-auto text-[11px]">⌘J</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-relaxed space-y-1">
        <div className="text-muted">
          <span className="text-accent">~/code/acme</span> $ bun run dev
        </div>
        <div className="text-muted/80">$ next dev --turbopack</div>
        <div className="text-foreground/90">▲ Next.js 16.2.4 (Turbopack)</div>
        <div className="text-muted">- Local: http://localhost:3000</div>
        <div className="text-accent">✓ Ready in 186ms</div>
        <div className="text-foreground/90">
          <span className="text-accent">▍</span>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 text-[11px] font-mono text-muted flex items-center gap-2">
        <span className="text-accent">preview</span>
        <span className="truncate">http://localhost:3000</span>
        <span className="ml-auto">auto-open</span>
      </div>
    </HighlightFrame>
  );
}

function ComputerUseCard() {
  return (
    <HighlightFrame>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between font-mono text-xs text-muted">
        <span>computer-use</span>
        <span className="text-accent">GUI</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-relaxed space-y-2">
        <div className="rounded border border-accent/30 bg-accent/10 px-3 py-2 text-foreground">
          Hand off current task to computer use
        </div>
        <div className="text-muted">
          &gt; open /mcp and enable built-in computer-use
        </div>
        <div className="text-muted">
          &gt; type prepared handoff into the interactive session
        </div>
        <div className="flex gap-2 pt-1">
          <span className="rounded border border-border px-2 py-1 text-muted">
            open /mcp
          </span>
          <span className="rounded border border-border px-2 py-1 text-accent">
            type handoff
          </span>
        </div>
      </div>
    </HighlightFrame>
  );
}

function Features() {
  const items = [
    {
      title: "Global command palette",
      body: "⌘K searches sessions, transcript text, and commands. Open settings, enter grid mode, check updates, jump to attention sessions, or launch dashboards from one picker.",
    },
    {
      title: "Tileable session grid",
      body: "Pin up to six live Claude Code panels. Each tile has its own subprocess, transcript, composer, model, permission state, scroll position, and focus shortcut.",
    },
    {
      title: "Session library",
      body: "Resume saved Claude Code sessions by title, project, model, date, or transcript hit. Rename, archive, delete, and export conversations as Markdown.",
    },
    {
      title: "Project dashboard",
      body: "Scan projects by active sessions, attention count, tokens, estimated cost, and recent activity, then open a session or start a new one from the project view.",
    },
    {
      title: "Local analytics",
      body: "Track tokens and estimated spend over 7, 30, 90 days, or all time. Break usage down by project, model, month, and recent sessions, then export CSV or JSON.",
    },
    {
      title: "Usage budgets",
      body: "Set monthly dollar or token budgets and get local warnings when current-month usage crosses the threshold.",
    },
    {
      title: "Structured transcripts",
      body: "Tool calls, diffs, command output, thinking blocks, permission prompts, stderr, diagnostics, and streaming text render as inspectable transcript blocks.",
    },
    {
      title: "Git-aware panels",
      body: "See the active branch, switch branches from the header, detect dirty worktrees, and isolate new grid panels with Claude Code's worktree mode.",
    },
    {
      title: "Terminal drawer",
      body: "Open a PTY-backed terminal with ⌘J, keep multiple tabs alive, resize the drawer, rename tabs, and verify work without leaving the app.",
    },
    {
      title: "Native preview",
      body: "Open local servers and external URLs in a side preview. Blackcrab can auto-detect localhost links from output and route transcript links into the preview.",
    },
    {
      title: "Computer-use handoff",
      body: "Launch an interactive Claude Code computer-use session or hand off the current composer task through the GUI action with /mcp helpers.",
    },
    {
      title: "Composer attachments",
      body: "Drop files, images, or screenshots onto the composer, manage multiple attachments inline, and type @ for file-path autocomplete.",
    },
    {
      title: "Claude setup flow",
      body: "Run setup checks, open the token setup path, store a Claude Code OAuth token in macOS Keychain, and avoid stale API-key conflicts in spawned sessions.",
    },
    {
      title: "Models and permissions",
      body: "Set defaults for new sessions, override model or permission mode per active session, and approve, deny, or retry permission prompts in context.",
    },
    {
      title: "Attention management",
      body: "Filter the sidebar to sessions that need attention, jump to the next one, and use notifications when a long turn finishes.",
    },
    {
      title: "Desktop updates",
      body: "The Tauri updater checks GitHub release artifacts, can install available updates, and reports anonymous updater health when analytics are enabled.",
    },
    {
      title: "Local-first privacy",
      body: "Core workflow data stays on disk with Claude Code. Optional app and updater analytics never include prompts, transcripts, paths, files, or tokens.",
    },
    {
      title: "Custom workspace settings",
      body: "Choose startup project, sidebar grouping, theme, auto-open preview, update checks, notifications, analytics sharing, and grid worktree behavior.",
    },
  ];
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
    >
      <div className="max-w-2xl mb-14">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          The full Blackcrab surface.
        </h2>
        <p className="mt-4 text-muted text-lg">
          The app is a local control surface for Claude Code: session history,
          live panels, verification tools, git context, usage reporting, and the
          setup details that make a desktop agent workflow reliable.
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

function Shortcuts() {
  const rows: Array<[string, string]> = [
    ["⌘K", "Open session palette / search transcripts"],
    ["⌘,", "Open settings"],
    ["⌘J", "Toggle integrated terminal"],
    ["⌘1 – ⌘6", "Focus grid tile N"],
    ["⌘⇧W", "Close focused grid panel"],
    ["⌘⇧D", "Duplicate panel (same session, new tile)"],
    ["⌘⇧A", "Show attention sessions only"],
    ["⌘⇧N", "Open next attention session"],
    ["⌘⇧I", "Open diagnostics"],
    ["⌘F", "Find in transcript"],
    ["⌘↵", "Send message"],
  ];
  return (
    <section
      id="shortcuts"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Keyboard-first when the mouse would slow you down.
          </h2>
          <p className="mt-4 text-muted text-lg">
            The app keeps common actions close to the home row, and the command
            palette covers the rest.
          </p>
        </div>
        <div className="rounded-xl border border-border divide-y divide-border">
          {rows.map(([keys, desc]) => (
            <div
              key={keys}
              className="flex items-center justify-between gap-6 px-5 py-3.5"
            >
              <span className="font-mono text-sm text-foreground">{keys}</span>
              <span className="text-sm text-muted text-right">{desc}</span>
            </div>
          ))}
        </div>
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
            Download the latest v0.1.2 desktop build for macOS, Windows, or Linux.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <DownloadLink
              href={MAC_DOWNLOAD_URL}
              platform="macos"
              className="rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              macOS .dmg
            </DownloadLink>
            <DownloadLink
              href={WINDOWS_DOWNLOAD_URL}
              platform="windows"
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              Windows .exe
            </DownloadLink>
            <DownloadLink
              href={LINUX_DOWNLOAD_URL}
              platform="linux"
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              Linux AppImage
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
