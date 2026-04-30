"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import { trackGoogleEvent } from "./lib/googleAnalytics";

export function DownloadLink({
  href,
  platform,
  source = "landing",
  children,
  className,
}: {
  href: string;
  platform: string;
  source?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        const eventParams = {
          platform,
          source,
        };

        track("download_clicked", {
          ...eventParams,
        });
        trackGoogleEvent("download_clicked", eventParams);
      }}
    >
      {children}
    </a>
  );
}
