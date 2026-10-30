"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { sendStat } from "@/lib/stats";
import type { TrackingWindow } from "@/lib/tracking";

/**
 * Mounted once in app/layout.tsx:
 *  - Vercel Web Analytics + Speed Insights (turn them on in Vercel → Project → Analytics / Speed Insights).
 *  - Page views for the daily email report, and window.ipStat for the contact-tap listener in the boot script.
 */
export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    (window as TrackingWindow).ipStat = (type, where) => sendStat(type, where);
  }, []);

  useEffect(() => {
    sendStat("view");
  }, [pathname]);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
