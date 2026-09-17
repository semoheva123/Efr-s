/* ============ NEXUS BOOT — auth, routing, application mount ============ */
function PublicPage(content, noFooter = false) {
  return h("div", { class: "fade-in" }, Header(), content, noFooter ? null : null);
}

function AuthPage(mode = "login", vendorMode = false) {
  let current = mode, isVendor = vendorMode, remember = true;
  const wrap = h("div", { style: { minHeight: "calc(100vh - 1px)", display: "grid", gridTemplateColumns: "1fr 1fr" } });
  const data = { email: isVendor ? "vendor@nexus.dev" : "", password: isVendor ? "vendor123" : "", name: "", storeName: "", country: "", city: "", description: "" };
  const render = () => {
    const signup = current === "register";
    const field = (label, key, type = "text", placeholder = "") => h("label", { style: { display: "grid", gap: "6px", color: "var(--mut)", fontSize: "12px" } }, label, h("input", { type, placeholder, value: data[key], required: ["email", "password", "name", "storeName"].includes(key), oninput: (e) => data[key] = e.target.value }));
    const proof = h("div", { style: { display: "flex", gap: "20px", marginTop: "32px", color: "var(--mut)", fontSize: "12px" } }, "✦ 42k+ sellers", "✦ 1.2m+ products", "✦ 4.9/5 trust");
    const story = h("div", { style: { maxWidth: "520px", marginTop: "clamp(60px,12vh,150px)" } }, h("span", { class: "chip chip-pri" }, isVendor ? "SELLER PLATFORM" : "WELCOME TO NEXUS"), h("h1", { style: { fontSize: "clamp(32px,5vw,62px)", lineHeight: "1.05", margin: "20px 0 15px" } }, isVendor ? "Build a store people remember." : "The world is full of good things."), h("p", { style: { color: "var(--mut)", fontSize: "15px", lineHeight: "1.7", maxWidth: "430px" } }, isVendor ? "Powerful tools, simple workflows, and a marketplace that puts independent brands first." : "Sign in to track your orders, save favorites, and discover your next favorite brand."), proof);
    const left = h("div", { style: { padding: "clamp(30px,7vw,100px)", background: "radial-gradient(circle at 15% 20%,rgba(109,94,252,.28),transparent 35%),radial-gradient(circle at 90% 85%,rgba(0,229,160,.15),transparent 35%),var(--bg)", display: "flex", flexDirection: "column", justifyContent: "center" } }, Logo(() => Router.go("/"), 1.1), story);
    const submit = (e) => { e.preventDefault(); const result = signup ? Session.register(data, isVendor) : Session.login(data.email, data.password, isVendor, remember); if (!result.ok) return toast(result.msg, "bad"); toast(signup ? (result.pending ? "Application submitted for review" : "Account created") : "Welcome back", "ok"); const next = Router.current.query.next; Router.go(next || (result.role === "vendor" ? "/vendor/dashboard" : result.role === "admin" ? "/admin/dashboard" : "/")); };
    const switchMode = h("div", { style: { display: "flex", gap: "7px", marginBottom: "25px" } }, h("button", { class: "btn " + (!isVendor ? "btn-p" : "btn-g"), onclick: () => { isVendor = false; data.email = ""; data.password = ""; render(); } }, "Customer"), h("button", { class: "btn " + (isVendor ? "btn-p" : "btn-g"), onclick: () => { isVendor = true; data.email = "vendor@nexus.dev"; data.password = "vendor123"; render(); } }, "Vendor"));
    const extra = signup && isVendor ? [h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, field("Country", "country", "text", "United States"), field("City", "city", "text", "Austin")), h("label", { style: { display: "grid", gap: "6px", color: "var(--mut)", fontSize: "12px" } }, "What do you sell?", h("textarea", { rows: 3, placeholder: "Tell buyers about your store", oninput: (e) => data.description = e.target.value }))] : [];
    const formKids = [signup && !isVendor ? field("Full name", "name", "text", "Alex Morgan") : null, signup && isVendor ? field("Store name", "storeName", "text", "Your brand name") : null, field("Email address", "email", "email", "you@example.com"), field("Password", "password", "password", "••••••••"), ...extra, !signup ? h("label", { style: { display: "flex", gap: "8px", alignItems: "center", color: "var(--mut)", fontSize: "12px" } }, h("input", { type: "checkbox", checked: remember, onchange: (e) => remember = e.target.checked, style: { width: "15px" } }), "Keep me signed in") : h("label", { style: { display: "flex", gap: "8px", alignItems: "center", color: "var(--mut)", fontSize: "12px" } }, h("input", { type: "checkbox", required: true, style: { width: "15px" } }), "I agree to the NEXUS terms and privacy policy"), h("button", { class: "btn btn-p", type: "submit", style: { width: "100%", marginTop: "5px" } }, signup ? (isVendor ? "Submit application" : "Create account") : (isVendor ? "Sign in to seller portal" : "Sign in"), I.arrow)];
    const form = h("form", { style: { display: "grid", gap: "13px" }, onsubmit: submit }, formKids);
    const footer = h("div", { style: { textAlign: "center", marginTop: "18px", fontSize: "13px", color: "var(--mut)" } }, signup ? "Already have an account? " : "New to NEXUS? ", h("button", { style: { background: "none", border: 0, color: "var(--pri2)", cursor: "pointer", fontWeight: "700" }, onclick: () => { current = signup ? "login" : "register"; render(); } }, signup ? "Sign in" : isVendor ? "Open your store" : "Create an account"));
    const demo = !signup ? h("div", { class: "card", style: { padding: "13px", marginTop: "22px", fontSize: "11px", color: "var(--mut)", lineHeight: "1.7" } }, h("strong", { style: { color: "var(--txt)" } }, "Demo access"), h("br"), isVendor ? "Vendor: vendor@nexus.dev / vendor123" : "Customer: customer@nexus.dev / demo123", h("br"), "Admin: admin@nexus.dev / admin123") : null;
    const right = h("div", { style: { background: "var(--bg2)", display: "grid", placeItems: "center", padding: "28px 20px" } }, h("div", { style: { width: "100%", maxWidth: "465px" } }, switchMode, h("h2", { style: { fontSize: "29px", margin: "0 0 8px" } }, signup ? (isVendor ? "Open your store" : "Create your account") : (isVendor ? "Vendor portal" : "Welcome back")), h("p", { style: { color: "var(--mut)", fontSize: "13px", margin: "0 0 22px" } }, signup ? (isVendor ? "Start selling to millions of buyers." : "Join the NEXUS community for free.") : (isVendor ? "Manage products, orders, and payouts." : "Your next discovery is waiting.")), form, footer, demo));
    wrap.replaceChildren(left, right);
  };
  render(); return wrap;
}

