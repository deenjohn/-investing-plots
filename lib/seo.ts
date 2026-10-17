import { brand, contact, faqs, SITE_URL, social } from "./site";

export const title = "Investing Plots | Buy Plots & Land for Investment in India";
export const description =
  "Residential, commercial, industrial and farm plots for investment. Share your budget and city — get plots, price lists and documents on WhatsApp.";

export const keywords = [
  "plots for investment",
  "investment plots",
  "buy plot in India",
  "land investment India",
  "residential plots for sale",
  "commercial plots",
  "industrial land for sale",
  "farm land for sale",
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
        description: `${brand.name} helps buyers find residential, commercial, industrial and farm plots for long-term investment in India, with documents checked before purchase.`,
        ...(contact.phone ? { telephone: `+${contact.phone}` } : {}),
        ...(contact.email ? { email: contact.email } : {}),
        areaServed: { "@type": "Country", name: "India" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+${contact.phone}`,
          contactType: "sales",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
        knowsAbout: ["Plots for investment", "Land investment", "RERA plotted developments", "Land due diligence"],
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
