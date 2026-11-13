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

## Current publication checkpoint — 2026-11-13

Mac v0.4.2 is public/stable/latest in BonJenn/blackcrab at
cb586b1f4832714e624c4a328b777ef321670fd3. Actual signed/notarized installer, embedded
helper, payloads, version and updater verification passed. Anonymous Mac downloads
passed. Preserve its public tag/assets; do not repeat the old private-draft workflow.

Website PR14 merged at 7b4cf8594001ff0b236508bcbf911446f0523051. Production deployment
dpl_GmaW6yasnWX5PmwCWWMvG9eoeemi is READY and serves www.blackcrab.app. Anonymous
home, 0.4.2 blog article, changelog, releases and docs/mobile anchor checks passed.
The apex redirects to the www site. /download/macos resolves to the public 0.4.2
Apple-silicon DMG; Windows and Linux retain verified 0.3.0 fallback assets.

This release includes the sole workspace, correct Blackcrab version/labels, external
drive picker shortcuts and pane-specific image drops. Some host-generated diagnostic
copy remains, disclosed in the release notes. No new iOS build or full parity is
claimed; TestFlight 1.0.0 (4) is unchanged. Owner UI/lifecycle testing follows
publication. Do not restore the old interface or advertise unverified completion.

Local evidence (may be absent on another machine):
/Volumes/G-DRIVE PRO/Programming/.blackcrab-parity-probes/mac-release-040-v2llrqsa/workspace-final-042-delivery/website-production-verification.json
and publication-result.json/public-download-verification.json in the same directory.
Older checkpoints below retain historical context and do not authorize restarting
completed builds or withholding this already-published release.

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


## 0.4.2 sole-workspace delivery

The owner requested removal of the older interface. Blackcrab PR275 merged to
stage d9b5601d424e9808ee2c8dcac5bf42f8cf97d137 after all nine checks passed.
It launches the new workspace automatically, retains startup recovery/service
controls and signed updates, and replaces remaining onboarding/account branding.
The dedicated signed helper from PR273 remains part of this release.
The first private 0.4.2 candidate predates this instruction and is superseded.
The replacement installer built and passed package/signature/notarization and
updater verification. Native UI testing is pending while the build Mac is locked.
Keep this website update unpublished until that exact installer is public. Do not announce complete parity.
The active desktop plan is
/Volumes/G-DRIVE PRO/Programming/.blackcrab-parity-probes/mac-release-040-v2llrqsa/desktop-default-042-plan.json.
The homepage must describe the new workspace; do not restore the old grid image,
legacy shortcuts or usage-dashboard claims. Historical release posts stay intact.

## Owner polish before 0.4.2 publication — 2026-11-13

The Mac was unlocked and the owner confirmed the sole workspace works. Its private
candidate is superseded by final branding/version, external-volume picker and
pane-drop changes (Blackcrab PR277–279). Keep this site unpublished until the
replacement signed installer is public. The new workspace mobile information link
lands at /docs#mobile; preserve that anchor and its truthful invite-only TestFlight
status. The current plan is the sibling workspace-polish-042-plan.json. No new
mobile build is implied by this Mac release.
