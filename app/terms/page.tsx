import { SiteChrome } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { brand, compliance, partner } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Terms & conditions | ${brand.name}`,
  description: `Terms for using ${brand.domain}, run by ${compliance.legalName}, a UP RERA registered real-estate agent.`,
  path: "/terms",
});

export default function Terms() {
  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/contact-us", label: "Contact" }]}>
      <main id="main" className="page">
        <div className="wrap narrow">
          <h1>Terms &amp; conditions</h1>
          <p>Last updated: October 2026</p>
          <h2>Who runs this site</h2>
          <p>
            {brand.domain} is run by {compliance.legalName}
            {partner.agentRera ? ` (UP RERA agent ${partner.agentRera})` : ""}, {compliance.officeAddress}.
          </p>
          <h2>Information only</h2>
          <p>
            Everything on this site is general information to help you shortlist plots. Sizes, prices, approvals and
            availability come from developers, authorities and sellers, can change without notice, and must be confirmed
            in writing before you pay. Images and illustrations are representative.
          </p>
          <h2>No offer and no guarantee</h2>
          <p>
            Nothing here is an offer to sell, a booking or financial advice. No return or price rise is promised.
            Every purchase is governed only by the agreement you sign with the developer or seller.
          </p>
          <h2>Payments</h2>
          <p>
            We never collect plot payments through this website. Pay only the developer or seller, by banking channels,
            against a receipt, after you have checked the documents.
          </p>
          <h2>Your enquiry</h2>
          <p>
            When you send the form or message us, you agree to be contacted about plots by call, WhatsApp and SMS, even if
            your number is on the DND register. See the <a className="text-link" href="/privacy">privacy policy</a>.
          </p>
          <h2>Law</h2>
          <p>These terms are governed by the laws of India; courts at Gautam Buddh Nagar, Uttar Pradesh have jurisdiction.</p>
        </div>
      </main>
    </SiteChrome>
  );
}
