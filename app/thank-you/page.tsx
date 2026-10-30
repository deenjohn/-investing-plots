import { SiteChrome } from "@/components/SiteChrome";
import { ThankYou } from "@/components/ThankYou";
import { pageMetadata } from "@/lib/seo";

// Not for search. Google Ads can use this URL as a "page load" goal, but the form already fires the
// lead conversion — use one or the other, not both, or every lead counts twice.
export const metadata = pageMetadata({
  title: "Enquiry received | Investing Plots",
  description: "Your plot enquiry has been received. An advisor will reply on WhatsApp.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <SiteChrome nav={[{ href: "/#projects", label: "Projects" }, { href: "/#faq", label: "FAQ" }]}>
      <main id="main" className="page">
        <div className="wrap narrow">
          <ThankYou />
        </div>
      </main>
    </SiteChrome>
  );
}
