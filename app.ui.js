/* ============ NEXUS UI — layout, header, footer, charts, components ============ */
function Logo(onclick, size = 1) {
  return h("div", { onclick, style: { display: "flex", alignItems: "center", gap: "10px", cursor: onclick ? "pointer" : "default" } },
    h("div", { style: { width: `${36 * size}px`, height: `${36 * size}px`, borderRadius: "11px", background: "linear-gradient(135deg,var(--pri),var(--acc))", display: "grid", placeItems: "center", fontWeight: "800", fontSize: `${19 * size}px`, color: "#fff", fontFamily: "Sora" } }, "◈"),
    h("div", { style: { lineHeight: "1.05" } },
      h("div", { style: { fontWeight: "800", fontSize: `${19 * size}px`, fontFamily: "Sora", letterSpacing: "-.03em" } }, "NEXUS"),
      h("div", { style: { fontSize: `${10 * size}px`, color: "var(--mut)", letterSpacing: ".16em", fontWeight: "600" } }, "MARKETPLACE")));
}

/* ---------- Header ---------- */
function Header() {
  if (document.body.classList.contains("public-theme")) return ArabicHeader();
  const nav = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Categories", path: "/categories" },
    { label: "Sell on NEXUS", path: "/vendor/register" },
  ];
  const cur = Router.current.path;
  const cat = Store.cartCount();
  const unread = Store.db.notifications.filter((n) => !n.read).length;
  const [menuOpen, setMenuOpen] = [false, null];

  const searchInput = h("input", {
    placeholder: "Search 30+ products, brands, vendors…", style: { paddingLeft: "40px", background: "var(--panel2)" },
    value: Router.current.query.q || "",
    onkeydown: (e) => { if (e.key === "Enter") { Router.go("/shop?q=" + encodeURIComponent(e.target.value)); } },
  });
  const searchWrap = h("div", { style: { position: "relative", flex: "1", maxWidth: "480px" } },
    h("span", { style: { position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "var(--mut)", display: "flex" }, html: I.search }),
    searchInput);

  const userArea = () => {
    if (Session.role === "vendor") {
      return h("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
        h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/vendor/dashboard") }, "Vendor Portal"),
        h("button", { class: "btn btn-g btn-sm", onclick: () => { Session.logout(); toast("Signed out", "pri"); Router.go("/"); App.render(); } , html: I.logout }));
    }
    if (Session.role === "admin") {
      return h("div", { style: { display: "flex", gap: "8px" } },
        h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/admin/dashboard") }, "Admin"),
        h("button", { class: "btn btn-g btn-sm", onclick: () => { Session.logout(); Router.go("/"); App.render(); }, html: I.logout }));
    }
    if (Session.user) {
      return h("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
        NotifBell(unread),
        h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/account") }, Session.user.name.split(" ")[0]),
        h("button", { class: "btn btn-g btn-sm", onclick: () => { Session.logout(); toast("Signed out", "pri"); Router.go("/"); App.render(); }, html: I.logout }));
    }
    return h("div", { style: { display: "flex", gap: "8px" } },
      h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/login") }, "Sign in"),
      h("button", { class: "btn btn-p btn-sm", onclick: () => Router.go("/vendor/register") }, "Start selling"));
  };

  return h("header", { class: "fade-in", style: { position: "sticky", top: 0, zIndex: 100, background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: "20px", padding: "13px 22px", maxWidth: "1560px", margin: "0 auto" } },
      Logo(() => Router.go("/")),
      h("nav", { class: "hide-m", style: { display: "flex", gap: "4px" } },
        nav.map((n) => h("a", { href: "#" + n.path, style: { padding: "8px 13px", borderRadius: "9px", fontSize: "14px", fontWeight: "500", color: cur === n.path ? "var(--txt)" : "var(--mut)", background: cur === n.path ? "var(--panel2)" : "none" } }, n.label))),
      h("div", { class: "hide-m", style: { flex: "1", display: "flex", justifyContent: "center" } }, searchWrap),
      h("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" } },
        ThemeToggle(),
        h("button", { class: "btn btn-g btn-sm", style: { position: "relative" }, onclick: () => Router.go("/cart") }, I.cart, cat > 0 ? h("span", { style: { position: "absolute", top: "-6px", right: "-6px", background: "var(--pri)", color: "#fff", borderRadius: "99px", fontSize: "10px", padding: "2px 6px", fontWeight: "700" } }, cat) : null),
        userArea())));
}

