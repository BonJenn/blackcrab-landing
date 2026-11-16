import type { Metadata } from "next";
import Link from "next/link";
import {
  LEGAL_EFFECTIVE_DATE,
  LegalPage,
  LegalSection,
} from "../legal-page";
import {
  APP_LICENSE_URL,
  PRIVACY_POLICY_URL,
  SUPPORT_PAGE_URL,
} from "../site";

export const metadata: Metadata = {
  title: "Terms of Service — Blackcrab",
  description:
    "The terms for using the Blackcrab iOS and desktop apps and the optional Blackcrab Connect relay service.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      current="/terms-of-service"
      intro="These terms apply to the Blackcrab iOS app, the Blackcrab desktop app, the optional Blackcrab Connect service and this website. By using them, you agree to these terms."
    >
      <LegalSection id="about" title="1. What Blackcrab is">
        <p>
          Blackcrab is free, open-source software, published by the Blackcrab
          open-source project. The desktop app runs AI coding agents on your
          own computer. The phone app lets you watch and steer those agents
          remotely. Blackcrab Connect is an optional hosted account and relay
          service, currently in beta, that connects the two.
        </p>
      </LegalSection>

      <LegalSection id="licence" title="2. Licence">
        <p>
          The Blackcrab software is licensed under the{" "}
          <a href={APP_LICENSE_URL}>Apache License 2.0</a>. That licence
          governs your rights to use, copy, modify and distribute the software.
          Nothing in these terms limits the rights that licence gives you.
        </p>
      </LegalSection>

      <LegalSection id="your-responsibilities" title="3. Your responsibilities">
        <p>You are responsible for:</p>
        <ul>
          <li>
            your own computer, including its security, its files and its
            backups;
          </li>
          <li>
            your accounts with AI providers (for example Anthropic or OpenAI),
            your compliance with their terms, and any costs they charge you;
          </li>
          <li>
            what your agents do. Agents run with the permissions of your own
            user account and can read, change and delete files and run
            commands. Review their actions and approvals carefully; and
          </li>
          <li>
            keeping your sign-in details and paired devices secure.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>
            abuse the relay, for example by overloading it, disrupting it, or
            using it for traffic it is not intended to carry;
          </li>
          <li>use Blackcrab for anything unlawful; or</li>
          <li>
            attempt to access computers, accounts or data that are not yours
            or that you do not have permission to use.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="connect" title="5. The Blackcrab Connect service">
        <p>
          Blackcrab Connect is a beta service provided &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo;. It may change, be limited, or be
          discontinued at any time. There is no uptime guarantee, and you
          should not rely on it for anything critical.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="6. Ending your account">
        <p>
          You can stop using Blackcrab at any time. You can delete your account
          inside the iOS app at Settings → Delete account; the{" "}
          <Link href={PRIVACY_POLICY_URL}>Privacy Policy</Link> explains what
          that removes.
        </p>
        <p>
          We may suspend or end access to Blackcrab Connect for accounts that
          abuse the service or break these terms.
        </p>
      </LegalSection>

      <LegalSection id="warranty" title="7. No warranty">
        <p>
          To the fullest extent permitted by law, Blackcrab is provided
          &ldquo;as is&rdquo;, without warranties of any kind, whether express
          or implied, including implied warranties of merchantability, fitness
          for a particular purpose and non-infringement. We do not warrant that
          Blackcrab will be uninterrupted, secure or error-free, or that the
          output of any AI agent will be correct or safe.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, the Blackcrab project and its
          contributors will not be liable for any indirect, incidental,
          special, consequential or punitive damages, or for any loss of data,
          profits or revenue, arising from your use of Blackcrab, including
          anything done by an AI agent on your computer. Some jurisdictions do
          not allow some of these limits, so they may not all apply to you.
        </p>
      </LegalSection>

      <LegalSection id="apple" title="9. Apple App Store additional terms">
        <p>
          If you got the Blackcrab iOS app from the Apple App Store, the
          following also applies. These terms are between you and Blackcrab
          only, not Apple, and Apple is not responsible for the app or its
          content. Your licence to use the app is limited to Apple-branded
          devices that you own or control, as permitted by the Usage Rules in
          the Apple Media Services Terms and Conditions. Apple has no
          obligation to provide any maintenance or support for the app. If the
          app fails to conform to any applicable warranty, you may notify
          Apple, and Apple will refund the purchase price, if any; to the
          maximum extent permitted by law, Apple has no other warranty
          obligation for the app. Apple is not responsible for addressing any
          claims relating to the app or your possession or use of it, including
          product liability claims, claims that the app fails to conform to any
          legal or regulatory requirement, and claims under consumer
          protection, privacy or similar laws. Apple is not responsible for
          investigating, defending, settling or discharging any third-party
          claim that the app infringes intellectual property rights. You
          confirm that you are not located in a country subject to a U.S.
          Government embargo or designated as a &ldquo;terrorist
          supporting&rdquo; country, and that you are not on any U.S.
          Government list of prohibited or restricted parties. You must comply
          with any third-party terms that apply when you use the app. Apple and
          its subsidiaries are third-party beneficiaries of these terms and may
          enforce them against you.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes">
        <p>
          If these terms change, this page will be updated with a new effective
          date. Continuing to use Blackcrab after a change means you accept the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="11. Contact">
        <p>
          For questions about these terms, use the{" "}
          <Link href={SUPPORT_PAGE_URL}>support page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
