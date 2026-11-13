import test from "node:test";
import assert from "node:assert/strict";
import { selectReleaseDownload } from "./assets.ts";
const asset = (name) => ({name, browser_download_url: "https://github.com/BonJenn/blackcrab/releases/download/v0.4.0/" + name});
const releases = [
  {tag_name: "v0.4.0", assets: [asset("blackcrab-managed-payloads.zip"), asset("latest.json"), asset("Blackcrab_aarch64.app.tar.gz"), asset("Blackcrab_0.4.0_aarch64.dmg")]},
  {tag_name: "v0.3.0", assets: [asset("Blackcrab_0.3.0_universal.dmg"), asset("Blackcrab-setup.exe"), asset("Blackcrab.AppImage")]},
];
test("Mac-only latest release selects its installer and preserves older platform downloads", () => {
  assert.equal(selectReleaseDownload(releases, "macos")?.asset.name, "Blackcrab_0.4.0_aarch64.dmg");
  assert.equal(selectReleaseDownload(releases, "windows")?.version, "v0.3.0");
  assert.equal(selectReleaseDownload(releases, "linux")?.asset.name, "Blackcrab.AppImage");
});
test("draft and prerelease artifacts cannot become stable downloads", () => {
  const candidates = [{...releases[0], draft: true}, {...releases[0], prerelease: true}, releases[1]];
  assert.equal(selectReleaseDownload(candidates, "macos")?.version, "v0.3.0");
});
test("missing platform installers do not select signatures or internal payload archives", () => {
  assert.equal(selectReleaseDownload([releases[0]], "windows"), null);
  assert.equal(selectReleaseDownload([{assets: [asset("Blackcrab.dmg.sig"), asset("blackcrab-managed-payloads.zip")]}], "macos"), null);
});
