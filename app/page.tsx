import Image from "next/image";
import { DownloadLink } from "./DownloadLink";

const APP_REPO_URL = "https://github.com/BonJenn/blackcrab";
const RELEASES_URL = "https://github.com/BonJenn/blackcrab/releases/latest";
const MAC_DOWNLOAD_URL = "/download/macos";
const PRIVACY_URL = "https://github.com/BonJenn/blackcrab/blob/main/PRIVACY.md";
const SECURITY_URL = "https://github.com/BonJenn/blackcrab/blob/main/SECURITY.md";
const ISSUES_URL = "https://github.com/BonJenn/blackcrab/issues";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <Hero />
      <Preview />
      <FeatureHighlights />
      <Features />
      <Shortcuts />
      <Docs />
      <CTA />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-black text-white border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-sm text-white">
          <CrabMark />
          <span className="font-semibold tracking-tight">blackcrab</span>
        </a>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-white">
          <a href="#highlights" className="hover:text-white/75 transition-colors">Highlights</a>
          <a href="#features" className="hover:text-white/75 transition-colors">Features</a>
          <a href="#shortcuts" className="hover:text-white/75 transition-colors">Shortcuts</a>
          <a href="#docs" className="hover:text-white/75 transition-colors">Docs</a>
          <a href={APP_REPO_URL} className="hover:text-white/75 transition-colors">GitHub</a>
        </nav>
        <a
          href="#download"
          className="text-sm font-medium rounded-md border border-white/25 bg-white/10 text-white px-3.5 py-1.5 hover:bg-white/15 transition"
        >
          Download
        </a>
      </div>
    </header>
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
          Run multiple Claude Code sessions side-by-side in a tileable grid.
          Local-first. Keyboard-driven. Zero glue code between you and the agent.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <DownloadLink
            href={MAC_DOWNLOAD_URL}
            platform="macos"
            className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition"
          >
            Download for macOS
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
        eyebrow="Usage"
        title="See token usage at a glance."
        body="Every turn shows context used, output tokens, and cost in dollars. The sidebar rolls those up per session, so you always know what a run spent before you kick off another."
        visual={<UsageCard />}
      />
      <Highlight
        eyebrow="Git"
        title="Switch branches and worktrees without leaving the window."
        body="Spin up a worktree from any repo and scope a session to it — your main checkout stays clean while the agent works in isolation. Switch branches mid-session from a picker; Blackcrab tracks the remote and keeps everything straight."
        visual={<BranchCard />}
        flip
      />
      <Highlight
        eyebrow="Terminal"
        title="A real terminal, right where you need it."
        body="A PTY-backed xterm.js drawer lives at the bottom of the app. Hit ⌘J to pop it open, run the thing you want to verify, and close it without losing state. Multiple tabs, resizable, same keybindings as your shell."
        visual={<TerminalCard />}
      />
      <Highlight
        eyebrow="Preview"
        title="Browse local servers and the web, in-app."
        body="A native preview pane renders your dev server and any URL you point it at. Watch the page re-render as the agent edits the code. No Alt-Tab, no losing your place."
        visual={<PreviewCard />}
        flip
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
    </HighlightFrame>
  );
}

function PreviewCard() {
  return (
    <HighlightFrame>
      <div className="px-4 py-2 border-b border-border flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex-1 rounded bg-white/[0.04] border border-border/80 px-3 py-1 text-[11px] font-mono text-muted truncate">
          http://localhost:3000
        </div>
        <span className="text-[11px] font-mono text-muted">↻</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="h-2 w-24 rounded bg-white/[0.08]" />
        <div className="h-6 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="h-14 rounded bg-accent/15 border border-accent/30" />
          <div className="h-14 rounded bg-white/[0.04]" />
          <div className="h-14 rounded bg-white/[0.04]" />
        </div>
      </div>
    </HighlightFrame>
  );
}

