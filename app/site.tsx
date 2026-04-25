import Link from "next/link";

export const APP_REPO_URL = "https://github.com/BonJenn/blackcrab";
export const RELEASES_URL = "https://github.com/BonJenn/blackcrab/releases/latest";
export const MAC_DOWNLOAD_URL = "/download/macos";
export const PRIVACY_URL = "https://github.com/BonJenn/blackcrab/blob/main/PRIVACY.md";
export const SECURITY_URL = "https://github.com/BonJenn/blackcrab/blob/main/SECURITY.md";
export const ISSUES_URL = "https://github.com/BonJenn/blackcrab/issues";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-black text-white border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm text-white">
          <CrabMark />
          <span className="font-semibold tracking-tight">blackcrab</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-white">
          <Link href="/#highlights" className="hover:text-white/75 transition-colors">Highlights</Link>
          <Link href="/#features" className="hover:text-white/75 transition-colors">Features</Link>
          <Link href="/#shortcuts" className="hover:text-white/75 transition-colors">Shortcuts</Link>
          <Link href="/docs" className="hover:text-white/75 transition-colors">Docs</Link>
          <a href={APP_REPO_URL} className="hover:text-white/75 transition-colors">GitHub</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="sm:hidden text-sm font-medium text-white hover:text-white/75 transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/#download"
            className="text-sm font-medium rounded-md border border-white/25 bg-white/10 text-white px-3.5 py-1.5 hover:bg-white/15 transition"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2 font-mono">
          <CrabMark />
          <span>blackcrab</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-mono text-xs">v0.1 · macOS, Windows, Linux</span>
          <Link href="/docs" className="hover:text-foreground transition">
            Docs
          </Link>
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
