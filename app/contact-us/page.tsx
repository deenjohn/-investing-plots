import { LeadForm } from "@/components/LeadForm";
import { MapEmbed } from "@/components/MapEmbed";
import { SiteChrome } from "@/components/SiteChrome";
import { PhoneIcon, WaIcon } from "@/components/icons";
import { breadcrumb, ldJson, pageMetadata } from "@/lib/seo";
import {
  brand,
  compliance,
  contact,
  defaultWhatsappText,
  mailHref,
  partner,
  phoneDisplay,
  SITE_URL,
  telHref,
  whatsappHref,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: `Contact us | ${brand.name}`,
  description: `Call or WhatsApp ${brand.name} (${compliance.legalName}, UP RERA agent ${partner.agentRera}) for plots in Gaur Yamuna City, 6% plots and plots on the Yamuna Expressway, Noida and Greater Noida.`,
  path: "/contact-us",
});

export default function ContactUs() {
  const call = telHref();
  const mail = mailHref();
  const wa = whatsappHref(defaultWhatsappText);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact-us#webpage`,
    url: `${SITE_URL}/contact-us`,
    name: `Contact ${brand.name}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#org` },
    inLanguage: "en-IN",
  };

  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/#faq", label: "FAQ" }, { href: "#enquire", label: "Enquire" }]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumb([{ name: "Contact us", path: "/contact-us" }]))} />
      <main id="main">
        <section className="hero" id="enquire" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Contact</p>
              <h1 id="hero-title">Talk to {brand.name}</h1>
              <p className="lede">
                Call, WhatsApp or send the form. An advisor replies with plot options, the dated price list and the
                documents, and arranges a site visit if you want one.
              </p>
              <div className="hero-actions">
                {wa ? (
                  <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where="contact-page">
                    <WaIcon /> WhatsApp us
                  </a>
                ) : null}
                {call ? (
                  <a className="btn btn-ghost btn-lg" href={call} data-where="contact-page">
                    <PhoneIcon /> Call {phoneDisplay()}
                  </a>
                ) : null}
              </div>
            </div>
            <LeadForm />
          </div>
        </section>

        <section className="section" aria-labelledby="about-title">
          <div className="wrap narrow page-copy">
            <h2 id="about-title">About us</h2>
            <p>
              {brand.name} ({brand.domain}) is run by {compliance.legalName}, a real-estate advisory and channel partner
              registered with UP RERA{partner.agentRera ? ` as agent no. ${partner.agentRera}` : ""}. We help buyers
              shortlist and buy plots in Noida, Greater Noida and on the Yamuna Expressway: Gaur Yamuna City, 6% plots
              and plotted projects from listed developers. We are not a developer or a government authority.
            </p>
            <h2>Details</h2>
            <ul>
              <li>Business name: {compliance.legalName}</li>
              {partner.agentRera ? <li>UP RERA agent registration: {partner.agentRera}</li> : null}
              {compliance.gstin ? <li>GSTIN: {compliance.gstin}</li> : null}
              <li>Office: {compliance.officeAddress}</li>
              {call ? (
                <li>
                  Phone and WhatsApp:{" "}
                  <a href={call} data-where="contact-details">
                    {phoneDisplay()}
                  </a>
                </li>
              ) : null}
              {mail ? (
                <li>
                  Email:{" "}
                  <a href={mail} data-where="contact-details">
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
            <MapEmbed query={compliance.officeAddress} title={`Map of the ${compliance.legalName} office`} />
            <p className="fine">
              How we use your details: <a href="/privacy">privacy policy</a>. Site terms: <a href="/terms">terms</a>.
              Check any RERA number on the <a href="https://www.up-rera.in/" target="_blank" rel="noreferrer">UP RERA portal</a>.
            </p>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
