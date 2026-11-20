import test from "node:test";
import assert from "node:assert/strict";
import { createSign, generateKeyPairSync } from "node:crypto";
import { deriveEntitlement } from "./entitlement.ts";
import { handleStripeEvent, subscriptionToRecord } from "./webhook.ts";
import { verifyClerkToken } from "./clerk.ts";

// ---------- entitlement ----------

const row = (over = {}) => ({
  stripe_subscription_id: "sub_1",
  status: "active",
  price_lookup_key: "blackcrab_remote_monthly",
  billing_interval: "month",
  trial_end: null,
  current_period_end: "2026-12-19T00:00:00.000Z",
  cancel_at_period_end: false,
  livemode: false,
  ...over,
});
const opts = { livemode: false, trialUsed: false };

test("no subscriptions means the free plan", () => {
  const e = deriveEntitlement([], opts);
  assert.equal(e.plan, "free");
  assert.equal(e.status, null);
});

test("trialing and active grant remote; trial end is only reported while trialing", () => {
  const trial = deriveEntitlement(
    [row({ status: "trialing", trial_end: "2026-12-03T00:00:00.000Z" })],
    opts,
  );
  assert.equal(trial.plan, "remote");
  assert.equal(trial.trialEndsAt, "2026-12-03T00:00:00.000Z");
  const active = deriveEntitlement([row({ trial_end: "2026-12-03T00:00:00.000Z" })], opts);
  assert.equal(active.plan, "remote");
  assert.equal(active.trialEndsAt, null);
});

test("past_due keeps access during Stripe's retry window", () => {
  assert.equal(deriveEntitlement([row({ status: "past_due" })], opts).plan, "remote");
});

test("canceled, unpaid, incomplete and paused are free", () => {
  for (const status of ["canceled", "unpaid", "incomplete", "incomplete_expired", "paused"]) {
    assert.equal(deriveEntitlement([row({ status })], opts).plan, "free", status);
  }
});

test("a sandbox subscription never grants access in live mode, nor the reverse", () => {
  assert.equal(deriveEntitlement([row({ livemode: false })], { livemode: true, trialUsed: false }).plan, "free");
  assert.equal(deriveEntitlement([row({ livemode: true })], { livemode: false, trialUsed: false }).plan, "free");
});

test("cancel_at_period_end stays remote until the period ends and is reported", () => {
  const e = deriveEntitlement([row({ cancel_at_period_end: true })], opts);
  assert.equal(e.plan, "remote");
  assert.equal(e.cancelAtPeriodEnd, true);
});

test("trialUsed is carried through for both plans", () => {
  assert.equal(deriveEntitlement([], { livemode: false, trialUsed: true }).trialUsed, true);
  assert.equal(deriveEntitlement([row()], { livemode: false, trialUsed: true }).trialUsed, true);
});

// ---------- webhook ----------

function memoryStore() {
  const s = {
    claimed: new Set(),
    processed: new Set(),
    accounts: new Map(), // account_id -> { customer, email, trial_used }
    subs: new Map(),
    releases: 0,
    upserts: 0,
  };
  s.claimEvent = async (id) => {
    if (s.processed.has(id)) return "processed";
    if (s.claimed.has(id)) return "in_progress";
    s.claimed.add(id);
    return "claimed";
  };
  s.markProcessed = async (id) => void s.processed.add(id);
  s.releaseEvent = async (id) => {
    s.releases++;
    s.claimed.delete(id);
  };
  s.accountIdForCustomer = async (c) =>
    [...s.accounts].find(([, a]) => a.customer === c)?.[0] ?? null;
  s.linkCustomer = async (id, customer, email) => {
    const prev = s.accounts.get(id) ?? { trial_used: false, email: null };
    s.accounts.set(id, { ...prev, customer, email: email ?? prev.email });
  };
  s.markTrialUsed = async (id) => {
    s.accounts.get(id).trial_used = true;
  };
  s.upsertSubscription = async (r) => {
    s.upserts++;
    s.subs.set(r.stripe_subscription_id, r);
  };
  return s;
}

const stripeSub = (over = {}) => ({
  id: "sub_1",
  status: "trialing",
  customer: "cus_1",
  metadata: { account_id: "user_abc" },
  trial_end: 1796000000,
  cancel_at_period_end: false,
  canceled_at: null,
  livemode: false,
  items: {
    data: [
      {
        current_period_end: 1796000000,
        price: { lookup_key: "blackcrab_remote_monthly", recurring: { interval: "month" } },
      },
    ],
  },
  ...over,
});

const evt = (type, object, over = {}) => ({
  id: `evt_${Math.random().toString(36).slice(2)}`,
  type,
  livemode: false,
  data: { object },
  ...over,
});

