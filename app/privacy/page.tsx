import type { Metadata } from "next";
import { brand, contact, phoneDisplay } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy policy | ${brand.name}`,
  description: `How ${brand.name} uses the details you share on the enquiry form.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <main className="page">
      <div className="wrap narrow">
        <p>
          <a className="text-link" href="/">← {brand.name}</a>
        </p>
        <h1>Privacy policy</h1>
        <p>Last updated: October 2026</p>

        <h2>What we collect</h2>
        <ul>
          <li>Your name, mobile number, the plot type you choose and, if you add them, your budget and preferred city.</li>
          <li>The page and ad you came from (UTM tags and ad click IDs), so we know which ads work.</li>
          <li>Standard analytics and advertising cookies from Google and Meta, when they are switched on.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry by call, WhatsApp, SMS or email with plot options, prices and documents.</li>
          <li>To arrange a site visit you ask for.</li>
          <li>To measure our advertising. Google and Meta receive a hashed (unreadable) copy of your contact details only to match the enquiry to an ad.</li>
        </ul>
        <p>We do not sell your details. We share them only with the advisor or developer handling your enquiry.</p>

        <h2>Your choices</h2>
        <p>
          Reply STOP on WhatsApp or ask us at {phoneDisplay()}
          {contact.email ? ` or ${contact.email}` : ""} to stop messages or to delete your details. You can block
          cookies in your browser settings.
        </p>

        <h2>Not financial advice</h2>
        <p>
          Information on this website is general. Land prices can rise or fall and no return is guaranteed. Verify the
          documents and RERA details of any plot before you pay.
        </p>
      </div>
    </main>
  );
}
