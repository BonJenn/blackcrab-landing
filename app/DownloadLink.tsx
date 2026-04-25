"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

export function DownloadLink({
  href,
  platform,
  children,
  className,
}: {
  href: string;
  platform: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        track("download_clicked", {
          platform,
          source: "landing",
        });
      }}
    >
      {children}
    </a>
  );
}
