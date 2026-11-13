<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Blackcrab website publication

Keep AGENTS.md and CLAUDE.md in this directory byte-for-byte identical.
This repository is BonJenn/blackcrab-landing, the marketing/download site at
www.blackcrab.app. It is separate from the hosted agent application at
app.blackcrab.app. Vercel project: blackcrab-landing, team bonjenns-projects.
Preserve the existing production project, domains and analytics configuration.
Do not print environment files or credentials.

The owner authorized publishing Mac version 0.4.0, website downloads, blog and
release notes on 2026-11-12. Publish the verified GitHub release in
BonJenn/blackcrab first; merge/deploy this announcement only once its actual Mac
installer is public. Keep release status honest: owner manual UI/service/upgrade
testing follows publication; full remote/notification parity remains unfinished.
The 0.4.0 installer is Apple-silicon only. Keep older Intel/Windows/Linux builds
accessible and never label an older platform build as version 0.4.0.

Blog and changelog content live in app/blog/posts.ts. Downloads resolve public
GitHub release assets through app/download/latest.ts and assets.ts. A Mac-only
latest release must fall back to the newest stable release containing the requested
Windows/Linux installer. Never offer signatures or internal payload archives as
user installers. Release cards hide blackcrab-managed-payloads.zip.

Before publishing: npm run test:downloads, TypeScript noEmit, scoped ESLint,
and npm run build. Review the Vercel preview against the exact PR commit. After
production deployment, check home, blog article, changelog, releases and the Mac
download redirect. Confirm the target version and architecture, and previous
Windows/Linux fallback. Keep release notes in the app repository consistent.

## 0.4.1 corrective publication

The startup patch continues the owner-authorized 0.4 release/test workflow.
Prepare its blog, changelog and download copy, but merge/deploy only after the
verified v0.4.1 Mac installer is public. The corrected runtime-marker detection
is tested; the work-Mac resolution remains unconfirmed until owner testing.
Do not announce completed parity or a new TestFlight build. Keep the published
0.4.0 assets and previous-platform downloads intact.


## 0.4.2 service startup repair

The 0.4.1 failure is reproduced: copying the signed main app executable into the
service directory loses its signed Info.plist. Blackcrab PR273 adds a dedicated
signed helper and a visible desktop entry. Version 0.4.2 is being built as a draft
for actual runtime validation. Keep this website update local/unpublished until
its real installer is verified and public. Do not describe overall parity as
finished or invent native acceptance. The active desktop plan is
/Volumes/G-DRIVE PRO/Programming/.blackcrab-parity-probes/mac-release-040-v2llrqsa/desktop-patch-042-plan.json.
