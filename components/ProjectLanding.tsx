import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LeadForm } from "@/components/LeadForm";
import { SiteChrome } from "@/components/SiteChrome";
import { WaIcon } from "@/components/icons";
import { enquiryWhatsappText, projectPages, type ProjectPage } from "@/lib/projects";
import { breadcrumb, ldJson, pageMetadata } from "@/lib/seo";
import { brand, SITE_URL, whatsappHref } from "@/lib/site";

const points = [
  "Sizes and the current price list",
  "Title, approvals and RERA papers before any payment",
  "Free site visit, with no obligation to book",
];

export function projectMetadata(project: ProjectPage): Metadata {
  const title = "seoTitle" in project ? project.seoTitle : `${project.name} | Noida, Yamuna Expressway & Greater Noida`;
  const description =
    "seoDescription" in project
      ? project.seoDescription
      : `Ask for ${project.name} in Noida, on the Yamuna Expressway and in Greater Noida. Get the price list and documents on WhatsApp.`;
  return pageMetadata({
    title,
    description,
    path: project.path,
    keywords: [
      project.name,
      `${project.name} Noida`,
      `${project.name} Yamuna Expressway`,
      `${project.name} Greater Noida`,
      "plots in Gaur Yamuna City",
      "6% plots Noida",
    ],
  });
}

export function ProjectLanding({ project, children }: { project: ProjectPage; children?: ReactNode }) {
  const wa = whatsappHref(enquiryWhatsappText(project.name));
  const others = projectPages().filter((item) => item.id !== project.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${project.path}#webpage`,
    url: `${SITE_URL}${project.path}`,
    name: "heading" in project ? project.heading : project.name,
    description: project.blurb,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#org` },
    primaryImageOfPage: `${SITE_URL}/og.jpg`,
    inLanguage: "en-IN",
  };
  const crumbs = breadcrumb([{ name: project.name, path: project.path }]);

  return (
    <SiteChrome
      nav={[
        { href: "/#projects", label: "All projects" },
        ...others.map((item) => ({ href: item.path, label: item.name })),
        { href: "#enquire", label: "Enquire" },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(jsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(crumbs)} />
      <main id="main">
        <section className="hero" id="enquire" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{project.name}</p>
              <h1 id="hero-title">
                {"heading" in project ? project.heading : `${project.name} in Noida, Yamuna Expressway and Greater Noida`}
              </h1>
              <p className="lede">{project.blurb}</p>
              <ul className="ticks">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="hero-actions">
                {wa ? (
                  <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer" data-where={`hero-${project.id}`}>
                    <WaIcon /> Get {project.name} options on WhatsApp
                  </a>
                ) : null}
                <a className="btn btn-ghost btn-lg" href="/#projects">
                  All projects
                </a>
              </div>
              <p className="hero-note">
                {"note" in project ? project.note : `${brand.name} is an independent advisory, not the developer of ${project.name}.`}
              </p>
            </div>
            <LeadForm project={project.id} />
          </div>
        </section>

        {children}

        <section className="section" aria-labelledby="related-title">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Also on this site</p>
              <h2 id="related-title">Other plots you can ask about</h2>
            </div>
            <ul className="cards cards-projects">
              {others.map((item) => (
                <li className="card plot" key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.blurb}</p>
                  <div className="plot-actions">
                    <a className="btn btn-sm btn-primary" href={item.path}>
                      View {item.name}
                    </a>
                  </div>
                </li>
              ))}
              <li className="card plot">
                <h3>Gaur Yamuna City and 6% plots</h3>
                <p>Plots in Gaur Yamuna City, and 6% plots in Noida, on the Yamuna Expressway and in Greater Noida.</p>
                <div className="plot-actions">
                  <a className="btn btn-sm btn-primary" href="/#projects">
                    See them on the home page
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
