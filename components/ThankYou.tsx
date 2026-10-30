"use client";

import { useEffect, useState } from "react";
import { WaIcon } from "@/components/icons";
import { defaultWhatsappText, whatsappHref } from "@/lib/site";

type Thanks = { href?: string; name?: string; project?: string };

export function ThankYou() {
  const [thanks, setThanks] = useState<Thanks>({});

  useEffect(() => {
    // The form sits mid-page; start the thank-you page at the top so the message is the first thing seen.
    window.scrollTo(0, 0);
    try {
      const raw = sessionStorage.getItem("ip-thanks");
      if (raw) setThanks(JSON.parse(raw) as Thanks);
    } catch {
      /* ignore */
    }
  }, []);

  const href = thanks.href || whatsappHref(defaultWhatsappText);

  return (
    <div className="form-card thanks-card" role="status" aria-live="polite">
      <p className="form-kicker">Enquiry received</p>
      <h1 className="form-title">{thanks.name ? `Thank you, ${thanks.name}.` : "Thank you."}</h1>
      <p className="form-note">
        WhatsApp has opened with your details{thanks.project ? ` for ${thanks.project}` : ""}. Tap <strong>Send</strong>{" "}
        there and an advisor will reply with matching plots, the price list and the documents.
      </p>
      {href ? (
        <a className="btn btn-wa btn-block btn-lg" href={href} target="_blank" rel="noreferrer" data-where="thank-you">
          <WaIcon /> Open WhatsApp again
        </a>
      ) : null}
      <p className="form-note">
        <a className="text-link" href="/#projects">
          Browse other projects
        </a>
      </p>
    </div>
  );
}
