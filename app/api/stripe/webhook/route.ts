import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { billingStore } from "../../../lib/billing/store";
import { getStripe, stripeLivemode } from "../../../lib/billing/server";
import {
  handleStripeEvent,
  type StripeEventLike,
  type StripeSubscriptionLike,
} from "../../../lib/billing/webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ error: "billing_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "missing_signature" }, { status: 400 });

  // The signature covers the exact bytes, so read the body as text and never
  // re-serialize it.
  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return Response.json({ error: "bad_signature" }, { status: 400 });
  }

  try {
    const result = await handleStripeEvent(event as unknown as StripeEventLike, {
      store: billingStore,
      retrieveSubscription: async (id) =>
        (await stripe.subscriptions.retrieve(id)) as unknown as StripeSubscriptionLike,
      expectedLivemode: stripeLivemode(),
      log: (message) => console.log(message),
    });
    return Response.json({ received: true, ...result });
  } catch (error) {
    console.error("stripe webhook failed", event.id, event.type, error);
    // A non-2xx makes Stripe retry with backoff.
    return Response.json({ error: "processing_failed" }, { status: 500 });
  }
}
