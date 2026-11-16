import type { Metadata } from "next";
import Link from "next/link";
import {
  LEGAL_EFFECTIVE_DATE,
  LegalPage,
  LegalSection,
} from "../legal-page";
import { PRIVACY_URL, SUPPORT_PAGE_URL } from "../site";

export const metadata: Metadata = {
  title: "Privacy Policy — Blackcrab",
  description:
    "What data the Blackcrab iOS app, desktop app, Blackcrab Connect service and website handle, who processes it, and how to delete your account.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      current="/privacy-policy"
      intro="Blackcrab is an open-source project. This policy explains, in plain English, what data Blackcrab handles and what happens to it."
    >
      <LegalSection id="scope" title="What this policy covers">
        <p>This policy covers:</p>
        <ul>
          <li>the Blackcrab iOS app;</li>
          <li>the Blackcrab desktop app;</li>
          <li>
            Blackcrab Connect, the optional account and relay service
            (relay.blackcrab.app and app.blackcrab.app); and
          </li>
          <li>this website (www.blackcrab.app).</li>
        </ul>
        <p>
          &ldquo;Blackcrab&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean
          the Blackcrab open-source project, which publishes these apps and
          runs these services.
        </p>
      </LegalSection>

      <LegalSection id="summary" title="The short version">
        <p>
          Blackcrab is a desktop app that runs AI coding agents (such as Claude
          Code and Codex) on your own computer, and a phone app that lets you
          watch and steer those agents remotely.
        </p>
        <ul>
          <li>
            Your prompts, code, transcripts and AI provider credentials live on
            your own computer.
          </li>
          <li>Blackcrab does not sell your data.</li>
          <li>Blackcrab does not show ads.</li>
          <li>
            Blackcrab does not track you across other companies&rsquo; apps or
            websites.
          </li>
          <li>
            You can use the desktop app without an account. An account is only
            needed for Blackcrab Connect.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="account-data" title="Account data">
        <p>
          Signing in is optional. If you sign in to Blackcrab Connect, we
          handle:
        </p>
        <ul>
          <li>your email address;</li>
          <li>
            your name and profile picture, if the sign-in method you choose
            provides them (email and password, Sign in with Apple, or GitHub);
            and
          </li>
          <li>authentication and session identifiers.</li>
        </ul>
        <p>
          Sign-in is processed by Clerk (clerk.com), which acts as our service
          provider for authentication.
        </p>
      </LegalSection>

      <LegalSection id="relay-data" title="Relay data">
        <p>
          The following applies only while you are signed in to Blackcrab
          Connect.
        </p>
        <ul>
          <li>
            <strong>Linked computers.</strong> For each computer you link, the
            relay keeps a record: an environment identifier, the label you gave
            it, public keys and a connection endpoint.
          </li>
          <li>
            <strong>Registered phones.</strong> For each phone you register,
            the relay keeps a record: a device identifier, the platform and OS
            version, the app version, Apple push notification tokens and Live
            Activity tokens, and your notification preferences.
          </li>
          <li>
            <strong>Agent status summaries.</strong> So that notifications and
            Live Activities can be delivered, your computer publishes short
            status summaries to the relay: the project title, thread title,
            model name, status (for example working, needs approval or
            finished) and timestamps. These summaries are sent to your phone
            through Apple&rsquo;s push notification service.
          </li>
          <li>
            <strong>Remote sessions.</strong> Remote sessions between your
            phone and your computer pass through the relay over TLS. The relay
            is hosted on Cloudflare and its database is hosted by PlanetScale.
            The relay routes this traffic and does not keep the conversation
            content.
          </li>
          <li>
            <strong>Webhooks.</strong> If you turn this on, incoming webhooks
            for a linked computer can be held briefly while that computer is
            offline.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="direct-connections" title="Direct connections">
        <p>
          When your phone is paired to your computer over your local network or
          a private tailnet, data goes directly between the two devices and
          does not pass through Blackcrab servers.
        </p>
      </LegalSection>

      <LegalSection id="on-device" title="Data stored on your phone">
        <ul>
          <li>
            Pairing credentials and session tokens are stored in the iOS
            Keychain.
          </li>
          <li>
            Cached thread lists, unsent drafts and queued messages are stored
            in the app&rsquo;s local storage.
          </li>
        </ul>
        <p>
          This data stays on your device (and in your device backups) until you
          remove it or delete the app.
        </p>
      </LegalSection>

      <LegalSection id="permissions" title="Permissions the iOS app asks for">
        <ul>
          <li>
            <strong>Camera</strong> — to scan a pairing QR code, and to take a
            photo to attach to a message.
          </li>
          <li>
            <strong>Photo library</strong> — to attach or save images.
          </li>
          <li>
            <strong>Microphone</strong> — for voice input. Audio is sent to
            your own linked computer for transcription, not to Blackcrab.
          </li>
          <li>
            <strong>Local network</strong> — to reach your computer.
          </li>
          <li>
            <strong>Notifications</strong> — to tell you when an agent needs
            you or has finished.
          </li>
        </ul>
        <p>
          Each permission is optional and can be changed at any time in the iOS
          Settings app.
        </p>
      </LegalSection>

      <LegalSection id="ai-providers" title="AI providers">
        <p>
          The prompts and files you send are handled by the AI provider
          command-line tool you configured on your own computer (for example
          Anthropic or OpenAI), under that provider&rsquo;s own terms and
          privacy policy. Blackcrab does not proxy that traffic and does not
          hold those credentials.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="Analytics and diagnostics">
        <ul>
          <li>
            <strong>iOS app.</strong> The iOS app contains no in-app analytics
            or advertising SDKs. It checks for app updates.
          </li>
          <li>
            <strong>Desktop app.</strong> The desktop app can send anonymous
            launch and update events to www.blackcrab.app: the platform, the
            app version, and a locally generated anonymous install identifier
            that is hashed before it is stored. You can turn this off in the
            desktop app&rsquo;s Settings.
          </li>
          <li>
            <strong>Website.</strong> This website uses Google Analytics to
            produce aggregate page statistics. It loads Google&rsquo;s
            analytics script, which records page views (the page address and
            title) and clicks on download buttons, and which may set cookies
            and collect standard browser and device information. The website
            also uses Vercel Web Analytics for aggregate page-view counts, and
            keeps a count of installer downloads by platform and version.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="service-providers" title="Service providers">
        <p>
          Blackcrab uses these companies to run its services. Each one
          processes only the data needed for its role.
        </p>
        <ul>
          <li>Clerk — authentication.</li>
          <li>Cloudflare — relay hosting and network.</li>
          <li>PlanetScale — database.</li>
          <li>Apple — push notifications and Sign in with Apple.</li>
          <li>GitHub — sign-in option.</li>
          <li>Vercel — website hosting.</li>
          <li>Google — website analytics.</li>
          <li>Expo — app update delivery.</li>
        </ul>
      </LegalSection>

      <LegalSection id="retention" title="How long data is kept">
        <p>
          Account and relay data is kept while your account exists, so that the
          service can work, and is removed when you delete your account as
          described below. Data on your own computer and phone is under your
          control.
        </p>
      </LegalSection>

      <LegalSection id="deleting-your-account" title="Deleting your account">
        <p>
          You can delete your account inside the Blackcrab iOS app at Settings
          → Delete account. The same option is also reachable from Settings →
          Blackcrab Account.
        </p>
        <p>Deleting your account:</p>
        <ul>
          <li>unlinks your computers from the relay;</li>
          <li>unregisters your phone;</li>
          <li>deletes your sign-in account; and</li>
          <li>signs you out.</li>
        </ul>
        <p>
          Data stored on your own computer and phone is under your control. You
          remove it by deleting it there or by uninstalling the apps.
        </p>
        <p>
          If you cannot use the app, you can request deletion through the{" "}
          <Link href={SUPPORT_PAGE_URL}>support page</Link>.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children">
        <p>
          Blackcrab is not directed to children under 13, and we do not
          knowingly collect personal information from them.
        </p>
      </LegalSection>

      <LegalSection id="international" title="International processing">
        <p>
          Your data may be processed in the United States and in other
          countries where our service providers operate.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          If this policy changes, this page will be updated with a new
          effective date.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          For privacy questions or requests, use the support page:{" "}
          <Link href={SUPPORT_PAGE_URL}>https://www.blackcrab.app/support</Link>
          .
        </p>
        <p>
          More technical detail about the desktop app is in the{" "}
          <a href={PRIVACY_URL}>desktop privacy notes on GitHub</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