function SimpleInfoPage(title, text, icon = "✦") {
  return h("div", { style: { maxWidth: "900px", margin: "0 auto", padding: "80px 22px", textAlign: "center" } }, h("div", { style: { fontSize: "52px", marginBottom: "18px" } }, icon), h("h1", { style: { fontSize: "38px", margin: "0 0 13px" } }, title), h("p", { style: { color: "var(--mut)", lineHeight: "1.75", maxWidth: "620px", margin: "0 auto 24px" } }, text), h("button", { class: "btn btn-p", onclick: () => Router.go("/") }, "Back to marketplace", I.arrow));
}

const App = {
  root: null,
  render() {
    const isPortal = /^#\/(vendor\/(dashboard|analytics|products|orders|payouts|coupons|settings|store)|admin\/)/.test(location.hash || "");
    document.body.classList.toggle("public-theme", !isPortal);
    document.documentElement.dir = LANGS[I18n.lang]?.dir || "rtl";
    document.documentElement.lang = I18n.lang || "ar";
    const page = Router.parse();
    if (page?.nodeType) { this.root.replaceChildren(page); I18n.translateDom(this.root); }
  },
  notFound() { return NotFoundPage(); },
};

/* ---------- route table ---------- */
Router.add("/", () => PublicPage(h("div", {}, ArabicHomePage())));
Router.add("/shop", () => PublicPage(h("div", {}, ShopPage())));
Router.add("/categories", () => PublicPage(h("div", {}, CategoriesPage())));
Router.add("/product/:id", ({ id }) => PublicPage(h("div", {}, ProductDetailPage(id))));
Router.add("/cart", () => PublicPage(h("div", {}, CartPage())));
Router.add("/checkout", () => PublicPage(h("div", {}, CheckoutPage())));
Router.add("/order/:id", ({ id }) => PublicPage(h("div", {}, OrderPage(id))));
Router.add("/account", () => PublicPage(h("div", {}, AccountPage())));
Router.add("/login", () => PublicPage(AuthPage("login", false), true));
Router.add("/register", () => PublicPage(AuthPage("register", false), true));
Router.add("/vendor/login", () => PublicPage(AuthPage("login", true), true));
Router.add("/vendor/register", () => PublicPage(AuthPage("register", true), true));
Router.add("/vendor/dashboard", () => VendorPage("dashboard"));
Router.add("/vendor/analytics", () => VendorPage("analytics"));
Router.add("/vendor/products", () => VendorPage("products"));
Router.add("/vendor/orders", () => VendorPage("orders"));
Router.add("/vendor/payouts", () => VendorPage("payouts"));
Router.add("/vendor/coupons", () => VendorPage("coupons"));
Router.add("/vendor/settings", () => VendorPage("settings"));
Router.add("/vendor/store", () => VendorPage("store"));
Router.add("/vendor/:id", ({ id }) => PublicPage(h("div", {}, VendorStorePage(id))));
Router.add("/admin/dashboard", () => AdminPage("dashboard"));
Router.add("/admin/analytics", () => AdminPage("analytics"));
Router.add("/admin/vendors", () => AdminPage("vendors"));
Router.add("/admin/products", () => AdminPage("products"));
Router.add("/admin/orders", () => AdminPage("orders"));
Router.add("/admin/users", () => AdminPage("users"));
Router.add("/admin/payouts", () => AdminPage("payouts"));
Router.add("/admin/coupons", () => AdminPage("coupons"));
Router.add("/admin/settings", () => AdminPage("settings"));
for (const [path, title, text, icon] of [["/about", "About NEXUS", "NEXUS is a modern marketplace built for independent brands and curious buyers. We combine the reach of a global platform with the personality of small businesses.", "◈"], ["/help", "How can we help?", "Our support team is ready to help with orders, returns, payments, and your seller journey.", "💬"], ["/pricing", "Simple, transparent pricing", "Start with a 30-day free trial. Our marketplace commission is only charged when you make a sale.", "◒"], ["/track", "Track your order", "Sign in to your account to see live order status and delivery updates.", "🚚"], ["/returns", "Returns made simple", "Most products can be returned within 30 days in original condition. Buyer protection is included on every order.", "↩"], ["/contact", "Contact the NEXUS team", "Email support@nexus.dev and a member of our team will get back to you within one business day.", "✉"]]) Router.add(path, () => PublicPage(h("div", {}, SimpleInfoPage(title, text, icon))));

/* ---------- startup ---------- */
Store.load(); I18n.init(); Session.load(); applyTheme();
Store.subscribe(() => { applyTheme(); });
document.addEventListener("click", (e) => {
  const button = e.target.closest?.("button");
  if (!button || button.textContent.trim() !== "Apply") return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const input = button.parentElement?.querySelector("input");
  const result = Store.applyCoupon(input?.value || "");
  toast(result.msg, result.ok ? "ok" : "bad");
  App.render();
}, true);
window.addEventListener("hashchange", () => App.render());
window.addEventListener("DOMContentLoaded", () => { App.root = $("#app"); App.render(); });
