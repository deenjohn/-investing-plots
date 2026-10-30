import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { brand, SITE_URL } from "@/lib/site";
import { description, keywords, title } from "@/lib/seo";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { ADS_ID, bootScript, CLARITY_ID, GA_ID, GTM_ID, gtmScript, PIXEL_ID } from "@/lib/tracking";
import "./globals.css";

// Self-hosted, preloaded, with a size-matched fallback so the swap causes no layout shift.
const jakarta = localFont({
  src: "./fonts/plus-jakarta.woff2",
  weight: "200 800",
  // "optional": no late font swap, so the text that is the LCP element paints once and never re-paints.
  display: "optional",
  variable: "--font-sans",
  preload: true,
  fallback: ["Segoe UI", "system-ui", "-apple-system", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

function verification(value: string | undefined) {
  if (!value) return undefined;
  const pasted = value.match(/content\s*=\s*["']([^"']+)["']/i);
  const token = (pasted?.[1] ?? value).trim();
  return /^[A-Za-z0-9_+=/-]{16,200}$/.test(token) ? token : undefined;
}

const google = verification(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
const meta = verification(process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords,
  applicationName: brand.name,
  authors: [{ name: brand.name, url: SITE_URL }],
  creator: brand.name,
  publisher: brand.name,
  category: "Real estate",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: "/",
    siteName: brand.name,
    locale: "en_IN",
    title,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Investing Plots — plots and land for investment in India" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    ...(google ? { google } : {}),
    ...(meta ? { other: { "facebook-domain-verification": meta } } : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d2340",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={jakarta.variable}>
      <head>
        {/* Warm up connections only when the tags are configured. */}
        {GA_ID || ADS_ID || GTM_ID ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
        {PIXEL_ID ? <link rel="preconnect" href="https://connect.facebook.net" /> : null}
        {CLARITY_ID ? <link rel="preconnect" href="https://www.clarity.ms" /> : null}
        {/* GTM first (Google's recommended spot), then the gtag / pixel / Clarity queues. Both share window.dataLayer. */}
        {GTM_ID ? <script dangerouslySetInnerHTML={{ __html: gtmScript() }} /> : null}
        <script dangerouslySetInnerHTML={{ __html: bootScript() }} />
      </head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        {children}
        <SiteAnalytics />
        {PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
          </noscript>
        ) : null}
      </body>
    </html>
  );
}
