"use client";

import { useState } from "react";

const threads = [
  {
    title: "Build the project page",
    provider: "Claude",
    prompt: "Give the project page a simpler layout.",
    reply:
      "I’ll start with the page structure and keep the navigation in place.",
    file: "src / project.tsx",
    lines: [
      "export function Project() {",
      "  return (",
      '    <main className="project">',
      "      <ProjectHeader />",
      "      <ThreadList />",
      "    </main>",
      "  );",
      "}",
    ],
  },
  {
    title: "Review the API",
    provider: "Codex",
    prompt: "Check the API’s error handling.",
    reply:
      "I’ll follow the request path and check how each error reaches the client.",
    file: "src / api.ts",
    lines: [
      "const response = await fetch(url);",
      "",
      "if (!response.ok) {",
      "  return handleError(response);",
      "}",
      "",
      "return response.json();",
    ],
  },
  {
    title: "Write the tests",
    provider: "Codex",
    prompt: "Add tests for the project routes.",
    reply: "I’ll cover the success and error paths with focused route tests.",
    file: "tests / project.test.ts",
    lines: [
      'describe("project routes", () => {',
      '  it("handles a missing project",',
      "    async () => {",
      "      const result = await get(id);",
      "      expect(result.status).toBe(404);",
      "    });",
      "});",
    ],
  },
  {
    title: "Update the docs",
    provider: "Claude",
    prompt: "Document the new API responses.",
    reply: "I’ll add request examples and document the error responses.",
    file: "docs / api.md",
    lines: [
      "# Project API",
      "",
      "GET /projects/:id",
      "",
      "Returns the selected project.",
      "",
      "404 — Project not found",
    ],
  },
];

export function WorkspaceDemo() {
  const [panes, setPanes] = useState(2);
  return (
    <figure id="workspace-demo" className="workspace-figure">
      <div className="workspace-toolbar">
        <span className="demo-caption">Explore the workspace</span>
        <div
          className="layout-options"
          role="group"
          aria-label="Example pane layout"
        >
          {[1, 2, 4].map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={panes === count}
              onClick={() => setPanes(count)}
              aria-controls="example-panes"
            >
              <span
                className={`layout-icon layout-icon-${count}`}
                aria-hidden="true"
              >
                {Array.from({ length: count }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
              {count} {count === 1 ? "pane" : "panes"}
            </button>
          ))}
        </div>
      </div>
      <div className="workspace-window">
        <div className="window-title">
          <span className="traffic-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>blackcrab</span>
          <span className="window-environment">
            <i /> Local workspace
          </span>
        </div>
        <div className="workspace-body">
          <aside className="workspace-sidebar" aria-hidden="true">
            <span className="sidebar-heading">
              Projects <span>＋</span>
            </span>
            <strong>⌄ &nbsp; fieldwork</strong>
            {threads.map((thread, i) => (
              <div
                key={thread.title}
                className={
                  i < panes ? "sidebar-thread selected" : "sidebar-thread"
                }
              >
                <span>◦</span>
                {thread.title}
              </div>
            ))}
            <div className="sidebar-bottom">
              <span>⌘ &nbsp; Settings</span>
              <span>main</span>
            </div>
          </aside>
          <div
            aria-live="polite"
            id="example-panes"
            className={`example-panes panes-${panes}`}
            aria-label={`${panes} example ${panes === 1 ? "thread" : "threads"}`}
          >
            {threads.slice(0, panes).map((thread) => (
              <div className="example-thread" key={thread.title}>
                <div className="thread-header">
                  <span>{thread.title}</span>
                  <span aria-hidden="true">↗ &nbsp; ×</span>
                </div>
                <div className="thread-conversation">
                  <div className="example-prompt">{thread.prompt}</div>
                  <span className="agent-label">
                    <i />
                    {thread.provider}
                  </span>
                  <p>{thread.reply}</p>
                  <div className="example-code">
                    <span>{thread.file}</span>
                    <pre>
                      {thread.lines.map((line, index) => (
                        <div key={index}>
                          <span>{index + 1}</span>
                          {line || " "}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
                <div className="example-composer">
                  <span>Follow up…</span>
                  <div>
                    <span>
                      {thread.provider} <span aria-hidden="true">⌄</span>
                    </span>
                    <span className="composer-send" aria-hidden="true">
                      ↑
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        Illustrative workspace · Example conversations, independent threads.
      </figcaption>
    </figure>
  );
}
