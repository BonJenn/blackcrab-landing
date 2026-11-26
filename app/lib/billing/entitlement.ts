// How a Stripe subscription turns into a Blackcrab plan. Pure and import-free
// so `node --test` can run it directly.
//
// Plans: "free" (the default) and "remote" (Blackcrab-hosted remote access).
// The free tier's limits are enforced by the relay, not here; this only says
// which plan an account is on.

export type Plan = "free" | "remote";

export type SubscriptionRow = {
  stripe_subscription_id: string;
  status: string;
  price_lookup_key: string | null;
  billing_interval: string | null;
  trial_end: Date | string | null;
  current_period_end: Date | string | null;
  cancel_at_period_end: boolean;
  livemode: boolean;
};

export type Entitlement = {
  plan: Plan;
  // Raw Stripe status of the subscription that decided the plan, or null.
  status: string | null;
  interval: "month" | "year" | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  // True once this account has used its 14-day trial.
  trialUsed: boolean;
};

// trialing and active are paid-for. past_due keeps access while Stripe retries
// the card (its retry window is the grace period). Everything else — canceled,
// unpaid, incomplete, incomplete_expired, paused — is free.
const ACCESS_STATUSES: ReadonlySet<string> = new Set([
  "trialing",
  "active",
  "past_due",
]);

export function statusGrantsAccess(status: string): boolean {
  return ACCESS_STATUSES.has(status);
}

function iso(value: Date | string | null): string | null {
  if (value === null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function deriveEntitlement(
  rows: readonly SubscriptionRow[],
  options: { livemode: boolean; trialUsed: boolean },
): Entitlement {
  const free: Entitlement = {
    plan: "free",
    status: null,
    interval: null,
    trialEndsAt: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    trialUsed: options.trialUsed,
  };

  const granting = rows
    .filter((r) => r.livemode === options.livemode)
    .filter((r) => statusGrantsAccess(r.status))
    // If somehow there is more than one, the one that lasts longest wins.
    .sort(
      (a, b) =>
        (Date.parse(iso(b.current_period_end) ?? "") || 0) -
        (Date.parse(iso(a.current_period_end) ?? "") || 0),
    );

  const best = granting[0];
  if (!best) return free;

  return {
    plan: "remote",
    status: best.status,
    interval:
      best.billing_interval === "month" || best.billing_interval === "year"
        ? best.billing_interval
        : null,
    trialEndsAt: best.status === "trialing" ? iso(best.trial_end) : null,
    currentPeriodEnd: iso(best.current_period_end),
    cancelAtPeriodEnd: best.cancel_at_period_end,
    trialUsed: options.trialUsed,
  };
}
