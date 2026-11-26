// Verifies a Clerk session token (an RS256 JWT) with no dependencies, so the
// site can tell which Blackcrab account is calling. Fails closed: any problem
// returns { ok: false } and nothing is trusted.
//
// Configuration (all server-side env vars):
//   CLERK_ISSUER              the Clerk Frontend API URL, e.g. https://clerk.blackcrab.app
//   CLERK_AUTHORIZED_PARTIES  optional comma-separated origins allowed in `azp`
//
// The signing keys come from `${issuer}/.well-known/jwks.json`, so rotating the
// Clerk secret key does not require touching this code.

import { createPublicKey, createVerify, type JsonWebKey } from "node:crypto";

export type ClerkIdentity = { accountId: string; email: string | null };

export type VerifyResult =
  | { ok: true; identity: ClerkIdentity }
  | { ok: false; reason: string };

export type Jwks = { keys: Array<JsonWebKey & { kid?: string }> };

export type VerifyOptions = {
  issuer: string;
  authorizedParties?: readonly string[];
  fetchJwks: (issuer: string) => Promise<Jwks>;
  nowSeconds?: number;
  clockToleranceSeconds?: number;
};

function b64urlToBuffer(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function parseJson(buf: Buffer): Record<string, unknown> | null {
  try {
    const v: unknown = JSON.parse(buf.toString("utf8"));
    return v && typeof v === "object" && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function verifyClerkToken(
  token: string,
  options: VerifyOptions,
): Promise<VerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed_token" };
  const [h, p, s] = parts;

  const header = parseJson(b64urlToBuffer(h));
  const claims = parseJson(b64urlToBuffer(p));
  if (!header || !claims) return { ok: false, reason: "malformed_token" };
  // Only RS256 is accepted. Never trust the header to pick a weaker algorithm.
  if (header.alg !== "RS256") return { ok: false, reason: "unsupported_alg" };

  const issuer = options.issuer.replace(/\/+$/, "");
  if (typeof claims.iss !== "string" || claims.iss.replace(/\/+$/, "") !== issuer) {
    return { ok: false, reason: "wrong_issuer" };
  }

  let jwks: Jwks;
  try {
    jwks = await options.fetchJwks(issuer);
  } catch {
    return { ok: false, reason: "jwks_unavailable" };
  }
  const jwk = jwks.keys.find(
    (k) => k.kty === "RSA" && (header.kid === undefined || k.kid === header.kid),
  );
  if (!jwk) return { ok: false, reason: "unknown_key" };

  let valid = false;
  try {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${h}.${p}`);
    valid = verifier.verify(
      createPublicKey({ key: jwk, format: "jwk" }),
      b64urlToBuffer(s),
    );
  } catch {
    valid = false;
  }
  if (!valid) return { ok: false, reason: "bad_signature" };

  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const skew = options.clockToleranceSeconds ?? 5;
  if (typeof claims.exp !== "number" || claims.exp + skew < now) {
    return { ok: false, reason: "expired" };
  }
  if (typeof claims.nbf === "number" && claims.nbf - skew > now) {
    return { ok: false, reason: "not_yet_valid" };
  }

  const parties = options.authorizedParties ?? [];
  if (parties.length > 0) {
    if (typeof claims.azp !== "string" || !parties.includes(claims.azp)) {
      return { ok: false, reason: "unauthorized_party" };
    }
  }

  if (typeof claims.sub !== "string" || claims.sub.length === 0) {
    return { ok: false, reason: "missing_subject" };
  }
  return {
    ok: true,
    identity: {
      accountId: claims.sub,
      email: typeof claims.email === "string" ? claims.email : null,
    },
  };
}

// JWKS are cached briefly so a burst of requests does one fetch. A key rotation
// is picked up within the TTL (until then, tokens signed with the new key are
// refused, which fails closed).
const cache = new Map<string, { at: number; jwks: Jwks }>();
const TTL_MS = 10 * 60 * 1000;

export async function fetchClerkJwks(issuer: string): Promise<Jwks> {
  const hit = cache.get(issuer);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.jwks;
  const res = await fetch(`${issuer}/.well-known/jwks.json`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`jwks ${res.status}`);
  const jwks = (await res.json()) as Jwks;
  if (!jwks || !Array.isArray(jwks.keys)) throw new Error("jwks shape");
  cache.set(issuer, { at: Date.now(), jwks });
  return jwks;
}
