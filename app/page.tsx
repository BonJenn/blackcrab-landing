import type { ReactNode } from "react";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <Hero />
      <Preview />
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
        <div className="grid grid-cols-12 min-h-[440px]">
          <aside className="col-span-3 border-r border-border p-3 space-y-1 text-sm">
            <div className="text-[11px] uppercase tracking-wider text-muted px-2 py-1">
              Sessions
            </div>
            <SidebarItem active>refactor auth middleware</SidebarItem>
            <SidebarItem>write migration for users</SidebarItem>
            <SidebarItem>fix flaky e2e test</SidebarItem>
            <SidebarItem>docs: grid shortcuts</SidebarItem>
            <SidebarItem muted>explore vercel queues</SidebarItem>
          </aside>
          <div className="col-span-9 grid grid-cols-2 grid-rows-2 gap-px bg-border">
            <GridTile title="auth middleware" status="streaming">
              <CodeLine>- token.validate(req.session)</CodeLine>
              <CodeLine dim>+ await sessions.verify(token)</CodeLine>
              <CodeLine dim>+ if (!verified) throw Unauthorized()</CodeLine>
            </GridTile>
            <GridTile title="users migration" status="idle">
              <CodeLine>ALTER TABLE users</CodeLine>
              <CodeLine>  ADD COLUMN email_verified_at</CodeLine>
              <CodeLine dim>  TIMESTAMP NULL;</CodeLine>
            </GridTile>
            <GridTile title="flaky e2e" status="waiting">
              <CodeLine dim>&gt; running test:e2e</CodeLine>
              <CodeLine>✓ login.spec.ts (4.2s)</CodeLine>
              <CodeLine dim>… checkout.spec.ts</CodeLine>
            </GridTile>
            <GridTile title="grid shortcuts docs" status="idle">
              <CodeLine># Keyboard</CodeLine>
              <CodeLine dim>⌘1–⌘6   focus panel</CodeLine>
              <CodeLine dim>⌘W      close panel</CodeLine>
            </GridTile>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({
  children,
  active,
  muted,
}: {
  children: ReactNode;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`truncate rounded px-2 py-1.5 ${
        active
          ? "bg-accent/10 text-foreground border border-accent/30"
          : muted
            ? "text-muted/60"
            : "text-muted hover:bg-white/[0.03]"
      }`}
    >
      {children}
    </div>
  );
}

function GridTile({
  title,
  status,
  children,
}: {
  title: string;
  status: "streaming" | "idle" | "waiting";
  children: ReactNode;
}) {
  const dot =
    status === "streaming"
      ? "bg-accent animate-pulse"
      : status === "waiting"
        ? "bg-yellow-400/80"
        : "bg-muted/50";
  return (
    <div className="bg-background p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-mono text-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="truncate">{title}</span>
      </div>
      <div className="font-mono text-[12px] leading-relaxed space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function CodeLine({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <div className={dim ? "text-muted/70" : "text-foreground/90"}>
      {children}
    </div>
  );
}

function Features() {
  const items = [
    {
      title: "Tileable grid",
      body: "Pin up to six sessions in one window. Each tile holds its own session, its own scroll, its own composer.",
    },
    {
      title: "Local-first sessions",
      body: "Transcripts are plain JSONL on disk. No server, no sync layer. You own the history and the backups.",
    },
    {
      title: "Markdown + syntax highlight",
      body: "Fenced code blocks render with highlight.js. GFM tables, task lists, and inline code all work.",
    },
    {
      title: "Built-in terminal",
      body: "An xterm.js pane lives alongside the transcript so you can verify the agent's suggestions without leaving the app.",
    },
    {
      title: "Keyboard-first",
      body: "⌘K opens the session palette. ⌘J jumps between panels. ⌘1–⌘6 focus grid tiles. Mouse optional.",
    },
    {
      title: "Native, not a webview wrapper",
      body: "Built on Tauri — small binary, OS menus, notifications, and file dialogs that behave like every other desktop app.",
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
