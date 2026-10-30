import type { Metadata } from "next";
import { brand, compliance, contact, faqs, partner, SITE_URL, social } from "./site";

export const title = "Invest in Plots | Gaur Yamuna City, Noida & Yamuna Expressway";
export const description =
  "Plots in Gaur Yamuna City, and 6% plots in Noida, Yamuna Expressway and Greater Noida. Ace Plots, Webcity Plots and Lodha Group Plots — price list and documents on WhatsApp.";

export const keywords = [
  "plots in Gaur Yamuna City",
  "6% plots Noida",
  "6% plots Yamuna Expressway",
  "6% plots Greater Noida",
  "Ace Plots",
  "Webcity Plots",
  "Lodha Group Plots",
  "plots for investment",
  "Yamuna Expressway plots",
  "Greater Noida plots",
  "RERA approved plots",
  "plot price list",
];

export function sameAs() {
  return Object.values(social).filter((url) => /^https:\/\//.test(url));
}

export function jsonLd() {
  const links = sameAs();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: brand.name,
        alternateName: ["InvestingPlots", brand.domain],
        url: `${SITE_URL}/`,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      {
        "@type": "RealEstateAgent",
        "@id": `${SITE_URL}/#org`,
        name: brand.name,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        image: `${SITE_URL}/og.jpg`,
        description: `${brand.name} helps buyers find residential, commercial, industrial and farm plots for long-term investment in Noida, Greater Noida and on the Yamuna Expressway, with documents checked before purchase.`,
        ...(compliance.legalName ? { legalName: compliance.legalName } : {}),
        ...(compliance.officeAddress ? { address: officeAddress() } : {}),
        ...(partner.agentRera ? { identifier: { "@type": "PropertyValue", propertyID: "UP RERA agent registration", value: partner.agentRera } } : {}),
        ...(contact.phone ? { telephone: `+${contact.phone}` } : {}),
        ...(contact.email ? { email: contact.email } : {}),
        areaServed: [
          { "@type": "City", name: "Noida" },
          { "@type": "City", name: "Greater Noida" },
          { "@type": "Place", name: "Yamuna Expressway (YEIDA)" },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+${contact.phone}`,
          contactType: "sales",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
        knowsAbout: [
          "Plots for investment",
          "6% plots",
          "Gaur Yamuna City plots",
          "Yamuna Expressway plots",
          "Greater Noida plots",
          "RERA plotted developments",
          "Land due diligence",
        ],
        ...(links.length ? { sameAs: links } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: title,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: `${SITE_URL}/og.jpg`,
        inLanguage: "en-IN",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Firm office address for the RealEstateAgent schema, from compliance.officeAddress. */
function officeAddress() {
  const pin = compliance.officeAddress.match(/\b(\d{6})\b/)?.[1];
  const street = compliance.officeAddress.split(", Greater Noida")[0];
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    ...(pin ? { postalCode: pin } : {}),
    addressCountry: "IN",
  };
}

const OG_IMAGE = { url: "/og.jpg", width: 1200, height: 630, alt: "Investing Plots — plots and land for investment in India" };

/**
 * Full metadata for one page. Next replaces (does not merge) openGraph and twitter from the root layout,
 * so every page must send the whole set, or its share card loses the image, site name and locale.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: brand.name,
      locale: "en_IN",
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Structured data script. Escapes "<" so the JSON cannot close the script tag. */
export function ldJson(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