const deps = (store, sub = stripeSub()) => ({
  store,
  retrieveSubscription: async () => sub,
  expectedLivemode: false,
});

test("subscriptionToRecord reads price, interval and the latest item period end", () => {
  const r = subscriptionToRecord(
    stripeSub({
      items: {
        data: [
          { current_period_end: 100, price: { lookup_key: "k", recurring: { interval: "year" } } },
          { current_period_end: 300, price: { lookup_key: "k", recurring: { interval: "year" } } },
        ],
      },
    }),
    "user_abc",
  );
  assert.equal(r.billing_interval, "year");
  assert.equal(r.price_lookup_key, "k");
  assert.equal(r.current_period_end.getTime(), 300000);
  assert.equal(r.stripe_customer_id, "cus_1");
});

test("checkout.session.completed links the customer, stores the subscription and spends the trial", async () => {
  const store = memoryStore();
  const result = await handleStripeEvent(
    evt("checkout.session.completed", {
      mode: "subscription",
      client_reference_id: "user_abc",
      customer: "cus_1",
      subscription: "sub_1",
      customer_details: { email: "a@example.com" },
    }),
    deps(store),
  );
  assert.deepEqual(result, { handled: true, type: "checkout.session.completed" });
  assert.equal(store.accounts.get("user_abc").customer, "cus_1");
  assert.equal(store.accounts.get("user_abc").email, "a@example.com");
  assert.equal(store.accounts.get("user_abc").trial_used, true);
  assert.equal(store.subs.get("sub_1").status, "trialing");
});

test("a redelivered event is ignored and writes nothing twice", async () => {
  const store = memoryStore();
  const e = evt("customer.subscription.updated", stripeSub());
  assert.equal((await handleStripeEvent(e, deps(store))).handled, true);
  const again = await handleStripeEvent(e, deps(store));
  assert.deepEqual(again, { handled: false, reason: "duplicate" });
  assert.equal(store.upserts, 1);
});

test("an event another delivery is still handling makes Stripe retry instead of dropping it", async () => {
  const store = memoryStore();
  const e = evt("customer.subscription.updated", stripeSub());
  store.claimed.add(e.id); // claimed by a delivery that has not finished
  await assert.rejects(handleStripeEvent(e, deps(store)), /still being processed/);
  assert.equal(store.upserts, 0);
  assert.equal(store.releases, 0, "must not release another delivery's claim");
});

test("a failure releases the event so Stripe's retry is processed", async () => {
  const store = memoryStore();
  const e = evt("customer.subscription.updated", stripeSub());
  let fail = true;
  const flaky = {
    ...deps(store),
    retrieveSubscription: async () => {
      if (fail) throw new Error("stripe is down");
      return stripeSub();
    },
  };
  await assert.rejects(handleStripeEvent(e, flaky), /stripe is down/);
  assert.equal(store.releases, 1);
  assert.equal(store.processed.has(e.id), false);
  fail = false;
  assert.equal((await handleStripeEvent(e, flaky)).handled, true);
  assert.equal(store.subs.size, 1);
});

test("an old 'updated' arriving after 'deleted' cannot resurrect the subscription", async () => {
  const store = memoryStore();
  // Stripe's current truth is canceled. Both events resolve to it.
  const current = stripeSub({ status: "canceled", canceled_at: 1796100000 });
  await handleStripeEvent(evt("customer.subscription.deleted", stripeSub()), deps(store, current));
  await handleStripeEvent(evt("customer.subscription.updated", stripeSub()), deps(store, current));
  assert.equal(store.subs.get("sub_1").status, "canceled");
});

test("events from the other Stripe mode are ignored and not even claimed", async () => {
  const store = memoryStore();
  const result = await handleStripeEvent(
    evt("customer.subscription.created", stripeSub({ livemode: true }), { livemode: true }),
    deps(store),
  );
  assert.deepEqual(result, { handled: false, reason: "wrong_mode" });
  assert.equal(store.claimed.size, 0);
  assert.equal(store.upserts, 0);
});

test("event types we do not use are ignored without being claimed", async () => {
  const store = memoryStore();
  const result = await handleStripeEvent(evt("charge.succeeded", {}), deps(store));
  assert.deepEqual(result, { handled: false, reason: "ignored_type" });
  assert.equal(store.claimed.size, 0);
});

test("a subscription we cannot attribute to an account is recorded as seen but not stored", async () => {
  const store = memoryStore();
  const result = await handleStripeEvent(
    evt("customer.subscription.created", stripeSub({ metadata: {}, customer: "cus_unknown" })),
    deps(store, stripeSub({ metadata: {}, customer: "cus_unknown" })),
  );
  assert.deepEqual(result, { handled: false, reason: "not_ours" });
  assert.equal(store.upserts, 0);
});

