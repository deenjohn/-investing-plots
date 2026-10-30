import { readCampaign } from "./tracking";

/**
 * Anonymous visit log for the daily email report (tools/daily-report.gs, a Google Apps Script web app).
 * Set NEXT_PUBLIC_STATS_WEBHOOK to that web app URL. Blank = nothing is sent.
 *
 * Sends no name, phone or email: only the page, where the visit came from, phone or desktop, and a
 * random visitor id kept in this browser so the report can count unique visitors.
 * Open any page once with ?internal=1 to stop counting your own visits on that browser (?internal=0 undoes it).
 */
const ENDPOINT = (() => {
  const value = (process.env.NEXT_PUBLIC_STATS_WEBHOOK || "").trim();
  return /^https:\/\/script\.google\.com\//.test(value) ? value : "";
})();

export type StatType = "view" | "whatsapp" | "call" | "email" | "lead";
const TYPES: readonly string[] = ["view", "whatsapp", "call", "email", "lead"];

function store(key: string, value?: string | null) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode or blocked storage */
  }
  return null;
}

function visitorId() {
  const saved = store("ip-vid");
  if (saved) return saved;
  const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  store("ip-vid", id);
  return id;
}

function skip() {
  const query = window.location.search;
  if (/[?&]internal=1\b/.test(query)) store("ip-internal", "1");
  if (/[?&]internal=0\b/.test(query)) store("ip-internal", null);
  if (store("ip-internal") === "1") return true;
  if (navigator.webdriver) return true;
  return /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|whatsapp|adsbot|mediapartners/i.test(
    navigator.userAgent,
  );
}

function source() {
  const campaign = readCampaign();
  if (campaign.utm_source) return { source: campaign.utm_source, medium: campaign.utm_medium || "", campaign: campaign.utm_campaign || "" };
  if (campaign.gclid || campaign.gbraid || campaign.wbraid || campaign.gad_source) return { source: "google", medium: "cpc", campaign: "" };
  if (campaign.fbclid) return { source: "facebook", medium: "paid_social", campaign: "" };
  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (!host || host === window.location.hostname.replace(/^www\./, "")) return { source: host ? "" : "direct", medium: "", campaign: "" };
  return { source: host, medium: "referral", campaign: "" };
}

export function sendStat(type: StatType | string, where = "") {
  if (!ENDPOINT || typeof window === "undefined" || !TYPES.includes(type) || skip()) return;
  const payload = {
    type,
    path: window.location.pathname,
    ...source(),
    device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "phone" : "desktop",
    vid: visitorId(),
    where: where.slice(0, 120),
  };
  // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain;charset=utf-8" }))) return;
  } catch {
    /* fall through */
  }
  fetch(ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true, body }).catch(() => {});
}
