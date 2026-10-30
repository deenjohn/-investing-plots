/**
 * Everything a non-developer may want to change lives in this file:
 * brand, phone / WhatsApp, plot types, budgets, cities, FAQs.
 */

export const brand = {
  name: "Investing Plots",
  mark: "IP",
  domain: "investingplots.com",
  tagline: "Plots and land for long-term investment in India",
};

/** Live address, no trailing slash. NEXT_PUBLIC_SITE_URL overrides it (a *.vercel.app value is ignored). */
export const SITE_URL = (() => {
  const env = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
  return /^https:\/\/(?!.*\.vercel\.app$)/.test(env) ? env : "https://www.investingplots.com";
})();

/** Sales numbers: digits only, country code included, no plus. "" hides the button. */
export const contact = {
  phone: "919015872848",
  whatsapp: "919015872848",
  email: "",
};

/** Your UP RERA agent registration number. Leave "" to hide. Google and Meta ad reviewers look for it. */
export const partner = { agentRera: "UPRERAAGT14805" };

/**
 * Business identity. Shown in the footer, /contact-us, /disclaimer, /privacy and the search data.
 * Must match Google Ads advertiser verification and GST records exactly.
 */
export const compliance = {
  /** Registered name of the firm. */
  legalName: "Shivam Property",
  /** Office address of the firm. */
  officeAddress:
    "1st Floor, Galaxy Blue Sapphire Plaza, above Chunmun, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201016",
  /** GSTIN, if registered. "" hides it. */
  gstin: "",
  /** Person who handles privacy requests (DPDP Act 2023). "" falls back to the firm name. */
  grievanceOfficer: "",
};

/** Date the site content last changed (YYYY-MM-DD). Used as <lastmod> in sitemap.xml — bump it when you edit copy. */
export const contentUpdated = "2026-10-30";

/** Full https profile URLs. "" hides the link. Also used as sameAs in search data. */
export const social = {
  instagram: "",
  youtube: "",
  facebook: "",
  linkedin: "",
};

/**
 * Cities / regions you sell in. Shown as chips and offered in the form.
 * Leave the array empty to hide the section — then the form asks for a city as free text.
 */
export const cities: string[] = ["Gaur Yamuna City", "Noida", "Yamuna Expressway", "Greater Noida"];

export const interests = [
  { id: "residential", label: "Residential plot", short: "residential plot" },
  { id: "commercial", label: "Commercial plot", short: "commercial plot" },
  { id: "industrial", label: "Industrial / warehousing land", short: "industrial or warehousing land" },
  { id: "farm", label: "Farm land", short: "farm land" },
  { id: "price-list", label: "Price list and options", short: "plot options and price list" },
  { id: "site-visit", label: "Site visit", short: "site visit" },
] as const;

export type InterestId = (typeof interests)[number]["id"];

export function findInterest(id: string | null | undefined) {
  return interests.find((item) => item.id === id);
}

export const budgets = [
  { id: "u10", label: "Under ₹10 lakh" },
  { id: "10-25", label: "₹10–25 lakh" },
  { id: "25-50", label: "₹25–50 lakh" },
  { id: "50-1cr", label: "₹50 lakh–1 crore" },
  { id: "1cr", label: "Above ₹1 crore" },
] as const;

export type BudgetId = (typeof budgets)[number]["id"];

export function findBudget(id: string | null | undefined) {
  return budgets.find((item) => item.id === id);
}

export const plotTypes = [
  {
    interest: "residential",
    title: "Residential plots",
    body: "Plots in approved residential layouts — build your home later, or hold the land for the long term.",
  },
  {
    interest: "commercial",
    title: "Commercial plots",
    body: "Plots on main roads and in commercial zones for shops, offices or showrooms.",
  },
  {
    interest: "industrial",
    title: "Industrial & warehousing",
    body: "Larger land parcels near highways, industrial estates and logistics corridors.",
  },
  {
    interest: "farm",
    title: "Farm land",
    body: "Agricultural land and farm plots. Rules on who can buy farm land differ by state — we check them first.",
  },
] as const satisfies ReadonlyArray<{ interest: InterestId; title: string; body: string }>;

