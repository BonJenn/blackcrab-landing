import { getSql } from "../db";
import type { BillingStore, SubscriptionRecord } from "./webhook";
import type { SubscriptionRow } from "./entitlement";

function sqlOrThrow() {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  return sql;
}

export const billingStore: BillingStore = {
  async claimEvent(id, type, livemode) {
    const sql = sqlOrThrow();
    const claimed = await sql`
      insert into stripe_webhook_events (event_id, event_type, livemode)
      values (${id}, ${type}, ${livemode})
      on conflict (event_id) do update set received_at = now()
        where stripe_webhook_events.processed_at is null
          and stripe_webhook_events.received_at < now() - interval '2 minutes'
      returning event_id`;
    if (claimed.length > 0) return "claimed";
    const rows = await sql`
      select processed_at from stripe_webhook_events where event_id = ${id}`;
    return rows[0]?.processed_at ? "processed" : "in_progress";
  },

  async markProcessed(id) {
    const sql = sqlOrThrow();
    await sql`update stripe_webhook_events set processed_at = now() where event_id = ${id}`;
  },

  async releaseEvent(id) {
    const sql = sqlOrThrow();
    await sql`delete from stripe_webhook_events where event_id = ${id}`;
  },

  async accountIdForCustomer(customerId) {
    const sql = sqlOrThrow();
    const rows = await sql`
      select account_id from billing_accounts
      where stripe_customer_id = ${customerId}`;
    return rows[0]?.account_id ?? null;
  },

  async linkCustomer(accountId, customerId, email) {
    const sql = sqlOrThrow();
    await sql`
      insert into billing_accounts (account_id, stripe_customer_id, email)
      values (${accountId}, ${customerId}, ${email})
      on conflict (account_id) do update set
        stripe_customer_id = excluded.stripe_customer_id,
        email = coalesce(excluded.email, billing_accounts.email),
        updated_at = now()`;
  },

  async markTrialUsed(accountId) {
    const sql = sqlOrThrow();
    await sql`
      update billing_accounts set trial_used = true, updated_at = now()
      where account_id = ${accountId} and not trial_used`;
  },

  async upsertSubscription(row: SubscriptionRecord) {
    const sql = sqlOrThrow();
    await sql`
      insert into billing_subscriptions (
        stripe_subscription_id, account_id, stripe_customer_id, status,
        price_lookup_key, billing_interval, trial_end, current_period_end,
        cancel_at_period_end, canceled_at, livemode
      ) values (
        ${row.stripe_subscription_id}, ${row.account_id}, ${row.stripe_customer_id},
        ${row.status}, ${row.price_lookup_key}, ${row.billing_interval},
        ${row.trial_end}, ${row.current_period_end}, ${row.cancel_at_period_end},
        ${row.canceled_at}, ${row.livemode}
      )
      on conflict (stripe_subscription_id) do update set
        account_id = excluded.account_id,
        stripe_customer_id = excluded.stripe_customer_id,
        status = excluded.status,
        price_lookup_key = excluded.price_lookup_key,
        billing_interval = excluded.billing_interval,
        trial_end = excluded.trial_end,
        current_period_end = excluded.current_period_end,
        cancel_at_period_end = excluded.cancel_at_period_end,
        canceled_at = excluded.canceled_at,
        livemode = excluded.livemode,
        updated_at = now()`;
  },
};

export type AccountBilling = {
  stripeCustomerId: string | null;
  trialUsed: boolean;
  subscriptions: SubscriptionRow[];
};

export async function loadAccountBilling(accountId: string): Promise<AccountBilling> {
  const sql = sqlOrThrow();
  const accounts = await sql`
    select stripe_customer_id, trial_used from billing_accounts
    where account_id = ${accountId}`;
  const subs = await sql`
    select stripe_subscription_id, status, price_lookup_key, billing_interval,
           trial_end, current_period_end, cancel_at_period_end, livemode
    from billing_subscriptions where account_id = ${accountId}`;
  return {
    stripeCustomerId: accounts[0]?.stripe_customer_id ?? null,
    trialUsed: accounts[0]?.trial_used ?? false,
    subscriptions: subs as unknown as SubscriptionRow[],
  };
}

// Creates the account row before a Stripe customer exists, so a checkout that
// is started and abandoned still has somewhere to remember the email.
export async function ensureAccount(accountId: string, email: string | null) {
  const sql = sqlOrThrow();
  await sql`
    insert into billing_accounts (account_id, email)
    values (${accountId}, ${email})
    on conflict (account_id) do update set
      email = coalesce(excluded.email, billing_accounts.email),
      updated_at = now()`;
}
