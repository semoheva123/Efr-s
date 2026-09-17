/* ============ NEXUS SHOP — public storefront and customer flows ============ */
function ProductCard(p) {
  const v = Store.vendor(p.vendorId);
  const saved = Store.inWishlist(p.id);
  return h("article", { class: "pcard fade-in", onclick: () => Router.go("/product/" + p.id) },
    h("div", { class: "pcard-img", style: { backgroundImage: `url('${productImage(p)}')` } },
      p.discount > 0 ? h("span", { class: "badge-sale" }, "-" + p.discount + "%") : null,
      new Date(p.createdAt) > new Date(Date.now() - 35 * 864e5) ? h("span", { class: "badge-new" }, t("new")) : null,
      h("button", { class: "btn btn-g btn-xs", style: { position: "absolute", right: "10px", top: "10px", zIndex: 3, color: saved ? "var(--bad)" : "var(--mut)" }, onclick: (e) => { e.stopPropagation(); Store.toggleWishlist(p.id); } }, saved ? "♥" : "♡"),
      h("div", { style: { fontSize: "76px", filter: "drop-shadow(0 12px 12px rgba(0,0,0,.18))" } }, p.emoji)),
    h("div", { style: { padding: "15px", display: "flex", flexDirection: "column", gap: "7px", flex: 1 } },
      h("div", { style: { color: "var(--mut)", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em" } }, localizedVendor(v?.name || "NEXUS Seller")),
      h("h3", { style: { fontSize: "15px", lineHeight: "1.35", margin: 0, minHeight: "40px" } }, localizedProductName(p)),
      h("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, h("span", { class: "stars" }, stars(p.rating)), h("span", { style: { color: "var(--mut)", fontSize: "12px" } }, "(" + num(p.reviewCount) + ")")),
      h("div", { style: { display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" } }, h("strong", { style: { fontSize: "19px" } }, money(p.price)), h("del", { style: { color: "var(--mut)", fontSize: "12px" } }, money(p.compareAt))),
      h("div", { style: { marginTop: "auto", paddingTop: "8px", display: "flex", gap: "6px", alignItems: "center", color: p.stock <= 25 ? "var(--warn)" : "var(--mut)", fontSize: "11px" } }, p.stock <= 25 ? "⚠ " + t("onlyLeft") + " " + p.stock : p.freeShipping ? "✦ " + t("freeShipping") : t("standardShipping")),
      h("button", { class: "btn btn-p btn-sm", onclick: (e) => { e.stopPropagation(); Store.addToCart(p.id); } }, NXI.cart, t("addCart"))));
}

function StoreHero() {
  return h("section", { style: { maxWidth: "1560px", margin: "0 auto", padding: "44px 22px 28px" } },
    h("div", { style: { display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "18px" } },
      h("div", { class: "card", style: { minHeight: "385px", padding: "clamp(28px,5vw,62px)", position: "relative", overflow: "hidden", background: "radial-gradient(circle at 90% 10%, rgba(0,229,160,.18), transparent 30%), radial-gradient(circle at 70% 100%, rgba(109,94,252,.28), transparent 42%), var(--panel)" } },
        h("div", { style: { position: "absolute", right: "5%", top: "14%", fontSize: "clamp(110px,17vw,210px)", opacity: ".11", transform: "rotate(-12deg)" } }, "◈"),
        h("span", { class: "chip chip-pri", style: { marginBottom: "18px" } }, "THE NEW NEXUS · 2026"),
        h("h1", { style: { fontSize: "clamp(34px,5vw,66px)", lineHeight: "1.02", maxWidth: "680px", margin: "0 0 16px" } }, "Everything worth having,", h("br"), h("span", { class: "hl" }, "all in one place.")),
        h("p", { style: { color: "var(--mut)", maxWidth: "530px", fontSize: "16px", lineHeight: "1.7", margin: "0 0 26px" } }, "Discover independent brands and world-class products from verified sellers. One marketplace, endless possibilities."),
        h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" } }, h("button", { class: "btn btn-p", onclick: () => Router.go("/shop") }, "Explore the marketplace", NXI.arrow), h("button", { class: "btn btn-g", onclick: () => Router.go("/vendor/register") }, "Open your store")),
        h("div", { style: { display: "flex", gap: "24px", marginTop: "31px", color: "var(--mut)", fontSize: "12px" } }, h("span", {}, "✓ Verified sellers"), h("span", {}, "✓ Secure checkout"), h("span", {}, "✓ Buyer protection"))),
      h("div", { style: { display: "grid", gap: "18px" } },
        h("div", { class: "card", style: { flex: 1, padding: "27px", background: "linear-gradient(135deg,rgba(109,94,252,.28),rgba(109,94,252,.06))", position: "relative", overflow: "hidden" } },
          h("div", { style: { position: "absolute", right: "25px", bottom: "-14px", fontSize: "110px", opacity: ".28" } }, "⚡"),
          h("span", { class: "chip", style: { color: "var(--pri2)" } }, "FLASH DROP"), h("h2", { style: { margin: "16px 0 6px", fontSize: "25px" } }, "Up to 45% off"), h("p", { style: { color: "var(--mut)", margin: "0 0 20px", fontSize: "13px" } }, "Limited-time deals on electronics & tech."), h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/shop?sort=discount") }, "Shop deals", NXI.arrow)),
        h("div", { class: "card", style: { padding: "27px", background: "linear-gradient(135deg,rgba(0,229,160,.19),rgba(0,229,160,.04))", position: "relative", overflow: "hidden" } },
          h("div", { style: { position: "absolute", right: "20px", bottom: "-16px", fontSize: "100px", opacity: ".22" } }, "🌱"),
          h("span", { class: "chip", style: { color: "var(--acc)" } }, "SELL WITH US"), h("h2", { style: { margin: "16px 0 6px", fontSize: "25px" } }, "Your brand, amplified."), h("p", { style: { color: "var(--mut)", margin: "0 0 20px", fontSize: "13px" } }, "Join 42,000+ sellers reaching new customers."), h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/vendor/register") }, "Start for free", NXI.arrow)))));
}

function CategoryStrip() {
  return h("section", { style: { maxWidth: "1560px", margin: "0 auto", padding: "18px 22px 28px" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" } }, h("h2", { style: { fontSize: "20px", margin: 0 } }, "Browse categories"), h("a", { href: "#/categories", style: { color: "var(--pri2)", fontSize: "13px" } }, "View all →")),
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" } }, CATEGORIES.map((c) => h("button", { class: "card", style: { cursor: "pointer", padding: "21px 15px", textAlign: "left", transition: ".18s", borderColor: "var(--line)" }, onclick: () => Router.go("/shop?category=" + c.id) }, h("div", { style: { fontSize: "32px", marginBottom: "12px" } }, c.icon), h("div", { style: { fontWeight: "700", fontSize: "13px" } }, c.name), h("div", { style: { color: "var(--mut)", fontSize: "11px", marginTop: "5px" } }, Store.products({ category: c.id }).length + " products")))));
}

function ProductShelf(title, sub, list, link) {
  return h("section", { style: { maxWidth: "1560px", margin: "0 auto", padding: "25px 22px" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: "17px" } }, h("div", {}, h("h2", { style: { fontSize: "22px", margin: "0 0 5px" } }, title), h("p", { style: { color: "var(--mut)", fontSize: "13px", margin: 0 } }, sub)), link ? h("a", { href: "#" + link, style: { color: "var(--pri2)", fontSize: "13px" } }, "See all →") : null),
    h("div", { class: "grid-prod" }, list.map(ProductCard)));
}

function HomePage() {
  const products = Store.products();
  return h("div", { class: "fade-in" }, StoreHero(), CategoryStrip(), ProductShelf("Trending now", "Products our community is loving right now", products.slice().sort((a, b) => b.sold - a.sold).slice(0, 5), "/shop?sort=popular"), ProductShelf("Fresh arrivals", "New drops from verified independent sellers", products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), "/shop?sort=new"), TrustBand(), Footer());
}

function TrustBand() {
  return h("section", { style: { maxWidth: "1560px", margin: "32px auto 10px", padding: "0 22px" } }, h("div", { class: "card", style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "22px 26px", gap: "16px" } }, [
    [NXI.shield, "Buyer protection", "Every purchase is covered"], [NXI.truck, "Fast, reliable shipping", "Track every order"], [NXI.users, "Verified sellers", "Real brands, real people"], [NXI.wallet, "Secure payments", "Your data stays private"],
  ].map(([icon, t, s]) => h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, h("span", { style: { color: "var(--acc)", display: "flex" }, html: icon }), h("div", {}, h("div", { style: { fontWeight: "700", fontSize: "13px" } }, t), h("div", { style: { color: "var(--mut)", fontSize: "11px", marginTop: "3px" } }, s))))));
}

function ShopPage() {
  const q0 = Router.current.query.q || "", c0 = Router.current.query.category || "";
  let q = q0, cat = c0, sort = Router.current.query.sort || "featured", page = 1, view = "grid";
  const content = h("div", { style: { maxWidth: "1560px", margin: "0 auto", padding: "34px 22px" } });
  const render = () => {
    let products = Store.products({ q, category: cat });
    if (sort === "price-low") products.sort((a, b) => a.price - b.price);
    if (sort === "price-high") products.sort((a, b) => b.price - a.price);
    if (sort === "popular") products.sort((a, b) => b.sold - a.sold);
    if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    if (sort === "new") products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "discount") products.sort((a, b) => b.discount - a.discount);
    const per = 12, pages = Math.max(1, Math.ceil(products.length / per)); page = Math.min(page, pages);
    const shown = products.slice((page - 1) * per, page * per);
    content.replaceChildren(
      h("div", { style: { marginBottom: "25px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px", marginBottom: "10px" } }, t("home") + " / " + t("shop")), h("h1", { style: { margin: 0, fontSize: "32px" } }, cat ? localizedCategory(cat) : q ? t("searchResults") : t("shopTitle")), h("p", { style: { color: "var(--mut)", margin: "8px 0 0" } }, products.length + " " + t("productsFromSellers"))),
      h("div", { style: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "26px", alignItems: "start" } },
        h("aside", { class: "card", style: { padding: "17px", position: "sticky", top: "90px" } },
          h("div", { style: { fontWeight: "700", marginBottom: "16px" } }, t("filters")),
          h("div", { style: { color: "var(--mut)", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" } }, t("category")),
          h("div", { style: { display: "flex", flexDirection: "column", gap: "3px" } }, h("button", { class: "nav-link " + (!cat ? "on" : ""), onclick: () => { cat = ""; page = 1; render(); } }, t("allProducts")), CATEGORIES.map((c) => h("button", { class: "nav-link " + (cat === c.id ? "on" : ""), onclick: () => { cat = c.id; page = 1; render(); } }, c.icon, localizedCategory(c.id)))),
          h("div", { style: { borderTop: "1px solid var(--line)", marginTop: "18px", paddingTop: "17px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" } }, t("quickFilters")), [t("freeShipping"), t("onSale"), t("inStock")].map((f) => h("label", { style: { display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", padding: "7px 0", color: "var(--mut)" } }, h("input", { type: "checkbox", style: { width: "15px", accentColor: "var(--pri)" } }), f))),
          h("div", { style: { borderTop: "1px solid var(--line)", marginTop: "18px", paddingTop: "17px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" } }, t("priceRange")), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" } }, h("input", { placeholder: "Min", type: "number" }), h("input", { placeholder: "Max", type: "number" })))),
        h("main", {},
          Toolbar({ q, setQ: (v) => { q = v; page = 1; render(); } }),
          h("div", { style: { display: "flex", alignItems: "center", gap: "9px", marginBottom: "17px" } }, h("span", { style: { color: "var(--mut)", fontSize: "13px" } }, t("sortBy")), Select(sort, [{ value: "featured", label: t("featured") }, { value: "popular", label: t("mostPopular") }, { value: "new", label: t("newest") }, { value: "rating", label: t("topRated") }, { value: "price-low", label: t("priceLow") }, { value: "price-high", label: t("priceHigh") }, { value: "discount", label: t("biggestDiscount") }], (v) => { sort = v; page = 1; render(); }), h("span", { style: { marginLeft: "auto", color: "var(--mut)", fontSize: "13px" } }, t("showing") + " " + (products.length ? (page - 1) * per + 1 : 0) + "–" + Math.min(page * per, products.length) + " " + t("of") + " " + products.length)),
          shown.length ? h("div", { class: "grid-prod" }, shown.map(ProductCard)) : Empty(t("noResults"), t("tryDifferent"), h("button", { class: "btn btn-p", onclick: () => { q = ""; cat = ""; render(); } }, t("clearFilters"))), Pager(page, pages, (n) => { page = n; render(); })))
    );
  };
  render(); return h("div", { class: "fade-in" }, content, Footer());
}

function CategoriesPage() {
  const cards = CATEGORIES.map((c) => h("div", {
    class: "card",
    style: { padding: "28px", minHeight: "180px", cursor: "pointer", background: `linear-gradient(135deg,${c.color}28,transparent 65%),var(--panel)` },
    onclick: () => Router.go("/shop?category=" + c.id),
  }, h("div", { style: { fontSize: "46px" } }, c.icon), h("h2", { style: { fontSize: "19px", margin: "17px 0 5px" } }, c.name), h("p", { style: { color: "var(--mut)", fontSize: "13px", margin: 0 } }, Store.products({ category: c.id }).length + " products · Shop now →")));
  const intro = h("div", { style: { marginBottom: "26px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px" } }, "Home / Categories"), h("h1", { style: { margin: "9px 0 5px", fontSize: "34px" } }, "Shop by category"), h("p", { style: { color: "var(--mut)", margin: 0 } }, "Explore carefully selected products from our marketplace."));
  return h("div", { style: { maxWidth: "1560px", margin: "0 auto", padding: "40px 22px" } }, intro, h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" } }, cards), Footer());
}

function ProductDetailPage(id) {
  const p = Store.product(id);
  if (!p) return NotFoundPage();
  const v = Store.vendor(p.vendorId), related = Store.products({ category: p.category }).filter((x) => x.id !== p.id).slice(0, 4);
  let qty = 1, tab = "details";
  const wrap = h("div", { style: { maxWidth: "1560px", margin: "0 auto", padding: "30px 22px" } });
  const render = () => {
    const thumbs = p.gallery.map((x, i) => h("div", { class: "card", style: { width: "78px", height: "70px", display: "grid", placeItems: "center", fontSize: "28px", borderColor: i === 0 ? "var(--pri)" : "var(--line)" } }, x));
    const media = h("div", {}, h("div", { class: "card", style: { aspectRatio: "1.1", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 35%,rgba(109,94,252,.14),transparent 60%),var(--panel2)", position: "relative" } }, h("span", { class: "badge-sale" }, "SAVE " + p.discount + "%"), h("div", { style: { fontSize: "clamp(120px,18vw,220px)" } }, p.emoji)), h("div", { style: { display: "flex", gap: "10px", marginTop: "12px" } }, thumbs));
    const info = h("div", {}, h("span", { class: "chip chip-pri" }, CATEGORIES.find((c) => c.id === p.category)?.name || p.category), h("h1", { style: { fontSize: "clamp(28px,4vw,43px)", lineHeight: "1.1", margin: "16px 0 12px" } }, p.name), h("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" } }, h("span", { class: "stars" }, stars(p.rating)), h("strong", {}, p.rating), h("span", { style: { color: "var(--mut)" } }, num(p.reviewCount) + " reviews")), h("div", { style: { display: "flex", alignItems: "baseline", gap: "12px", padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" } }, h("strong", { style: { fontSize: "34px" } }, money(p.price)), h("del", { style: { color: "var(--mut)" } }, money(p.compareAt)), h("span", { class: "chip chip-bad" }, p.discount + "% off")), h("p", { style: { color: "var(--mut)", lineHeight: "1.75", fontSize: "14px", margin: "20px 0" } }, p.description), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginBottom: "20px" } }, p.features.map((f) => h("div", { style: { background: "var(--panel2)", borderRadius: "8px", padding: "10px", fontSize: "12px" } }, "✓ ", f))), h("div", { style: { display: "flex", gap: "9px", alignItems: "center" } }, h("div", { style: { display: "flex", border: "1px solid var(--line)", borderRadius: "9px", overflow: "hidden" } }, h("button", { class: "btn btn-g btn-sm", onclick: () => { qty = Math.max(1, qty - 1); render(); } }, "−"), h("span", { style: { minWidth: "40px", display: "grid", placeItems: "center" } }, qty), h("button", { class: "btn btn-g btn-sm", onclick: () => { qty = Math.min(p.stock, qty + 1); render(); } }, "+")), h("button", { class: "btn btn-p", style: { flex: 1 }, onclick: () => Store.addToCart(p.id, qty) }, NXI.cart, "Add to cart"), h("button", { class: "btn btn-g", onclick: () => Store.toggleWishlist(p.id) }, Store.inWishlist(p.id) ? "♥" : "♡")), h("div", { style: { display: "flex", gap: "16px", marginTop: "14px", fontSize: "12px", color: "var(--mut)" } }, p.stock + " in stock", p.freeShipping ? "✦ Free shipping" : "Standard shipping", "↩ 30-day returns"), h("div", { class: "card", style: { padding: "14px", marginTop: "22px", display: "flex", gap: "10px", alignItems: "center" } }, h("span", { style: { fontSize: "22px" } }, v?.logo), h("div", { style: { flex: 1 } }, h("strong", {}, v?.name), h("div", { style: { color: "var(--mut)", fontSize: "11px" } }, "★ ", v?.rating, " · ", v?.responseRate, "% response")), h("button", { class: "btn btn-g btn-xs", onclick: () => Router.go("/vendor/" + v.id) }, "View store")));
    const tabs = h("div", { style: { display: "flex", gap: "8px", borderBottom: "1px solid var(--line)", marginBottom: "18px" } }, ["details", "reviews", "shipping"].map((t) => h("button", { class: "btn " + (tab === t ? "btn-p" : "btn-g"), onclick: () => { tab = t; render(); } }, t[0].toUpperCase() + t.slice(1) + (t === "reviews" ? " (" + num(p.reviewCount) + ")" : ""))));
    let tabBody;
    if (tab === "details") tabBody = h("div", { style: { lineHeight: "1.8", color: "var(--mut)", fontSize: "14px" } }, h("h3", { style: { color: "var(--txt)" } }, "About this product"), p.description, h("h3", { style: { color: "var(--txt)", marginTop: "20px" } }, "Specifications"), p.features.map((f, i) => h("div", { style: { padding: "10px", background: "var(--panel2)", borderRadius: "8px", marginTop: "8px" } }, "Feature ", i + 1, ": ", f)));
    else if (tab === "shipping") tabBody = h("div", { style: { color: "var(--mut)", lineHeight: "1.8", fontSize: "14px" } }, "🚚 Free standard shipping on orders over $500. Estimated delivery 3–5 business days.", h("br"), "↩ Easy 30-day returns within 30 days.", h("br"), "🛡️ NEXUS buyer protection covers every purchase.");
    else tabBody = h("div", { style: { display: "grid", gap: "16px" } }, p.reviews.map((r) => h("div", { style: { paddingBottom: "15px", borderBottom: "1px solid var(--line)" } }, h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("strong", {}, r.user), h("span", { class: "stars" }, stars(r.rating))), h("p", { style: { color: "var(--mut)", fontSize: "13px", lineHeight: "1.6", margin: "8px 0" } }, r.text), h("span", { class: "chip chip-ok", style: { fontSize: "10px" } }, "✓ Verified purchase"))));
    const lower = h("div", { class: "card", style: { marginTop: "50px", padding: "23px" } }, tabs, tabBody);
    wrap.replaceChildren(h("div", { style: { color: "var(--mut)", fontSize: "12px", marginBottom: "22px" } }, "Home / ", v?.name, " / ", p.name), h("div", { style: { display: "grid", gridTemplateColumns: ".95fr 1.05fr", gap: "54px", alignItems: "start" } }, media, info), lower);
  };
  render(); return h("div", { class: "fade-in" }, wrap, ProductShelf("You may also like", "More from this category", related));
}

function CartPage() {
  const wrap = h("div", { style: { maxWidth: "1200px", margin: "0 auto", padding: "38px 22px" } });
  const render = () => {
    const d = Store.cartDetail();
    wrap.replaceChildren(h("div", { style: { marginBottom: "24px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px" } }, "Home / Cart"), h("h1", { style: { margin: "9px 0 5px", fontSize: "33px" } }, "Your cart"), h("p", { style: { color: "var(--mut)", margin: 0 } }, d.items.length + " item" + (d.items.length === 1 ? "" : "s") + " from " + new Set(d.items.map((i) => i.product.vendorId)).size + " seller(s)")), d.items.length ? h("div", { style: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px", alignItems: "start" } }, h("div", { class: "card", style: { padding: "5px 20px" } }, d.items.map((i) => h("div", { style: { display: "flex", gap: "15px", padding: "18px 0", borderBottom: "1px solid var(--line)", alignItems: "center" } }, h("div", { style: { width: "82px", height: "82px", flexShrink: 0, background: "var(--panel2)", borderRadius: "11px", display: "grid", placeItems: "center", fontSize: "43px" } }, i.product.emoji), h("div", { style: { flex: 1 } }, h("div", { style: { color: "var(--mut)", fontSize: "11px" } }, i.vendor.name), h("h3", { style: { fontSize: "15px", margin: "4px 0 8px" } }, i.product.name), h("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, h("strong", {}, money(i.product.price)), h("span", { style: { color: "var(--mut)", fontSize: "12px" } }, i.product.freeShipping ? "Free shipping" : "Standard shipping"))), h("div", { style: { display: "flex", alignItems: "center", gap: "7px" } }, h("button", { class: "btn btn-g btn-xs", onclick: () => Store.setQty(i.productId, i.variant, i.qty - 1) }, "−"), h("span", {}, i.qty), h("button", { class: "btn btn-g btn-xs", onclick: () => Store.setQty(i.productId, i.variant, i.qty + 1) }, "+")), h("strong", { style: { minWidth: "80px", textAlign: "right" } }, money(i.line)), h("button", { class: "btn btn-g btn-xs", style: { color: "var(--bad)" }, onclick: () => Store.removeFromCart(i.productId, i.variant) }, NXI.trash))), h("div", { style: { display: "flex", justifyContent: "space-between", padding: "16px 0", fontSize: "13px" } }, h("button", { class: "btn btn-g btn-sm", onclick: () => { Store.clearCart(); toast("Cart cleared", "pri"); } }, "Clear cart"), h("button", { class: "btn btn-g btn-sm", onclick: () => Router.go("/shop") }, "← Continue shopping"))), h("div", { class: "card", style: { padding: "22px", position: "sticky", top: "94px" } }, h("h3", { style: { margin: "0 0 17px" } }, "Order summary"), h("div", { style: { display: "flex", gap: "8px", marginBottom: "17px" } }, h("input", { placeholder: "Coupon code", value: Store.db._appliedCoupon || "" }), h("button", { class: "btn btn-g", onclick: () => { const r = Store.applyCoupon(nxQuery("input", this.parentNode)?.value || ""); toast(r.msg, r.ok ? "ok" : "bad"); render(); } }, "Apply")), Store.db._appliedCoupon ? h("div", { class: "chip chip-ok", style: { marginBottom: "14px" } }, "✓ ", Store.db._appliedCoupon, h("button", { style: { background: "none", border: 0, cursor: "pointer", color: "inherit" }, onclick: () => { Store.clearCoupon(); render(); } }, "×")) : null, h("div", { style: { display: "grid", gap: "12px", fontSize: "14px", color: "var(--mut)" } }, h("div", { style: { display: "flex", justifyContent: "space-between" } }, "Subtotal", h("span", { style: { color: "var(--txt)" } }, money(d.subtotal))), h("div", { style: { display: "flex", justifyContent: "space-between" } }, "Shipping", h("span", { style: { color: d.shipping ? "var(--txt)" : "var(--ok)" } }, d.shipping ? money(d.shipping) : "FREE")), d.discount ? h("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--ok)" } }, "Discount", h("span", {}, "−" + money(d.discount))) : null, h("div", { style: { display: "flex", justifyContent: "space-between" } }, "Tax", h("span", { style: { color: "var(--txt)" } }, money(d.tax)))), h("div", { style: { borderTop: "1px solid var(--line)", marginTop: "16px", paddingTop: "16px", display: "flex", justifyContent: "space-between", fontSize: "19px" } }, h("strong", {}, "Total"), h("strong", {}, money(d.total))), h("button", { class: "btn btn-p", style: { width: "100%", marginTop: "20px" }, onclick: () => Router.go("/checkout") }, "Secure checkout", NXI.arrow), h("div", { style: { textAlign: "center", color: "var(--mut)", fontSize: "11px", marginTop: "12px" } }, "🛡️ Protected by NEXUS Buyer Protection"))) : Empty("Your cart is empty", "Find something you'll love from our independent sellers.", h("button", { class: "btn btn-p", onclick: () => Router.go("/shop") }, "Start shopping", NXI.arrow)));
  };
  const node = h("div", { class: "fade-in" }, wrap); Store.subscribe(render); render(); return node;
}

function CheckoutPage() {
  const d = Store.cartDetail();
  if (!d.items.length) return h("div", { style: { maxWidth: "700px", margin: "80px auto" } }, Empty("Your cart is empty", "Add a product before checking out.", h("button", { class: "btn btn-p", onclick: () => Router.go("/shop") }, "Browse products")));
  const data = { name: Session.user?.name || "", email: Session.user?.email || "", address: Session.user?.address || "", city: "", zip: "", paymentMethod: "crypto", cryptoAsset: "USDT", cryptoNetwork: "TRC20" };
  const wrap = h("div", { style: { maxWidth: "1180px", margin: "0 auto", padding: "36px 22px" } });
  const field = (label, key, type = "text", placeholder = "") => h("label", { style: { display: "grid", gap: "6px", fontSize: "12px", color: "var(--mut)" } }, label, h("input", { type, value: data[key], placeholder, required: true, oninput: (e) => data[key] = e.target.value }));
  const render = () => {
    const pay = ["crypto", "card", "paypal", "bank"].map((m) => h("label", { class: "card", style: { display: "flex", alignItems: "center", gap: "10px", padding: "13px", cursor: "pointer", borderColor: data.paymentMethod === m ? "var(--pri)" : "var(--line)" } }, h("input", { type: "radio", name: "pay", checked: data.paymentMethod === m, onchange: () => { data.paymentMethod = m; render(); }, style: { width: "auto" } }), m === "crypto" ? "₿ " + t("cryptoPayment") : m === "card" ? "💳 " + t("cardPayment") : m === "paypal" ? "🅿️ PayPal" : "🏦 " + t("bankTransfer")));
    const assetSelect = Select(data.cryptoAsset, [{ value: "USDT", label: "USDT" }, { value: "USDC", label: "USDC" }, { value: "BTC", label: "Bitcoin (BTC)" }, { value: "ETH", label: "Ethereum (ETH)" }], (v) => { data.cryptoAsset = v; render(); }, { width: "100%" });
    const networkSelect = Select(data.cryptoNetwork, [{ value: "TRC20", label: "TRON / TRC20" }, { value: "ERC20", label: "Ethereum / ERC20" }, { value: "BTC", label: "Bitcoin network" }], (v) => { data.cryptoNetwork = v; render(); }, { width: "100%" });
    const cryptoBox = data.paymentMethod === "crypto" ? h("div", { class: "card", style: { display: "grid", gap: "10px", padding: "14px", borderColor: "var(--acc)" } }, h("strong", {}, t("cryptoPayment")), h("p", { style: { color: "var(--mut)", fontSize: "12px", margin: 0 } }, t("cryptoNotice")), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } }, h("label", {}, t("cryptoAsset"), assetSelect), h("label", {}, t("network"), networkSelect))) : null;
     const form = h("form", { class: "card", style: { padding: "23px" }, onsubmit: (e) => { e.preventDefault(); const o = Store.placeOrder(data); if (o) Router.go("/order/" + o.id); } }, h("div", { style: { display: "flex", gap: "8px", marginBottom: "23px" } }, h("span", { class: "chip chip-pri" }, "1. " + t("details")), h("span", { class: "chip" }, "2. " + t("payment"))), h("h3", {}, t("contactInformation")), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "13px", marginBottom: "22px" } }, field(t("fullName"), "name", "text", "Alex Morgan"), field(t("emailAddress"), "email", "email", "you@example.com")), h("h3", {}, t("shippingAddress")), h("div", { style: { display: "grid", gap: "13px", marginBottom: "22px" } }, field(t("streetAddress"), "address", "text", "123 Main Street"), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "13px" } }, field(t("city"), "city", "text", "Austin"), field(t("zip"), "zip", "text", "78701"))), h("h3", {}, t("paymentMethod")), h("div", { style: { display: "grid", gap: "9px", marginBottom: "10px" } }, pay), cryptoBox, h("div", { class: "card", style: { padding: "12px", color: "var(--mut)", fontSize: "12px" } }, "🔒 " + t("encryptedPayment")), h("button", { class: "btn btn-p", type: "submit", style: { width: "100%", marginTop: "20px" } }, t("placeOrder"), " · ", money(d.total), NXI.arrow));
    const summaryRows = d.items.map((i) => h("div", { style: { display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--line)", alignItems: "center" } }, h("span", { style: { fontSize: "25px" } }, i.product.emoji), h("span", { style: { flex: 1, fontSize: "12px" } }, i.product.name.slice(0, 28), " ×", i.qty), h("strong", {}, money(i.line))));
     const summary = h("div", { class: "card", style: { padding: "22px", position: "sticky", top: "94px" } }, h("h3", {}, t("orderSummary")), summaryRows, h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "20px" } }, h("strong", {}, t("total")), h("strong", {}, money(d.total))));
     wrap.replaceChildren(h("div", { style: { marginBottom: "24px" } }, h("div", { style: { color: "var(--mut)", fontSize: "12px" } }, t("home") + " / " + t("cart") + " / " + t("checkout")), h("h1", { style: { margin: "9px 0 5px", fontSize: "32px" } }, t("secureCheckout")), h("p", { style: { color: "var(--mut)", margin: 0 } }, t("securePaymentDescription"))), h("div", { style: { display: "grid", gridTemplateColumns: "1fr 365px", gap: "22px", alignItems: "start" } }, form, summary));
  };
  render(); return h("div", { class: "fade-in" }, wrap);
}

function OrderPage(id) {
  const o = Store.order(id); if (!o) return NotFoundPage();
  const timeline = o.timeline.map((t, i) => h("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" } }, h("div", { style: { width: "23px", height: "23px", borderRadius: "50%", background: i === o.timeline.length - 1 ? "var(--pri)" : "var(--ok)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }, html: NXI.check }), h("div", {}, h("strong", {}, t.label), h("div", { style: { color: "var(--mut)", fontSize: "11px" } }, dt(t.at)))));
  const items = o.items.map((i) => h("div", { style: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--line)" } }, h("span", { style: { fontSize: "25px" } }, i.emoji), h("span", { style: { flex: 1, fontSize: "13px" } }, i.name, " ×", i.qty), h("strong", {}, money(i.price * i.qty))));
  const success = h("div", { class: "card", style: { padding: "30px", textAlign: "center", background: "linear-gradient(135deg,rgba(0,229,160,.12),rgba(109,94,252,.09))" } }, h("div", { style: { width: "65px", height: "65px", borderRadius: "50%", background: "var(--ok)", color: "#00130c", display: "grid", placeItems: "center", margin: "0 auto 18px", fontSize: "31px" }, html: NXI.check }), h("h1", {}, "Order confirmed!"), h("p", { style: { color: "var(--mut)" } }, "Thanks, ", o.customerName.split(" ")[0], ". We've received your order."), h("div", { style: { fontFamily: "monospace", fontSize: "18px", color: "var(--pri2)" } }, o.id));
  const timelineCard = h("div", { class: "card", style: { padding: "22px" } }, h("h3", {}, "Order timeline"), timeline);
  const itemCard = h("div", { class: "card", style: { padding: "22px" } }, h("h3", {}, "Items in this order"), items, h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "17px", fontSize: "18px" } }, h("strong", {}, "Total"), h("strong", {}, money(o.total))));
  const actions = h("div", { style: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "25px" } }, h("button", { class: "btn btn-p", onclick: () => Router.go("/account?tab=orders") }, "View my orders"), h("button", { class: "btn btn-g", onclick: () => Router.go("/shop") }, "Continue shopping"));
  return h("div", { style: { maxWidth: "1050px", margin: "0 auto", padding: "45px 22px" } }, success, h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "22px" } }, timelineCard, itemCard), actions);
}

function AccountPage() {
  if (!Session.user) { Router.go("/login?next=/account"); return h("div"); }
  const u = Session.user, tab0 = Router.current.query.tab || "overview";
  let tab = tab0;
  const wrap = h("div", { style: { maxWidth: "1250px", margin: "0 auto", padding: "35px 22px" } });
  const render = () => {
    const orders = Store.db.orders.filter((o) => o.customerId === u.id);
    const wishlist = Store.wishlist().map((id) => Store.product(id)).filter(Boolean);
    const orderRows = orders.map((o) => h("tr", {}, h("td", {}, h("strong", {}, o.id)), h("td", {}, dt(o.createdAt, "date")), h("td", {}, o.items.reduce((s, i) => s + i.qty, 0)), h("td", {}, money(o.total)), h("td", {}, StatusChip(o.status)), h("td", {}, h("button", { class: "btn btn-g btn-xs", onclick: () => Router.go("/order/" + o.id) }, "View"))));
    const orderTable = orders.length ? h("table", { class: "tbl" }, h("thead", {}, h("tr", {}, ["Order", "Date", "Items", "Total", "Status", ""].map((x) => h("th", {}, x)))), h("tbody", {}, orderRows)) : Empty("No orders yet", "Your purchases will appear here.", h("button", { class: "btn btn-p", onclick: () => Router.go("/shop") }, "Start shopping"));
    let body;
    if (tab === "orders") body = h("div", { class: "card", style: { padding: "20px", overflow: "auto" } }, orderTable);
    else if (tab === "wishlist") body = wishlist.length ? h("div", { class: "grid-prod" }, wishlist.map(ProductCard)) : Empty("Your wishlist is empty", "Tap the heart on anything you love.", h("button", { class: "btn btn-p", onclick: () => Router.go("/shop") }, "Discover products"));
    else if (tab === "settings") body = h("div", { class: "card", style: { padding: "23px", maxWidth: "700px" } }, h("h3", {}, "Profile settings"), h("div", { style: { display: "grid", gap: "14px" } }, h("label", {}, "Full name", h("input", { value: u.name, oninput: (e) => u.name = e.target.value })), h("label", {}, "Email", h("input", { value: u.email, disabled: true })), h("label", {}, "Phone", h("input", { value: u.phone || "", oninput: (e) => u.phone = e.target.value })), h("label", {}, "Default address", h("textarea", { rows: 3, oninput: (e) => u.address = e.target.value }, u.address || "")), h("button", { class: "btn btn-p", onclick: () => { Store.upsertUser(u); Session.user = { ...u }; Session.persist(true); toast("Profile updated", "ok"); } }, "Save changes")));
    else { const recent = orders.slice(0, 5).map((o) => h("tr", { onclick: () => Router.go("/order/" + o.id), style: { cursor: "pointer" } }, h("td", {}, o.id), h("td", {}, dt(o.createdAt, "date")), h("td", {}, money(o.total)), h("td", {}, StatusChip(o.status)))); const recentTable = orders.length ? h("table", { class: "tbl" }, h("thead", {}, h("tr", {}, ["Order", "Date", "Total", "Status"].map((x) => h("th", {}, x)))), h("tbody", {}, recent)) : h("p", { style: { color: "var(--mut)" } }, "No orders yet."); body = h("div", { style: { display: "grid", gap: "20px" } }, h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" } }, StatCard("Total orders", orders.length, null, NXI.box, "lifetime"), StatCard("Total spent", money(orders.reduce((s, o) => s + o.total, 0)), null, NXI.wallet, "all time"), StatCard("Wishlist", wishlist.length, null, NXI.heart, "saved items")), h("div", { class: "card", style: { padding: "22px", overflow: "auto" } }, h("h3", {}, "Recent orders"), recentTable)); }
    wrap.replaceChildren(h("div", { style: { display: "flex", gap: "20px", alignItems: "center", marginBottom: "28px" } }, h("div", { style: { width: "58px", height: "58px", borderRadius: "17px", display: "grid", placeItems: "center", fontSize: "28px", background: "linear-gradient(135deg,var(--pri),var(--acc))" } }, u.avatar), h("div", {}, h("h1", { style: { margin: 0, fontSize: "29px" } }, "Welcome back, ", u.name.split(" ")[0]), h("p", { style: { margin: "5px 0 0", color: "var(--mut)" } }, "Manage your orders, wishlist, and account."))), h("div", { style: { display: "grid", gridTemplateColumns: "210px 1fr", gap: "22px", alignItems: "start" } }, h("aside", { class: "card", style: { padding: "10px" } }, [["overview", NXI.grid, "Overview"], ["orders", NXI.box, "My orders"], ["wishlist", NXI.heart, "Wishlist"], ["settings", NXI.cog, "Settings"]].map(([t, icon, label]) => h("button", { class: "nav-link " + (tab === t ? "on" : ""), onclick: () => { tab = t; render(); } }, h("span", { style: { display: "flex" }, html: icon }), label))), h("main", {}, body)));
  };
  render(); return h("div", { class: "fade-in" }, wrap);
}

function VendorStorePage(id) {
  const v = Store.vendor(id); if (!v) return NotFoundPage();
  const products = Store.products({ vendorId: id });
  const banner = h("div", { style: { height: "190px", background: v.banner, position: "relative" } }, h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(transparent,rgba(0,0,0,.45))" } }), h("div", { style: { position: "absolute", left: "28px", bottom: "-31px", width: "88px", height: "88px", borderRadius: "24px", display: "grid", placeItems: "center", fontSize: "43px", background: "var(--panel)", border: "5px solid var(--panel)" } }, v.logo));
  const meta = h("div", { style: { display: "flex", gap: "17px", color: "var(--mut)", fontSize: "12px" } }, "★ ", v.rating, " (", num(v.reviews), " reviews) · ", v.city, " · ", num(v.followers), " followers");
  const info = h("div", { style: { padding: "48px 28px 24px", display: "flex", alignItems: "start", gap: "25px" } }, h("div", { style: { flex: 1 } }, h("h1", { style: { margin: 0, fontSize: "28px" } }, v.name, v.verified ? h("span", { class: "chip chip-ok", style: { fontSize: "11px", marginLeft: "10px" } }, "✓ Verified") : null), h("p", { style: { color: "var(--mut)", lineHeight: "1.6", maxWidth: "650px", margin: "10px 0" } }, v.description), meta), h("button", { class: "btn btn-p", onclick: () => toast("Following " + v.name, "ok") }, "+ Follow"));
  const header = h("div", { class: "card", style: { overflow: "hidden", marginBottom: "25px" } }, banner, info);
  return h("div", { style: { maxWidth: "1560px", margin: "0 auto", padding: "28px 22px" } }, header, ProductShelf("Products from " + v.name, products.length + " products", products));
}

function NotFoundPage() { return h("div", { style: { maxWidth: "700px", margin: "100px auto" } }, Empty("Page not found", "The page you're looking for doesn't exist.", h("button", { class: "btn btn-p", onclick: () => Router.go("/") }, "Back to home"))); }

/* ============ ARABIC PUBLIC EXPERIENCE ============ */
const PUBLIC_IMAGES = {
  solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=82",
  electronics: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=82",
  tools: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=82",
  home: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=82",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=82",
};
const AR_CATEGORY = { solar: "الطاقة الشمسية", electronics: "الإلكترونيات والتقنية", tools: "المعدات والأدوات", home: "المنزل والمعيشة", fashion: "الأزياء والملابس" };
const AR_VENDOR = { "Solaris Power Ltd": "سولاريس للطاقة", "Voltix Electronics": "فولتكس للإلكترونيات", "IronForge Tools": "آيرون فورج للأدوات", "Casa Verde Home": "كازا فيردي للمنزل", "Atelier Nord": "أتيليه نورد" };
const AR_PRODUCTS = {
  "Solaris 450W Monocrystalline Solar Panel": "لوح شمسي أحادي التبلور 450 واط",
  "PowerWall 5.12kWh LiFePO4 Battery": "بطارية منزلية ليثيوم 5.12 كيلوواط",
  "Hybrid Inverter 8kW Pure Sine Wave": "عاكس هجين 8 كيلوواط بموجة نقية",
  "Aurora Pro 16\" Laptop — M4 Max, 32GB": "حاسوب Aurora Pro بمعالج M4 Max",
  "SonicWave ANC Wireless Headphones": "سماعات SonicWave لاسلكية عازلة للضجيج",
  "Titan 20V Brushless Hammer Drill Kit": "طقم مثقاب Titan بدون فرشاة 20 فولت",
  "AeroPure HEPA 13 Air Purifier — 1200 sqft": "منقّي هواء AeroPure بفلتر HEPA 13",
  "Merino Wool Overcoat — Charcoal": "معطف صوف ميرينو فاخر بلون فحمي",
};
function arProductName(p) { return AR_PRODUCTS[p.name] || p.name; }
function localizedProductName(p) { return I18n.lang === "ar" ? arProductName(p) : I18n.lang === "ku" ? (KU_TEXT[p.name] || p.name) : p.name; }
function productImage(p) { return PUBLIC_IMAGES[p.category] || PUBLIC_IMAGES.electronics; }

function ArabicHeader() {
  const count = Store.cartCount();
  const go = (path) => () => Router.go(path);
  const search = h("div", { class: "arabic-search" }, h("span", { html: NXI.search }), h("input", { placeholder: t("search"), value: Router.current.query.q || "", onkeydown: (e) => { if (e.key === "Enter") Router.go("/shop?q=" + encodeURIComponent(e.target.value)); } }));
  const theme = h("button", { class: "arabic-icon-btn theme-btn", title: "Theme", onclick: () => { Store.db.settings.theme = Store.db.settings.theme === "light" ? "dark" : "light"; Store.save(); applyTheme(); Store.emit(); } }, Store.db.settings.theme === "light" ? "☀" : "☾");
  const cart = h("button", { class: "arabic-icon-btn", onclick: go("/cart"), title: t("cart") }, NXI.cart, count ? h("span", { class: "count" }, count) : null);
  const account = Session.user ? h("button", { class: "arabic-account", onclick: go("/account") }, NXI.user, Session.user.name.split(" ")[0]) : h("button", { class: "arabic-account", onclick: go("/login") }, NXI.user, t("login"));
  const nav = [[t("home"), "/"], [t("shop"), "/shop"], [t("categories"), "/categories"], [t("solar"), "/shop?category=solar"], [t("electronics"), "/shop?category=electronics"], [t("homeLiving"), "/shop?category=home"], [t("fashion"), "/shop?category=fashion"], ["🔥 " + t("offers"), "/shop?sort=discount"]];
  return h("div", { class: "arabic-public-header" }, h("div", { class: "arabic-topbar" }, h("span", {}, h("i", { class: "mini-flag" }), " ", t("topbar"))), h("header", {}, h("div", { class: "arabic-header-inner" }, h("div", { class: "arabic-logo", onclick: go("/") }, h("div", { class: "arabic-logo-mark" }, "☀"), h("div", { class: "arabic-logo-copy" }, h("strong", {}, "EFRÎN ONE"), h("small", {}, t("brandSub")))), search, h("div", { class: "arabic-actions" }, languageSwitcher(), theme, cart, account))), h("nav", { class: "arabic-nav" }, h("div", { class: "arabic-nav-inner" }, nav.map(([label, path]) => h("button", { class: "arabic-nav-link " + (Router.current.path === path ? "active" : "") , onclick: go(path) }, label)))));
}

function ArabicProductShelf(title, desc, list, link = "/shop") {
  return h("section", { class: "arabic-section arabic-products" }, h("div", { class: "arabic-container" }, h("div", { class: "arabic-section-head" }, h("div", {}, h("div", { class: "arabic-section-tag" }, t("selectionsTag")), h("h2", { class: "arabic-section-title" }, title), h("p", { class: "arabic-section-desc" }, desc)), h("button", { class: "arabic-link", onclick: () => Router.go(link) }, t("viewAll"))), h("div", { class: "grid-prod" }, list.map(ProductCard))));
}

function ArabicHomePage() {
  const products = Store.products();
  const hero = h("section", { class: "arabic-hero" }, h("div", { class: "arabic-hero-inner" }, h("div", { class: "arabic-hero-copy" }, h("div", { class: "arabic-eyebrow" }, h("b", {}, "✦"), t("heroEyebrow")), h("h1", { class: "arabic-hero-title" }, h("span", {}, t("heroTitle1")), h("span", { class: "gold" }, t("heroTitle2"))), h("div", { class: "arabic-hero-sub" }, t("heroSub")), h("p", { class: "arabic-hero-desc" }, t("heroDesc")), h("div", { class: "arabic-hero-actions" }, h("button", { class: "arabic-hero-primary", onclick: () => Router.go("/shop") }, t("shopNow")), h("button", { class: "arabic-hero-ghost", onclick: () => Router.go("/vendor/register") }, t("openStore"))), h("div", { class: "arabic-hero-stats" }, h("div", { class: "arabic-hero-stat" }, h("strong", {}, "42K+"), h("small", {}, t("sellers"))), h("div", { class: "arabic-hero-stat" }, h("strong", {}, "1.2M+"), h("small", {}, t("products"))), h("div", { class: "arabic-hero-stat" }, h("strong", {}, "4.9/5"), h("small", {}, t("trust")))),), h("div", { class: "arabic-hero-art" }, h("div", { class: "arabic-hero-mark" }, "☀"))));
  const categoryCards = CATEGORIES.map((c) => h("button", { class: "arabic-category", style: { "--cat": c.color + "2b" }, onclick: () => Router.go("/shop?category=" + c.id) }, h("div", { class: "emoji" }, c.icon), h("strong", {}, localizedCategory(c.id)), h("small", {}, Store.products({ category: c.id }).length + " " + t("products"))));
  const categories = h("section", { class: "arabic-section" }, h("div", { class: "arabic-container" }, h("div", { class: "arabic-section-head" }, h("div", {}, h("div", { class: "arabic-section-tag" }, t("discoverTag")), h("h2", { class: "arabic-section-title" }, t("categoryTitle")), h("p", { class: "arabic-section-desc" }, t("categoryDesc"))), h("button", { class: "arabic-link", onclick: () => Router.go("/categories") }, t("allCategories"))), h("div", { class: "arabic-category-grid" }, categoryCards)));
  const storyStats = h("div", { class: "arabic-story-stats" },
    h("div", {}, h("strong", {}, "2024"), h("small", {}, t("founded"))),
    h("div", {}, h("strong", {}, "38"), h("small", {}, t("countries"))),
    h("div", {}, h("strong", {}, "98%"), h("small", {}, t("commitment"))));
  const story = h("section", { class: "arabic-story" }, h("div", { class: "arabic-story-inner" },
    h("div", { class: "arabic-story-media" }, h("span", { onclick: () => toast(t("storyTag"), "ok") }, "▶")),
    h("div", { class: "arabic-story-copy" }, h("div", { class: "arabic-section-tag" }, t("storyTag")), h("h2", {}, t("storyTitle")), h("p", {}, t("storyDesc")), h("div", { class: "arabic-quote" }, t("quote")), storyStats)));
  const vendorFeatures = [["✦", "reach", "reachDesc"], ["◈", "smart", "smartDesc"], ["⚡", "payouts", "payoutsDesc"], ["♡", "community", "communityDesc"]].map(([icon, title, text]) => h("div", { class: "arabic-vendor-feature" }, h("div", { class: "icon" }, icon), h("strong", {}, t(title)), h("p", {}, t(text))));
  const vendors = h("section", { class: "arabic-vendor-cta" }, h("div", { class: "arabic-container" },
    h("div", { class: "arabic-vendor-head" }, h("div", { class: "arabic-section-tag" }, t("vendorTag")), h("h2", {}, t("vendorTitle")), h("p", {}, t("vendorDesc"))),
    h("div", { class: "arabic-vendor-grid" }, vendorFeatures),
    h("div", { style: { textAlign: "center", marginTop: "34px" } }, h("button", { class: "arabic-hero-primary", onclick: () => Router.go("/vendor/register") }, t("startFree")))));
  const newsletter = h("section", { class: "arabic-newsletter" }, h("div", { class: "arabic-container" },
    h("h2", {}, t("newsletterTitle")), h("p", {}, t("newsletterDesc")),
    h("div", { class: "arabic-newsletter-form" }, h("input", { placeholder: t("email") }), h("button", { onclick: () => toast(t("subscribe"), "ok") }, t("subscribe")))));
  return h("div", { class: "arabic-home" }, hero, categories, ArabicProductShelf(t("weeklyTitle"), t("weeklyDesc"), products.slice().sort((a, b) => b.sold - a.sold).slice(0, 4), "/shop?sort=popular"), story, ArabicProductShelf(t("latestTitle"), t("latestDesc"), products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4), "/shop?sort=new"), vendors, newsletter, Footer());
}

function ArabicFooter() {
  return h("footer", { class: "arabic-footer" }, h("div", { class: "arabic-footer-grid" }, h("div", {}, h("div", { class: "arabic-logo", style: { marginBottom: "17px" } }, h("div", { class: "arabic-logo-mark" }, "☀"), h("div", { class: "arabic-logo-copy" }, h("strong", { style: { color: "#f4c95d" } }, "EFRÎN ONE"), h("small", {}, t("brandSub")))), h("p", {}, t("footerAbout"))), h("div", {}, h("h4", {}, t("footerShop")), h("a", { href: "#/shop" }, t("allProducts")), h("a", { href: "#/categories" }, t("categories")), h("a", { href: "#/shop?sort=discount" }, t("offers")), h("a", { href: "#/vendors" }, t("sellers"))), h("div", {}, h("h4", {}, t("footerSell")), h("a", { href: "#/vendor/register" }, t("becomeVendor")), h("a", { href: "#/vendor/login" }, t("vendorLogin")), h("a", { href: "#/pricing" }, t("pricing"))), h("div", {}, h("h4", {}, t("footerHelp")), h("a", { href: "#/help" }, t("help")), h("a", { href: "#/track" }, t("track")), h("a", { href: "#/returns" }, t("returns")), h("a", { href: "#/contact" }, t("contact")))), h("div", { class: "arabic-footer-bottom" }, h("span", {}, "© 2026 EFRÎN ONE STORE · " + t("rights")), h("span", {}, t("made") + " · " + LANGS[I18n.lang].short + " · USD $")));
}

function Footer() { return document.body.classList.contains("public-theme") ? ArabicFooter() : EnglishFooter(); }
