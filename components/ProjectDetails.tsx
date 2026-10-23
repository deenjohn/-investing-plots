import { WaIcon } from "@/components/icons";
import { enquiryWhatsappText } from "@/lib/projects";
import { whatsappHref } from "@/lib/site";

/* Long-form content for the project pages that need more than a shortlist:
   what a 6% plot is, and the facts about Gaur Yamuna City. */

type Faq = { q: string; a: string };

function FaqBlock({ id, title, items }: { id: string; title: string; items: readonly Faq[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="section section-alt" id={id} aria-labelledby={`${id}-title`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap narrow">
        <div className="head">
          <p className="eyebrow">FAQ</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className="faq">
          {items.map((f, i) => (
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
  );
}

function AskBand({ name, title, body }: { name: string; title: string; body: string }) {
  const wa = whatsappHref(enquiryWhatsappText(name));
  return (
    <section className="cta-band" aria-labelledby="ask-title">
      <div className="wrap cta-row">
        <div>
          <h2 id="ask-title">{title}</h2>
          <p>{body}</p>
        </div>
        <div className="cta-actions">
          {wa ? (
            <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where={`band-${name}`}>
              <WaIcon /> Ask on WhatsApp
            </a>
          ) : null}
          <a className="btn btn-gold btn-lg" href="#enquire">
            Fill the form
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 6% plots ───────────────────────── */

const sixSteps = [
  {
    title: "The authority buys the land",
    body: "Noida, Greater Noida or the Yamuna Authority (YEIDA) acquires a farmer’s land for a new sector and pays compensation for it.",
  },
  {
    title: "The farmer gets a developed plot back",
    body: "On top of the money, the farmer is allotted a residential plot in a developed sector, sized as a share of the land given: 6% in Greater Noida (5% in Noida, 7% on YEIDA land).",
  },
  {
    title: "The plot can be sold on",
    body: "Once the plot is allotted and the lease deed is signed, the farmer can sell it. The authority records the new owner through a transfer, so you hold the same lease the farmer had.",
  },
] as const;

const sixWhy = [
  { title: "Inside planned sectors", body: "Roads, drains and power are laid by the authority, next to growing villages and sectors." },
  { title: "No lottery", body: "Authority plot schemes are allotted by draw. A 6% plot is bought from an existing allottee, so you choose the plot." },
  { title: "Many sizes", body: "Sizes depend on how much land the farmer gave. On YEIDA land they range from about 120 sq m up to 2,500 sq m." },
  { title: "Same lease as any sector plot", body: "After transfer, you hold the authority lease in your own name, like any other residential plot in that sector." },
] as const;

const sixChecks = [
  "Allotment letter from the authority in the farmer’s name, with plot number, sector and size",
  "Registered lease deed, and the possession letter if it has been handed over",
  "Every co-allottee and legal heir signs: these plots often belong to a whole family",
  "No-dues certificate from the authority (lease rent and any other charges)",
  "Transfer permission or transfer memorandum from the authority, and the transfer charges in writing",
  "Encumbrance check: no loan, case or stay order on the plot",
  "Visit the plot and match the number and boundaries with the authority map",
] as const;

const sixFaqs: readonly Faq[] = [
  {
    q: "What is a 6% plot?",
    a: "When Greater Noida Authority acquires a farmer’s land, it pays compensation and also gives back a developed residential plot equal to 6% of the land taken. That plot is called a 6% (or abadi) plot. Noida used 5%, and YEIDA uses 7% for land on the Yamuna Expressway.",
  },
  {
    q: "Are 6% plots legal to buy?",
    a: "Yes, when the plot is allotted, the lease deed is signed, and the authority transfers it to you. The risk is in buying too early, before the lease deed, on only an agreement to sell and a power of attorney. Those are not title documents, so wait for the authority transfer.",
  },
  {
    q: "Why is the price different from an authority scheme plot?",
    a: "You buy from the farmer at a market price, not at the authority’s scheme rate. In return you skip the lottery and pick the exact plot and size you want.",
  },
  {
    q: "What extra costs should I plan for?",
    a: "Stamp duty and registration on the transfer, the authority’s transfer charges, and any pending lease rent. We give you the full list in writing before you pay anything.",
  },
  {
    q: "Can I get a home loan on a 6% plot?",
    a: "Banks lend on plots with a registered lease deed and a clean transfer. Loans on plots still under agreement to sell are usually refused, which is one more reason to buy after the lease deed.",
  },
];

export function SixPercentDetails() {
  return (
    <>
      <section className="section section-dark" id="what" aria-labelledby="what-title">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow eyebrow-light">Explained simply</p>
            <h2 id="what-title">What is a 6% plot?</h2>
            <p className="sub" style={{ color: "#d4deeb" }}>
              When the government takes a farmer’s land to build a new sector, it pays for the land and also gives part of it back as a ready,
              developed plot. In Greater Noida that share is 6%. These are the plots we help you buy.
            </p>
          </div>
          <ol className="steps">
            {sixSteps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt" id="why-six" aria-labelledby="why-six-title">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow">Why buyers like them</p>
            <h2 id="why-six-title">Why choose a 6% plot</h2>
          </div>
          <ul className="cards cards-4">
            {sixWhy.map((w) => (
              <li className="card" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ul>
          <p className="fine">
            The share given back depends on the authority and the year of acquisition, and YEIDA has proposed raising it. Every plot we offer
            comes with its own allotment papers, so you see the exact terms.
          </p>
        </div>
      </section>

      <section className="section" id="checks" aria-labelledby="six-checks-title">
        <div className="wrap narrow">
          <div className="head">
            <p className="eyebrow">Buy with care</p>
            <h2 id="six-checks-title">7 papers to see before you buy a 6% plot</h2>
            <p className="sub">
              Buy after the lease deed, through an authority transfer. An agreement to sell or a power of attorney alone does not make you the
              owner.
            </p>
          </div>
          <ol className="checklist">
            {sixChecks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <p className="fine">This is general guidance, not legal advice. Have a property lawyer read the papers before you pay.</p>
        </div>
      </section>

      <FaqBlock id="six-faq" title="Questions about 6% plots" items={sixFaqs} />
      <AskBand
        name="6% plots"
        title="Looking for a 6% plot?"
        body="Send your budget, size and preferred sector. We share plots with the allotment papers, the price and the transfer costs."
      />
    </>
  );
}

/* ───────────────────────── Gaur Yamuna City ───────────────────────── */

const gaurFacts = [
  { label: "Where", value: "Sector 19, YEIDA, Yamuna Expressway (Exit 2C)" },
  { label: "Size", value: "About 250 acres (101 ha) integrated township" },
  { label: "Developer", value: "Gaurs Group (Gaursons India)" },
  { label: "Landmark", value: "Opposite the Buddh International (F1) Circuit" },
  { label: "Airport", value: "On the road to the Noida International Airport, Jewar" },
  { label: "RERA (Aerocity commercial plots)", value: "UPRERAPRJ342117" },
] as const;

const gaurWhy = [
  { title: "A whole township", body: "Plots, group housing and commercial areas planned together, with land kept for a hospital, school, sports park and shops." },
  { title: "On the airport corridor", body: "The Yamuna Expressway links Greater Noida to the new airport at Jewar, the main reason this stretch is watched by investors." },
  { title: "Families already living there", body: "The developer says more than 200 families have taken possession in its housing and plotted phases." },
  { title: "Residential and commercial", body: "Ask about residential plots or the Aerocity commercial plots, from about 78 sq m (93 sq yd) to about 252 sq m (301 sq yd)." },
] as const;

const gaurFaqs: readonly Faq[] = [
  {
    q: "Where is Gaur Yamuna City?",
    a: "In Sector 19 of the Yamuna Expressway Authority area (YEIDA), near Exit 2C of the Yamuna Expressway and opposite the Buddh International Circuit, on the way to the Noida International Airport at Jewar.",
  },
  {
    q: "Who is the developer?",
    a: "Gaurs Group (Gaursons India). Investing Plots is an independent advisory and not the developer; we help you compare plots and check the papers.",
  },
  {
    q: "Is Gaur Yamuna City RERA registered?",
    a: "The Aerocity commercial plots are listed under UP RERA number UPRERAPRJ342117. Each phase has its own registration, so check the number for the exact plot you buy on the UP RERA website.",
  },
  {
    q: "What plot sizes are available?",
    a: "It depends on the phase and what is unsold. Send your budget and we share current sizes, the price list and the payment plan on WhatsApp.",
  },
];

export function GaurYamunaDetails() {
  return (
    <>
      <section className="section" id="facts" aria-labelledby="facts-title">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow">At a glance</p>
            <h2 id="facts-title">Gaur Yamuna City in six facts</h2>
          </div>
          <ul className="cards cards-projects">
            {gaurFacts.map((f) => (
              <li className="card" key={f.label}>
                <p className="eyebrow">{f.label}</p>
                <h3>{f.value}</h3>
              </li>
            ))}
          </ul>
          <p className="fine">Facts as published by the developer. Prices, sizes and approvals change by phase, so we confirm them in writing for your plot.</p>
        </div>
      </section>

      <section className="section section-alt" id="why-gaur" aria-labelledby="why-gaur-title">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow">Why people ask about it</p>
            <h2 id="why-gaur-title">Why buy a plot in Gaur Yamuna City</h2>
          </div>
          <ul className="cards cards-4">
            {gaurWhy.map((w) => (
              <li className="card" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ul>
          <p className="fine">Land is a long-term, less liquid holding and prices can fall as well as rise. Buy what you can hold.</p>
        </div>
      </section>

      <FaqBlock id="gaur-faq" title="Questions about Gaur Yamuna City" items={gaurFaqs} />
      <AskBand
        name="Gaur Yamuna City"
        title="Want the Gaur Yamuna City price list?"
        body="Tell us your budget and plot size. We send available plots, the current price list, the RERA papers and arrange a site visit."
      />
    </>
  );
}
