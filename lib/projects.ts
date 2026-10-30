/**
 * Named projects and locations from the sales list.
 * Pages exist only where `path` is set: /gaur-yamuna-city, /6-percent-plots, /ace-plots, /webcity-plots, /lodha-plots.
 * `heading`, `seoTitle` and `seoDescription` override the defaults on that project's page.
 */

export const enquiries = [
  {
    id: "gaur",
    name: "Gaur Yamuna City",
    label: "Plots in Gaur Yamuna City",
    short: "Gaur Yamuna City plots",
    path: "/gaur-yamuna-city",
    city: "Gaur Yamuna City",
    blurb: "Gaurs Group’s 250-acre township in Sector 19, YEIDA, opposite the F1 circuit on the Yamuna Expressway. Ask for sizes, the price list and the RERA papers.",
    heading: "Plots in Gaur Yamuna City, Yamuna Expressway",
    seoTitle: "Gaur Yamuna City Plots | Sector 19, YEIDA, Yamuna Expressway",
    seoDescription: "Plots in Gaur Yamuna City, Gaurs Group’s 250-acre township in Sector 19, YEIDA, opposite the F1 circuit. Price list, sizes and RERA papers on WhatsApp.",
  },
  {
    id: "six",
    name: "6% plots",
    label: "6% plots in Noida, Yamuna Expressway and Greater Noida",
    short: "6% plots",
    path: "/6-percent-plots",
    city: "",
    blurb: "Developed plots the authority gives back to farmers whose land it acquired, bought from the farmer and transferred to you. Share your budget and the sector you prefer.",
    heading: "6% plots in Greater Noida, Noida and the Yamuna Expressway",
    seoTitle: "6% Plots in Greater Noida & YEIDA | What They Are, How to Buy",
    note: "Investing Plots is an independent advisory. We help you buy from the farmer allottee and see the authority transfer through.",
    seoDescription: "What a 6% (abadi) plot is, why buyers like them, and the 7 papers to check before you buy one in Greater Noida, Noida or on the Yamuna Expressway.",
  },
  {
    id: "ace",
    name: "Ace Plots",
    label: "Ace Plots",
    short: "Ace Plots",
    path: "/ace-plots",
    city: "",
    blurb: "ACE Group’s plotted township ACE Estate in Sector 22D, YEIDA, on the Yamuna Expressway: plots of 150, 200, 300 and 500 sq yd. Sizes, price list and RERA papers on WhatsApp.",
    heading: "ACE Estate plots in Sector 22D, Yamuna Expressway",
    seoTitle: "ACE Estate Plots Sector 22D YEIDA | Ace Group Plots, Yamuna Expressway",
    seoDescription: "ACE Group’s plotted township in Sector 22D, YEIDA on the Yamuna Expressway. Plots of 150, 200, 300 and 500 sq yd. Get the price list, payment plan and RERA papers on WhatsApp.",
  },
  {
    id: "webcity",
    name: "Webcity Plots",
    label: "Webcity Plots",
    short: "Webcity Plots",
    path: "/webcity-plots",
    city: "",
    blurb: "Webcity Plots in Noida, on the Yamuna Expressway and in Greater Noida. Sizes, price list and documents on WhatsApp.",
  },
  {
    id: "lodha",
    name: "Lodha Group Plots",
    label: "Lodha Group Plots",
    short: "Lodha Group Plots",
    path: "/lodha-plots",
    city: "",
    blurb: "Lodha Group Plots in Noida, on the Yamuna Expressway and in Greater Noida. Sizes, price list and documents on WhatsApp.",
  },
] as const;

export type EnquiryId = (typeof enquiries)[number]["id"];

export type ProjectPage = Extract<(typeof enquiries)[number], { path: string }>;

export function findEnquiry(id: string | null | undefined) {
  return enquiries.find((item) => item.id === id);
}

export function projectPages(): ProjectPage[] {
  return enquiries.filter((item): item is ProjectPage => "path" in item);
}

export function enquiryWhatsappText(name: string) {
  return `Hello, I am looking at ${name}. Please share options, the price list and documents.`;
}
