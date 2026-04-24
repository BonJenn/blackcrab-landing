import Image from "next/image";

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

function Nav() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-sm">
          <CrabMark />
          <span className="font-semibold tracking-tight">blackcrab</span>
        </a>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-muted">
          <a href="#highlights" className="hover:text-foreground transition-colors">Highlights</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#shortcuts" className="hover:text-foreground transition-colors">Shortcuts</a>
          <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>
        <a
          href="#download"
          className="text-sm font-medium rounded-md bg-foreground text-background px-3.5 py-1.5 hover:opacity-90 transition"
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
          <a
            href="#download"
            className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition"
          >
            Download for macOS
          </a>
          <a
            href="https://github.com"
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
      <div className="rounded-xl border border-border bg-[#0c0c0c] overflow-hidden shadow-[0_20px_80px_-20px_rgba(255,90,61,0.25)]">
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
          width={3838}
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
    <div className="rounded-xl border border-border bg-[#0c0c0c] overflow-hidden shadow-[0_10px_40px_-20px_rgba(255,90,61,0.3)]">
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
            A universal macOS build is ~8 MB. Windows and Linux builds are on
            the releases page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Download .dmg
            </a>
            <a
              href="https://github.com"
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
          <a href="https://github.com" className="hover:text-foreground transition">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground transition">
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
