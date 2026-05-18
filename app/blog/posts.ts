export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  displayDate: string;
  readTime: string;
  tags: string[];
  sections: BlogSection[];
};

export type ChangelogEntry = {
  version: string;
  label: string;
  displayDate: string;
  summary: string;
  changes: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "blackcrab-0-2-0-power-user-interface",
    title: "Blackcrab 0.2.0: a sharper interface for power users",
    dek: "A design-focused release that makes the desktop workspace denser, more keyboard-friendly, and more predictable in smaller windows while keeping the local Claude Code workflow intact.",
    category: "Release notes",
    displayDate: "May 2026",
    readTime: "5 min read",
    tags: ["Release", "Interface", "Power users"],
    sections: [
      {
        heading: "A quieter shell for heavier work",
        paragraphs: [
          "Blackcrab 0.2.0 is mostly about the surface you live in while Claude Code is running. The app now uses a tighter, more minimal shell with less repeated chrome, a clearer command entry point, and a status bar that carries the details you need without turning the top of the app into a control panel.",
          "The direction is deliberately closer to a focused editor than a marketing dashboard: compact rows, predictable controls, useful status, and fewer visual interruptions between sessions.",
        ],
      },
      {
        heading: "Density modes are now first-class",
        paragraphs: [
          "This release adds three layout densities: comfortable, compact, and focus. Compact is the default for a denser power-user workspace. Comfortable gives the interface more air. Focus hides the sidebar and tightens the shell for working inside one active conversation.",
          "Density can be changed from Settings, the command palette, or the bottom status bar. The top-bar density control was removed so the setting is still available without being repeated in two places.",
        ],
        bullets: [
          "Comfortable mode for a roomier transcript and controls.",
          "Compact mode for everyday power-user density.",
          "Focus mode for a reduced single-session workspace.",
          "Command palette entries for cycling or selecting density directly.",
        ],
      },
      {
        heading: "Navigation is faster from the keyboard",
        paragraphs: [
          "The command palette is now easier to reach from the main shell, and it includes commands for opening the next or previous recent session. That makes session switching less dependent on the sidebar when you already know you are moving through recent work.",
          "Blackcrab also adds recent-session keyboard navigation with Command-Shift-[ and Command-Shift-] on macOS, with the equivalent Control modifier on other platforms.",
        ],
      },
      {
        heading: "Status moved where it belongs",
        paragraphs: [
          "The bottom status bar now carries the active session id, current project folder, branch state, selected model, permission mode, context tokens, estimated cost, tool count, attention queue, diagnostics, and layout density. The goal is to make the running state visible without competing with the transcript.",
          "This is especially useful when multiple sessions are active. The app can show what is connected, what is running, and what needs attention while leaving the main pane for the conversation and tool output.",
        ],
      },
      {
        heading: "Windowed mode behaves better",
        paragraphs: [
          "A smaller but important fix: the app should no longer clip off the right side of the UI when it is not fullscreen. The sidebar collapses at narrower widths, the preview pane has responsive width caps, and compact labels keep the status area from forcing horizontal overflow.",
          "That matters on laptops and split-screen desktops, where a power-user tool has to work in the actual window size people give it, not only in a perfect fullscreen layout.",
        ],
      },
      {
        heading: "Authentication startup is safer",
        paragraphs: [
          "This release also includes the Claude authentication fix from the 0.2.0 branch. When normal Claude Code CLI authentication is available, Blackcrab now avoids passing stale Anthropic credential override environment variables into spawned Claude processes.",
          "That should reduce the recurring 401 failure mode where an old token overrides a valid local CLI login when starting or continuing sessions.",
        ],
      },
      {
        heading: "Upgrade notes",
        paragraphs: [
          "Blackcrab 0.2.0 ships signed updater artifacts and fresh installers for macOS, Windows, and Linux through GitHub Releases. Existing users should be able to update through the app once the updater check sees the published release.",
          "There are no manual migration steps for this release. If the updater does not appear immediately, downloading a fresh installer from the releases page is still safe.",
        ],
      },
    ],
  },
  {
    slug: "blackcrab-0-1-3-steadier-sessions-cleaner-transcripts",
    title: "Blackcrab 0.1.3: steadier sessions and cleaner transcripts",
    dek: "A focused quality release for the workflows people touch every day: switching between conversations, reading long transcripts, and keeping local Claude Code sessions connected reliably.",
    category: "Release notes",
    displayDate: "May 2026",
    readTime: "4 min read",
    tags: ["Release", "Sessions", "Transcripts"],
    sections: [
      {
        heading: "A focused quality release",
        paragraphs: [
          "Blackcrab 0.1.3 is not a broad feature drop. It is the kind of update that makes the existing app feel calmer under real use.",
          "The release tightens conversation switching, makes transcripts easier to scan, cleans up Claude session startup, and adds anonymous update health events so future releases can be measured more clearly.",
        ],
      },
      {
        heading: "Conversations keep their place",
        paragraphs: [
          "The biggest fix is conversation continuity across mode switches. When you move from grid mode into a single conversation, then back to the grid, the app now keeps better track of which backend panel owns each conversation and which transcript should receive new events.",
          "That matters most when a response is still running. Earlier builds could leave the grid showing an older snapshot, or cause the next single-mode open to hit a warning that the session was already being used somewhere else. Blackcrab now tracks panel ownership and transcript state more deliberately so active sessions can continue without fighting over the same saved conversation file.",
        ],
      },
      {
        heading: "Transcripts are easier to scan",
        paragraphs: [
          "Long Claude Code sessions can get noisy fast. Tool calls, command output, thinking blocks, file reads, patches, and permission flow all compete with the actual conversation.",
          "In 0.1.3, transcript blocks use more compact drawers. Tool output folds by default when it is not an error, while failures stay visible. Summaries show useful context such as paths, command descriptions, line counts, task counts, and whether a background command is involved.",
          "The goal is simple: you should be able to skim a session, find the important parts, and expand the raw details only when you need them.",
        ],
      },
      {
        heading: "Claude session startup is cleaner",
        paragraphs: [
          "This release also tightens how Blackcrab prepares Claude Code sessions. The app refreshes Claude auth state before spawning a session, while avoiding direct injection of keychain access tokens into spawned processes.",
          "That keeps session startup aligned with the local Claude Code CLI and reduces the amount of credential handling Blackcrab needs to do itself.",
        ],
      },
      {
        heading: "Update health is now measurable",
        paragraphs: [
          "Blackcrab can now send anonymous app and updater events to the landing site's analytics endpoint. These events cover app launches, update checks, update starts, completed updates, and update failures.",
          "The setting is visible in Settings and can be turned off. The privacy docs and README were updated to explain what is sent and why: the data is meant to help understand whether releases are installing successfully, not to inspect local sessions or Claude traffic.",
        ],
      },
      {
        heading: "Upgrade notes",
        paragraphs: [
          "There are no manual migration steps for 0.1.3. Users on 0.1.2 should be able to install the update normally through the app or download a fresh installer from GitHub Releases.",
          "As usual for an early desktop build, the release is still macOS-first, with GitHub Actions also producing Windows and Linux artifacts for testing.",
        ],
      },
    ],
  },
  {
    slug: "what-changed-in-blackcrab-0-1-1-and-0-1-2",
    title: "What changed in Blackcrab 0.1.1 and 0.1.2",
    dek: "The first two updates after the initial preview focused on making Blackcrab more reliable as a daily Claude Code workspace: better attention signals, safer handoffs, usage dashboards, project reporting, faster search, and signed update artifacts.",
    category: "Release notes",
    displayDate: "May 2026",
    readTime: "6 min read",
    tags: ["Releases", "Usage", "Updater"],
    sections: [
      {
        heading: "0.1.1 tightened the live workflow",
        paragraphs: [
          "Blackcrab v0.1.1 was published on April 28, 2026. It was less about adding a large new surface and more about making the early desktop workflow hold together when real sessions are active.",
          "The biggest theme was attention and reliability. Sessions move through clearer activity states, the sidebar can promote work that needs a look, and stuck turns have a smarter watchdog so the app can tell when Claude Code has gone quiet for too long.",
        ],
        bullets: [
          "Smoother sidebar activity promotion and session attention management.",
          "Claude OAuth refresh through the app's token path, plus a smarter stuck-turn watchdog.",
          "Deferred grid handoff while a session is busy, so single-panel and grid transitions are less fragile.",
          "macOS TCC permission strings and stderr filtering for a cleaner packaged-app experience.",
          "A Claude token setup flow, title-edit focus fixes, and a fix for handing a single session into the grid.",
        ],
      },
      {
        heading: "0.1.2 made usage visible",
        paragraphs: [
          "Blackcrab v0.1.2 was published on May 2, 2026. This release moved the app from showing per-session usage hints to giving you a broader view of where tokens and estimated spend are going.",
          "The new usage dashboard summarizes saved Claude Code sessions over time, by project, by model, and by recent session. It also added usage history, export, and monthly budget warnings, which makes parallel agent work easier to manage before it gets expensive or noisy.",
        ],
        bullets: [
          "Usage dashboard, usage history, monthly token and dollar budgets, and CSV/JSON export.",
          "Project dashboard with session counts, attention counts, token totals, estimated cost, and recent activity.",
          "Expanded global session search across saved transcript content.",
          "Synchronized grid session titles and additional single-mode/grid handoff fixes.",
          "Centralized session metadata updates, refreshed roadmap content, native build commands, and startup/search performance work.",
        ],
      },
      {
        heading: "The release pipeline matters too",
        paragraphs: [
          "Both releases ship GitHub installers and Tauri updater artifacts for the desktop app. That includes platform assets, signatures, and latest.json so the app can check for updates from the published release channel instead of relying on manual rebuilds.",
          "That plumbing is easy to ignore until it is missing. For an early desktop app, predictable downloads and update checks are product features because they decide whether testers can stay current without being walked through a build process.",
        ],
      },
      {
        heading: "What this changes for the product",
        paragraphs: [
          "The product is becoming less of a nicer transcript viewer and more of an operating surface for agent work. You can see which sessions need attention, how much work each project is consuming, whether a session is stuck, and which update path you are on.",
          "That is the direction for the next stretch: keep the local-first Claude Code workflow intact, but make the surrounding desktop experience more observable, recoverable, and honest about what the agent is doing.",
        ],
      },
    ],
  },
  {
    slug: "why-blackcrab-is-a-desktop-app",
    title: "Why Blackcrab is a desktop app",
    dek: "The product is not trying to hide Claude Code. It gives the CLI a native workspace for parallel sessions, local context, and the parts of agent work that are easier to manage visually.",
    category: "Design note",
    displayDate: "Apr 2026",
    readTime: "4 min read",
    tags: ["Local-first", "Tauri", "Claude Code"],
    sections: [
      {
        heading: "Start with the workflow",
        paragraphs: [
          "Claude Code is strongest when it can stay close to a real repository, a real shell, and the developer who knows when to interrupt. The terminal is a good home for that, but it gets crowded fast once more than one thread of work is active.",
          "Blackcrab starts from that pressure point. A native app can keep several sessions visible at once, preserve the relationship between a prompt, a working directory, a branch, and a terminal, and still leave Claude Code as the engine doing the work.",
        ],
      },
      {
        heading: "Native boundaries matter",
        paragraphs: [
          "A desktop shell around an agent should be boring in the right ways. It should use local files, local auth, local git state, and OS conventions that people already trust. That is why Blackcrab avoids a hosted backend for the core workflow.",
          "The app reads the same local session data and project paths you would inspect yourself. It does not ask for Anthropic credentials, proxy prompts through a server, or turn a local coding tool into another account you have to manage.",
        ],
      },
      {
        heading: "What v0.1 is proving",
        paragraphs: [
          "The first useful version is about focus and coordination: a tileable grid, visible session status, token and cost signals, local preview, and a terminal that stays attached to the work.",
          "That is enough to test the central bet: the best GUI for an agent is not a chat app with more chrome. It is a workspace that keeps code, context, and verification close together.",
        ],
      },
    ],
  },
  {
    slug: "designing-the-tiled-session-grid",
    title: "Designing the tiled session grid",
    dek: "Running one agent at a time is simple, but it leaves a lot of attention unused. The grid is Blackcrab's attempt to make parallel agent work legible without turning it into a control room.",
    category: "Product devlog",
    displayDate: "Apr 2026",
    readTime: "5 min read",
    tags: ["Interface", "Sessions", "Keyboard"],
    sections: [
      {
        heading: "Each tile is a work unit",
        paragraphs: [
          "The grid works because each tile has a clear owner: one session, one transcript, one composer, and one working directory. That keeps parallel work from collapsing into one long feed.",
          "A tile should answer the practical questions immediately. What is this session doing? Which repo is it in? Is it still streaming? How much context is left? What changed since I last looked?",
        ],
      },
      {
        heading: "Density without dashboard noise",
        paragraphs: [
          "Developer tools can become decorative dashboards quickly. The grid tries to stay closer to a terminal multiplexer: dense, predictable, and built around repeated actions instead of one-off presentation.",
          "That means stable tile sizes, keyboard focus, compact status, and enough visual contrast to scan six sessions without needing a legend.",
        ],
        bullets: [
          "Command palette for cross-session navigation.",
          "Numbered shortcuts for direct tile focus.",
          "Per-session state instead of global mode switches.",
          "Compact status text that does not resize the layout.",
        ],
      },
      {
        heading: "The open question",
        paragraphs: [
          "The hard part is deciding how much automation belongs in the grid itself. Blackcrab should help notice stuck sessions and expensive runs, but it should not pretend to know which thread deserves your attention.",
          "For now, the product favors explicit control. The app makes many sessions visible, but the developer still chooses when to split work, when to merge it, and when to stop an agent before it wanders.",
        ],
      },
    ],
  },
  {
    slug: "what-local-first-means-for-blackcrab",
    title: "What local-first means for Blackcrab",
    dek: "Local-first is not a vibe for this product. It is a practical constraint around where transcripts live, how Claude Code runs, and what kind of trust the app should ask for.",
    category: "Engineering",
    displayDate: "Apr 2026",
    readTime: "4 min read",
    tags: ["Privacy", "Architecture", "Trust"],
    sections: [
      {
        heading: "The CLI stays in charge",
        paragraphs: [
          "Blackcrab does not replace Claude Code. It launches and coordinates the local CLI, then reflects the state that already exists on your machine. That is a smaller promise than a hosted agent platform, and that is the point.",
          "Keeping the CLI in charge means the same authentication, billing, tool permissions, and project files remain the source of truth. The GUI can make the workflow easier without taking ownership of the developer's account or code.",
        ],
      },
      {
        heading: "Data should be inspectable",
        paragraphs: [
          "Transcripts and session state are useful because they are durable. They are also sensitive. A local-first app should make that tradeoff visible instead of hiding it behind a sync layer.",
          "The goal is for exported markdown, session files, project paths, and git metadata to feel like normal local developer artifacts: easy to inspect, easy to back up, and easy to remove when needed.",
        ],
      },
      {
        heading: "Local does not mean risk-free",
        paragraphs: [
          "A local agent workspace still has serious power. It can coordinate shells, open URLs, read project files, attach screenshots, and help an agent run commands. Blackcrab should make those capabilities explicit instead of sanding them down in copy.",
          "The bar is simple: before someone installs Blackcrab, they should know what it can touch, what it stores, what it sends, and what still feels rough. If that information is buried after the download, I have already asked for too much trust.",
        ],
      },
    ],
  },
];

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v0.2.0",
    label: "Current preview",
    displayDate: "May 2026",
    summary:
      "A design-focused release with a denser power-user shell, first-class density modes, faster recent-session navigation, safer Claude auth startup, and better behavior in smaller windows.",
    changes: [
      "Added comfortable, compact, and focus density modes, available from Settings, the command palette, and the status bar.",
      "Refreshed the app shell with a command chip, denser transcript layout, and a more informative bottom status bar.",
      "Added keyboard and command palette navigation for opening the next or previous recent session.",
      "Fixed right-side clipping in non-fullscreen windows with responsive sidebar, preview, and status layout behavior.",
      "Claude sessions now prefer normal CLI authentication over stale credential override environment variables.",
    ],
  },
  {
    version: "v0.1.3",
    label: "Quality update",
    displayDate: "May 2026",
    summary:
      "A focused quality release with steadier conversation switching, cleaner transcript reading, and published installers for macOS, Windows, and Linux.",
    changes: [
      "Conversation continuity is improved across grid and single-session mode switches.",
      "Transcript tool calls and thinking blocks use compact drawers, with noisy output folded by default.",
      "Claude session startup refreshes auth state without injecting keychain access tokens into spawned processes.",
      "Anonymous app and updater events can help measure release health and can be disabled in Settings.",
    ],
  },
  {
    version: "v0.1.2",
    label: "Usage update",
    displayDate: "May 2026",
    summary:
      "A usage and project visibility release for tracking token spend, session activity, and saved Claude Code work across projects.",
    changes: [
      "Usage dashboard with range filters, token and cost rollups, history, budgets, and CSV/JSON export.",
      "Project dashboard with active session counts, attention counts, usage totals, and direct session open actions.",
      "Expanded global search across session metadata and transcript content.",
      "Grid title synchronization and additional single-mode/grid handoff fixes.",
      "Native build commands, centralized session metadata updates, and startup/search performance improvements.",
    ],
  },
  {
    version: "v0.1.1",
    label: "Stability update",
    displayDate: "Apr 2026",
    summary:
      "A reliability pass for live sessions, attention management, Claude token setup, and packaged-app behavior.",
    changes: [
      "Smoother sidebar activity promotion and session attention management.",
      "Claude OAuth refresh support, token setup flow, and smarter stuck-turn detection.",
      "Deferred grid handoff while sessions are busy, plus fixes for single-session to grid handoff.",
      "macOS TCC strings, stderr filtering, and title edit focus fixes.",
      "Signed installer and updater artifacts published through GitHub Releases.",
    ],
  },
  {
    version: "v0.1.0",
    label: "Initial preview",
    displayDate: "Apr 2026",
    summary:
      "The first public shape of Blackcrab: a macOS-first desktop workspace for running Claude Code sessions side-by-side.",
    changes: [
      "Tileable session grid for parallel Claude Code work.",
      "Local session discovery from Claude Code project data.",
      "Token, context, and cost signals in the session surface.",
      "Integrated terminal drawer and in-app preview pane.",
      "Docs covering setup, requirements, privacy, security, and limitations.",
    ],
  },
  {
    version: "Next",
    label: "In progress",
    displayDate: "Planned",
    summary:
      "Near-term work is focused on tightening the first-run experience and making local verification smoother.",
    changes: [
      "Clearer setup checks for Claude Code installation and authentication.",
      "Better release notes around packaging, updates, and platform support.",
      "More practical devlog posts from building the desktop workflow.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
