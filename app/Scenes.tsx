import Image from "next/image";
import { Stage } from "./Motion";

/*
 * Animated screenshot scenes. Each one keeps a real screenshot as its base and
 * layers motion on top, positioned in percentages of the screenshot so it
 * scales with it. The overlays are decorative (aria-hidden); the screenshot's
 * alt text carries the meaning. The motion shows example activity and is not
 * captured from a live session.
 */

const HERO_ALT =
  "Blackcrab's workspace in chat mode: a project sidebar, an agent conversation with tool activity, a model picker and a Git changes summary";

export function HeroScene() {
  return (
    <Stage className="scene-hero">
      <Image
        src="/screenshots/chat-mode-v2.png"
        alt={HERO_ALT}
        width={2000}
        height={1129}
        sizes="(max-width: 1200px) 92vw, 1100px"
        priority
      />
      <div className="fx" aria-hidden="true">
        <span className="hero-row" />
        <span className="hero-stop" />
        <div className="tick-stack">
          <div className="tick tick-1">
            <span className="tick-dot tick-claude" />
            <span className="tick-text">
              <b>Claude</b> Editing src/upload.ts
            </span>
            <em>
              <u>+24</u> <s>−3</s>
            </em>
            <i className="tick-bar" />
          </div>
          <div className="tick tick-2">
            <span className="tick-dot tick-gemini" />
            <span className="tick-text">
              <b>Gemini</b> Reviewing the diff
            </span>
            <em>2 notes</em>
            <i className="tick-bar" />
          </div>
          <div className="tick tick-3">
            <span className="tick-dot tick-codex" />
            <span className="tick-text">
              <b>Codex</b> Running npm test
            </span>
            <em>
              <u>12 passed</u>
            </em>
            <i className="tick-bar" />
          </div>
        </div>
        <span className="scene-sheen" />
      </div>
    </Stage>
  );
}

/** One pane at the screenshot's pane-mode layout, shown as a clipped layer. */
function PaneLayer({
  className,
  alt = "",
}: {
  className: string;
  alt?: string;
}) {
  return (
    <div className={`ps-layer ${className}`} aria-hidden={alt ? undefined : true}>
      <Image
        src="/screenshots/pane-mode-v2.png"
        alt={alt}
        width={2000}
        height={1126}
        sizes="(max-width: 1800px) 88vw, 1500px"
      />
    </div>
  );
}

export function PaneScene() {
  return (
    <Stage className="scene-panes">
      <PaneLayer
        className="ps-side"
        alt="Blackcrab in pane mode: three threads side by side, each with its own composer and a different model selected"
      />
      <PaneLayer className="ps-pane ps-pane-3" />
      <PaneLayer className="ps-pane ps-pane-2" />
      <PaneLayer className="ps-pane ps-pane-1" />
      <div className="fx" aria-hidden="true">
        <span className="ps-seam ps-seam-1" />
        <span className="ps-seam ps-seam-2" />
        <span className="ps-chip">
          <kbd>⌘</kbd>
          <kbd>D</kbd> Split pane
        </span>
      </div>
    </Stage>
  );
}

export function IdeScene() {
  return (
    <Stage className="scene-ide">
      <Image
        src="/screenshots/ide-mode-v2.png"
        alt="Blackcrab in IDE mode: a file tree and code editor on the left and the agent conversation on the right"
        width={2000}
        height={1126}
        sizes="(max-width: 1800px) 92vw, 1600px"
      />
      <div className="fx" aria-hidden="true">
        <span className="ide-hop" />
        <span className="ide-red" />
        <span className="ide-green" />
        <span className="ide-follow" />
        <span className="ide-think" />
        <span className="ide-count">
          <i className="ide-count-0">▾ Agent changes (0)</i>
          <i className="ide-count-1">▾ Agent changes (1)</i>
          <i className="ide-count-2">▾ Agent changes (2)</i>
          <i className="ide-count-3">▾ Agent changes (3)</i>
        </span>
        <span className="ide-toast">
          <span className="ide-toast-dot" />
          Following agent · <b>src/App.tsx</b>
        </span>
      </div>
    </Stage>
  );
}

export function WindowsScene() {
  return (
    <Stage className="scene-windows">
      <div
        className="monitors"
        role="group"
        aria-label="Two displays side by side, each showing a Blackcrab window"
      >
        <figure className="monitor">
          <div className="monitor-screen">
            <div className="mwin mwin-1">
              <Image
                src="/screenshots/pane-mode-v2.png"
                alt="Display one: a Blackcrab window in pane mode with three threads side by side"
                width={2000}
                height={1126}
                sizes="(max-width: 800px) 90vw, 620px"
              />
            </div>
          </div>
          <div className="monitor-neck" aria-hidden="true" />
          <div className="monitor-base" aria-hidden="true" />
          <figcaption>Display 1 · Pane mode</figcaption>
        </figure>
        <figure className="monitor">
          <div className="monitor-screen">
            <div className="wallpaper" aria-hidden="true" />
            <div className="mwin mwin-2">
              <Image
                src="/screenshots/ide-mode-v2.png"
                alt="Display two: a Blackcrab window in IDE mode with a file tree and editor beside the conversation"
                width={2000}
                height={1126}
                sizes="(max-width: 800px) 90vw, 620px"
              />
            </div>
            <span className="win-ripple" aria-hidden="true" />
          </div>
          <div className="monitor-neck" aria-hidden="true" />
          <div className="monitor-base" aria-hidden="true" />
          <figcaption>Display 2 · IDE mode</figcaption>
        </figure>
        <div className="fx" aria-hidden="true">
          <span className="drag-chip">Review checkout…</span>
          <svg
            className="drag-cursor"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 3l16 7.5-7 2.2-2.6 7.3z"
              fill="#fff"
              stroke="#17151a"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          <span className="new-win-chip">
            <kbd>⌘</kbd>
            <kbd>⇧</kbd>
            <kbd>N</kbd> New window
          </span>
        </div>
      </div>
    </Stage>
  );
}