export const reasons = [
  {
    title: "Land is limited",
    body: "Cities keep growing outward, but the land near new roads, airports and industrial zones does not increase.",
  },
  {
    title: "Little upkeep",
    body: "No tenants, no repairs, no society maintenance on an open plot — just fencing, taxes and the paperwork kept current.",
  },
  {
    title: "Your choice of use",
    body: "Hold it, build a home, build to rent, or sell. A plot keeps your options open in a way a flat does not.",
  },
  {
    title: "Entry at many budgets",
    body: "From small residential plots to large industrial parcels, there is a ticket size for most investors.",
  },
] as const;

export const steps = [
  { title: "Tell us your budget and city", body: "Message us on WhatsApp or fill the form. We shortlist plots that match your budget and purpose." },
  { title: "Get prices and documents", body: "Each option comes with a dated price list and the title, approval and RERA papers to check." },
  { title: "Visit, then decide", body: "We arrange a site visit so you see the plot, the access road and the surroundings yourself." },
] as const;

export const checks = [
  "Clear title, with the chain of ownership and the seller’s name on the land records",
  "Encumbrance certificate — no loan, lien or dispute on the land",
  "Land-use zoning that allows what you plan to build",
  "Non-agricultural (NA) conversion, where the land needs it",
  "Layout approved by the local development authority or town planning department",
  "RERA registration for plotted projects, checked on your state’s RERA portal",
  "A dated price list showing what is and is not included",
] as const;

export const faqs = [
  {
    q: "Is buying a plot a good investment?",
    a: "Land can be a good long-term holding when it has a clear title, legal approvals and real development around it — roads, jobs and housing. It is less liquid than shares or a fund, and prices can fall as well as rise. Buy only what you can hold for several years.",
  },
  {
    q: "How do I check if a plot is legal?",
    a: "Check the title chain and land records, get an encumbrance certificate, confirm the land-use zone and NA conversion, and ask for the approved layout. For a plotted project, search it on your state’s RERA portal and match the promoter and survey numbers. We share these documents for every option.",
  },
  {
    q: "Do plotted projects need RERA registration?",
    a: "Under the RERA Act, plotted developments above the size threshold set by the state (generally more than 500 sq. m or more than eight plots) must be registered before they are sold. Ask for the RERA number and verify it on the state portal.",
  },
  {
    q: "Can I get a home loan for a plot?",
    a: "Banks generally offer plot loans for land in approved residential layouts, usually for a lower share of the price than a home loan. Loans for open land with no plan to build, or for farm land, are harder to get. Check with your bank before you book.",
  },
  {
    q: "Can NRIs buy plots in India?",
    a: "NRIs can generally buy residential and commercial land in India, but not agricultural land, plantations or farmhouses. Ask us for the land category of each plot and confirm with your own advisor.",
  },
  {
    q: "What does it cost apart from the plot price?",
    a: "Expect stamp duty and registration (set by each state), legal fees, and sometimes development, club or maintenance charges. Ask for a price list that shows every charge before you pay a booking amount.",
  },
  {
    q: "Is any return guaranteed?",
    a: "No. No one can guarantee appreciation on land. Treat any projection as an estimate and decide on the documents and the price in front of you.",
  },
] as const;

/* ---------- helpers ---------- */

export function telHref() {
  return contact.phone ? `tel:+${contact.phone}` : "";
}

export function phoneDisplay() {
  const local = contact.phone.replace(/^91/, "");
  return local.length === 10 ? `+91 ${local.slice(0, 5)} ${local.slice(5)}` : contact.phone ? `+${contact.phone}` : "";
}

export function mailHref() {
  return contact.email ? `mailto:${contact.email}` : "";
}

export function whatsappHref(message: string) {
  return contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}` : "";
}

export const defaultWhatsappText = "Hello, I want to invest in a plot. Please share options and the price list.";

export function interestWhatsappText(interest: InterestId) {
  const item = findInterest(interest);
  return `Hello, I am looking for a ${item?.short ?? "plot"} for investment. Please share options and prices.`;
}

/** Strip non-digits, drop a leading 91 (12 digits) or 0 (11 digits). */
export function normalizeIndianMobile(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function isIndianMobile(digits: string) {
  return /^[6-9]\d{9}$/.test(digits);
}