function NotifBell(unread) {
  return h("button", { class: "btn btn-g btn-sm", style: { position: "relative" }, onclick: () => {
    const list = Store.db.notifications;
    const m = modal("Notifications",
      list.length ? h("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } }, list.map((n) =>
        h("div", { style: { padding: "13px", borderRadius: "11px", background: n.read ? "transparent" : "var(--panel2)", border: "1px solid var(--line)", display: "flex", gap: "12px" } },
          h("div", { style: { fontSize: "20px" } }, n.type === "order" ? "📦" : n.type === "payout" ? "💰" : n.type === "stock" ? "⚠️" : "⭐"),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontWeight: "600", fontSize: "14px" } }, n.title),
            h("div", { style: { color: "var(--mut)", fontSize: "13px", marginTop: "2px" } }, n.body),
            h("div", { style: { color: "var(--mut)", fontSize: "11px", marginTop: "5px" } }, dt(n.at, "ago")))))) :
        h("p", { style: { color: "var(--mut)" } }, "No notifications"),
      { footer: [h("button", { class: "btn btn-g", onclick: () => { Store.db.notifications.forEach((n) => (n.read = true)); Store.save(); Store.emit(); m.close(); } }, "Mark all read")] });
  } }, I.bell, unread > 0 ? h("span", { style: { position: "absolute", top: "-6px", right: "-6px", background: "var(--bad)", color: "#fff", borderRadius: "99px", fontSize: "10px", padding: "2px 6px", fontWeight: "700" } }, unread) : null);
}

function ThemeToggle() {
  const isDark = Store.db.settings.theme !== "light";
  return h("button", {
    class: "btn btn-g btn-sm", title: "Toggle theme",
    onclick: () => { Store.db.settings.theme = isDark ? "light" : "dark"; Store.save(); applyTheme(); Store.emit(); },
  }, isDark ? "🌙" : "☀️");
}
function applyTheme() { document.documentElement.dataset.theme = Store.db.settings.theme === "light" ? "light" : "dark"; }

