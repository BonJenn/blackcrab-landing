import type { Metadata } from "next";
import {
  DISCUSSIONS_URL,
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
              and what to check if the workspace or background service does not
              start cleanly.
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
                  Download the Apple-silicon Mac installer, move Blackcrab to
                  Applications, and open it.
                </li>
                <li>
                  Blackcrab prepares the background service and opens the new
                  workspace automatically. If startup fails, use the recovery
                  screen to inspect the error and retry.
                </li>
                <li>
                  Follow the workspace setup steps to connect an available agent
                  provider. Provider sign-in and usage billing remain separate
                  from the Blackcrab app.
                </li>
                <li>
                  Choose a project directory and create or open an agent thread.
                  Git, terminals and approvals are available in the workspace.
                </li>
                <li>
                  Use the Blackcrab app menu for background-service controls and
                  app updates. Keep existing app data when upgrading.
                </li>
              </ol>
            </DocSection>

            <DocSection id="requirements" number="02" title="Requirements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                <RequirementCard
                  title="Released app"
                  body="Blackcrab 0.4.2 targets Apple-silicon Macs. Previous builds remain available for Intel Macs, Windows and Linux. Complete the setup for the agent provider you choose."
                />
                <RequirementCard
                  title="Local development"
                  body="Use the pinned toolchain and build instructions in the repository. The Mac release combines a native launcher, an Electron workspace and a background-service host."
                />
                <RequirementCard
                  title="Experience level"
                  body="The project is early and aimed at people comfortable with coding agents, local repositories, shells and developer tools."
                />
              </div>
            </DocSection>

            <DocSection id="privacy-security" number="03" title="Privacy and security">
              <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
                <li>
                  Local work runs through the host on your Mac. Blackcrab also
                  provides account and hosted remote-connection services;
                  connecting those services involves network requests.
                </li>
                <li>
                  Agent providers, tools and commands can send data to external
                  services. Review your provider settings and approval requests
                  before granting access to sensitive repositories.
                </li>
                <li>
                  Conversations, project paths, attachments and command output
                  can contain sensitive information. Treat saved workspace data
                  and exported files accordingly.
                </li>
                <li>
                  Blackcrab is not a sandbox. Agents and terminals can use the
                  permissions of your local user account to work with files,
                  Git repositories and other developer tools.
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
                  title="Projects or threads are missing"
                  body={
                    <>
                      Select the environment and project where the thread was created.
                      Leave existing app data in place while diagnosing a
                      missing conversation.
                    </>
                  }
                />
                <TroubleCard
                  title="The workspace does not open"
                  body="Read the startup error, then use the retry or service controls. If it continues to fail, report the exact message and app version. Do not delete workspace data or change cache permissions as a first troubleshooting step."
                />
                <TroubleCard
                  title="Updater or download issues"
                  body="Installers and updater artifacts are published through GitHub Releases. If the in-app update fails, download the latest release manually."
                />
              </div>
              <p className="mt-5 text-sm text-muted leading-relaxed">
                Use Discussions for setup questions, ideas, and general help.
                Use Issues for reproducible bugs.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={DISCUSSIONS_URL}
                  className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent/90 transition"
                >
                  Ask in Discussions
                </a>
                <a
                  href={ISSUES_URL}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
                >
                  Open a GitHub issue
                </a>
              </div>
            </DocSection>

            <DocSection id="mobile" number="05" title="Blackcrab Remote for iPhone and iPad">
              <p className="text-muted leading-relaxed">
                Blackcrab Remote is currently an invite-only iOS beta distributed
                through TestFlight. Invited testers can install it from their
                TestFlight invitation. A public App Store download is not yet available.
              </p>
              <p className="mt-4 text-muted leading-relaxed">
                The mobile app connects to an authorized Blackcrab environment.
                Keep the host Mac running and use Settings → Sharing &amp; access
                in the desktop workspace to configure access. Remote workflows
                and notifications remain under validation during the beta.
              </p>
            </DocSection>

            <DocSection id="known-limitations" number="06" title="Known limitations">
              <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
                <li>
                  Blackcrab is pre-1.0 software. Expect behavior and packaging
                  details to change.
                </li>
                <li>
                  Version 0.4.2 is for Apple-silicon Macs. Full desktop/mobile
                  remote parity and notifications remain under validation;
                  this release includes no new iOS build.
                </li>
                <li>
                  Agent providers have their own setup, authentication and usage
                  requirements. Blackcrab does not replace those accounts or
                  subscriptions.
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
  ["Blackcrab Remote", "#mobile"],
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
