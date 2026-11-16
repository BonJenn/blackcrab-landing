import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../legal-page";
import {
  ISSUES_URL,
  PRIVACY_POLICY_URL,
  SECURITY_POLICY_URL,
  TERMS_URL,
} from "../site";

export const metadata: Metadata = {
  title: "Support — Blackcrab",
  description:
    "Get help with Blackcrab: how to contact support, connect your phone to your computer, and delete your account.",
};

export default function SupportPage() {
  return (
    <LegalPage
      eyebrow="Support"
      title="Blackcrab support"
      current="/support"
      intro="Help with the Blackcrab iOS app, the desktop app and Blackcrab Connect."
    >
      <LegalSection id="what-is-blackcrab" title="What Blackcrab is">
        <p>
          Blackcrab is a desktop app that runs AI coding agents (such as Claude
          Code and Codex) on your own computer, and a phone app that lets you
          watch and steer those agents remotely. The phone app needs a computer
          running the Blackcrab desktop app to connect to.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="How to get help">
        <p>
          The contact channel for Blackcrab support is GitHub Issues:
        </p>
        <p>
          <a href={ISSUES_URL}>{ISSUES_URL}</a>
        </p>
        <p>
          Open an issue to ask a question, report a problem, or make a privacy
          or account request. Issues are public, so do not post secrets such as
          passwords, API keys, tokens, pairing codes or private code.
        </p>
        <p>
          Setup steps, requirements and troubleshooting are in the{" "}
          <Link href="/docs">documentation</Link>, including the{" "}
          <Link href="/docs#troubleshooting">troubleshooting</Link> and{" "}
          <Link href="/docs#mobile">phone app</Link> sections.
        </p>
        <p>
          To report a security vulnerability, follow the{" "}
          <Link href={SECURITY_POLICY_URL}>Security Policy</Link> instead of
          opening a public issue.
        </p>
      </LegalSection>

      <LegalSection id="faq" title="Frequently asked questions">
        <h3 id="connect-phone">
          How do I connect my phone to my computer?
        </h3>
        <ol>
          <li>
            Install the Blackcrab desktop app on your computer from{" "}
            <a href="https://www.blackcrab.app">https://www.blackcrab.app</a>{" "}
            and open it.
          </li>
          <li>
            Then do one of these:
            <ul>
              <li>
                sign in to the same Blackcrab account in the desktop app and in
                the phone app; or
              </li>
              <li>
                open Settings in the desktop app and scan the pairing QR code
                with the phone app.
              </li>
            </ul>
          </li>
        </ol>

        <h3 id="delete-account">How do I delete my account?</h3>
        <p>
          In the Blackcrab iOS app, go to Settings → Delete account. The same
          option is also reachable from Settings → Blackcrab Account.
        </p>
        <p>
          Deleting your account unlinks your computers from the relay,
          unregisters your phone, deletes your sign-in account and signs you
          out. Data on your own computer and phone stays under your control;
          remove it by deleting it there or by uninstalling the apps.
        </p>
        <p>
          If you cannot use the app, open an issue at the address above and ask
          for your account to be deleted. Do not post your password or other
          secrets in the issue.
        </p>
      </LegalSection>

      <LegalSection id="policies" title="Policies">
        <ul>
          <li>
            <Link href={PRIVACY_POLICY_URL}>Privacy Policy</Link>
          </li>
          <li>
            <Link href={TERMS_URL}>Terms of Service</Link>
          </li>
          <li>
            <Link href={SECURITY_POLICY_URL}>Security Policy</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
