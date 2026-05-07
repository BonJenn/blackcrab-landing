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
          "That framing will shape the product docs as much as the code. The site needs setup instructions, a security model, known limitations, and honest release notes next to the download button.",
        ],
      },
    ],
  },
];

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v0.1.3",
    label: "Current preview",
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
    version: "v0.1",
    label: "Earlier preview",
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
