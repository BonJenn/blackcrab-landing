import Link from "next/link";
import { DownloadLink } from "./DownloadLink";
import { WorkspaceDemo } from "./WorkspaceDemo";
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
                Apple silicon · Free &amp; open source
              </span>
            </div>
          </div>
          <div className="hero-workspace">
            <WorkspaceDemo />
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
          <a href="#panes">
            <span>02</span> Pane mode <Arrow />
          </a>
          <a href="#remote">
            <span>03</span> Remote access <Arrow />
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
              id="panes"
              className="panes-section"
              aria-labelledby="panes-title"
            >
              <div className="feature-copy">
                <p className="eyebrow">02 / Pane mode</p>
                <h2 id="panes-title">
                  Make room
                  <br />
                  for both.
                </h2>
                <p>
                  Keep separate threads side by side. Follow one task while
                  another runs. Git, terminals and approvals are right there
                  when you need them.
                </p>
                <a className="text-link" href="#workspace-demo">
                  Try the pane layouts <Arrow />
                </a>
              </div>
              <div
                className="pane-study"
                role="img"
                aria-label="Two independent threads, each with its own conversation and composer"
              >
                <div className="study-window study-one">
                  <span className="study-label">01 / Build</span>
                  <strong>
                    Work on
                    <br />
                    the interface.
                  </strong>
                  <div className="study-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="study-composer">
                    Claude <span>↑</span>
                  </span>
                </div>
                <div className="study-window study-two">
                  <span className="study-label">02 / Review</span>
                  <strong>
                    Look at
                    <br />
                    the details.
                  </strong>
                  <div className="study-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="study-composer">
                    Codex <span>↑</span>
                  </span>
                </div>
                <p>Separate conversations. Side by side.</p>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section
              id="remote"
              className="remote-section section-space"
              aria-labelledby="remote-title"
            >
              <div
                className="remote-drawing"
                role="img"
                aria-label="Blackcrab Connect links your running host computer with a remote device. Invitation-only beta."
              >
                <div className="remote-host">
                  <div className="device-top">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="host-panes">
                    <i />
                    <i />
                  </div>
                  <span>Your computer</span>
                </div>
                <div className="connection-line">
                  <span />
                </div>
                <div className="remote-phone">
                  <div className="phone-island" />
                  <div className="phone-content">
                    <span className="phone-symbol">↗</span>
                    <span>
                      Blackcrab
                      <br />
                      Remote
                    </span>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <span className="connection-caption">
                  Your workspace, within reach.
                </span>
              </div>
              <div className="feature-copy">
                <p className="eyebrow">
                  03 / Remote access{" "}
                  <span className="beta-label">Invite-only beta</span>
                </p>
                <h2 id="remote-title">
                  A little less
                  <br />
                  desk-bound.
                </h2>
                <p>
                  Blackcrab Connect is bringing your running workspace to other
                  devices. Remote access is in private beta, with iPhone and
                  iPad testing through TestFlight.
                </p>
                <Link className="text-link" href="/docs#mobile">
                  About the remote beta <Arrow />
                </Link>
                <p className="fine-print">
                  Free local and self-hosted software. Paid Blackcrab-hosted
                  remote access is planned; public signup isn’t open yet.
                </p>
              </div>
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
              <p>v0.4.3 · Apple silicon</p>
            </div>
            <div className="download-alternatives">
              <span>Other platforms</span>
              <DownloadLink href={WINDOWS_DOWNLOAD_URL} platform="windows">
                Windows <span>v0.3.0</span>
              </DownloadLink>
              <DownloadLink href={LINUX_DOWNLOAD_URL} platform="linux">
                Linux <span>v0.3.0</span>
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
