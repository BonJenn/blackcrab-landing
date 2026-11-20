import type { Metadata } from "next";
import { Footer, Nav } from "../../site";

export const metadata: Metadata = {
  title: "Blackcrab Remote — billing",
  robots: { index: false },
};

const MESSAGES: Record<string, { title: string; body: string }> = {
  success: {
    title: "You're subscribed",
    body: "Blackcrab Remote is on. Return to the Blackcrab app; it picks up the change within a minute.",
  },
  cancelled: {
    title: "Checkout cancelled",
    body: "Nothing was charged. You can start again from the Blackcrab app whenever you like.",
  },
  portal: {
    title: "Billing updated",
    body: "Any changes you made are saved. Return to the Blackcrab app.",
  },
};

export default async function BillingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const { result } = await searchParams;
  const message = MESSAGES[result ?? ""] ?? MESSAGES.portal;
  return (
    <main className="flex-1 w-full">
      <Nav />
      <article id="content" className="legal-page">
        <header className="legal-header">
          <span className="legal-eyebrow">Blackcrab Remote</span>
          <h1>{message.title}</h1>
          <p className="legal-intro">{message.body}</p>
        </header>
      </article>
      <Footer />
    </main>
  );
}
