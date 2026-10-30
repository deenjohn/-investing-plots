import type { MetadataRoute } from "next";
import { projectPages } from "@/lib/projects";
import { contentUpdated, SITE_URL } from "@/lib/site";

/**
 * <lastmod> is the date in lib/site.ts (contentUpdated), not the build time: Google only trusts
 * lastmod when it changes with the content. /thank-you is left out (noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${contentUpdated}T00:00:00+05:30`);
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/og.jpg`],
    },
    ...projectPages().map((project) => ({
      url: `${SITE_URL}${project.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/contact-us`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
