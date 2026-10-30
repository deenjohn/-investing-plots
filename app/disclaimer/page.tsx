import { SiteChrome } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { brand, compliance, partner } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Disclaimer | ${brand.name}`,
  description: `${brand.name} is an independent real-estate advisory run by ${compliance.legalName}. Not a developer's or authority's official website.`,
  path: "/disclaimer",
});

export default function Disclaimer() {
  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/contact-us", label: "Contact" }]}>
      <main id="main" className="page">
        <div className="wrap narrow">
          <h1>Disclaimer</h1>
          <p>
            This website is operated by {compliance.legalName}
            {partner.agentRera ? `, UP RERA agent registration no. ${partner.agentRera}` : ""}, an independent real-estate
            advisory and channel partner. It is not the official website of any developer whose project is named here, or of
            the Noida, Greater Noida or Yamuna Expressway (YEIDA) authorities. Project and brand names are used only to identify the plots we can help you with.
          </p>
          <p>
            Content, images, layouts, sizes and prices are for information only and may change without notice. They are
            not an offer or a contract. This site is meant to collect your enquiry, not to sell. Land prices can go down as
            well as up and no return is guaranteed.
          </p>
          <p>
            Before you pay, verify the title, approvals and RERA registration of any plot yourself, including on the{" "}
            <a className="text-link" href="https://www.up-rera.in/" target="_blank" rel="noreferrer">
              UP RERA portal
            </a>
            .
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
