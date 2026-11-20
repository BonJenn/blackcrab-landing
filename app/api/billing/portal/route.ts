import type { NextRequest } from "next/server";
import {
  authenticateAccount,
  getStripe,
  json,
  preflight,
  siteUrl,
} from "../../../lib/billing/server";
import { loadAccountBilling } from "../../../lib/billing/store";

export const dynamic = "force-dynamic";

export const OPTIONS = preflight;

// Returns a Stripe customer portal URL: invoices, card, plan switch, cancel.
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return json({ error: "billing_not_configured" }, 503);

  const auth = await authenticateAccount(request);
  if (!auth.ok) return auth.response;

  try {
    const billing = await loadAccountBilling(auth.identity.accountId);
    if (!billing.stripeCustomerId) return json({ error: "no_customer" }, 404);

    const configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
    const session = await stripe.billingPortal.sessions.create({
      customer: billing.stripeCustomerId,
      return_url: `${siteUrl()}/billing/complete?result=portal`,
      ...(configuration ? { configuration } : {}),
    });
    return json({ url: session.url });
  } catch (error) {
    console.error("portal failed", error);
    return json({ error: "portal_failed" }, 502);
  }
}
