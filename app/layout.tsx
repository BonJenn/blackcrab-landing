import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "./GoogleAnalytics";
import "./globals.css";

const geistSans = localFont({
  variable: "--font-geist-sans",
  src: [
    {
      path: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
      weight: "100 900",
    },
    {
      path: "../node_modules/next/dist/next-devtools/server/font/geist-latin-ext.woff2",
      weight: "100 900",
    },
  ],
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: [
    {
      path: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
      weight: "100 900",
    },
    {
      path: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin-ext.woff2",
      weight: "100 900",
    },
  ],
});

export const metadata: Metadata = {
  title: "Blackcrab — Different models. One place to work.",
  description:
    "Choose your models, work in parallel panes, and keep projects, Git and terminals together. Free, open-source software for Apple-silicon Macs. Remote access in private beta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
