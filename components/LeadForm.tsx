"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { enquiries, findEnquiry, type EnquiryId } from "@/lib/projects";
import {
  budgets,
  cities,
  findBudget,
  findInterest,
  interests,
  isIndianMobile,
  normalizeIndianMobile,
  whatsappHref,
  type BudgetId,
  type InterestId,
} from "@/lib/site";
import { readCampaign, trackLead } from "@/lib/tracking";
import { WaIcon } from "./icons";

type Errors = Partial<Record<"name" | "phone" | "interest", string>>;

function campaignLine(campaign: Record<string, string>) {
  const source =
    campaign.utm_source || (campaign.gclid || campaign.gbraid || campaign.wbraid ? "google" : campaign.fbclid ? "meta" : "");
  return source ? `Ref: ${[source, campaign.utm_campaign].filter(Boolean).join(" / ")}` : "";
}

function newEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function LeadForm({ project }: { project?: EnquiryId }) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<InterestId | "">("");
  const [budget, setBudget] = useState<BudgetId | "">("");
  const [city, setCity] = useState("");
  const [projectId, setProjectId] = useState<EnquiryId | "">(project ?? "");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const router = useRouter();

  // Warm up /thank-you so the move after sending is instant.
  useEffect(() => {
    router.prefetch("/thank-you");
  }, [router]);

  // Ad links can preselect: /?interest=commercial&budget=25-50&city=Jaipur  (ids in lib/site.ts)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const i = findInterest(params.get("interest"));
    const b = findBudget(params.get("budget"));
    const p = project ? undefined : findEnquiry(params.get("project"));
    const c = (params.get("city") || "").replace(/[^\p{L}\p{N} ,.-]/gu, "").slice(0, 60);
    if (i) setInterest(i.id);
    if (b) setBudget(b.id);
    if (p) setProjectId(p.id);
    if (c) setCity(c);

    // Any element with data-interest / data-budget / data-city / data-project preselects and jumps to the form.
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.(
        "[data-interest],[data-budget],[data-city],[data-project]",
      ) as HTMLElement | null;
      if (!el || el.closest("form")) return;
      const pickedInterest = findInterest(el.dataset.interest);
      const pickedBudget = findBudget(el.dataset.budget);
      const pickedProject = project ? undefined : findEnquiry(el.dataset.project);
      if (pickedInterest) setInterest(pickedInterest.id);
      if (pickedBudget) setBudget(pickedBudget.id);
      if (pickedProject) setProjectId(pickedProject.id);
      if (el.dataset.city) setCity(el.dataset.city);
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 400);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [project]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const mobile = normalizeIndianMobile(phone);
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!isIndianMobile(mobile)) next.phone = "Enter a 10-digit Indian mobile number.";
    const chosen = findInterest(interest);
    if (!chosen) next.interest = "Choose what you are looking for.";
    setErrors(next);
    if (Object.keys(next).length || !chosen) {
      window.setTimeout(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }

    const campaign = readCampaign();
    const eventId = newEventId();
    const budgetLabel = findBudget(budget)?.label || "";
    const pickedProject = findEnquiry(projectId);
    const message = [
      "Hello, I want to invest in a plot.",
      "",
      `Name: ${name.trim()}`,
      `Mobile: +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`,
      `Looking for: ${chosen.label}`,
      pickedProject ? `Project: ${pickedProject.label}` : "",
      budgetLabel ? `Budget: ${budgetLabel}` : "",
      city.trim() ? `City / area: ${city.trim()}` : "",
      campaignLine(campaign),
    ]
      .filter((line, i) => line !== "" || i === 1)
      .join("\n");
    const href = whatsappHref(message);

    if (sending) return;
    setSending(true);
    if (!company) {
      // Open WhatsApp synchronously inside the tap, before anything async, so pop-up blockers allow it.
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      trackLead({ interest: chosen.label, project: pickedProject?.label, phone: mobile, eventId });
      const body = JSON.stringify({
        name: name.trim(),
        phone: mobile,
        interest: chosen.id,
        project: projectId,
        budget,
        city: city.trim(),
        company,
        eventId,
        page: window.location.href.slice(0, 500),
        referrer: document.referrer.slice(0, 300),
        campaign,
      });
      // keepalive: the request survives the switch to WhatsApp.
      fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(
        () => {},
      );
    }
    // /thank-you shows the "Open WhatsApp again" button and is the page to use for URL-based goals.
    try {
      sessionStorage.setItem(
        "ip-thanks",
        JSON.stringify({ href, name: name.trim().split(/\s+/)[0], project: pickedProject?.short || chosen.short }),
      );
    } catch {
      /* private mode: the thank-you page falls back to a generic message */
    }
    router.push("/thank-you");
  }

  const chosen = findInterest(interest);
  const pickedProject = findEnquiry(projectId);
  const title = pickedProject
    ? `Get ${pickedProject.short} options on WhatsApp`
    : chosen && chosen.id !== "price-list" && chosen.id !== "site-visit"
      ? `Get ${chosen.short} options on WhatsApp`
      : "Get plot options and prices on WhatsApp";

  const clear = (key: keyof Errors) => setErrors((x) => (x[key] ? { ...x, [key]: undefined } : x));

  return (
    <form className="form-card" id="enquire-form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <p className="form-kicker">Free shortlist · No obligation</p>
      <h2 className="form-title" id={`${id}-title`}>
        {title}
      </h2>
      {project && pickedProject ? <p className="project-lock">Project: {pickedProject.label}</p> : null}

      <div className="field">
        <label htmlFor={`${id}-name`}>Name</label>
        <input
          ref={nameRef}
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          enterKeyHint="next"
          value={name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
          onChange={(e) => {
            setName(e.target.value);
            clear("name");
          }}
        />
        {errors.name ? <span className="err" id={`${id}-name-err`}>{errors.name}</span> : null}
      </div>

      <div className="field">
        <label htmlFor={`${id}-phone`}>WhatsApp / mobile number</label>
        <div className="phone">
          <span aria-hidden="true">+91</span>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            enterKeyHint="next"
            placeholder="98XXX XXXXX"
            maxLength={16}
            value={phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-err` : undefined}
            onChange={(e) => {
              setPhone(e.target.value);
              clear("phone");
            }}
          />
        </div>
        {errors.phone ? <span className="err" id={`${id}-phone-err`}>{errors.phone}</span> : null}
      </div>

      <div className="field">
        <label htmlFor={`${id}-interest`}>Looking for</label>
        <select
          id={`${id}-interest`}
          name="interest"
          value={interest}
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? `${id}-interest-err` : undefined}
          onChange={(e) => {
            setInterest(e.target.value as InterestId);
            clear("interest");
          }}
        >
          <option value="">Select one</option>
          {interests.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.interest ? <span className="err" id={`${id}-interest-err`}>{errors.interest}</span> : null}
      </div>

      {project ? null : (
        <div className="field">
          <label htmlFor={`${id}-project`}>
            Project <span className="opt">(optional)</span>
          </label>
          <select id={`${id}-project`} name="project" value={projectId} onChange={(e) => setProjectId(e.target.value as EnquiryId)}>
            <option value="">Any project</option>
            {enquiries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor={`${id}-budget`}>
            Budget <span className="opt">(optional)</span>
          </label>
          <select id={`${id}-budget`} name="budget" value={budget} onChange={(e) => setBudget(e.target.value as BudgetId)}>
            <option value="">Any</option>
            {budgets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-city`}>
            City / area <span className="opt">(optional)</span>
          </label>
          <input
            id={`${id}-city`}
            name="city"
            autoComplete="address-level2"
            enterKeyHint="send"
            list={cities.length ? `${id}-cities` : undefined}
            maxLength={60}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {cities.length ? (
            <datalist id={`${id}-cities`}>
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          ) : null}
        </div>
      </div>

      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <button className="btn btn-wa btn-block btn-lg" type="submit" disabled={sending}>
        <WaIcon /> {sending ? "Opening WhatsApp…" : "Send on WhatsApp"}
      </button>
      <p className="form-legal">
        By sending, you agree to be contacted by call, WhatsApp and SMS about plots. See our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}
