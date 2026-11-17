import Image from "next/image";
import Link from "next/link";
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
                Pick your model. Open a pane.
                <br />
                Keep the whole project in view.
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

        <nav className="chapter-nav" aria-label="Explore features">
          <a href="#models">
            <span>01</span> Multiple models <Arrow />
          </a>
          <a href="#collaboration">
            <span>02</span> Collaboration <Arrow />
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
              id="models"
              className="models-section section-space"
              aria-labelledby="models-title"
            >
              <div className="feature-copy">
                <p className="eyebrow">01 / Multiple models</p>
                <h2 id="models-title">
                  Your task.
                  <br />
                  Your choice.
                </h2>
                <p>
                  Claude for one thread. Codex for the next. Choose from your
                  configured providers and models, all in the same workspace.
                </p>
                <p className="fine-print">
                  Bring your own provider accounts. Their usage and
                  subscriptions stay separate.
                </p>
              </div>
              <div
                className="model-composition"
                aria-label="Choose a provider and model for each thread"
              >
                <div className="model-line">
                  <span className="model-initial">C</span>
                  <div>
                    <strong>Claude</strong>
                    <span>Anthropic</span>
                  </div>
                  <span className="model-family">Claude models</span>
                </div>
                <div className="model-line">
                  <span className="model-initial codex-initial">↗</span>
                  <div>
                    <strong>Codex</strong>
                    <span>OpenAI</span>
                  </div>
                  <span className="model-family">GPT models</span>
                </div>
                <div className="model-foot">
                  <span>One workspace. Individual threads.</span>
                  <span aria-hidden="true">↳</span>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="collaboration"
              className="shot-section"
              aria-labelledby="collaboration-title"
            >
              <div className="shot-head">
                <div className="feature-copy">
                  <p className="eyebrow">02 / Model collaboration</p>
                  <h2 id="collaboration-title">
                    Two models.
                    <br />
                    One task.
                  </h2>
                  <p>
                    Click the plus beside the model picker and choose a partner.
                    The lead model does the work, the partner reviews it, and the
                    lead resolves what the review found, all in the same
                    conversation.
                  </p>
                  <p className="fine-print">
                    The reviewer is told not to edit. It runs under the same
                    permission mode as the rest of the conversation.
                  </p>
                </div>
                <ol className="steps" aria-label="How model collaboration works">
                  <li>
                    <span>1</span>
                    <div>
                      <strong>Lead works</strong>
                      <p>The model you chose does the task.</p>
                    </div>
                  </li>
                  <li>
                    <span>2</span>
                    <div>
                      <strong>Partner reviews</strong>
                      <p>A second model checks the work.</p>
                    </div>
                  </li>
                  <li>
                    <span>3</span>
                    <div>
                      <strong>Lead resolves</strong>
                      <p>The lead acts on what the review found.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <figure className="shot-frame">
                <Image
                  src="/screenshots/chat-mode-v2.png"
                  alt="Blackcrab in chat mode: a conversation with tool activity, the model picker with a plus button for a partner model, and a Git and changes summary"
                  width={2000}
                  height={1129}
                  sizes="(max-width: 1800px) 92vw, 1600px"
                />
                <figcaption>
                  Chat mode. The plus beside the model picker adds a partner.
                </figcaption>
              </figure>
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
              <p>v0.4.6 · Apple silicon</p>
            </div>
            <div className="download-alternatives">
              <span>Other platforms</span>
              <DownloadLink href={WINDOWS_DOWNLOAD_URL} platform="windows">
                Windows <span>v0.4.6</span>
              </DownloadLink>
              <DownloadLink href={LINUX_DOWNLOAD_URL} platform="linux">
                Linux <span>v0.4.6</span>
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
