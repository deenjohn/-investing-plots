/**
 * investingplots.com — visit log, enquiry log and daily email report.
 *
 * Runs free inside a Google Sheet (Extensions > Apps Script). Setup steps are in README.md under
 * "Daily email report". The website sends:
 *   - visits and WhatsApp / call / email taps (NEXT_PUBLIC_STATS_WEBHOOK, from the browser) -> "Visits" tab
 *   - enquiry form submissions (LEAD_WEBHOOK, from /api/lead on the server)          -> "Leads" tab
 * Every morning dailyReport() emails yesterday's numbers.
 */

const REPORT_TO = "shivamag214@gmail.com,dj.itbhu@gmail.com"; // Comma-separate to send to more than one person.
const TZ = "Asia/Kolkata";
const REPORT_HOUR = 8; // 8–9 AM IST
const KEEP_DAYS = 120; // Visit rows older than this are deleted. Leads are never deleted.

const VISIT_HEADERS = ["Time", "Type", "Page", "Source", "Medium", "Campaign", "Device", "Visitor", "Where"];
const LEAD_HEADERS = ["Time", "Name", "Mobile", "Interest", "Project", "Budget", "City", "Page", "Source", "Campaign", "Keyword", "gclid", "fbclid"];

/** Run once by hand after pasting: creates the tabs and the daily 8 AM trigger. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);
  tab_(ss, "Visits", VISIT_HEADERS);
  tab_(ss, "Leads", LEAD_HEADERS);
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "dailyReport")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("dailyReport").timeBased().everyDays(1).atHour(REPORT_HOUR).inTimezone(TZ).create();
}

function doPost(e) {
  const raw = (e && e.postData && e.postData.contents) || "";
  if (raw.length > 8000) return ok_();
  let body;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    return ok_();
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const now = new Date();
    if (body.type) {
      if (["view", "whatsapp", "call", "email", "lead"].indexOf(body.type) === -1) return ok_();
      tab_(ss, "Visits", VISIT_HEADERS).appendRow([
        now, cell_(body.type), cell_(body.path), cell_(body.source), cell_(body.medium),
        cell_(body.campaign), cell_(body.device), cell_(body.vid), cell_(body.where),
      ]);
    } else if (body.name && body.phone) {
      // /api/lead sends the campaign keys flat: utm_source, utm_campaign, gclid, fbclid ...
      const source = body.utm_source || (body.gclid || body.gbraid || body.wbraid ? "google ads" : body.fbclid ? "meta ads" : "");
      tab_(ss, "Leads", LEAD_HEADERS).appendRow([
        now, cell_(body.name), cell_(body.phone), cell_(body.interest), cell_(body.project), cell_(body.budget),
        cell_(body.city), cell_(body.page), cell_(source), cell_(body.utm_campaign), cell_(body.utm_term),
        cell_(body.gclid || body.gbraid || body.wbraid), cell_(body.fbclid),
      ]);
    }
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

/** Emails yesterday's numbers. The trigger from setup() runs it every morning; you can also run it by hand. */
function dailyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const end = startOfDay_(new Date());
  const start = new Date(end.getTime() - 24 * 3600 * 1000);
  const inRange = (row) => row[0] instanceof Date && row[0] >= start && row[0] < end;

  const visits = rows_(tab_(ss, "Visits", VISIT_HEADERS)).filter(inRange);
  const leads = rows_(tab_(ss, "Leads", LEAD_HEADERS)).filter(inRange);
  const views = visits.filter((r) => r[1] === "view");
  const count = (type) => visits.filter((r) => r[1] === type).length;
  const visitors = new Set(views.map((r) => r[7])).size;
  const wa = count("whatsapp");
  const calls = count("call");
  const day = Utilities.formatDate(start, TZ, "EEE d MMM yyyy");

  const top = (list, pick, n) => {
    const map = {};
    list.forEach((r) => {
      const k = pick(r) || "(none)";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.keys(map).map((k) => [k, map[k]]).sort((a, b) => b[1] - a[1]).slice(0, n);
  };
  const table = (title, pairs) =>
    pairs.length
      ? `<h3 style="margin:18px 0 6px">${title}</h3><table cellpadding="4" style="border-collapse:collapse">` +
        pairs.map((p) => `<tr><td>${esc_(p[0])}</td><td style="text-align:right"><b>${p[1]}</b></td></tr>`).join("") +
        "</table>"
      : "";

  const leadList = leads.length
    ? "<h3 style=\"margin:18px 0 6px\">Enquiries</h3><ul>" +
      leads
        .map((r) => `<li><b>${esc_(r[1])}</b>, ${esc_(r[2])} — ${esc_(r[3] || "general")} ${esc_(r[4] || "")} ${esc_(r[5] || "")} (${esc_(r[8] || "direct")})</li>`)
        .join("") +
      "</ul>"
    : "";

  const html =
    `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">` +
    `<h2 style="margin:0 0 4px">investingplots.com — ${day}</h2>` +
    `<p style="font-size:16px;margin:8px 0 0"><b>${visitors}</b> visitors · <b>${views.length}</b> page views · ` +
    `<b>${wa}</b> WhatsApp taps · <b>${calls}</b> call taps · <b>${leads.length}</b> enquiries</p>` +
    leadList +
    table("Where visitors came from", top(views, (r) => r[3] + (r[5] ? ` / ${r[5]}` : ""), 6)) +
    table("Top pages", top(views, (r) => r[2], 6)) +
    table("Device", top(views, (r) => r[6], 2)) +
    `<p style="color:#666;margin-top:18px">Full log: <a href="${ss.getUrl()}">Google Sheet</a></p></div>`;

  MailApp.sendEmail({
    to: REPORT_TO,
    subject: `investingplots.com ${day}: ${visitors} visitors, ${wa} WhatsApp taps, ${leads.length} enquiries`,
    htmlBody: html,
  });
  prune_(tab_(ss, "Visits", VISIT_HEADERS));
}

// ---- helpers ----

function tab_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_(sh) {
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues();
}

function prune_(sh) {
  const cutoff = new Date(Date.now() - KEEP_DAYS * 24 * 3600 * 1000);
  const data = rows_(sh);
  let old = 0;
  while (old < data.length && data[old][0] instanceof Date && data[old][0] < cutoff) old++;
  if (old > 0) sh.deleteRows(2, old);
}

function startOfDay_(d) {
  const ymd = Utilities.formatDate(d, TZ, "yyyy-MM-dd");
  return new Date(`${ymd}T00:00:00+05:30`);
}

/** Text only, max 300 chars, and never a spreadsheet formula. */
function cell_(v) {
  const s = String(v == null ? "" : v).slice(0, 300);
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
}

function esc_(v) {
  return String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function ok_() {
  return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
}
