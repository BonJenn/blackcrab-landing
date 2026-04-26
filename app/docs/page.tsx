import type { Metadata } from "next";
import {
  Footer,
  ISSUES_URL,
  Nav,
  PRIVACY_URL,
  SECURITY_URL,
} from "../site";

export const metadata: Metadata = {
  title: "Blackcrab Documentation",
  description:
    "Setup, requirements, privacy, security, troubleshooting, and limitations for Blackcrab.",
};

export default function DocsPage() {
  return (
    <main className="flex-1 w-full">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-20">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Documentation
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Setup, trust, and support notes.
            </h1>
            <p className="mt-4 text-muted leading-relaxed">
              The short version of what you need before downloading Blackcrab
              and what to check if the local Claude Code bridge does not start
              cleanly.
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
                    Anthropic Console billing users can use the Claude Code
                    console login flow instead.
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
                  Use grid mode for up to six live panels, open local preview
                  URLs in the side webview, and export finished sessions as
                  Markdown.
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
                  CLI subprocess. Network requests come from Claude Code, tools
                  it runs, opened URLs, or commands you execute locally.
                </li>
                <li>
                  Treat exported Markdown transcripts and Claude session files
                  as sensitive. They can contain prompts, file paths, command
                  output, and tool results.
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
                      terminal. If it fails, install Claude Code and make sure
                      the <InlineCode>claude</InlineCode> executable is available
                      from your shell path.
                    </>
                  }
                />
                <TroubleCard
                  title="Claude Code is installed but not authenticated"
                  body={
                    <>
                      Run <InlineCode>claude auth status</InlineCode>. If
                      needed, sign in with{" "}
                      <InlineCode>claude auth login --claudeai</InlineCode> or
                      use the Console billing login flow.
                    </>
                  }
                />
                <TroubleCard
                  title="Sessions are missing from the sidebar"
                  body={
                    <>
                      Confirm the working directory is correct and that Claude
                      Code has saved session files under{" "}
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
                  Linux are not supported desktop targets yet.
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
      <Footer />
    </main>
  );
}

const docLinks: Array<[string, string]> = [
  ["Getting started", "#getting-started"],
  ["Requirements", "#requirements"],
  ["Privacy and security", "#privacy-security"],
  ["Troubleshooting", "#troubleshooting"],
  ["Known limitations", "#known-limitations"],
];

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
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function RequirementCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="bg-background p-5">
      <h3 className="font-medium mb-2">{title}</h3>
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
      <h3 className="font-medium mb-2">{title}</h3>
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
