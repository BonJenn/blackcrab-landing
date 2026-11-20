import type { NextRequest } from "next/server";
import { deriveEntitlement } from "../../../lib/billing/entitlement";
import {
  authenticateAccount,
  isServerCaller,
  json,
  preflight,
  stripeLivemode,
} from "../../../lib/billing/server";
import { loadAccountBilling } from "../../../lib/billing/store";

export const dynamic = "force-dynamic";

export const OPTIONS = preflight;

// Which plan is this account on? Two callers:
//  - an app, with its Clerk session token: answers for the signed-in account;
//  - the relay, with BILLING_ENTITLEMENT_SECRET: answers for ?account_id=.
// Unknown accounts are simply "free". The iOS app only ever reads this; there
// is no purchase path in it.
export async function GET(request: NextRequest) {
  let accountId: string;
  if (isServerCaller(request)) {
    const requested = request.nextUrl.searchParams.get("account_id");
    if (!requested) return json({ error: "account_id_required" }, 400);
    accountId = requested;
  } else {
    const auth = await authenticateAccount(request);
    if (!auth.ok) return auth.response;
    accountId = auth.identity.accountId;
  }

  try {
    const billing = await loadAccountBilling(accountId);
    return json(
      deriveEntitlement(billing.subscriptions, {
        livemode: stripeLivemode(),
        trialUsed: billing.trialUsed,
      }),
    );
  } catch (error) {
    console.error("entitlement lookup failed", error);
    // Callers must treat this as "unknown", not as "free" and not as "paid".
    return json({ error: "unavailable" }, 503);
  }
}
