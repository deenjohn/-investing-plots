import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found | ${brand.name}`,
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/contact-us", label: "Contact" }]}>
      <main id="main" className="page">
        <div className="wrap narrow">
          <h1>Page not found</h1>
          <p>This page does not exist. See the plots we can help with, or send your budget on WhatsApp.</p>
          <p>
            <a className="btn btn-primary" href="/#projects">
              See projects
            </a>
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
