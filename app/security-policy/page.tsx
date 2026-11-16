import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../legal-page";
import {
  PRIVACY_POLICY_URL,
  SECURITY_ADVISORY_URL,
  SECURITY_URL,
  SUPPORT_PAGE_URL,
} from "../site";

export const metadata: Metadata = {
  title: "Security Policy — Blackcrab",
  description:
    "How to report a security vulnerability in Blackcrab, and a summary of how Blackcrab protects your credentials and connections.",
};

export default function SecurityPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Security Policy"
      current="/security-policy"
      intro="How to report a vulnerability, and a short summary of how Blackcrab is built to keep your work on your own computer."
    >
      <LegalSection id="reporting" title="Reporting a vulnerability">
        <p>
          Please report security problems privately, through a GitHub private
          security advisory:
        </p>
        <p>
          <a href={SECURITY_ADVISORY_URL}>{SECURITY_ADVISORY_URL}</a>
        </p>
        <p>
          Do not open a public issue for a vulnerability, and do not include
          secrets such as API keys or tokens in any report. Describe what you
          found, how to reproduce it, and which version and platform you used.
        </p>
      </LegalSection>

      <LegalSection id="security-model" title="Security model">
        <ul>
          <li>
            <strong>Your provider credentials stay on your computer.</strong>{" "}
            Blackcrab uses the AI provider command-line tools you have already
            signed in to. Those credentials are not sent to Blackcrab.
          </li>
          <li>
            <strong>Relay connections use TLS.</strong> When your phone reaches
            your computer through Blackcrab Connect, the connection to the
            relay is encrypted in transit.
          </li>
          <li>
            <strong>Pairing uses per-device keys.</strong> Each phone you pair
            with your computer gets its own key.
          </li>
          <li>
            <strong>Sign-in is handled by Clerk.</strong> Blackcrab does not
            store your password.
          </li>
        </ul>
        <p>
          Agents run with the permissions of your own user account on your
          computer, so treat approving an agent action the way you would treat
          running a command yourself.
        </p>
      </LegalSection>

      <LegalSection id="more" title="More information">
        <ul>
          <li>
            <a href={SECURITY_URL}>Full security notes on GitHub</a>
          </li>
          <li>
            <Link href={PRIVACY_POLICY_URL}>Privacy Policy</Link>
          </li>
          <li>
            <Link href={SUPPORT_PAGE_URL}>Support</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
