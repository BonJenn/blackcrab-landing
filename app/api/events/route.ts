import type { NextRequest } from "next/server";
import { trackEvent, type EventType } from "../../lib/tracking";

export const dynamic = "force-dynamic";

const ALLOWED_EVENT_TYPES: ReadonlySet<EventType> = new Set([
  "app_launch",
  "update_check",
  "update_started",
  "update_completed",
  "update_failed",
]);

const ALLOWED_PLATFORMS = new Set(["macos", "windows", "linux"]);

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Blackcrab-Events-Key",
  "Cache-Control": "no-store",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: RESPONSE_HEADERS,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: RESPONSE_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "invalid_json" },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }

  const parsed = parseEvent(body);

  if (!parsed.ok) {
    return Response.json(
      { ok: false, error: parsed.error },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }

  const ok = await trackEvent({
    ...parsed.event,
    source: parsed.event.source ?? "app",
    userAgent: request.headers.get("user-agent"),
  });

  return Response.json({ ok }, { status: 202, headers: RESPONSE_HEADERS });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.EVENT_INGEST_SECRET;
  if (!secret) return true;

  const bearer = request.headers.get("authorization");
  const eventKey = request.headers.get("x-blackcrab-events-key");

  return bearer === `Bearer ${secret}` || eventKey === secret;
}

function parseEvent(body: unknown):
  | {
      ok: true;
      event: {
        eventType: EventType;
        platform?: string | null;
        version?: string | null;
        fromVersion?: string | null;
        toVersion?: string | null;
        installId?: string | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
      };
    }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "body_must_be_object" };
  }

  const eventType = readString(body, "event_type", "eventType");
  if (!isEventType(eventType)) {
    return { ok: false, error: "invalid_event_type" };
  }

  const rawPlatform = readString(body, "platform");
  const platform = normalizePlatform(rawPlatform);
  if (rawPlatform && !platform) {
    return { ok: false, error: "invalid_platform" };
  }

  const currentVersion = readString(body, "current_version", "currentVersion");
  const latestVersion = readString(body, "latest_version", "latestVersion");
  const version =
    readString(body, "version") ??
    (eventType === "app_launch" ? currentVersion : null);
  const fromVersion =
    readString(body, "from_version", "fromVersion") ??
    (eventType.startsWith("update_") ? currentVersion ?? version : null);
  const toVersion =
    readString(body, "to_version", "toVersion") ??
    (eventType.startsWith("update_") ? latestVersion : null);
  const installId = readString(
    body,
    "install_id",
    "installId",
    "anonymous_install_id",
    "anonymousInstallId",
  );
  const source = readString(body, "source");
  const metadata = readRecord(body.metadata);

  return {
    ok: true,
    event: {
      eventType,
      platform,
      version,
      fromVersion,
      toVersion,
      installId,
      source,
      metadata,
    },
  };
}

function isEventType(value: string | null): value is EventType {
  return value !== null && ALLOWED_EVENT_TYPES.has(value as EventType);
}

function normalizePlatform(value: string | null) {
  if (!value) return null;
  const platform = value.toLowerCase();
  if (platform === "darwin" || platform === "mac" || platform === "macos") {
    return "macos";
  }
  if (platform === "win32" || platform === "win" || platform === "windows") {
    return "windows";
  }
  if (platform === "linux") {
    return "linux";
  }
  return ALLOWED_PLATFORMS.has(platform) ? platform : null;
}

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function readRecord(value: unknown) {
  if (!isRecord(value)) return null;
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
