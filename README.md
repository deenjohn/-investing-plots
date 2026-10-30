# Investing Plots — investingplots.com

One-page lead site for plot / land investment. Next.js 16 (App Router), statically prerendered,
WhatsApp-first enquiry, Google + Meta ad tracking.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy: push to GitHub → import in Vercel → add `investingplots.com` and `www.investingplots.com`
in Project → Domains (redirect the apex to www). Node 20.9+.

## Edit content

Everything editable is in **`lib/site.ts`**: phone / WhatsApp number, plot types, budgets, `cities`
(empty = hidden, form asks for free text), FAQs, RERA agent number, social links.

## How a lead flows

1. Visitor fills name, mobile, plot type (+ optional project, budget, city) and taps **Send on WhatsApp**.
2. WhatsApp opens with the details pre-typed, plus `Ref: google / campaign-name` so sales sees the ad source.
3. Conversions fire in the same page: GA4 `generate_lead`, Google Ads conversion (enhanced conversions with the
   phone number, hashed by Google), dataLayer `generate_lead` for GTM, Meta `Lead` (de-duplicated with CAPI by
   event ID), Clarity `lead` and the daily-report `lead` row.
4. The visitor moves to **`/thank-you`** (noindex) with an "Open WhatsApp again" button, in case WhatsApp did not open.
5. In parallel `POST /api/lead` forwards the lead (with UTM / gclid / gbraid / fbclid) to `LEAD_WEBHOOK` and to
   Meta Conversions API when configured.
6. Every tap on a call, WhatsApp or email link fires `contact_call` / `contact_whatsapp` / `contact_email`
   (GA4, dataLayer, Meta `Contact`, the daily report and, if set, the Google Ads contact conversion).

Without `LEAD_WEBHOOK` the lead only reaches you if the visitor taps Send in WhatsApp — set it before ads go live.

## Business details (ad compliance)

`compliance` and `partner` in `lib/site.ts`: firm name (Shivam Property), office address, UP RERA agent number,
GSTIN, grievance officer. They appear in the footer, `/contact-us`, `/terms`, `/disclaimer`, `/privacy` and the
RealEstateAgent search data. Keep them identical to your Google Ads advertiser verification and Google Business Profile.

## Ads

| Platform | Set | Use as conversion |
|---|---|---|
| Google Search + YouTube + PMax | `NEXT_PUBLIC_GOOGLE_ADS_SEND_TO=AW-xxx/label` | lead (primary). Turn on **Enhanced conversions for leads** on this action |
| Google, WhatsApp / call taps | `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_SEND_TO=AW-xxx/label2` (or import `contact_whatsapp` / `contact_call` from GA4) | secondary, so bidding is not trained on taps |
| Google Tag Manager | `NEXT_PUBLIC_GTM_ID=GTM-xxx` | optional; listen for the `generate_lead` and `contact_*` dataLayer events |
| Instagram + Facebook | `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | `Lead`, `Contact` |
| Analytics | `NEXT_PUBLIC_GA_ID=G-xxx`; mark `generate_lead` as a key event | — |
| Recordings | `NEXT_PUBLIC_CLARITY_ID` | — |

Pick **one** way to count the lead in Google Ads: the site tag above, *or* a GTM tag, *or* a "page load" goal on
`/thank-you`. Two of them counts every lead twice.

Landing URLs — the form pre-selects from the link, and the form headline changes to match:

| Ad | URL |
|---|---|
| Google Search, Gaur Yamuna City | `/gaur-yamuna-city?utm_source=google&utm_medium=cpc&utm_campaign=gaur-yamuna-city&utm_term={keyword}` |
| Google Search, 6% plots | `/6-percent-plots?utm_source=google&utm_medium=cpc&utm_campaign=6-percent-plots&utm_term={keyword}` |
| Google Search, residential | `/?interest=residential&utm_source=google&utm_medium=cpc&utm_campaign=residential-plots` |
| Google Search, commercial | `/?interest=commercial&utm_source=google&utm_medium=cpc&utm_campaign=commercial-plots` |
| Instagram, budget plots | `/?interest=residential&budget=10-25&utm_source=instagram&utm_medium=paid_social&utm_campaign=budget-plots&utm_content={{ad.name}}` |
| YouTube, farm land | `/?interest=farm&utm_source=youtube&utm_medium=video&utm_campaign=farm-land` |
| Any, with a city / project | add `&city=Greater%20Noida` or `&project=gaur` (ids: `gaur`, `six`, `ace`, `webcity`, `lodha`) |

Interest ids: `residential`, `commercial`, `industrial`, `farm`, `price-list`, `site-visit`.
Budget ids: `u10`, `10-25`, `25-50`, `50-1cr`, `1cr`.

Google auto-tagging (`gclid`, `gbraid`, `wbraid`) and Meta `fbclid` are captured and stored on every lead in the
sheet, so offline conversions (site visit, booking) can be uploaded to Google Ads later. `/whatsapp` redirects to
the form — handy for an Instagram bio link.

**Ad policy notes (India real estate):** no guaranteed-return claims (footer, `/disclaimer`, FAQ); business name,
address and UP RERA agent number on every page; `/privacy`, `/terms`, `/disclaimer` and `/contact-us` linked from
the footer; Google requires advertiser verification for real-estate ads.

## Daily email report

Every morning at 8 AM IST: visitors, page views, WhatsApp and call taps, enquiries (with name and mobile), sources
and top pages. Data sits in a Google Sheet you own.

1. Create a Google Sheet, e.g. "investingplots stats". Extensions → Apps Script, paste all of `tools/daily-report.gs`,
   save. Change `REPORT_TO` if needed.
2. Run `setup` once and allow the permissions.
3. Deploy → New deployment → **Web app**, execute as **Me**, access **Anyone**. Copy the `/exec` URL.
4. In Vercel set both `NEXT_PUBLIC_STATS_WEBHOOK` and `LEAD_WEBHOOK` to that URL, then redeploy.
5. Open the live site once with `?internal=1` on each of your own devices so your visits are not counted.

## SEO

- Every page uses `pageMetadata()` in `lib/seo.ts`: title, description, canonical, full Open Graph + X card (Next does
  not merge these from the layout, so a page without them loses its share image).
- JSON-LD: WebSite, RealEstateAgent (legal name, address, RERA, areas served), WebPage, FAQPage, BreadcrumbList,
  ContactPage.
- `robots.txt`, `sitemap.xml` (lastmod = `contentUpdated` in `lib/site.ts` — bump it when you change copy), web
  manifest and icons are generated by Next. `/thank-you` is noindex and kept out of the sitemap.
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, deploy, verify in Search Console, submit `/sitemap.xml`.
- Google Business Profile with the same name, address and phone helps local "plots near me" searches.
- Vercel Web Analytics and Speed Insights are mounted; switch them on in the Vercel project.

## Speed

Lighthouse on the production build: desktop 100/100/100/100, mobile 96 performance and 100 for
accessibility, best practices and SEO. CLS 0. Why it is fast:

- Static HTML, CSS inlined (`experimental.inlineCss`) — no render-blocking requests.
- One self-hosted variable font, preloaded, `display: optional` (no late re-paint).
- No photos: the hero is a CSS pattern and the illustration is inline SVG.
- Only the form is a client component. Sticky bar, FAQ (`<details>`) and tracking listeners need no React.
- Google / Meta scripts load after `load` + idle; their queues exist from the first byte so nothing is lost.
- Modern `browserslist` — no legacy polyfills.