test("attribution falls back to the customer link when metadata is missing", async () => {
  const store = memoryStore();
  await store.linkCustomer("user_abc", "cus_1", null);
  const sub = stripeSub({ metadata: {} });
  const result = await handleStripeEvent(evt("customer.subscription.updated", sub), deps(store, sub));
  assert.equal(result.handled, true);
  assert.equal(store.subs.get("sub_1").account_id, "user_abc");
});

test("invoice events find the subscription in both API shapes", async () => {
  for (const invoice of [
    { parent: { subscription_details: { subscription: "sub_1" } } },
    { subscription: "sub_1" },
  ]) {
    const store = memoryStore();
    const r = await handleStripeEvent(evt("invoice.payment_failed", invoice), deps(store, stripeSub({ status: "past_due" })));
    assert.equal(r.handled, true);
    assert.equal(store.subs.get("sub_1").status, "past_due");
  }
});

test("a one-time (non-subscription) checkout is not ours", async () => {
  const store = memoryStore();
  const r = await handleStripeEvent(
    evt("checkout.session.completed", { mode: "payment", customer: "cus_1" }),
    deps(store),
  );
  assert.deepEqual(r, { handled: false, reason: "not_ours" });
});

// ---------- Clerk token verification ----------

const ISSUER = "https://clerk.example.test";
const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "key-1" };
const fetchJwks = async () => ({ keys: [jwk] });
const NOW = 1_800_000_000;

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
function makeToken(claims = {}, header = {}, signWith = privateKey) {
  const h = { alg: "RS256", typ: "JWT", kid: "key-1", ...header };
  const p = { iss: ISSUER, sub: "user_abc", exp: NOW + 60, nbf: NOW - 60, ...claims };
  const signing = `${b64(h)}.${b64(p)}`;
  const sig = createSign("RSA-SHA256").update(signing).sign(signWith).toString("base64url");
  return `${signing}.${sig}`;
}
const verify = (token, extra = {}) =>
  verifyClerkToken(token, { issuer: ISSUER, fetchJwks, nowSeconds: NOW, ...extra });

test("a valid Clerk token yields the account id and email", async () => {
  const r = await verify(makeToken({ email: "a@example.com" }));
  assert.deepEqual(r, { ok: true, identity: { accountId: "user_abc", email: "a@example.com" } });
});

test("a tampered payload fails the signature check", async () => {
  const [h, , s] = makeToken().split(".");
  const forged = `${h}.${b64({ iss: ISSUER, sub: "user_victim", exp: NOW + 60 })}.${s}`;
  assert.deepEqual(await verify(forged), { ok: false, reason: "bad_signature" });
});

test("a token signed by a different key is rejected", async () => {
  const other = generateKeyPairSync("rsa", { modulusLength: 2048 });
  assert.equal((await verify(makeToken({}, {}, other.privateKey))).reason, "bad_signature");
});

test("expired, not-yet-valid and wrong-issuer tokens are rejected", async () => {
  assert.equal((await verify(makeToken({ exp: NOW - 3600 }))).reason, "expired");
  assert.equal((await verify(makeToken({ nbf: NOW + 3600 }))).reason, "not_yet_valid");
  assert.equal((await verify(makeToken({ iss: "https://evil.test" }))).reason, "wrong_issuer");
});

test("alg none and HS256 are rejected before any key is used", async () => {
  assert.equal((await verify(`${b64({ alg: "none" })}.${b64({ iss: ISSUER, sub: "x", exp: NOW + 60 })}.`)).reason, "unsupported_alg");
  assert.equal((await verify(makeToken({}, { alg: "HS256" }))).reason, "unsupported_alg");
});

test("authorized parties are enforced when configured", async () => {
  const parties = ["https://app.example.test"];
  assert.equal((await verify(makeToken({ azp: "https://app.example.test" }), { authorizedParties: parties })).ok, true);
  assert.equal((await verify(makeToken({ azp: "https://evil.test" }), { authorizedParties: parties })).reason, "unauthorized_party");
  assert.equal((await verify(makeToken(), { authorizedParties: parties })).reason, "unauthorized_party");
});

test("an unknown key id, a missing subject and an unreachable JWKS all fail closed", async () => {
  assert.equal((await verify(makeToken({}, { kid: "other" }))).reason, "unknown_key");
  assert.equal((await verify(makeToken({ sub: undefined }))).reason, "missing_subject");
  const down = await verify(makeToken(), { fetchJwks: async () => { throw new Error("offline"); } });
  assert.equal(down.reason, "jwks_unavailable");
  assert.equal((await verify("not-a-jwt")).reason, "malformed_token");
});
