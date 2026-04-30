const PRODUCTION_GA_MEASUREMENT_ID = "G-T2QXKS2G70";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_GA_MEASUREMENT_ID
    : undefined);

type GoogleAnalyticsValue = string | number | boolean | null | undefined;

type GoogleAnalyticsParams = Record<string, GoogleAnalyticsValue>;

type GtagCommand =
  | ["js", Date]
  | ["config", string, GoogleAnalyticsParams?]
  | ["event", string, GoogleAnalyticsParams?];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagCommand) => void;
  }
}

export function trackGoogleEvent(
  eventName: string,
  params: GoogleAnalyticsParams,
) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") {
    return;
  }

  window.gtag?.("event", eventName, params);
}
