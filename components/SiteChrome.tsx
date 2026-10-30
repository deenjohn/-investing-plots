import type { ReactNode } from "react";
import { PhoneIcon, WaIcon } from "@/components/icons";
import { projectPages } from "@/lib/projects";
import { brand, compliance, defaultWhatsappText, partner, phoneDisplay, social, telHref, whatsappHref } from "@/lib/site";

export function SiteChrome({
  nav,
  children,
}: {
  nav: readonly { href: string; label: string }[];
  children: ReactNode;
}) {
  const wa = whatsappHref(defaultWhatsappText);
  const tel = telHref();
  const socialLinks = Object.entries(social).filter(([, url]) => /^https:\/\//.test(url));
  const pages = projectPages();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="wrap header-row">
          <a className="logo" href="/">
            <span className="logo-mark" aria-hidden="true">
              {brand.mark}
            </span>
            <span className="logo-text">
              Investing<b>Plots</b>
            </span>
          </a>
          <nav className="nav" aria-label="Sections">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-cta">
            {wa ? (
              <a className="btn btn-wa btn-sm" href={wa} target="_blank" rel="noreferrer" data-where="header">
                <WaIcon /> <span>WhatsApp</span>
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <p className="logo-text logo-light">
              Investing<b>Plots</b>
            </p>
            <p>{brand.tagline}.</p>
            <p>
              Run by {compliance.legalName}
              {partner.agentRera ? ` · UP RERA agent reg. no. ${partner.agentRera}` : ""}
            </p>
            <p>{compliance.officeAddress}</p>
            {tel ? (
              <p>
                Call / WhatsApp{" "}
                <a href={tel} data-where="footer">
                  {phoneDisplay()}
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <p className="foot-h">Projects</p>
            {pages.map((project) => (
              <p key={project.id}>
                <a href={project.path}>{project.name}</a>
              </p>
            ))}
          </div>
          <div>
            <p className="foot-h">Links</p>
            {wa ? (
              <p>
                <a href={wa} target="_blank" rel="noreferrer" data-where="footer">
                  WhatsApp
                </a>
              </p>
            ) : null}
            <p>
              <a href="/#plots">Plot types</a>
            </p>
            <p>
              <a href="/#faq">FAQ</a>
            </p>
            <p>
              <a href="/contact-us">Contact us</a>
            </p>
            {socialLinks.map(([key, url]) => (
              <p key={key}>
                <a href={url} target="_blank" rel="noreferrer me">
                  {key[0].toUpperCase() + key.slice(1)}
                </a>
              </p>
            ))}
          </div>
        </div>
        <div className="wrap disclaimer">
          <p>
            {brand.name} is an independent real-estate advisory and channel partner, not a developer or a government
            body. Information on this site is general and not financial advice. Land prices can go down as well as up;
            no return is promised or guaranteed. Verify all documents and RERA details before paying.
          </p>
          <ul className="foot-legal">
            <li>
              <a href="/privacy">Privacy policy</a>
            </li>
            <li>
              <a href="/terms">Terms</a>
            </li>
            <li>
              <a href="/disclaimer">Disclaimer</a>
            </li>
            <li>
              <a href="https://www.up-rera.in/" target="_blank" rel="noreferrer">
                UP RERA
              </a>
            </li>
          </ul>
          <p>
            © {new Date().getFullYear()} {compliance.legalName} · {brand.name} · {brand.domain}
          </p>
        </div>
      </footer>

      <div className="mobile-bar">
        {tel ? (
          <a className="btn btn-ghost-dark" href={tel} data-where="sticky">
            <PhoneIcon /> Call
          </a>
        ) : null}
        {wa ? (
          <a className="btn btn-wa" href={wa} target="_blank" rel="noreferrer" data-where="sticky">
            <WaIcon /> WhatsApp
          </a>
        ) : null}
      </div>
      {wa ? (
        <a className="wa-float" href={wa} target="_blank" rel="noreferrer" data-where="float" aria-label="Chat on WhatsApp">
          <WaIcon />
        </a>
      ) : null}
    </>
  );
}
