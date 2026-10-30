/**
 * Ad / analytics IDs. All optional; leave blank until the accounts exist. Set them in Vercel → Settings → Environment Variables.
 *  - Google Analytics 4:              NEXT_PUBLIC_GA_ID                         G-XXXXXXX
 *  - Google Ads lead conversion:      NEXT_PUBLIC_GOOGLE_ADS_SEND_TO            AW-123456789/AbCdEf   (primary: form sent)
 *  - Google Ads contact conversion:   NEXT_PUBLIC_GOOGLE_ADS_CONTACT_SEND_TO    AW-123456789/XyZ123   (secondary: WhatsApp / call tap)
 *  - Google Tag Manager:              NEXT_PUBLIC_GTM_ID                        GTM-XXXXXXX
 *  - Meta (Instagram + Facebook):     NEXT_PUBLIC_META_PIXEL_ID                 1234567890
 *  - Microsoft Clarity:               NEXT_PUBLIC_CLARITY_ID                    abcd123xyz
 */
/** Google Analytics 4 for investingplots.com. NEXT_PUBLIC_GA_ID overrides it; set it to "off" to turn GA off. */
const GA_DEFAULT = "G-BJ67W1E8CX";
export const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID === "off" ? "" : match(process.env.NEXT_PUBLIC_GA_ID || GA_DEFAULT, /^G-[A-Z0-9]+$/);
export const ADS_SEND_TO = match(process.env.NEXT_PUBLIC_GOOGLE_ADS_SEND_TO, /^AW-\d+\/[\w-]+$/);
export const ADS_CONTACT_SEND_TO = match(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_SEND_TO, /^AW-\d+\/[\w-]+$/);
export const ADS_ID = (ADS_SEND_TO || ADS_CONTACT_SEND_TO).split("/")[0];
export const GTM_ID = match(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]+$/);
export const PIXEL_ID = match(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{6,20}$/);
export const CLARITY_ID = match(process.env.NEXT_PUBLIC_CLARITY_ID, /^[a-z0-9]{6,20}$/);

function match(value: string | undefined, pattern: RegExp) {
  return typeof value === "string" && pattern.test(value.trim()) ? value.trim() : "";
}

const CAMPAIGN_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "gclid", "gbraid", "wbraid", "gad_source", "gad_campaignid", "fbclid", "igshid", "ttclid", "msclkid",
];

/** Google's standard GTM loader. Starts at once (async) so every visit is counted. */
export function gtmScript() {
  return GTM_ID
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
    : "";
}

/**
 * Inline <head> script. Creates the gtag / fbq / clarity queues at once (so early events are kept),
 * remembers UTM / click IDs for the lead, counts every tel:, wa.me and mailto: tap, and loads the
 * vendor scripts only after the page has loaded and the browser is idle — no hit on LCP / INP.
 */
export function bootScript() {
  const tag = GA_ID || ADS_ID;
  const contactConversion = ADS_CONTACT_SEND_TO
    ? `if(c!=='email')gtag('event','conversion',{send_to:'${ADS_CONTACT_SEND_TO}'});`
    : "";
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;",
    tag ? "gtag('js',new Date());" : "",
    GA_ID ? `gtag('config','${GA_ID}');` : "",
    ADS_ID ? `gtag('config','${ADS_ID}',{allow_enhanced_conversions:true});` : "",
    PIXEL_ID
      ? `!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window);fbq('init','${PIXEL_ID}');fbq('track','PageView');`
      : "",
    CLARITY_ID ? "window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};" : "",
    // Campaign memory (first touch in this tab wins per key, later keys are added).
    `(function(){try{var p=new URLSearchParams(location.search),k=${JSON.stringify(CAMPAIGN_KEYS)},o=JSON.parse(sessionStorage.getItem('ip-campaign')||'{}'),c=0;k.forEach(function(x){var v=p.get(x);if(v&&!o[x]){o[x]=v.slice(0,180);c++}});if(!o.landing){o.landing=location.pathname.slice(0,120);c++}if(c)sessionStorage.setItem('ip-campaign',JSON.stringify(o))}catch(e){}})();`,
    // Contact taps: one listener for every call / WhatsApp / email link, now and later.
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'',w=a.getAttribute('data-where')||location.pathname,c=h.indexOf('tel:')===0?'call':/^https:\\/\\/(wa\\.me|api\\.whatsapp\\.com)\\//.test(h)?'whatsapp':h.indexOf('mailto:')===0?'email':'';if(!c)return;dataLayer.push({event:'contact_'+c,link_location:w});gtag('event','contact_'+c,{method:c,link_location:w});" +
      contactConversion +
      "window.fbq&&fbq('track','Contact',{content_name:c});window.ipStat&&ipStat(c,w)},true);",
    // Vendor scripts after load + idle.
    "(function(){function add(u){var s=document.createElement('script');s.async=1;s.src=u;document.head.appendChild(s)}function go(){",
    tag ? `add('https://www.googletagmanager.com/gtag/js?id=${tag}');` : "",
    PIXEL_ID ? "add('https://connect.facebook.net/en_US/fbevents.js');" : "",
    CLARITY_ID ? `add('https://www.clarity.ms/tag/${CLARITY_ID}');` : "",
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

/**
 * Lead conversion for GA4, Google Ads (with enhanced conversions), GTM (dataLayer `generate_lead`),
 * Meta (deduplicated with CAPI by eventId) and Clarity. Fired once, in the same page, before the
 * visitor is moved to /thank-you — so nothing is lost to a page unload.
 */
export function trackLead(lead: { interest: string; project?: string; email?: string; phone: string; eventId: string }) {
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "generate_lead",
    interest: lead.interest,
    project: lead.project || "",
    lead_id: lead.eventId,
    // For GTM enhanced-conversion variables. Google hashes these before they leave the browser.
    user_data: { phone_number: `+91${lead.phone}`, ...(lead.email ? { email: lead.email.trim().toLowerCase() } : {}) },
  });
  w.gtag?.("set", "user_data", {
    ...(lead.email ? { email: lead.email.trim().toLowerCase() } : {}),
    phone_number: `+91${lead.phone}`,
  });
  w.gtag?.("event", "generate_lead", { currency: "INR", value: 1, item_name: lead.project || lead.interest });
  if (ADS_SEND_TO) w.gtag?.("event", "conversion", { send_to: ADS_SEND_TO, currency: "INR", value: 1, transaction_id: lead.eventId });
  w.fbq?.("track", "Lead", { content_name: lead.project || lead.interest, currency: "INR", value: 1 }, { eventID: lead.eventId });
  w.clarity?.("event", "lead");
  w.ipStat?.("lead", lead.project || lead.interest);
}

export type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
  ipStat?: (type: string, where?: string) => void;
};
