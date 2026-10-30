import { LeadForm } from "@/components/LeadForm";
import { PlotIllustration } from "@/components/PlotIllustration";
import { SiteChrome } from "@/components/SiteChrome";
import { WaIcon } from "@/components/icons";
import { jsonLd } from "@/lib/seo";
import { enquiries, enquiryWhatsappText, projectPages } from "@/lib/projects";
import {
  budgets,
  checks,
  cities,
  defaultWhatsappText,
  faqs,
  interestWhatsappText,
  partner,
  plotTypes,
  reasons,
  steps,
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
  const pages = projectPages();

  return (
    <SiteChrome
      nav={[
        { href: "#projects", label: "Projects" },
        { href: "#plots", label: "Plot types" },
        { href: "#why", label: "Why plots" },
        { href: "#faq", label: "FAQ" },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />

      <main id="main">
        {/* ---------- Hero: headline + form above the fold ---------- */}
        <section className="hero" id="enquire" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{partner.agentRera ? `UP RERA registered agent · ${partner.agentRera}` : "Plot investment advisory"}</p>
              <h1 id="hero-title">
                <span className="hl">Plots</span> for investment in Noida, Greater Noida &amp; Yamuna Expressway
              </h1>
              <p className="hero-keys" aria-label="Popular projects">
                <a href="/gaur-yamuna-city">Gaur Yamuna City</a>
                {" · "}
                <a href="/6-percent-plots">6% plots</a>
                {" · "}
                <a href="/ace-plots">Ace Plots</a>
                {" · "}
                <a href="/webcity-plots">Webcity Plots</a>
                {" · "}
                <a href="/lodha-plots">Lodha Group Plots</a>
              </p>
              <p className="lede">
                Tell us your budget and city — we send matching plots, the price list and the documents on WhatsApp,
                then arrange a site visit.
              </p>
              <ul className="ticks">
                <li>Shortlist that fits your budget</li>
                <li>Title, approvals and RERA shared upfront</li>
                <li>Free site visit, no obligation</li>
              </ul>
              <div className="hero-actions">
                {wa ? (
                  <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where="hero">
                    <WaIcon /> Get plot options on WhatsApp
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

        {/* ---------- Named projects ---------- */}
        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Projects</p>
              <h2 id="projects-title">Plots you can ask about today</h2>
              <p className="sub">
                Gaur Yamuna City, 6% plots, Ace Plots, Webcity Plots and Lodha Group Plots. Open a project or send your
                budget for a shortlist.
              </p>
            </div>
            <ul className="cards cards-projects">
              {enquiries.map((item) => {
                const page = pages.find((project) => project.id === item.id);
                const ask = whatsappHref(enquiryWhatsappText(item.name));
                return (
                  <li className="card plot" key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.blurb}</p>
                    <div className="plot-actions">
                      <a
                        className="btn btn-sm btn-primary"
                        href="#enquire"
                        data-project={item.id}
                        {...(item.city ? { "data-city": item.city } : {})}
                      >
                        Get options
                      </a>
                      {page ? (
                        <a className="btn btn-sm btn-ghost-dark" href={page.path}>
                          Details
                        </a>
                      ) : ask ? (
                        <a
                          className="btn btn-sm btn-wa-outline"
                          href={ask}
                          target="_blank"
                          rel="noreferrer"
                          data-where={`project-${item.id}`}
                          aria-label={`Ask on WhatsApp about ${item.name}`}
                        >
                          <WaIcon /> Ask
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
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
    </SiteChrome>
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
