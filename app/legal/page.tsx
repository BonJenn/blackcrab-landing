import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../legal-page";
import { APP_LICENSE_URL } from "../site";

export const metadata: Metadata = {
  title: "Legal — Blackcrab",
  description:
    "Blackcrab's privacy policy, terms of service, security policy and support page.",
};

const documents: ReadonlyArray<readonly [string, string, string]> = [
  [
    "Privacy Policy",
    "/privacy-policy",
    "What data Blackcrab handles, where it goes, and how to delete your account.",
  ],
  [
    "Terms of Service",
    "/terms-of-service",
    "The terms for using the Blackcrab apps and the optional Blackcrab Connect service.",
  ],
  [
    "Security Policy",
    "/security-policy",
    "How to report a vulnerability, and a summary of the security model.",
  ],
  [
    "Support",
    "/support",
    "How to get help, connect your phone to your computer, or delete your account.",
  ],
];

export default function LegalIndexPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Legal and support"
      intro="The documents that apply to the Blackcrab iOS app, the Blackcrab desktop app, the optional Blackcrab Connect service and this website."
      current="/legal"
    >
      <ul className="legal-cards">
        {documents.map(([title, href, description]) => (
          <li key={href}>
            <Link href={href}>
              <strong>{title}</strong>
              <span>{description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        Blackcrab is open-source software released under the{" "}
        <a href={APP_LICENSE_URL}>Apache License 2.0</a>.
      </p>
    </LegalPage>
  );
}
