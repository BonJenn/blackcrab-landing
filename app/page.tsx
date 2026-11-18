import Image from "next/image";
import Link from "next/link";
import { CollabIllustration } from "./CollabIllustration";
import { DownloadLink } from "./DownloadLink";
import { Reveal } from "./Reveal";
import {
  APP_REPO_URL,
  Footer,
  LINUX_DOWNLOAD_URL,
  MAC_DOWNLOAD_URL,
  Nav,
  WINDOWS_DOWNLOAD_URL,
} from "./site";

const providers: {
  name: string;
  maker: string;
  note: string;
  logo: string;
  badge?: string;
  strip?: boolean;
  stripLabel?: string;
}[] = [
  { name: "Claude", logo: "claude", strip: true, maker: "Anthropic", note: "Claude models, including Claude Code." },
  { name: "Codex", logo: "openai", strip: true, stripLabel: "OpenAI Codex", maker: "OpenAI", note: "GPT models through Codex." },
  {
    name: "Gemini", logo: "gemini", strip: true,
    maker: "Google",
    note: "Through Antigravity. Sign in with a Google account, a Gemini API key or Vertex AI.",
  },
  {
    name: "Muse", logo: "muse", strip: true, stripLabel: "Meta Muse",
    maker: "Meta",
    note: "Meta’s Muse models through Muse Code, signed in with muse login.",
  },
  { name: "Grok", logo: "grok", strip: true, maker: "xAI", note: "Grok models through the Grok agent." },
  { name: "Cursor", logo: "cursor", strip: true, maker: "Cursor", note: "Models from your Cursor account." },
  {
    name: "OpenCode", logo: "opencode", strip: true,
    maker: "Open source",
    note: "Point it at hosted models or models running on your machine.",
  },
  { name: "Pi", logo: "pi", maker: "Open source", note: "A lightweight coding agent you can enable." },
  { name: "Kiro", logo: "kiro", maker: "Amazon", note: "Kiro’s agent.", badge: "Early access" },
  {
    name: "Local models", logo: "local",
    maker: "On your machine",
    note: "Run models locally through OpenCode, or any agent you add that speaks the Agent Client Protocol.",
  },
  {
    name: "Any ACP agent", logo: "acp",
    maker: "Agent Client Protocol",
    note: "Add an agent from the ACP Registry, or run your own with a local command.",
  },
];

