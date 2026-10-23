/**
 * Named projects and locations from the sales list.
 * Pages exist only where `path` is set: /ace-plots, /webcity-plots, /lodha-plots.
 */

export const enquiries = [
  {
    id: "gaur",
    name: "Gaur Yamuna City",
    label: "Plots in Gaur Yamuna City",
    short: "Gaur Yamuna City plots",
    city: "Gaur Yamuna City",
    blurb: "Plots in Gaur Yamuna City. Ask for sizes, the current price list and the papers.",
  },
  {
    id: "six",
    name: "6% plots",
    label: "6% plots in Noida, Yamuna Expressway and Greater Noida",
    short: "6% plots",
    city: "",
    blurb: "6% plots in Noida, along the Yamuna Expressway and in Greater Noida. Share your budget and the area you prefer.",
  },
  {
    id: "ace",
    name: "Ace Plots",
    label: "Ace Plots",
    short: "Ace Plots",
    path: "/ace-plots",
    city: "",
    blurb: "Ace Plots in Noida, on the Yamuna Expressway and in Greater Noida. Sizes, price list and documents on WhatsApp.",
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
