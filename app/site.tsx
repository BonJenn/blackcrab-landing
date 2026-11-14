import Image from "next/image";
import Link from "next/link";

export const APP_REPO_URL = "https://github.com/BonJenn/blackcrab";
export const GITHUB_RELEASES_URL =
  "https://github.com/BonJenn/blackcrab/releases";
export const MAC_DOWNLOAD_URL = "/download/macos";
export const WINDOWS_DOWNLOAD_URL = "/download/windows";
export const LINUX_DOWNLOAD_URL = "/download/linux";
export const PRIVACY_URL =
  "https://github.com/BonJenn/blackcrab/blob/main/PRIVACY.md";
export const SECURITY_URL =
  "https://github.com/BonJenn/blackcrab/blob/main/SECURITY.md";
export const ISSUES_URL = "https://github.com/BonJenn/blackcrab/issues";
export const DISCUSSIONS_URL =
  "https://github.com/BonJenn/blackcrab/discussions";

export function Nav() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Link href="/" className="wordmark" aria-label="Blackcrab home">
        <CrabMark />
        <span>blackcrab</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/#features" className="nav-features">
          Features
        </Link>
        <Link href="/docs">Docs</Link>
        <Link href="/releases" className="nav-releases">
          Releases
        </Link>
        <Link href="/#download" className="nav-download">
          Get Blackcrab <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="wordmark">
          <CrabMark />
          <span>blackcrab</span>
        </Link>
        <p>Space for the way you work.</p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Blackcrab</span>
        <nav aria-label="Footer navigation">
          <Link href="/docs">Docs</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/releases">Releases</Link>
          <a href={DISCUSSIONS_URL}>Community</a>
          <a href={APP_REPO_URL}>GitHub</a>
        </nav>
      </div>
    </footer>
  );
}

function CrabMark() {
  return (
    <span aria-hidden className="crab-mark">
      <Image
        src="/blackcrab_logo.png"
        alt=""
        width={20}
        height={20}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
