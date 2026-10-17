import type { MetadataRoute } from "next";
import { brand } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: "InvestingPlots",
    description: brand.tagline,
    start_url: "/?utm_source=homescreen",
    display: "standalone",
    background_color: "#0d2340",
    theme_color: "#0d2340",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
