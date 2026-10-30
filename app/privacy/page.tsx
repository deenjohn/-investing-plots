import { SiteChrome } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { brand, compliance, contact, phoneDisplay } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Privacy policy | ${brand.name}`,
  description: `How ${brand.name} (${compliance.legalName}) uses the details you share on the enquiry form, and your rights under India's DPDP Act.`,
  path: "/privacy",
});

export default function Privacy() {
  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/contact-us", label: "Contact" }]}>
      <main id="main" className="page">
        <div className="wrap narrow">
          <h1>Privacy policy</h1>
          <p>Last updated: October 2026</p>
          <p>
            {brand.domain} is run by {compliance.legalName}, {compliance.officeAddress} (“we”). This policy explains what
            we collect and why, under the Digital Personal Data Protection Act, 2023.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>Your name, mobile number, the plot type you choose and, if you add them, your project, budget and preferred city.</li>
            <li>The page and ad you came from (UTM tags and ad click IDs such as gclid or fbclid), so we know which ads work.</li>
            <li>
              Analytics and advertising cookies from Google (Analytics, Ads, Tag Manager), Meta and Microsoft Clarity, when
              they are switched on, and cookie-free visit counts from Vercel Analytics. Clarity records how pages are used
              (clicks and scrolling) with form fields masked.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To reply to your enquiry by call, WhatsApp, SMS or email with plot options, prices and documents.</li>
            <li>To arrange a site visit you ask for.</li>
            <li>
              To measure our advertising. Google and Meta receive a hashed (unreadable) copy of your contact details only to
              match the enquiry to an ad.
            </li>
          </ul>
          <p>
            We use your details on the basis of the consent you give when you send the form. We do not sell them. We share
            them only with the advisor or developer handling your enquiry, and with the service providers above. We keep
            enquiries for as long as needed to serve you and meet legal duties, and delete them on request.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask to see, correct or delete your details, withdraw consent, or stop calls and messages. Reply STOP on
            WhatsApp, or contact {compliance.grievanceOfficer || `the grievance officer at ${compliance.legalName}`} at{" "}
            {phoneDisplay()}
            {contact.email ? ` or ${contact.email}` : ""}. You can also block cookies in
            your browser settings.
          </p>

          <h2>Not financial advice</h2>
          <p>
            Information on this website is general. Land prices can rise or fall and no return is guaranteed. Verify the
            documents and RERA details of any plot before you pay.
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
