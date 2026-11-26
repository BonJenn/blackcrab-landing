-- Blackcrab Remote billing (Stripe). Applied to the same Postgres database as
-- 001_downloads.sql and 002_events.sql (the site's DATABASE_URL).
--
-- account_id is the Blackcrab account id: the Clerk user id (`sub`) that the
-- desktop and iOS apps sign in with. Stripe is the source of truth for the
-- subscription; these rows are a cache that the webhook keeps current.

create table if not exists billing_accounts (
  account_id         text        primary key,
  stripe_customer_id text        unique,
  email              text,
  -- One free trial per account, even if the subscription is cancelled and
  -- the person comes back.
  trial_used         boolean     not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists billing_subscriptions (
  stripe_subscription_id text        primary key,
  account_id             text        not null references billing_accounts (account_id),
  stripe_customer_id     text        not null,
  status                 text        not null,
  price_lookup_key       text,
  billing_interval       text,
  trial_end              timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  canceled_at            timestamptz,
  -- A sandbox subscription must never grant access in production, and the
  -- reverse. The entitlement query filters on this.
  livemode               boolean     not null,
  updated_at             timestamptz not null default now()
);

create index if not exists billing_subscriptions_account_idx
  on billing_subscriptions (account_id);

-- Stripe retries webhooks and can deliver them twice or out of order. The
-- event id makes handling idempotent: the first insert wins.
create table if not exists stripe_webhook_events (
  event_id     text        primary key,
  event_type   text        not null,
  livemode     boolean     not null,
  received_at  timestamptz not null default now(),
  processed_at timestamptz
);
