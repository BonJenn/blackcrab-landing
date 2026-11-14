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

## Current published release — 0.4.3

Mac v0.4.3 is PUBLIC from Blackcrab commit
18055fbc080faa4f6d518c420b19040ce45e3296. Its actual signed/notarized installer,
embedded helper, payload inventories, updater cryptography and anonymous public
downloads passed. Website PR16 merged as
7aebba7bbd55b2deefd3f2012d2ba058cc996115; production deployment
dpl_Eekh2ZQt8YhrjHtXJMFGnKMyn6xq is READY and verified. Home, release article,
changelog, releases, docs/mobile anchor and all three platform download routes
passed anonymously. /download/macos resolves to the public 0.4.3 Apple-silicon
DMG; Windows/Linux correctly retain their public 0.3.0 installers. TestFlight
1.0.0 (4) is unchanged. No new user installation or full parity is claimed.

The initial Mac route used cached 0.4.2 metadata, then the existing 300-second
release fetch revalidated; a full recheck passed. No routing changes were needed.
Runtime logs for the new deployment reported no error groups. Preserve these
public releases and historical articles. No build/publication command remains
active. The app handoff and workspace-043-plan.json hold the next Windows/Linux
native implementation work. Do not restart superseded release preparations.

## Historical preparation — 0.4.3, before publication

The owner requested the next Mac update. This branch prepares 0.4.3 release copy
for permission attribution, imported monitor events and pane controls. Do not
merge/deploy until the verified v0.4.3 installer is PUBLIC in BonJenn/blackcrab.
The app release PR is #286; source/build state is in the sibling
workspace-043-plan.json and workspace-043-delivery directory. Actual signed
installer and native candidate validation are pending. Windows/Linux remain on
previous 0.3.0 downloads; full-workspace platform packages are still in development.
TestFlight is unchanged. Keep historical articles intact and do not claim full
parity or that native permission prompts were validated before evidence exists.

## Published baseline — 2026-11-13

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

## Website redesign — independent of native releases

The design/blackcrab-product-site branch redesigns this existing Next.js site:
white framing, lavender surfaces, concise model/pane/remote narrative and an
interactive illustrative workspace. App release work continues separately.
Do not use public/hero.png (retired interface) on the homepage. WorkspaceDemo is
an explicitly labeled illustration, not a screenshot or live agent session.
Claude and Codex are verified in vendor/t3/packages/client-runtime/src/providerClients.ts;
models and providers are selected per thread. Never imply automatic shared
context between panes. The desktop is free/open source; paid hosted remote
access is planned and invitation-only beta. Public self-service is unfinished.
Preserve Mac 0.4.3 and previous Windows/Linux 0.3.0 routing until verified newer
installers are public. Do not announce pending TestFlight or desktop builds.
When verified 0.4.4 installers become public, add a one-time manual replacement
instruction for 0.4.2/0.4.3 users, keeping app data; their workspace updater is
broken. This redesign does not repair the native updater or publish 0.4.4.
Keep the existing Vercel project, domains and analytics. Check 320px phones,
tablets and desktop, keyboard pane controls, reduced-motion CSS and no-JS content
alongside the required download tests, types, scoped lint and production build.

### Redesign publication checkpoint — 2026-11-13 Pacific

PR18 contains the completed redesign (implementation 60f7d5f). Production build,
TypeScript noEmit, scoped ESLint, three download tests, responsive browser checks
at 320/390/768/1280/1440px, keyboard pane switching and local production routes
passed. Existing historical posts, download resolver and analytics are unchanged.
Vercel rejected the Git deployment with "Account is blocked." No preview was
created, and PR18 is NOT merged. The team dashboard reports a Hobby Fast Origin
Transfer fair-use pause from November 13 until December 13, 2026. The existing
www.blackcrab.app deployment also serves "Deployment Paused"; this branch did not
change production. Billing/plan changes are not authorized by the redesign brief.
Once the account pause is resolved, retry the exact PR head preview, inspect it,
merge only after checks pass, and verify production pages and all download routes.
Do not substitute another Vercel project or alter the existing domains.

### Redesign published — 2026-11-13 Pacific

The owner upgraded Vercel and explicitly authorized deployment. PR18 merged as
30a0e74e2c40d0d1f317d47911a03d328f4a5559 after both checks passed on
9e03f9376742e69cb98dfeca39c94beb59fc70b6. Exact-head preview
dpl_5i4bkqUcPBwym3RVk2xt4ux4HpRk was READY and passed desktop/mobile visual,
pane-switching and route checks before merge. Production deployment
dpl_5HuQvgHWAMZghBadigTv9vfME3DH is READY and serves www.blackcrab.app.
The earlier account pause is resolved; do not treat it as a current blocker.

Anonymous production home, 0.4.3 article, changelog, releases and docs/mobile
anchor passed. The apex redirects to www. All three download routes returned
302: Mac v0.4.3 aarch64 DMG, Windows v0.3.0 x64 setup EXE and Linux v0.3.0 amd64
AppImage. Runtime error/fatal log groups were empty for the new deployment.
PR18 is merged and unwatched. No native app or TestFlight release was made by
this site work. Keep that independent release work and all download truth intact.
