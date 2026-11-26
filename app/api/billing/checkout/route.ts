import type { NextRequest } from "next/server";
import { deriveEntitlement } from "../../../lib/billing/entitlement";
import {
  PRICE_LOOKUP_KEYS,
  TRIAL_DAYS,
  authenticateAccount,
  getStripe,
  json,
  preflight,
  siteUrl,
  stripeLivemode,
} from "../../../lib/billing/server";
import {
  billingStore,
  ensureAccount,
  loadAccountBilling,
} from "../../../lib/billing/store";

export const dynamic = "force-dynamic";

export const OPTIONS = preflight;

// Starts a Stripe Checkout session for Blackcrab Remote and returns its URL.
// The desktop app opens that URL in the browser. The iOS app never calls this.
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return json({ error: "billing_not_configured" }, 503);

  const auth = await authenticateAccount(request);
  if (!auth.ok) return auth.response;
  const { accountId } = auth.identity;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // An empty body means the default interval.
  }
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const interval = record.interval === "year" ? "year" : "month";

  const email =
    auth.identity.email ??
    (typeof record.email === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(record.email)
      ? record.email
      : null);

  try {
    await ensureAccount(accountId, email);
    const billing = await loadAccountBilling(accountId);

    const entitlement = deriveEntitlement(billing.subscriptions, {
      livemode: stripeLivemode(),
      trialUsed: billing.trialUsed,
    });
    if (entitlement.plan === "remote") {
      // Changing plan or cancelling happens in the customer portal.
      return json({ error: "already_subscribed" }, 409);
    }

    const prices = await stripe.prices.list({
      lookup_keys: [PRICE_LOOKUP_KEYS[interval]],
      active: true,
      limit: 1,
    });
    const price = prices.data[0];
    if (!price) return json({ error: "price_not_found" }, 503);

    let customerId = billing.stripeCustomerId;
    if (!customerId) {
      // The idempotency key makes two simultaneous first checkouts share one
      // Stripe customer.
      const customer = await stripe.customers.create(
        { email: email ?? undefined, metadata: { account_id: accountId } },
        { idempotencyKey: `blackcrab-customer-${accountId}` },
      );
      customerId = customer.id;
      await billingStore.linkCustomer(accountId, customerId, email);
    }

    const site = siteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: accountId,
      line_items: [{ price: price.id, quantity: 1 }],
      subscription_data: {
        metadata: { account_id: accountId },
        // One trial per account.
        ...(billing.trialUsed ? {} : { trial_period_days: TRIAL_DAYS }),
      },
      metadata: { account_id: accountId },
      allow_promotion_codes: true,
      success_url: `${site}/billing/complete?result=success`,
      cancel_url: `${site}/billing/complete?result=cancelled`,
    });

    return json({ url: session.url, trialDays: billing.trialUsed ? 0 : TRIAL_DAYS });
  } catch (error) {
    console.error("checkout failed", error);
    return json({ error: "checkout_failed" }, 502);
  }
}