export default function Home() {
  return (
    <div className="landing">
      <Nav />
      <main id="content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div>
              <p className="eyebrow">A desktop workspace for coding agents</p>
              <h1 id="hero-title">
                Different models.
                <br />
                One place to work.
              </h1>
            </div>
            <div className="hero-intro">
              <p>
                Pick your model. Pair a second
                <br />
                to review it. Open a pane.
              </p>
              <DownloadLink
                href={MAC_DOWNLOAD_URL}
                platform="macos"
                className="button button-dark"
              >
                Download for Mac <Arrow down />
              </DownloadLink>
              <span className="download-note">
                Mac, Windows &amp; Linux · Free &amp; open source
              </span>
            </div>
          </div>
          <div className="hero-workspace">
            <figure className="shot-frame hero-shot">
              <Image
                src="/screenshots/chat-mode-v2.png"
                alt="Blackcrab's workspace in chat mode: a project sidebar, an agent conversation with tool activity, a model picker and a Git changes summary"
                width={2000}
                height={1129}
                sizes="(max-width: 1200px) 92vw, 1100px"
                priority
              />
              <figcaption>
                The Blackcrab workspace in chat mode.
              </figcaption>
            </figure>
          </div>
          <div className="hero-bottom">
            <span>Less switching. More making.</span>
            <a href="#features" aria-label="Explore Blackcrab features">
              <Arrow down />
            </a>
          </div>
        </section>

        <section className="works-with" aria-label="Works with">
          <p>Works with</p>
          <ul>
            {providers
              .filter((provider) => provider.strip)
              .map((provider) => (
                <li key={provider.name}>
                  <Image
                    src={`/providers/${provider.logo}.svg`}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                  />
                  <span>{provider.stripLabel ?? provider.name}</span>
                </li>
              ))}
            <li className="works-with-more">
              <span>and local models</span>
            </li>
          </ul>
        </section>

        <nav className="chapter-nav" aria-label="Explore features">
          <a href="#collaboration">
            <span>01</span> Collaboration <Arrow />
          </a>
          <a href="#models">
            <span>02</span> Any model <Arrow />
          </a>
          <a href="#panes">
            <span>03</span> Pane mode <Arrow />
          </a>
          <a href="#ide">
            <span>04</span> IDE mode <Arrow />
          </a>
          <a href="#windows">
            <span>05</span> Multi-window <Arrow />
          </a>
          <a href="#ios">
            <span>06</span> iOS app <Arrow />
          </a>
        </nav>

        <div id="features" className="features">
          <Reveal>
            <section
              id="collaboration"
              className="shot-section"
              aria-labelledby="collaboration-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">01 / Model collaboration</p>
                  <h2 id="collaboration-title">
                    Let one model
                    <br />
                    check another.
                  </h2>
                  <p>
                    Click the plus beside the model picker and choose a partner.
                    The lead model does the work, the partner reviews it, and
                    the lead resolves what the review found. All three passes
                    happen in the same conversation, with no copying between
                    tools.
                  </p>
                  <p className="fine-print">
                    The reviewer is told not to edit. It runs under the same
                    permission mode as the rest of the conversation.
                  </p>
                </div>
                <div className="pairings">
                  <p className="pairings-label">Try pairings like</p>
                  <ul>
                    <li>
                      <span>Claude</span> leads <i aria-hidden="true">·</i>{" "}
                      <span>Gemini</span> reviews
                    </li>
                    <li>
                      <span>Codex</span> leads <i aria-hidden="true">·</i>{" "}
                      <span>Muse</span> reviews
                    </li>
                    <li>
                      <span>Your hosted model</span> leads{" "}
                      <i aria-hidden="true">·</i> <span>a local model</span>{" "}
                      reviews
                    </li>
                  </ul>
                  <p className="fine-print">
                    Available pairings depend on the providers you have set up.
                  </p>
                </div>
              </div>
              <CollabIllustration />
            </section>
          </Reveal>

          <Reveal>
            <section
              id="models"
              className="shot-section"
              aria-labelledby="models-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">02 / Any model</p>
                  <h2 id="models-title">
                    Claude, Gemini,
                    <br />
                    Muse, or your own.
                  </h2>
                  <p>
                    Choose a provider and model for each thread, and mix them in
                    one workspace. Use hosted models from Anthropic, OpenAI,
                    Google, Meta and xAI, or run models on your own machine.
                  </p>
                </div>
                <p className="providers-note">
                  Each provider is a separate tool that you set up and sign in
                  to on your computer. Usage, billing and terms stay with the
                  provider. Names and logos belong to their owners and show
                  compatibility only.
                </p>
              </div>
              <ul className="providers" aria-label="Supported providers">
                {providers.map((provider) => (
                  <li key={provider.name} className="provider-card">
                    <div className="provider-top">
                      <span className="provider-logo">
                        <Image
                          src={`/providers/${provider.logo}.svg`}
                          alt=""
                          width={26}
                          height={26}
                          unoptimized
                        />
                      </span>
                      <strong>{provider.name}</strong>
                      {provider.badge ? (
                        <span className="provider-badge">{provider.badge}</span>
                      ) : null}
                    </div>
                    <span className="provider-maker">{provider.maker}</span>
                    <p>{provider.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="panes"
              className="shot-section shot-tinted"
              aria-labelledby="panes-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">03 / Pane mode</p>
                  <h2 id="panes-title">
                    Make room
                    <br />
                    for both.
                  </h2>
                  <p>
                    Keep separate threads side by side. Follow one task while
                    another runs, each with its own conversation, composer and
                    model. Git, terminals and approvals are right there when you
                    need them.
                  </p>
                </div>
              </div>
              <figure className="shot-frame">
                <Image
                  src="/screenshots/pane-mode-v2.png"
                  alt="Blackcrab in pane mode: three threads side by side, each with its own composer and a different model selected"
                  width={2000}
                  height={1126}
                  sizes="(max-width: 1800px) 88vw, 1500px"
                />
                <figcaption>
                  Three panes, three models.
                </figcaption>
              </figure>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="ide"
              className="shot-section"
              aria-labelledby="ide-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">04 / IDE mode</p>
                  <h2 id="ide-title">
                    Code beside
                    <br />
                    the conversation.
                  </h2>
                  <p>
                    IDE mode opens a file tree and editor next to the chat. It
                    follows the files your agent changes and refreshes them from
                    disk. Switch back to chat mode with one click.
                  </p>
                </div>
                <ul className="ios-points">
                  <li>Edit and save without leaving the thread</li>
                  <li>Saves are refused if the file changed on disk</li>
                  <li>A recovery copy keeps the previous contents</li>
                  <li>Select lines to attach them to your next message</li>
                </ul>
              </div>
              <figure className="shot-frame">
                <Image
                  src="/screenshots/ide-mode-v2.png"
                  alt="Blackcrab in IDE mode: a file tree and code editor on the left and the agent conversation on the right"
                  width={2000}
                  height={1126}
                  sizes="(max-width: 1800px) 92vw, 1600px"
                />
                <figcaption>
                  IDE mode. The code panel sits beside the conversation.
                </figcaption>
              </figure>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="windows"
              className="shot-section"
              aria-labelledby="windows-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">05 / Multi-window</p>
                  <h2 id="windows-title">
                    More desk.
                    <br />
                    More windows.
                  </h2>
                  <p>
                    Open more than one window and spread your threads across
                    your displays. Windows share the same workspace and
                    background service, so every conversation stays in sync.
                  </p>
                </div>
              </div>
              <div
                className="monitors"
                role="group"
                aria-label="Two displays side by side, each showing a Blackcrab window"
              >
                <figure className="monitor">
                  <div className="monitor-screen">
                    <Image
                      src="/screenshots/pane-mode-v2.png"
                      alt="Display one: a Blackcrab window in pane mode with three threads side by side"
                      width={2000}
                      height={1126}
                      sizes="(max-width: 800px) 90vw, 620px"
                    />
                  </div>
                  <div className="monitor-neck" aria-hidden="true" />
                  <div className="monitor-base" aria-hidden="true" />
                  <figcaption>Display 1 · Pane mode</figcaption>
                </figure>
                <figure className="monitor">
                  <div className="monitor-screen">
                    <Image
                      src="/screenshots/ide-mode-v2.png"
                      alt="Display two: a Blackcrab window in IDE mode with a file tree and editor beside the conversation"
                      width={2000}
                      height={1126}
                      sizes="(max-width: 800px) 90vw, 620px"
                    />
                  </div>
                  <div className="monitor-neck" aria-hidden="true" />
                  <div className="monitor-base" aria-hidden="true" />
                  <figcaption>Display 2 · IDE mode</figcaption>
                </figure>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="ios"
              className="shot-section"
              aria-labelledby="ios-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">
                    06 / iOS app <span className="beta-label">Coming soon</span>
                  </p>
                  <h2 id="ios-title">
                    Your agents,
                    <br />
                    in your pocket.
                  </h2>
                  <p>
                    Blackcrab for iPhone and iPad is on its way. Watch your
                    agent threads, answer questions, approve changes and review
                    diffs from wherever you are. Your code and provider accounts
                    stay on your computer.
                  </p>
                  <Link className="text-link" href="/docs#mobile">
                    About the iOS app <Arrow />
                  </Link>
                  <p className="fine-print">
                    Not yet available on the App Store. Free local and
                    self-hosted software; paid Blackcrab-hosted remote access is
                    planned.
                  </p>
                </div>
                <ul className="ios-points">
                  <li>See every thread across your projects, live</li>
                  <li>Approve or decline commands and file changes</li>
                  <li>Review diffs, terminal output and pull requests</li>
                  <li>Get notified when an agent finishes or needs you</li>
                </ul>
              </div>
              <figure className="ios-stage">
                <div className="ios-devices">
                  {[
                    ["/ios/iphone-chats.png", "The thread list across two computers"],
                    ["/ios/iphone-thread.png", "An agent conversation about fixing a flaky test"],
                    ["/ios/iphone-review.png", "A code diff review of changes against main"],
                    ["/ios/iphone-live.jpg", "A Live Activity on the Lock Screen waiting for approval"],
                  ].map(([src, alt]) => (
                    <div className="ios-device" key={src}>
                      <Image
                        src={src}
                        alt={`Blackcrab on iPhone: ${alt}`}
                        width={782}
                        height={1700}
                        sizes="(max-width: 800px) 44vw, 300px"
                      />
                    </div>
                  ))}
                </div>
                <figcaption>
                  Screenshots from the iPhone app, using demo projects.
                </figcaption>
              </figure>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section
            id="download"
            className="download-section"
            aria-labelledby="download-title"
          >
            <div>
              <p className="eyebrow">Yours to work with.</p>
              <h2 id="download-title">Start something.</h2>
            </div>
            <div className="download-actions">
              <DownloadLink
                href={MAC_DOWNLOAD_URL}
                platform="macos"
                className="button button-dark"
              >
                Download for Mac <Arrow down />
              </DownloadLink>
              <p>v0.4.7 · Apple silicon</p>
            </div>
            <div className="download-alternatives">
              <span>Other platforms</span>
              <DownloadLink href={WINDOWS_DOWNLOAD_URL} platform="windows">
                Windows <span>v0.4.7</span>
              </DownloadLink>
              <DownloadLink href={LINUX_DOWNLOAD_URL} platform="linux">
                Linux <span>v0.4.7</span>
              </DownloadLink>
              <Link href="/releases">
                All releases <Arrow />
              </Link>
              <a href={APP_REPO_URL}>
                View source <Arrow />
              </a>
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className="arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      style={down ? { transform: "rotate(90deg)" } : undefined}
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
