import { createHash } from "node:crypto";
import { after, type NextRequest } from "next/server";
import { findEnquiry } from "@/lib/projects";
import { findBudget, findInterest, isIndianMobile, normalizeIndianMobile } from "@/lib/site";

/**
 * POST /api/lead — the form already opened WhatsApp in the visitor's browser. This keeps a copy:
 *  - LEAD_WEBHOOK      → Google Sheet (Apps Script), Zapier, Make or your CRM receives the JSON.
 *  - META_CAPI_TOKEN   → the lead is also sent to Meta's Conversions API (Instagram / Facebook ads),
 *                        de-duplicated with the browser pixel by eventId. Needs NEXT_PUBLIC_META_PIXEL_ID.
 */
export const runtime = "nodejs";

const hits = new Map<string, { n: number; t: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > 8;
}

const sha = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Honeypot: pretend it worked, keep nothing.
  if (clip(body.company, 200)) return Response.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });

  const name = clip(body.name, 80);
  const phone = normalizeIndianMobile(clip(body.phone, 20));
  const email = clip(body.email, 120);
  const interest = findInterest(clip(body.interest, 40));
  if (name.length < 2 || !isIndianMobile(phone) || !interest) {
    return Response.json({ ok: false, error: "Check your name, mobile and choice." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Check the email address." }, { status: 422 });
  }

  const project = findEnquiry(clip(body.project, 40));

  const campaign: Record<string, string> = {};
  if (body.campaign && typeof body.campaign === "object") {
    for (const [k, v] of Object.entries(body.campaign as Record<string, unknown>).slice(0, 20)) {
      if (/^[a-z_]{2,20}$/.test(k)) campaign[k] = clip(v, 180);
    }
  }

  const lead = {
    at: new Date().toISOString(),
    name,
    phone: `+91${phone}`,
    email,
    interest: interest.label,
    project: project?.label || "",
    budget: findBudget(clip(body.budget, 20))?.label || "",
    city: clip(body.city, 60),
    page: clip(body.page, 500),
    referrer: clip(body.referrer, 300),
    ...campaign,
    eventId: clip(body.eventId, 64),
  };

  const userAgent = req.headers.get("user-agent") || "";
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc =
    req.cookies.get("_fbc")?.value || (campaign.fbclid ? `fb.1.${Date.now()}.${campaign.fbclid}` : undefined);

  after(async () => {
    const jobs: Promise<unknown>[] = [];
    const webhook = process.env.LEAD_WEBHOOK;
    if (webhook && /^https:\/\//.test(webhook)) {
      jobs.push(
        fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(lead),
          signal: AbortSignal.timeout(8000),
        }),
      );
    }

    const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;
    if (pixel && token) {
      jobs.push(
        fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                event_name: "Lead",
                event_time: Math.floor(Date.now() / 1000),
                event_id: lead.eventId || undefined,
                action_source: "website",
                event_source_url: lead.page || undefined,
                user_data: {
                  ph: [sha(`91${phone}`)],
                  ...(email ? { em: [sha(email)] } : {}),
                  fn: [sha(name.split(/\s+/)[0])],
                  country: [sha("in")],
                  client_ip_address: ip !== "unknown" ? ip : undefined,
                  client_user_agent: userAgent || undefined,
                  fbp,
                  fbc,
                },
                custom_data: {
                  content_name: project ? `${project.label} — ${interest.label}` : interest.label,
                  currency: "INR",
                  value: 1,
                },
              },
            ],
          }),
          signal: AbortSignal.timeout(8000),
        }),
      );
    }

    const results = await Promise.allSettled(jobs);
    const failed = results.filter((r) => r.status === "rejected" || (r.value as Response)?.ok === false).length;
    // Masked log line: enough to spot problems in the Vercel logs without storing the full number.
    console.log(`lead ${interest.id} +91******${phone.slice(-4)} ${campaign.utm_source || "direct"} forwards=${jobs.length} failed=${failed}`);
  });

  return Response.json({ ok: true });
}
