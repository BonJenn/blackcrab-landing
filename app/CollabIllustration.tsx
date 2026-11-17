/**
 * Illustration of model collaboration: the lead model works, a partner model
 * reviews, and the lead resolves what the review found. It is drawn in the
 * workspace's dark style from example content, not captured from a session.
 */
export function CollabIllustration() {
  return (
    <figure className="collab">
      <div
        className="collab-stage"
        role="group"
        aria-label="Illustration: a lead model edits code, a partner model reviews it, and the lead resolves the review"
      >
        <div className="cw">
          <div className="cw-bar">
            <span className="cw-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="cw-title">Upload client</span>
            <span className="cw-step">1 · Lead works</span>
          </div>
          <div className="cw-body">
            <div className="cw-user">
              Add retry with backoff to the upload client.
            </div>
            <div className="cw-msg">
              <div className="cw-who">
                <span className="cw-dot cw-dot-lead" />
                Claude <span className="cw-role cw-role-lead">Lead</span>
              </div>
              <p>
                I’ll wrap the request in a retry loop and wait between
                attempts.
              </p>
              <div className="cw-tool">
                <span>Edited src/upload.ts</span>
                <span>
                  <b className="cw-add">+24</b> <b className="cw-del">−3</b>
                </span>
              </div>
              <p>Added up to three retries. Ready for review.</p>
            </div>
            <div className="cw-composer">
              <span className="cw-placeholder">Ask anything…</span>
              <div className="cw-composer-row">
                <span className="cw-pill">Claude · High</span>
                <span className="cw-partner">
                  <b aria-hidden="true">+</b> Partner: Gemini
                </span>
              </div>
            </div>
          </div>
        </div>

        <span className="cw-arrow" aria-hidden="true">
          →
        </span>

        <div className="cw">
          <div className="cw-bar">
            <span className="cw-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="cw-title">Upload client</span>
            <span className="cw-step">2 · Partner reviews</span>
          </div>
          <div className="cw-body">
            <div className="cw-msg">
              <div className="cw-who">
                <span className="cw-dot cw-dot-partner" />
                Gemini <span className="cw-role cw-role-partner">Partner</span>
                <span className="cw-note">Review only</span>
              </div>
              <p>Two issues in the retry loop:</p>
              <ol className="cw-issues">
                <li>
                  Retries fire immediately, so a struggling server gets
                  hammered. Add exponential backoff.
                </li>
                <li>
                  The timeout isn’t cleared after a successful attempt, which
                  leaks timers.
                </li>
              </ol>
              <p>Everything else looks correct.</p>
            </div>
          </div>
        </div>

        <span className="cw-arrow" aria-hidden="true">
          →
        </span>

        <div className="cw">
          <div className="cw-bar">
            <span className="cw-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="cw-title">Upload client</span>
            <span className="cw-step">3 · Lead resolves</span>
          </div>
          <div className="cw-body">
            <div className="cw-msg">
              <div className="cw-who">
                <span className="cw-dot cw-dot-lead" />
                Claude <span className="cw-role cw-role-lead">Lead</span>
              </div>
              <p>
                Fixed both: delays now double between attempts, and the
                timeout is cleared on success.
              </p>
              <div className="cw-tool">
                <span>Edited src/upload.ts</span>
                <span>
                  <b className="cw-add">+9</b> <b className="cw-del">−2</b>
                </span>
              </div>
              <div className="cw-tool">
                <span>Ran npm test</span>
                <span>
                  <b className="cw-add">12 passed</b>
                </span>
              </div>
              <p>The review is resolved.</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption>
        Illustration of model collaboration. Example models and conversation.
      </figcaption>
    </figure>
  );
}
