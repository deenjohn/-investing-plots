import { LeadForm } from "@/components/LeadForm";
import { PlotIllustration } from "@/components/PlotIllustration";
import { PhoneIcon, WaIcon } from "@/components/icons";
import { jsonLd } from "@/lib/seo";
import {
  brand,
  budgets,
  checks,
  cities,
  defaultWhatsappText,
  faqs,
  interestWhatsappText,
  partner,
  plotTypes,
  reasons,
  social,
  steps,
  telHref,
  whatsappHref,
  type InterestId,
} from "@/lib/site";

const promises = [
  { title: "Documents first", body: "Title, approvals and RERA papers before any payment." },
  { title: "Price in writing", body: "A dated price list with every charge shown." },
  { title: "Free site visit", body: "See the plot and the road before you decide." },
  { title: "Straight advice", body: "No guaranteed-return promises. Ever." },
] as const;

export default function Home() {
  const wa = whatsappHref(defaultWhatsappText);
  const tel = telHref();
  const links = Object.entries(social).filter(([, url]) => /^https:\/\//.test(url));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
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
            <a href="#plots">Plot types</a>
            <a href="#why">Why plots</a>
            <a href="#checks">Checks</a>
            <a href="#faq">FAQ</a>
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

      <main id="main">
        {/* ---------- Hero: headline + form above the fold ---------- */}
        <section className="hero" id="enquire" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Plots · Land · India</p>
              <h1 id="hero-title">
                Invest in <span className="hl">plots</span> with clear titles and approvals
              </h1>
              <p className="lede">
                Residential, commercial, industrial and farm plots. Tell us your budget and city — we send matching
                plots, the price list and the documents on WhatsApp, then arrange a site visit.
              </p>
              <ul className="ticks">
                <li>Shortlist that fits your budget</li>
                <li>Title, approvals and RERA shared upfront</li>
                <li>Free site visit, no obligation</li>
              </ul>
              <div className="hero-actions">
                {wa ? (
                  <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where="hero">
                    <WaIcon /> Chat on WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
            <LeadForm />
          </div>
        </section>

        {/* ---------- Promises ---------- */}
        <section className="promises" aria-label="How we work">
          <ul className="wrap promise-grid">
            {promises.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Plot types ---------- */}
        <section className="section" id="plots" aria-labelledby="plots-title">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Plot types</p>
              <h2 id="plots-title">Which plot are you looking for?</h2>
              <p className="sub">Pick one and we send options, sizes and the current price list on WhatsApp.</p>
            </div>
            <ul className="cards cards-4">
              {plotTypes.map((p) => (
                <li className="card plot" key={p.interest}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                  <div className="plot-actions">
                    <a className="btn btn-sm btn-primary" href="#enquire" data-interest={p.interest}>
                      Get options
                    </a>
                    <AskWa interest={p.interest} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="budget-box">
              <h3 id="budget-title">Shop by budget</h3>
              <ul className="chips" aria-labelledby="budget-title">
                {budgets.map((b) => (
                  <li key={b.id}>
                    <a className="chip" href="#enquire" data-budget={b.id}>
                      {b.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {cities.length ? (
              <div className="budget-box">
                <h3 id="city-title">Where we have plots</h3>
                <ul className="chips" aria-labelledby="city-title">
                  {cities.map((c) => (
                    <li key={c}>
                      <a className="chip" href="#enquire" data-city={c}>
                        {c}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        {/* ---------- Why plots ---------- */}
        <section className="section section-alt" id="why" aria-labelledby="why-title">
          <div className="wrap split">
            <div>
              <p className="eyebrow">Why plots</p>
              <h2 id="why-title">Why investors choose land over a flat</h2>
              <ul className="reasons">
                {reasons.map((r, i) => (
                  <li key={r.title}>
                    <span className="num" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <div>
                      <h3>{r.title}</h3>
                      <p>{r.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="fine">
                Land is a long-term, less liquid holding and prices can fall as well as rise. Buy what you can hold.
              </p>
            </div>
            <PlotIllustration className="illustration" />
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section className="section section-dark" id="process" aria-labelledby="process-title">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow eyebrow-light">How it works</p>
              <h2 id="process-title">From WhatsApp to your plot in three steps</h2>
            </div>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="center">
              {wa ? (
                <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where="process">
                  <WaIcon /> Start on WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {/* ---------- Due diligence ---------- */}
        <section className="section" id="checks" aria-labelledby="docs-title">
          <div className="wrap narrow">
            <div className="head">
              <p className="eyebrow">Buy with care</p>
              <h2 id="docs-title">7 checks before you invest in any plot</h2>
              <p className="sub">We share these papers for every plot we offer. Read them, ask questions, pay only when satisfied.</p>
            </div>
            <ol className="checklist">
              {checks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="section section-alt" id="faq" aria-labelledby="faq-title">
          <div className="wrap narrow">
            <div className="head">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">Questions about investing in plots</h2>
            </div>
            <div className="faq">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    <h3>{f.q}</h3>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="cta-band" aria-labelledby="cta-title">
          <div className="wrap cta-row">
            <div>
              <h2 id="cta-title">Get your plot shortlist today</h2>
              <p>One WhatsApp message with your budget and city. Options, prices and documents, no obligation.</p>
            </div>
            <div className="cta-actions">
              {wa ? (
                <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where="cta">
                  <WaIcon /> WhatsApp us
                </a>
              ) : null}
              <a className="btn btn-gold btn-lg" href="#enquire" data-interest="price-list">
                Request price list
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <p className="logo-text logo-light">
              Investing<b>Plots</b>
            </p>
            <p>{brand.tagline}.</p>
            {partner.agentRera ? <p>RERA agent reg. no. {partner.agentRera}</p> : null}
          </div>
          <div>
            <p className="foot-h">Contact</p>
            {wa ? (
              <p>
                <a href={wa} target="_blank" rel="noreferrer" data-where="footer">
                  WhatsApp
                </a>
              </p>
            ) : null}
          </div>
          <div>
            <p className="foot-h">Links</p>
            <p>
              <a href="#plots">Plot types</a>
            </p>
            <p>
              <a href="#faq">FAQ</a>
            </p>
            <p>
              <a href="/privacy">Privacy policy</a>
            </p>
            {links.map(([key, url]) => (
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
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.domain}
          </p>
        </div>
      </footer>

      {/* Mobile: thumb-reach bar. Desktop: floating WhatsApp button. Pure CSS, no JS. */}
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

function AskWa({ interest }: { interest: InterestId }) {
  const href = whatsappHref(interestWhatsappText(interest));
  if (!href) return null;
  return (
    <a
      className="btn btn-sm btn-wa-outline"
      href={href}
      target="_blank"
      rel="noreferrer"
      data-where={`plot-${interest}`}
      aria-label={`Ask on WhatsApp about ${interest} plots`}
    >
      <WaIcon /> Ask
    </a>
  );
}
