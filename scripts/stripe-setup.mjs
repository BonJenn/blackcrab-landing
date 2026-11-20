#!/usr/bin/env node
// Creates (or finds) the Blackcrab Remote billing objects in whichever Stripe
// account STRIPE_SECRET_KEY belongs to. Safe to re-run: every object is looked
// up by lookup_key / metadata before it is created. Run it once against the
// sandbox, then once against the live account; products and prices do not
// carry over between accounts.
//
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
//   STRIPE_WEBHOOK_URL=https://www.blackcrab.app/api/stripe/webhook  (optional)
//   STRIPE_PORTAL_RETURN_URL=https://www.blackcrab.app/account       (optional)
//   STRIPE_PRODUCT_TAX_CODE=txcd_10103000                            (optional)
//
// The product needs a tax code: Managed Payments (Stripe as merchant of record,
// on by default for some accounts) refuses Checkout without one. The default,
// txcd_10103000, is "Software as a Service (SaaS) - Personal Use";
// txcd_10103001 is "... - Business Use". Which one applies is the account
// owner's call, so check it with your accountant before going live.
//
// The secret key is read from the environment and never printed. The webhook
// signing secret is only returned by Stripe when an endpoint is created, so it
// is written to the file named by STRIPE_WEBHOOK_SECRET_OUT (mode 0600) and
// not to stdout.

import { writeFileSync } from "node:fs";

const key = process.env.STRIPE_SECRET_KEY;
if (!key || !/^(sk|rk)_(test|live)_/.test(key)) {
  console.error("Set STRIPE_SECRET_KEY to a Stripe secret or restricted key.");
  process.exit(1);
}
const mode = key.includes("_live_") ? "live" : "sandbox";

const PRODUCT_KEY = "blackcrab_remote";
const TAX_CODE = process.env.STRIPE_PRODUCT_TAX_CODE ?? "txcd_10103000";
const PRICES = [
  { lookup_key: "blackcrab_remote_monthly", unit_amount: 500, interval: "month", nickname: "Remote monthly" },
  { lookup_key: "blackcrab_remote_yearly", unit_amount: 4800, interval: "year", nickname: "Remote yearly" },
];
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
];

// Stripe takes form-encoded bodies with bracketed nested keys.
function encode(value, prefix = "", out = []) {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => encode(v, `${prefix}[${i}]`, out));
  } else if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) encode(v, prefix ? `${prefix}[${k}]` : k, out);
  } else {
    out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`);
  }
  return out;
}

async function stripe(method, path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body ? encode(body).join("&") : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${json.error?.message ?? res.status}`);
  return json;
}

async function ensureProduct() {
  // List (not search): search indexing lags and would let a re-run duplicate it.
  const found = await stripe("GET", "/products?active=true&limit=100");
  const match = found.data.find((p) => p.metadata?.blackcrab_key === PRODUCT_KEY);
  if (match) {
    if (match.tax_code !== TAX_CODE) {
      return stripe("POST", `/products/${match.id}`, { tax_code: TAX_CODE });
    }
    return match;
  }
  return stripe("POST", "/products", {
    name: "Blackcrab Remote",
    description: "Hosted remote access for Blackcrab: reach your desktop agents from the iOS app from anywhere.",
    tax_code: TAX_CODE,
    metadata: { blackcrab_key: PRODUCT_KEY },
  });
}

async function ensurePrice(product, spec) {
  const found = await stripe("GET", `/prices?lookup_keys[]=${spec.lookup_key}&active=true`);
  if (found.data[0]) return found.data[0];
  return stripe("POST", "/prices", {
    product: product.id,
    currency: "usd",
    unit_amount: spec.unit_amount,
    recurring: { interval: spec.interval },
    lookup_key: spec.lookup_key,
    nickname: spec.nickname,
    tax_behavior: "unspecified",
  });
}

async function ensurePortal(product, prices) {
  const list = await stripe("GET", "/billing_portal/configurations?limit=100&is_default=false");
  const existing = list.data.find((c) => c.metadata?.blackcrab_key === PRODUCT_KEY && c.active);
  const config = {
    business_profile: { headline: "Manage your Blackcrab Remote subscription" },
    default_return_url: process.env.STRIPE_PORTAL_RETURN_URL,
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "name", "address"] },
      subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "create_prorations",
        products: [{ product: product.id, prices: prices.map((p) => p.id) }],
      },
    },
    metadata: { blackcrab_key: PRODUCT_KEY },
  };
  if (existing) return stripe("POST", `/billing_portal/configurations/${existing.id}`, config);
  return stripe("POST", "/billing_portal/configurations", config);
}

async function ensureWebhook(url) {
  const list = await stripe("GET", "/webhook_endpoints?limit=100");
  const existing = list.data.find((w) => w.url === url);
  if (existing) {
    await stripe("POST", `/webhook_endpoints/${existing.id}`, { enabled_events: WEBHOOK_EVENTS });
    return { endpoint: existing, secret: null };
  }
  const created = await stripe("POST", "/webhook_endpoints", {
    url,
    enabled_events: WEBHOOK_EVENTS,
    description: "Blackcrab Remote billing",
    metadata: { blackcrab_key: PRODUCT_KEY },
  });
  return { endpoint: created, secret: created.secret };
}

const account = await stripe("GET", "/account");
console.log(`Account: ${account.settings?.dashboard?.display_name ?? "(unnamed)"} ${account.id} [${mode}]`);

const product = await ensureProduct();
console.log(`Product: ${product.id}`);
const prices = [];
for (const spec of PRICES) {
  const price = await ensurePrice(product, spec);
  prices.push(price);
  console.log(`Price:   ${price.id}  ${spec.lookup_key}  ${price.unit_amount / 100} USD / ${price.recurring.interval}`);
}
const portal = await ensurePortal(product, prices);
console.log(`Portal:  ${portal.id}`);

const webhookUrl = process.env.STRIPE_WEBHOOK_URL;
if (webhookUrl) {
  const { endpoint, secret } = await ensureWebhook(webhookUrl);
  console.log(`Webhook: ${endpoint.id}  ${webhookUrl}`);
  const out = process.env.STRIPE_WEBHOOK_SECRET_OUT;
  if (secret && out) {
    writeFileSync(out, `STRIPE_WEBHOOK_SECRET=${secret}\n`, { mode: 0o600 });
    console.log(`Webhook signing secret written to ${out}`);
  } else if (secret) {
    console.log("Webhook created, but STRIPE_WEBHOOK_SECRET_OUT was not set, so the signing secret was discarded. Delete the endpoint and re-run with it set.");
  } else {
    console.log("Webhook already existed; its signing secret is only shown at creation (roll it in the dashboard if lost).");
  }
} else {
  console.log("Webhook: skipped (set STRIPE_WEBHOOK_URL once the endpoint exists; use `stripe listen` locally).");
}
