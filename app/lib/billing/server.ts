import { timingSafeEqual } from "node:crypto";
import Stripe from "stripe";
import { fetchClerkJwks, verifyClerkToken, type ClerkIdentity } from "./clerk";

export const TRIAL_DAYS = 14;

export const PRICE_LOOKUP_KEYS = {
  month: "blackcrab_remote_monthly",
  year: "blackcrab_remote_yearly",
} as const;

// Native apps send bearer tokens, not cookies, so a wildcard origin is safe and
// lets the desktop webview call these routes. Same approach as /api/events.
export const BILLING_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: BILLING_HEADERS });
}

export function preflight() {
  return new Response(null, { status: 204, headers: BILLING_HEADERS });
}

export function siteUrl() {
  return (process.env.BILLING_SITE_URL ?? "https://www.blackcrab.app").replace(/\/+$/, "");
}

// The key itself decides which mode this deployment is in, so a sandbox key
// can never be paired with live-mode behaviour.
export function stripeLivemode() {
  return (process.env.STRIPE_SECRET_KEY ?? "").includes("_live_");
}

let stripeSingleton: Stripe | null = null;
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeSingleton ??= new Stripe(key, { maxNetworkRetries: 2 });
  return stripeSingleton;
}

export type AuthResult =
  | { ok: true; identity: ClerkIdentity }
  | { ok: false; response: Response };

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization");
  const match = header ? /^Bearer\s+(.+)$/i.exec(header) : null;
  return match ? match[1].trim() : null;
}

// Identifies the signed-in Blackcrab account from its Clerk session token.
export async function authenticateAccount(request: Request): Promise<AuthResult> {
  const issuer = process.env.CLERK_ISSUER;
  if (!issuer) {
    return { ok: false, response: json({ error: "auth_not_configured" }, 503) };
  }
  const token = bearer(request);
  if (!token) return { ok: false, response: json({ error: "unauthorized" }, 401) };

  const parties = (process.env.CLERK_AUTHORIZED_PARTIES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const result = await verifyClerkToken(token, {
    issuer,
    authorizedParties: parties,
    fetchJwks: fetchClerkJwks,
  });
  if (!result.ok) {
    // The reason is for logs, not for the caller.
    console.warn(`billing auth rejected: ${result.reason}`);
    return { ok: false, response: json({ error: "unauthorized" }, 401) };
  }
  return { ok: true, identity: result.identity };
}

// For the relay, which asks about an account by id with a shared secret.
export function isServerCaller(request: Request): boolean {
  const secret = process.env.BILLING_ENTITLEMENT_SECRET;
  const token = bearer(request);
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