function EnglishFooter() {
  const cols = [
    ["Marketplace", [["All Products", "/shop"], ["Categories", "/categories"], ["Deals", "/shop?sort=discount"], ["Top Vendors", "/vendors"]]],
    ["Sell", [["Become a Vendor", "/vendor/register"], ["Vendor Login", "/vendor/login"], ["Fee Structure", "/pricing"], ["Seller Guide", "/guide"]]],
    ["Support", [["Help Center", "/help"], ["Track Order", "/track"], ["Returns", "/returns"], ["Contact", "/contact"]]],
    ["Company", [["About", "/about"], ["Careers", "/careers"], ["Privacy", "/privacy"], ["Terms", "/terms"]]],
  ];
  return h("footer", { style: { borderTop: "1px solid var(--line)", marginTop: "70px", background: "var(--bg2)" } },
    h("div", { style: { maxWidth: "1560px", margin: "0 auto", padding: "50px 22px 26px", display: "grid", gridTemplateColumns: "1.6fr repeat(4, 1fr)", gap: "34px" } },
      h("div", {},
        Logo(),
        h("p", { style: { color: "var(--mut)", fontSize: "13px", lineHeight: "1.7", marginTop: "14px", maxWidth: "280px" } }, "The multi-vendor marketplace connecting 42,000+ independent sellers with millions of buyers worldwide."),
        h("div", { style: { display: "flex", gap: "9px", marginTop: "16px" } }, ["Visa", "MC", "Amex", "PayPal"].map((p) => h("span", { style: { padding: "5px 10px", borderRadius: "7px", border: "1px solid var(--line)", fontSize: "11px", color: "var(--mut)", fontWeight: "600" } }, p)))),
      cols.map(([title, links]) => h("div", {},
        h("h4", { style: { fontSize: "13px", marginBottom: "14px", letterSpacing: ".05em", textTransform: "uppercase", color: "var(--mut)" } }, title),
        h("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } }, links.map(([l, p]) => h("a", { href: "#" + p, style: { fontSize: "14px", color: "var(--txt)", opacity: ".78" } }, l)))))),
    h("div", { style: { borderTop: "1px solid var(--line)", padding: "20px 22px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", maxWidth: "1560px", margin: "0 auto", color: "var(--mut)", fontSize: "13px" } },
      h("span", {}, "© 2026 NEXUS Marketplace Inc. All rights reserved."),
      h("span", { style: { display: "flex", gap: "16px" } }, h("span", {}, "🌐 English (US)"), h("span", {}, "USD $"), h("span", {}, "v1.0.0"))));
}

/* ---------- charts (dependency-free SVG) ---------- */
function AreaChart(data, { height = 240, color = "var(--pri)", key = "revenue", fmt = (v) => money(v) } = {}) {
  if (!data.length) return h("div", { style: { height: height + "px", display: "grid", placeItems: "center", color: "var(--mut)" } }, "No data");
  const w = 1000, pad = 34, max = Math.max(...data.map((d) => d[key]), 1) * 1.15;
  const pts = data.map((d, i) => [pad + (i / (data.length - 1 || 1)) * (w - pad * 2), height - pad - (d[key] / max) * (height - pad * 2)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${pts.at(-1)[0]} ${height - pad} L ${pts[0][0]} ${height - pad} Z`;
  const gid = uid("g");
  const sparks = [0, 1, 2, 3].map((i) => pad + (i / 3) * (w - pad * 2));
  const labels = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0);
  return h("div", { style: { width: "100%" } },
    h("div", { html: `<svg viewBox="0 0 ${w} ${height}" preserveAspectRatio="none" style="width:100%;height:${height}px;display:block">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity=".38"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient></defs>
      ${sparks.map((x) => `<line x1="${x}" y1="${pad}" x2="${x}" y2="${height - pad}" stroke="var(--line)" stroke-dasharray="3 5"/>`).join("")}
      <path d="${area}" fill="url(#${gid})"/>
      <path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.filter((_, i) => i % Math.max(1, Math.floor(data.length / 12)) === 0).map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="var(--panel)" stroke="${color}" stroke-width="2.4"/>`).join("")}
    </svg>` }),
    h("div", { style: { display: "flex", justifyContent: "space-between", padding: "4px 6px 0", color: "var(--mut)", fontSize: "11px" } },
      labels.map((d) => h("span", {}, d.label))));
}

function BarsChart(data, { height = 200, key = "revenue", fmt = (v) => money(v), color = "var(--pri)" } = {}) {
  const max = Math.max(...data.map((d) => d[key]), 1);
  return h("div", { style: { display: "flex", alignItems: "flex-end", gap: "6px", height: height + "px", padding: "10px 0" } },
    data.map((d) => h("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }, title: `${d.label}: ${fmt(d[key])}` },
      h("div", { style: { width: "100%", maxWidth: "38px", height: Math.max(3, (d[key] / max) * 100) + "%", background: `linear-gradient(180deg,${color},color-mix(in srgb,${color} 40%, transparent))`, borderRadius: "6px 6px 3px 3px", transition: ".3s" } }))));
}

function DonutChart(items, { size = 190, thickness = 26 } = {}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const colors = ["#6d5efc", "#00e5a0", "#ffb020", "#ff6b9d", "#4dabff", "#8b7dff"];
  const r = (size - thickness) / 2, c = size / 2, circ = 2 * Math.PI * r;
  let off = 0;
  const segs = items.map((it, i) => {
    const frac = it.value / total, dash = `${frac * circ} ${circ - frac * circ}`;
    const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${it.color || colors[i % colors.length]}" stroke-width="${thickness}" stroke-dasharray="${dash}" stroke-dashoffset="${-off}" transform="rotate(-90 ${c} ${c})" stroke-linecap="butt"/>`;
    off += frac * circ; return el;
  }).join("");
  return h("div", { style: { display: "flex", gap: "22px", alignItems: "center", flexWrap: "wrap" } },
    h("div", { html: `<svg width="${size}" height="${size}">${segs}<text x="${c}" y="${c - 4}" text-anchor="middle" fill="var(--mut)" font-size="11" font-family="Inter">TOTAL</text><text x="${c}" y="${c + 15}" text-anchor="middle" fill="var(--txt)" font-size="17" font-weight="700" font-family="Sora">${compact(total)}</text></svg>` }),
    h("div", { style: { display: "flex", flexDirection: "column", gap: "9px", flex: 1, minWidth: "150px" } },
      items.map((it, i) => h("div", { style: { display: "flex", alignItems: "center", gap: "9px", fontSize: "13px" } },
        h("span", { style: { width: "11px", height: "11px", borderRadius: "3px", background: it.color || colors[i % colors.length], flexShrink: 0 } }),
        h("span", { style: { flex: 1, color: "var(--mut)" } }, it.label),
        h("span", { style: { fontWeight: "600" } }, compact(it.value))))));
}

function StatCard(label, value, delta, icon, sub) {
  const up = delta >= 0;
  return h("div", { class: "stat fade-in" },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      h("div", { style: { color: "var(--mut)", fontSize: "12.5px", fontWeight: "600", letterSpacing: ".03em", textTransform: "uppercase" } }, label),
      h("div", { style: { color: "var(--pri2)", display: "flex" }, html: icon })),
    h("div", { style: { fontSize: "30px", fontWeight: "800", fontFamily: "Sora", marginTop: "10px", letterSpacing: "-.03em" } }, value),
    h("div", { style: { display: "flex", alignItems: "center", gap: "7px", marginTop: "8px", fontSize: "12.5px" } },
      delta != null ? h("span", { class: "chip " + (up ? "chip-ok" : "chip-bad"), style: { padding: "2px 8px" } }, (up ? "▲ " : "▼ ") + Math.abs(delta) + "%") : null,
      sub ? h("span", { style: { color: "var(--mut)" } }, sub) : null));
}

function StatusChip(status) {
  const m = STATUS_META[status] || { label: status, cls: "chip" };
  return h("span", { class: "chip " + m.cls }, m.label);
}

function Empty(title, sub, action) {
  return h("div", { style: { padding: "70px 20px", textAlign: "center" } },
    h("div", { style: { fontSize: "52px", marginBottom: "12px", opacity: ".5" } }, "🗂️"),
    h("h3", { style: { margin: "0 0 8px" } }, title),
    h("p", { style: { color: "var(--mut)", margin: "0 0 18px" } }, sub),
    action || null);
}

function Pager(page, pages, onPage) {
  if (pages <= 1) return h("div");
  const btn = (n, label, active, dis) => h("button", {
    class: "btn btn-xs " + (active ? "btn-p" : "btn-g"), disabled: dis,
    onclick: () => onPage(n), style: { minWidth: "34px" },
  }, label || n);
  const nums = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
  const out = [];
  let prev = 0;
  nums.forEach((n) => { if (n - prev > 1) out.push(h("span", { style: { color: "var(--mut)", padding: "0 4px" } }, "…")); out.push(btn(n, null, n === page)); prev = n; });
  return h("div", { style: { display: "flex", gap: "6px", justifyContent: "center", alignItems: "center", padding: "18px 0", flexWrap: "wrap" } },
    btn(page - 1, "‹", false, page === 1), out, btn(page + 1, "›", false, page === pages));
}

function Toolbar({ q, setQ, children, right }) {
  return h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "18px" } },
    h("div", { style: { position: "relative", flex: "1", minWidth: "200px", maxWidth: "340px" } },
      h("span", { style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--mut)", display: "flex" }, html: I.search }),
      h("input", { placeholder: "Search…", value: q || "", oninput: (e) => setQ(e.target.value), style: { paddingLeft: "38px" } })),
    ...(children || []),
    right ? h("div", { style: { marginLeft: "auto", display: "flex", gap: "8px" } }, right) : null);
}

function Select(value, options, onChange, style = {}) {
  return h("select", { onchange: (e) => onChange(e.target.value), style: { width: "auto", minWidth: "130px", ...style } },
    options.map((o) => h("option", { value: o.value, selected: String(o.value) === String(value) }, o.label)));
}