function Features() {
  const items = [
    {
      title: "Command palette",
      body: "⌘K opens fuzzy search across sessions and every turn in your transcript history. Trigger any action — toggle grid, open terminal, cycle theme — without leaving the keyboard.",
    },
    {
      title: "Tileable grid",
      body: "Pin up to six sessions in one window. Each tile has its own session, scroll, and composer. ⌘1–⌘6 focuses; ⌘⇧D duplicates; drag to reorder.",
    },
    {
      title: "Local-first transcripts",
      body: "Every session is plain JSONL on disk. Searchable, exportable to markdown, backup-friendly. No server, no sync layer, no lock-in.",
    },
    {
      title: "Drag-and-drop attachments",
      body: "Drop files, images, or screenshots straight onto the composer. Multi-attachment support with an inline list you can edit before sending.",
    },
    {
      title: "Per-session model and permissions",
      body: "Switch Claude models or flip permission mode on a single tile without disturbing the others. One window, many setups.",
    },
    {
      title: "Native, not a webview wrapper",
      body: "Built on Tauri — small binary, OS menus, real file dialogs, and desktop notifications when a long-running turn finishes.",
    },
  ];
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
    >
      <div className="max-w-2xl mb-14">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Built for the way you actually use Claude Code.
        </h2>
        <p className="mt-4 text-muted text-lg">
          One tab per task gets old fast. Blackcrab is the tool you reach for
          when you&apos;re running three agents in parallel and still want to stay
          in flow.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
        {items.map((f) => (
          <div key={f.title} className="bg-background p-6 min-h-[160px]">
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
    ["⌘J", "Cycle focus between panels"],
    ["⌘1 – ⌘6", "Focus grid tile N"],
    ["⌘W", "Close focused panel"],
    ["⌘⇧D", "Duplicate panel (same session, new tile)"],
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
            Keyboard vocabulary.
          </h2>
          <p className="mt-4 text-muted text-lg">
            If you live in a terminal, you&apos;ll feel at home. Every core
            action has a binding, and the palette covers the rest.
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

function Docs() {
  const docLinks: Array<[string, string]> = [
    ["Getting started", "#getting-started"],
    ["Requirements", "#requirements"],
    ["Privacy and security", "#privacy-security"],
    ["Troubleshooting", "#troubleshooting"],
    ["Known limitations", "#known-limitations"],
  ];

  return (
    <section
      id="docs"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-20">
          <span className="text-xs font-mono uppercase tracking-wider text-accent">
            Documentation
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Setup, trust, and support notes.
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            The short version of what you need before downloading Blackcrab and
            what to check if the local Claude Code bridge does not start cleanly.
          </p>
          <nav className="mt-6 hidden lg:grid gap-2 text-sm text-muted">
            {docLinks.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-foreground transition">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <DocSection id="getting-started" number="01" title="Getting started">
            <ol className="space-y-4 text-muted leading-relaxed list-decimal pl-5">
              <li>
                Install and authenticate Claude Code before opening Blackcrab.
                <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-[#0c0c0c] p-4 text-sm text-foreground">
                  <code>{`npm install -g @anthropic-ai/claude-code
claude auth login --claudeai`}</code>
                </pre>
                <p className="mt-3">
                  Anthropic Console billing users can use the Claude Code console
                  login flow instead.
                </p>
              </li>
              <li>
                Download the latest Blackcrab installer from GitHub Releases,
                then launch the app.
              </li>
              <li>
                Confirm the setup screen shows Claude Code as installed and
                authenticated.
              </li>
              <li>
                Pick a working directory, start a new session, or resume an
                existing session from the sidebar.
              </li>
              <li>
                Use grid mode for up to six live panels, open local preview URLs
                in the side webview, and export finished sessions as Markdown.
              </li>
            </ol>
          </DocSection>

          <DocSection id="requirements" number="02" title="Requirements">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
              <RequirementCard
                title="Released app"
                body="Blackcrab is currently macOS-first and expects the Claude Code CLI to be installed and signed in on the same machine."
              />
              <RequirementCard
                title="Local development"
                body="Building from source requires Node.js 20 or newer, Rust stable with Cargo, and the Tauri 2 system dependencies for your target platform."
              />
              <RequirementCard
                title="Experience level"
                body="The project is early and aimed at people already comfortable with Claude Code, local repositories, shells, and developer tools."
              />
            </div>
          </DocSection>

          <DocSection id="privacy-security" number="03" title="Privacy and security">
            <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
              <li>
                Blackcrab is a local app. It does not operate a hosted backend,
                proxy Claude traffic, or ask for Anthropic credentials.
              </li>
              <li>
                It reads Claude Code session JSONL files under{" "}
                <InlineCode>~/.claude/projects</InlineCode>, selected project
                paths, git metadata, UI preferences, and files you explicitly
                attach.
              </li>
              <li>
                Messages are sent to your local <InlineCode>claude</InlineCode>{" "}
                CLI subprocess. Network requests come from Claude Code, tools it
                runs, opened URLs, or commands you execute locally.
              </li>
              <li>
                Treat exported Markdown transcripts and Claude session files as
                sensitive. They can contain prompts, file paths, command output,
                and tool results.
              </li>
              <li>
                Blackcrab is not a sandbox. It coordinates shells, Claude
                subprocesses, file paths, webviews, and git commands on your
                local machine.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PRIVACY_URL}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
              >
                Privacy details
              </a>
              <a
                href={SECURITY_URL}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
              >
                Security model
              </a>
            </div>
          </DocSection>

          <DocSection id="troubleshooting" number="04" title="Troubleshooting">
            <div className="grid grid-cols-1 gap-px bg-border rounded-xl overflow-hidden">
              <TroubleCard
                title="Claude Code CLI was not found"
                body={
                  <>
                    Run <InlineCode>claude --version</InlineCode> in your
                    terminal. If it fails, install Claude Code and make sure the{" "}
                    <InlineCode>claude</InlineCode> executable is available from
                    your shell path.
                  </>
                }
              />
              <TroubleCard
                title="Claude Code is installed but not authenticated"
                body={
                  <>
                    Run <InlineCode>claude auth status</InlineCode>. If needed,
                    sign in with{" "}
                    <InlineCode>claude auth login --claudeai</InlineCode> or use
                    the Console billing login flow.
                  </>
                }
              />
              <TroubleCard
                title="Sessions are missing from the sidebar"
                body={
                  <>
                    Confirm the working directory is correct and that Claude Code
                    has saved session files under{" "}
                    <InlineCode>~/.claude/projects</InlineCode>.
                  </>
                }
              />
              <TroubleCard
                title="Preview URLs do not render"
                body="The preview panel can open HTTP and HTTPS URLs. Some production sites block embedded webviews; use the external browser action when a site refuses to load inside the app."
              />
              <TroubleCard
                title="Updater or download issues"
                body="Installers and updater artifacts are published through GitHub Releases. If the in-app update fails, download the latest release manually."
              />
            </div>
            <a
              href={ISSUES_URL}
              className="mt-5 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
            >
              Open a GitHub issue
            </a>
          </DocSection>

          <DocSection id="known-limitations" number="05" title="Known limitations">
            <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
              <li>
                Blackcrab is pre-1.0 software. Expect behavior and packaging
                details to change.
              </li>
              <li>
                macOS is the currently tested desktop experience. Windows and
                Linux release artifacts may exist, but they are not the primary
                target yet.
              </li>
              <li>
                The app depends on a working local Claude Code installation and
                does not replace Claude Code authentication, billing, or CLI
                configuration.
              </li>
              <li>
                Private one-on-one setup support is not part of the current
                project scope.
              </li>
              <li>
                Only run Blackcrab on machines and repositories where local
                developer-tool access is acceptable.
              </li>
            </ul>
          </DocSection>
        </div>
      </div>
    </section>
  );
}

function DocSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-xl border border-border bg-white/[0.02] p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-xs text-accent">{number}</span>
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function RequirementCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="bg-background p-5">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </article>
  );
}

function TroubleCard({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <article className="bg-background p-5">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </article>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
      {children}
    </code>
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
            Download the latest macOS build. Windows and Linux builds are
            published on the releases page when available.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <DownloadLink
              href={MAC_DOWNLOAD_URL}
              platform="macos"
              className="rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Download .dmg
            </DownloadLink>
            <a
              href={RELEASES_URL}
              className="rounded-md border border-border hover:border-foreground/40 px-5 py-2.5 text-sm font-medium transition"
            >
              All releases
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2 font-mono">
          <CrabMark />
          <span>blackcrab</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs">v0.1 · macOS, Windows, Linux</span>
          <a href={APP_REPO_URL} className="hover:text-foreground transition">
            GitHub
          </a>
          <a href={RELEASES_URL} className="hover:text-foreground transition">
            Changelog
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

function CrabMark() {
  return (
    <span
      aria-hidden
      className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold"
    >
      B
    </span>
  );
}
