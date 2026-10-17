/**
 * Ad / analytics IDs. All optional; leave blank until the accounts exist.
 *  - Google Analytics 4:          NEXT_PUBLIC_GA_ID               G-XXXXXXX
 *  - Google Ads (Search + YouTube): NEXT_PUBLIC_GOOGLE_ADS_SEND_TO AW-123456789/AbCdEf  (lead conversion label)
 *  - Meta (Instagram + Facebook):  NEXT_PUBLIC_META_PIXEL_ID      1234567890
 */
export const GA_ID = match(process.env.NEXT_PUBLIC_GA_ID, /^G-[A-Z0-9]+$/);
export const ADS_SEND_TO = match(process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO, /^AW-\d+\/[\w-]+$/);
export const ADS_ID = ADS_SEND_TO ? ADS_SEND_TO.split("/")[0] : "";
export const PIXEL_ID = match(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{6,20}$/);

function match(value: string | undefined, pattern: RegExp) {
  return typeof value === "string" && pattern.test(value.trim()) ? value.trim() : "";
}

const CAMPAIGN_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "gclid", "gbraid", "wbraid", "gad_source", "fbclid", "igshid", "ttclid",
];

/**
 * Inline <head> script. Creates the gtag / fbq queues at once (so early events are kept),
 * remembers UTM / click IDs for the lead, counts every tel: and wa.me tap, and loads the
 * vendor scripts only after the page has loaded and the browser is idle — no hit on LCP / INP.
 */
export function bootScript() {
  const tag = GA_ID || ADS_ID;
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;",
    tag ? "gtag('js',new Date());" : "",
    GA_ID ? `gtag('config','${GA_ID}');` : "",
    ADS_ID ? `gtag('config','${ADS_ID}',{allow_enhanced_conversions:true});` : "",
    PIXEL_ID
      ? `!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);fbq('init','${PIXEL_ID}');fbq('track','PageView');`
      : "",
    // Campaign memory (first touch in this tab wins per key, later keys are added).
    `(function(){try{var p=new URLSearchParams(location.search),k=${JSON.stringify(CAMPAIGN_KEYS)},o=JSON.parse(sessionStorage.getItem('ip-campaign')||'{}'),c=0;k.forEach(function(x){var v=p.get(x);if(v&&!o[x]){o[x]=v.slice(0,180);c++}});if(c)sessionStorage.setItem('ip-campaign',JSON.stringify(o))}catch(e){}})();`,
    // Contact taps: one listener for every call / WhatsApp link, now and later.
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'',w=a.getAttribute('data-where')||'page',c=h.indexOf('tel:')===0?'call':/^https:\\/\\/(wa\\.me|api\\.whatsapp\\.com)\\//.test(h)?'whatsapp':'';if(!c)return;dataLayer.push({event:'contact_'+c,link_location:w});gtag('event','contact_'+c,{method:c,link_location:w});window.fbq&&fbq('track','Contact',{content_name:c})},true);",
    // Vendor scripts after load + idle.
    "(function(){function add(u){var s=document.createElement('script');s.async=1;s.src=u;document.head.appendChild(s)}function go(){",
    tag ? `add('https://www.googletagmanager.com/gtag/js?id=${tag}');` : "",
    PIXEL_ID ? "add('https://connect.facebook.net/en_US/fbevents.js');" : "",
    "}function idle(){(window.requestIdleCallback||function(c){setTimeout(c,1500)})(go,{timeout:4000})}if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true})})();",
  ].join("");
}

export function readCampaign(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem("ip-campaign");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Lead conversion for GA4, Google Ads (with enhanced conversions) and Meta (deduplicated with CAPI by eventId). */
export function trackLead(lead: { interest: string; email?: string; phone: string; eventId: string }) {
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "generate_lead", interest: lead.interest });
  w.gtag?.("set", "user_data", {
    ...(lead.email ? { email: lead.email.trim().toLowerCase() } : {}),
    phone_number: `+91${lead.phone}`,
  });
  w.gtag?.("event", "generate_lead", { currency: "INR", value: 1, item_name: lead.interest });
  if (ADS_SEND_TO) w.gtag?.("event", "conversion", { send_to: ADS_SEND_TO, currency: "INR", value: 1, transaction_id: lead.eventId });
  w.fbq?.("track", "Lead", { content_name: lead.interest, currency: "INR", value: 1 }, { eventID: lead.eventId });
}

type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};
