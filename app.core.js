/* ============ NEXUS CORE — utils, router, state bus ============ */
const NX = { version: "1.0.0" };

/* ---------- DOM helpers ---------- */
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "data" && typeof v === "object") for (const [dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(9)) {
    if (kid == null || kid === false) continue;
    if (typeof kid === "string" && kid.trim().startsWith("<svg")) {
      const icon = document.createElement("span");
      icon.innerHTML = kid;
      el.append(...icon.childNodes);
    } else el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const nxQuery = (s, r = document) => r.querySelector(s);
const nxQueryAll = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const svg = (d, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  grid: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  cart: svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'),
  user: svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  box: svg('<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>'),
  chart: svg('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),
  wallet: svg('<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>'),
  cog: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'),
  store: svg('<path d="m2 7 2-4h16l2 4"/><path d="M2 7h20v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z"/><path d="M7 11v6M12 11v6M17 11v6"/>'),
  users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  search: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
  trash: svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>'),
  edit: svg('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>'),
  bell: svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
  logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  trend: svg('<path d="m23 6-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>'),
  truck: svg('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  star: svg('<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'),
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>'),
  menu: svg('<path d="M3 12h18M3 6h18M3 18h18"/>'),
  arrow: svg('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>'),
  filter: svg('<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>'),
  heart: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>'),
  eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'),
  globe: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>'),
  lock: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  tag: svg('<path d="M20.6 13.4 12 22l-9-9V4a2 2 0 0 1 2-2h9l6.6 6.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
  refresh: svg('<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>'),
  home: svg('<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>'),
  dollar: svg('<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  fire: svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3 0 0 3-1 3-4 0 0 5 2 5 8a6 6 0 0 1-12 0c0-2 1-3.5 1-3.5s1.5 2 1.5 5z"/>'),
};

/* ---------- formatting ---------- */
const money = (n, cur = "USD") => {
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); }
  catch { return "$" + Number(n).toFixed(2); }
};
const num = (n) => new Intl.NumberFormat("en-US").format(n);
const compact = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
const dt = (iso, mode = "short") => {
  const d = new Date(iso);
  const locale = typeof I18n !== "undefined" ? (I18n.lang === "ku" ? "ku" : I18n.lang === "ar" ? "ar" : "en-US") : "en-US";
  if (mode === "date") return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  if (mode === "time") return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  if (mode === "ago") {
    const s = (Date.now() - d) / 1000;
    if (s < 60) return locale === "ku" ? "Niha" : locale === "ar" ? "الآن" : "just now";
    if (s < 3600) return locale === "ku" ? Math.floor(s / 60) + " deqîqe berê" : locale === "ar" ? "منذ " + Math.floor(s / 60) + " د" : Math.floor(s / 60) + "m ago";
    if (s < 86400) return locale === "ku" ? Math.floor(s / 3600) + " seet berê" : locale === "ar" ? "منذ " + Math.floor(s / 3600) + " س" : Math.floor(s / 3600) + "h ago";
    if (s < 604800) return locale === "ku" ? Math.floor(s / 86400) + " roj berê" : locale === "ar" ? "منذ " + Math.floor(s / 86400) + " ي" : Math.floor(s / 86400) + "d ago";
    return dt(iso, "date");
  }
  return d.toLocaleString(locale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
const stars = (r) => { const f = Math.round(r); return "★".repeat(f) + "☆".repeat(5 - f); };
const initials = (s) => String(s || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const uid = (p = "id") => p + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ---------- toast ---------- */
function toast(msg, type = "pri", ms = 3200) {
  const colors = { pri: "var(--pri)", ok: "var(--ok)", bad: "var(--bad)", warn: "var(--warn)" };
  const el = h("div", { class: "toast", style: { borderLeftColor: colors[type] } },
    h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } },
      h("span", { style: { color: colors[type], display: "flex" }, html: type === "ok" ? I.check : type === "bad" ? I.x : I.bell }),
      h("span", {}, msg)));
  nxQuery("#toasts").append(el);
  setTimeout(() => { el.style.transition = ".3s"; el.style.opacity = "0"; el.style.transform = "translateX(40px)"; setTimeout(() => el.remove(), 300); }, ms);
}

/* ---------- modal ---------- */
function modal(title, bodyNode, opts = {}) {
  const root = nxQuery("#modal-root");
  const close = () => { bg.style.animation = "fi .2s reverse"; setTimeout(() => bg.remove(), 180); };
  const bg = h("div", { class: "modal-bg", onclick: (e) => { if (e.target === bg && opts.dismissable !== false) close(); } },
    h("div", { class: "modal", style: opts.width ? { maxWidth: opts.width } : {} },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--line)" } },
        h("h3", { style: { margin: 0, fontSize: "19px" } }, title),
        h("button", { class: "btn btn-g btn-xs", onclick: close, html: I.x })),
      h("div", { style: { padding: "24px" } }, bodyNode),
      opts.footer ? h("div", { style: { padding: "16px 24px", borderTop: "1px solid var(--line)", display: "flex", gap: "10px", justifyContent: "flex-end" } }, opts.footer) : null));
  root.append(bg);
  return { close, el: bg };
}
function confirmDialog(title, msg, onYes, yesLabel = "Confirm", danger = true) {
  const m = modal(title,
    h("p", { style: { color: "var(--mut)", lineHeight: "1.6", margin: 0 } }, msg),
    { width: "440px", footer: [
      h("button", { class: "btn btn-g", onclick: () => m.close() }, "Cancel"),
      h("button", { class: "btn " + (danger ? "btn-d" : "btn-p"), onclick: () => { m.close(); onYes(); } }, yesLabel),
    ] });
}

/* ---------- router ---------- */
const Router = {
  routes: [],
  add(pattern, handler) {
    const names = [];
    const rx = new RegExp("^" + pattern.replace(/:[^/]+/g, (m) => { names.push(m.slice(1)); return "([^/]+)"; }) + "$");
    this.routes.push({ rx, names, handler, pattern });
  },
  current: { path: "/", params: {} },
  go(path, replace = false) {
    if (replace) history.replaceState({}, "", "#" + path);
    else location.hash = "#" + path;
  },
  parse() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = Object.fromEntries(new URLSearchParams(qs || ""));
    const segs = path.replace(/\/+$/, "") || "/";
    for (const r of this.routes) {
      const m = segs.match(r.rx);
      if (m) {
        const params = {};
        r.names.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1])));
        this.current = { path: segs, params, query };
        return r.handler(params, query);
      }
    }
    this.current = { path: segs, params: {}, query };
    App.notFound();
  },
  init() {
    window.addEventListener("hashchange", () => { this.parse(); window.scrollTo({ top: 0 }); });
    this.parse();
  },
};
