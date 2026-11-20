// Turns verified Stripe events into rows. Dependencies are injected so the
// logic is testable without a database or the network, and import-free so
// `node --test` can run it directly.
//
// Design: events are only a *signal*. For anything about a subscription we
// re-read the subscription from Stripe and store that, so a duplicate or
// out-of-order delivery can never leave an old state behind.

export type SubscriptionRecord = {
  stripe_subscription_id: string;
  account_id: string;
  stripe_customer_id: string;
  status: string;
  price_lookup_key: string | null;
  billing_interval: string | null;
  trial_end: Date | null;
  current_period_end: Date | null;
  cancel_at_period_end: boolean;
  canceled_at: Date | null;
  livemode: boolean;
};

export interface BillingStore {
  // "claimed": this call owns the event. "processed": it was already handled.
  // "in_progress": another delivery is handling it right now (or died while
  // doing so less than a couple of minutes ago); the caller should make Stripe
  // retry rather than drop it. Stale unfinished claims are handed back out as
  // "claimed" so a crash cannot lose an event.
  claimEvent(
    id: string,
    type: string,
    livemode: boolean,
  ): Promise<"claimed" | "processed" | "in_progress">;
  markProcessed(id: string): Promise<void>;
  // Un-claims an event after a failure so Stripe's retry is processed.
  releaseEvent(id: string): Promise<void>;
  accountIdForCustomer(customerId: string): Promise<string | null>;
  linkCustomer(
    accountId: string,
    customerId: string,
    email: string | null,
  ): Promise<void>;
  markTrialUsed(accountId: string): Promise<void>;
  upsertSubscription(row: SubscriptionRecord): Promise<void>;
}

// The slice of Stripe's objects we read.
export type StripeSubscriptionLike = {
  id: string;
  status: string;
  customer: string | { id: string };
  metadata?: Record<string, string> | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  livemode: boolean;
  items: {
    data: Array<{
      current_period_end?: number;
      price: {
        lookup_key: string | null;
        recurring: { interval: string } | null;
      };
    }>;
  };
};

export type StripeEventLike = {
  id: string;
  type: string;
  livemode: boolean;
  data: { object: Record<string, unknown> };
};

export type HandleResult =
  | { handled: true; type: string }
  | { handled: false; reason: "wrong_mode" | "duplicate" | "ignored_type" | "not_ours" };

export type HandleDeps = {
  store: BillingStore;
  retrieveSubscription: (id: string) => Promise<StripeSubscriptionLike>;
  expectedLivemode: boolean;
  log?: (message: string) => void;
};

const SUBSCRIPTION_EVENTS: ReadonlySet<string> = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);
const INVOICE_EVENTS: ReadonlySet<string> = new Set([
  "invoice.paid",
  "invoice.payment_failed",
]);

function idOf(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

function secondsToDate(s: number | null | undefined): Date | null {
  return typeof s === "number" ? new Date(s * 1000) : null;
}

export function subscriptionToRecord(
  sub: StripeSubscriptionLike,
  accountId: string,
): SubscriptionRecord {
  const item = sub.items.data[0];
  const periodEnds = sub.items.data
    .map((i) => i.current_period_end)
    .filter((n): n is number => typeof n === "number");
  return {
    stripe_subscription_id: sub.id,
    account_id: accountId,
    stripe_customer_id: idOf(sub.customer) ?? "",
    status: sub.status,
    price_lookup_key: item?.price.lookup_key ?? null,
    billing_interval: item?.price.recurring?.interval ?? null,
    trial_end: secondsToDate(sub.trial_end),
    current_period_end: periodEnds.length
      ? secondsToDate(Math.max(...periodEnds))
      : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    canceled_at: secondsToDate(sub.canceled_at),
    livemode: sub.livemode,
  };
}

// The subscription an invoice belongs to. Newer API versions put it under
// `parent.subscription_details`; older ones have `subscription` directly.
function invoiceSubscriptionId(invoice: Record<string, unknown>): string | null {
  const parent = invoice.parent as
    | { subscription_details?: { subscription?: unknown } }
    | null
    | undefined;
  return (
    idOf(parent?.subscription_details?.subscription) ??
    idOf(invoice.subscription)
  );
}

async function syncSubscription(
  id: string,
  deps: HandleDeps,
): Promise<"synced" | "not_ours"> {
  const sub = await deps.retrieveSubscription(id);
  const customerId = idOf(sub.customer);
  if (!customerId) return "not_ours";

  const accountId =
    sub.metadata?.account_id || (await deps.store.accountIdForCustomer(customerId));
  if (!accountId) return "not_ours";

  await deps.store.linkCustomer(accountId, customerId, null);
  // Any subscription that has had a trial period consumes the account's trial.
  if (sub.status === "trialing" || sub.trial_end !== null) {
    await deps.store.markTrialUsed(accountId);
  }
  await deps.store.upsertSubscription(subscriptionToRecord(sub, accountId));
  return "synced";
}

export async function handleStripeEvent(
  event: StripeEventLike,
  deps: HandleDeps,
): Promise<HandleResult> {
  // A sandbox event must never touch production rows, or the reverse.
  if (event.livemode !== deps.expectedLivemode) {
    return { handled: false, reason: "wrong_mode" };
  }

  const interesting =
    event.type === "checkout.session.completed" ||
    SUBSCRIPTION_EVENTS.has(event.type) ||
    INVOICE_EVENTS.has(event.type);
  if (!interesting) return { handled: false, reason: "ignored_type" };

  const claim = await deps.store.claimEvent(event.id, event.type, event.livemode);
  if (claim === "processed") return { handled: false, reason: "duplicate" };
  // Not an answer Stripe should accept: a non-2xx makes it retry later.
  if (claim === "in_progress") throw new Error(`event ${event.id} is still being processed`);

  try {
    const object = event.data.object;
    let outcome: "synced" | "not_ours" = "not_ours";

    if (event.type === "checkout.session.completed") {
      if (object.mode !== "subscription") {
        outcome = "not_ours";
      } else {
        const metadata = object.metadata as Record<string, string> | null;
        const accountId =
          (typeof object.client_reference_id === "string"
            ? object.client_reference_id
            : null) ?? metadata?.account_id ?? null;
        const customerId = idOf(object.customer);
        const subscriptionId = idOf(object.subscription);
        if (accountId && customerId) {
          const details = object.customer_details as
            | { email?: string | null }
            | null
            | undefined;
          await deps.store.linkCustomer(
            accountId,
            customerId,
            details?.email ?? null,
          );
        }
        if (subscriptionId) outcome = await syncSubscription(subscriptionId, deps);
      }
    } else if (SUBSCRIPTION_EVENTS.has(event.type)) {
      const id = idOf(object);
      if (id) outcome = await syncSubscription(id, deps);
    } else {
      const id = invoiceSubscriptionId(object);
      if (id) outcome = await syncSubscription(id, deps);
    }

    await deps.store.markProcessed(event.id);
    if (outcome === "not_ours") {
      deps.log?.(`stripe event ${event.id} (${event.type}) is not a Blackcrab subscription`);
      return { handled: false, reason: "not_ours" };
    }
    return { handled: true, type: event.type };
  } catch (error) {
    // Let Stripe retry: un-claim, then fail the request.
    await deps.store.releaseEvent(event.id).catch(() => {});
    throw error;
  }
}
