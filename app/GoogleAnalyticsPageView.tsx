"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GoogleAnalyticsPageView({
  measurementId,
}: {
  measurementId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
      send_to: measurementId,
    });
  }, [measurementId, pathname, query]);

  return null;
}
