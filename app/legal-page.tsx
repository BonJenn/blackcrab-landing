import Link from "next/link";
import { Footer, Nav } from "./site";

export const LEGAL_EFFECTIVE_DATE = "November 16, 2026";

export const LEGAL_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["Legal", "/legal"],
  ["Privacy", "/privacy-policy"],
  ["Terms", "/terms-of-service"],
  ["Security", "/security-policy"],
  ["Support", "/support"],
];

/**
 * Shared shell for the legal and support pages. These pages are also opened
 * inside the iOS app's web view, so they are plain server-rendered documents:
 * no client components, and readable at 320px.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  effectiveDate,
  current,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  effectiveDate?: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <article id="content" className="legal-page">
        <header className="legal-header">
          <span className="legal-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {effectiveDate ? (
            <p className="legal-date">Effective date: {effectiveDate}</p>
          ) : null}
          {intro ? <p className="legal-intro">{intro}</p> : null}
        </header>
        <nav className="legal-nav" aria-label="Legal and support pages">
          {LEGAL_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={href === current ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="legal-body">{children}</div>
      </article>
      <Footer />
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
