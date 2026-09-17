/* ============ NEXUS STORE — persistence, state, cart, auth ============ */
const LS_KEY = "nexus_db_v1";
const SS_KEY = "nexus_session_v1";

const Store = {
  db: null,
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit() { this.listeners.forEach((f) => { try { f(this.db); } catch (e) { console.error(e); } }); },
  save() { try { localStorage.setItem(LS_KEY, JSON.stringify(this.db)); } catch (e) { console.warn("save failed", e); } },
  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.version === NX.version) { this.db = d; return; } }
    } catch (e) { console.warn("load failed", e); }
    this.db = this.fresh();
    this.save();
  },
  reset() { this.db = this.fresh(); this.save(); this.emit(); },
  fresh() {
    const products = buildProducts();
    const orders = buildOrders(products);
    const notifications = [
      { id: uid("n"), title: "New order received", body: "Order NX-102400 for $1,249.00", type: "order", read: false, at: new Date(Date.now() - 12 * 6e4).toISOString() },
      { id: uid("n"), title: "Payout processed", body: "$12,480.50 sent to your bank account", type: "payout", read: false, at: new Date(Date.now() - 3 * 36e5).toISOString() },
      { id: uid("n"), title: "Low stock alert", body: "ProLift Hydraulic Scissor Lift is down to 12 units", type: "stock", read: false, at: new Date(Date.now() - 8 * 36e5).toISOString() },
      { id: uid("n"), title: "New 5-star review", body: "James W. reviewed Solaris 450W Panel", type: "review", read: true, at: new Date(Date.now() - 26 * 36e5).toISOString() },
      { id: uid("n"), title: "Vendor application", body: "Nomad Gear Co submitted an application", type: "vendor", read: false, at: new Date(Date.now() - 40 * 36e5).toISOString() },
    ];
    return {
      version: NX.version,
      products, orders,
      vendors: VENDORS.map((v) => ({ ...v })),
      users: DEMO_CUSTOMERS.map((u) => ({ ...u })),
      payouts: PAYOUTS_SEED.map((p) => ({ ...p })),
      coupons: COUPONS.map((c) => ({ ...c })),
      notifications,
      reviews: [],
      carts: {},
      wishlist: {},
      settings: {
        siteName: "NEXUS", tagline: "The marketplace for everything", currency: "USD", language: "ar",
        commission: 10, theme: "dark", payoutSchedule: "biweekly", minPayout: 100,
        maintenance: false, autoApproveVendors: false, allowGuestCheckout: true,
      },
      broadcasts: [
        "Free shipping on orders over $500",
        "0% commission for your first 30 days as a new vendor",
        "Weekly flash deals — up to 45% off electronics",
        "Join 42,000+ sellers already growing on NEXUS",
      ],
      createdAt: new Date().toISOString(),
    };
  },

  /* ---- getters ---- */
  products(opts = {}) {
    let list = this.db.products.slice();
    if (opts.vendorId) list = list.filter((p) => p.vendorId === opts.vendorId);
    if (opts.category) list = list.filter((p) => p.category === opts.category);
    if (opts.status) list = list.filter((p) => p.status === opts.status);
    if (opts.q) {
      const q = opts.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return list;
  },
  product(id) { return this.db.products.find((p) => p.id === id); },
  vendor(id) { return this.db.vendors.find((v) => v.id === id); },
  user(id) { return this.db.users.find((u) => u.id === id); },
  order(id) { return this.db.orders.find((o) => o.id === id); },
  ordersForVendor(vid) { return this.db.orders.filter((o) => o.items.some((i) => i.vendorId === vid)); },

  /* ---- CRUD ---- */
  upsertProduct(p) {
    const i = this.db.products.findIndex((x) => x.id === p.id);
    if (i >= 0) this.db.products[i] = { ...this.db.products[i], ...p };
    else this.db.products.unshift({ id: uid("p"), rating: 0, reviewCount: 0, reviews: [], sold: 0, views: 0, createdAt: new Date().toISOString(), status: "active", gallery: [p.emoji || "📦", p.emoji || "📦", p.emoji || "📦"], features: p.features || [], tags: [], freeShipping: (p.price || 0) > 250, ...p });
    this.save(); this.emit();
  },
  deleteProduct(id) { this.db.products = this.db.products.filter((p) => p.id !== id); this.save(); this.emit(); },
  updateOrder(id, patch) {
    const o = this.order(id); if (!o) return;
    Object.assign(o, patch);
    if (patch.status && !o.timeline.find((t) => t.s === patch.status)) {
      o.timeline.push({ s: patch.status, label: STATUS_META[patch.status]?.label || patch.status, at: new Date().toISOString() });
    }
    this.save(); this.emit();
  },
  upsertVendor(v) {
    const i = this.db.vendors.findIndex((x) => x.id === v.id);
    if (i >= 0) this.db.vendors[i] = { ...this.db.vendors[i], ...v };
    else this.db.vendors.push({ id: uid("v"), rating: 0, reviews: 0, joined: new Date().toISOString().slice(0, 10), status: "pending", commission: 10, plan: "starter", verified: false, balance: 0, pending: 0, followers: 0, responseRate: 90, shipOnTime: 90, banner: "linear-gradient(135deg,#6d5efc,#00e5a0)", logo: "🏪", ...v });
    this.save(); this.emit();
  },
  upsertUser(u) {
    const i = this.db.users.findIndex((x) => x.id === u.id);
    if (i >= 0) this.db.users[i] = { ...this.db.users[i], ...u };
    else this.db.users.push({ id: uid("u"), role: "customer", avatar: "🙂", joined: new Date().toISOString().slice(0, 10), status: "active", ...u });
    this.save(); this.emit();
  },
  upsertCoupon(c) {
    const i = this.db.coupons.findIndex((x) => x.code === c.code);
    if (i >= 0) this.db.coupons[i] = { ...this.db.coupons[i], ...c };
    else this.db.coupons.push(c);
    this.save(); this.emit();
  },
  upsertPayout(p) {
    const i = this.db.payouts.findIndex((x) => x.id === p.id);
    if (i >= 0) this.db.payouts[i] = { ...this.db.payouts[i], ...p };
    else this.db.payouts.unshift(p);
    this.save(); this.emit();
  },
  notify(title, body, type = "info") {
    this.db.notifications.unshift({ id: uid("n"), title, body, type, read: false, at: new Date().toISOString() });
    this.db.notifications = this.db.notifications.slice(0, 40);
    this.save(); this.emit();
  },

  /* ---- cart ---- */
  cartKey() { return Session.user ? "u_" + Session.user.id : "guest"; },
  cart() { return this.db.carts[this.cartKey()] || []; },
  cartCount() { return this.cart().reduce((s, i) => s + i.qty, 0); },
  addToCart(productId, qty = 1, variant = null) {
    const k = this.cartKey();
    const cart = this.db.carts[k] || (this.db.carts[k] = []);
    const found = cart.find((i) => i.productId === productId && i.variant === variant);
    const p = this.product(productId);
    if (!p) return false;
    if (found) found.qty = Math.min(found.qty + qty, p.stock);
    else cart.push({ productId, qty: Math.min(qty, p.stock), variant, addedAt: new Date().toISOString() });
    this.save(); this.emit();
    toast(`${p.name.slice(0, 40)}… added to cart`, "ok");
    return true;
  },
  setQty(productId, variant, qty) {
    const cart = this.db.carts[this.cartKey()] || [];
    const it = cart.find((i) => i.productId === productId && i.variant === variant);
    if (it) { it.qty = Math.max(1, qty); this.save(); this.emit(); }
  },
  removeFromCart(productId, variant) {
    const k = this.cartKey();
    this.db.carts[k] = (this.db.carts[k] || []).filter((i) => !(i.productId === productId && i.variant === variant));
    this.save(); this.emit();
  },
  clearCart() { this.db.carts[this.cartKey()] = []; this.save(); this.emit(); },
  cartDetail() {
    const items = this.cart().map((ci) => {
      const p = this.product(ci.productId);
      if (!p) return null;
      return { ...ci, product: p, line: +(p.price * ci.qty).toFixed(2), vendor: this.vendor(p.vendorId) };
    }).filter(Boolean);
    const subtotal = +items.reduce((s, i) => s + i.line, 0).toFixed(2);
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 14.99;
    const couponCode = this.db._appliedCoupon;
    let discount = 0;
    if (couponCode) {
      const c = this.db.coupons.find((x) => x.code === couponCode && x.active && (!x.min || subtotal >= x.min));
      if (c) discount = c.type === "percent" ? +(subtotal * c.value / 100).toFixed(2) : c.type === "fixed" ? Math.min(c.value, subtotal) : 0;
    }
    const shipFinal = couponCode === "FREESHIP" && subtotal >= 100 ? 0 : shipping;
    const tax = +((subtotal - discount) * 0.0825).toFixed(2);
    return { items, subtotal, shipping: shipFinal, discount, tax, total: +Math.max(0, subtotal - discount + shipFinal + tax).toFixed(2) };
  },
  applyCoupon(code) {
    const c = this.db.coupons.find((x) => x.code.toUpperCase() === code.toUpperCase());
    if (!c) return { ok: false, msg: "Invalid coupon code" };
    if (!c.active) return { ok: false, msg: "This coupon has expired" };
    const sub = this.cartDetail().subtotal;
    if (c.min && sub < c.min) return { ok: false, msg: `Minimum order of ${money(c.min)} required` };
    this.db._appliedCoupon = c.code; this.save(); this.emit();
    return { ok: true, msg: `${c.code} applied successfully` };
  },
  clearCoupon() { delete this.db._appliedCoupon; this.save(); this.emit(); },

  /* ---- wishlist ---- */
  wishlist() { return this.db.wishlist[this.cartKey()] || (this.db.wishlist[this.cartKey()] = []); },
  toggleWishlist(pid) {
    const w = this.wishlist();
    const i = w.indexOf(pid);
    if (i >= 0) { w.splice(i, 1); toast("Removed from wishlist", "pri"); }
    else { w.push(pid); toast("Saved to wishlist ♥", "ok"); }
    this.save(); this.emit();
  },
  inWishlist(pid) { return this.wishlist().includes(pid); },

  /* ---- checkout ---- */
  placeOrder(info) {
    const d = this.cartDetail();
    if (!d.items.length) return null;
    const order = {
      id: "NX-" + Math.floor(200000 + Math.random() * 799999),
      customerId: Session.user?.id || "guest",
      customerName: info.name, customerEmail: info.email,
      items: d.items.map((i) => ({ productId: i.productId, name: i.product.name, emoji: i.product.emoji, price: i.product.price, qty: i.qty, vendorId: i.product.vendorId, sku: i.product.sku })),
      subtotal: d.subtotal, shipping: d.shipping, tax: d.tax, discount: d.discount, total: d.total,
      status: "pending", paymentStatus: info.paymentMethod === "crypto" ? "pending" : "paid", createdAt: new Date().toISOString(),
      address: info.address, paymentMethod: info.paymentMethod, cryptoAsset: info.cryptoAsset || null, cryptoNetwork: info.cryptoNetwork || null,
      tracking: null, carrier: null,
      timeline: [{ s: "pending", label: "Order placed", at: new Date().toISOString() }],
    };
    this.db.orders.unshift(order);
    d.items.forEach((i) => { const p = this.product(i.productId); if (p) { p.stock = Math.max(0, p.stock - i.qty); p.sold += i.qty; } });
    const c = this.db.coupons.find((x) => x.code === this.db._appliedCoupon);
    if (c) c.uses++;
    this.clearCart(); this.clearCoupon();
    this.notify("New order received", `Order ${order.id} for ${money(order.total)}`, "order");
    this.save(); this.emit();
    return order;
  },

  /* ---- analytics helpers ---- */
  stats(vendorId = null) {
    const orders = vendorId ? this.ordersForVendor(vendorId) : this.db.orders;
    const products = vendorId ? this.products({ vendorId }) : this.db.products;
    const paid = orders.filter((o) => !["cancelled", "refunded"].includes(o.status));
    const rev = (o) => vendorId ? o.items.filter((i) => i.vendorId === vendorId).reduce((s, i) => s + i.price * i.qty, 0) : o.total;
    const revenue = paid.reduce((s, o) => s + rev(o), 0);
    const units = paid.reduce((s, o) => s + (vendorId ? o.items.filter((i) => i.vendorId === vendorId).reduce((a, i) => a + i.qty, 0) : o.items.reduce((a, i) => a + i.qty, 0)), 0);
    const now = Date.now(), DAY = 864e5;
    const period = (days) => {
      const cur = paid.filter((o) => now - new Date(o.createdAt) < days * DAY);
      const prev = paid.filter((o) => { const d = now - new Date(o.createdAt); return d >= days * DAY && d < 2 * days * DAY; });
      const cr = cur.reduce((s, o) => s + rev(o), 0), pr = prev.reduce((s, o) => s + rev(o), 0);
      return { current: cr, previous: pr, growth: pr ? +(((cr - pr) / pr) * 100).toFixed(1) : 100, orders: cur.length, prevOrders: prev.length };
    };
    return {
      revenue, units, orders: orders.length, products: products.length,
      aov: paid.length ? revenue / paid.length : 0,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      refunded: orders.filter((o) => o.status === "refunded").length,
      customers: new Set(orders.map((o) => o.customerId)).size,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 25).length,
      outStock: products.filter((p) => p.stock === 0).length,
      p7: period(7), p30: period(30), p90: period(90),
      revenueSeries: this.series(vendorId, 30),
    };
  },
  series(vendorId, days = 30) {
    const paid = (vendorId ? this.ordersForVendor(vendorId) : this.db.orders).filter((o) => !["cancelled", "refunded"].includes(o.status));
    const rev = (o) => vendorId ? o.items.filter((i) => i.vendorId === vendorId).reduce((s, i) => s + i.price * i.qty, 0) : o.total;
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - i);
      const end = new Date(start.getTime() + 864e5);
      const day = paid.filter((o) => { const t = new Date(o.createdAt); return t >= start && t < end; });
      const locale = typeof I18n !== "undefined" && I18n.lang === "ku" ? "ku" : typeof I18n !== "undefined" && I18n.lang === "ar" ? "ar" : "en-US";
      const kuMonths = ["Rêbendan", "Sibat", "Adar", "Nîsan", "Gulan", "Hezîran", "Tîrmeh", "Gelawêj", "Îlon", "Cotmeh", "Sermawez", "Berfanbar"];
      const label = locale === "ku" ? kuMonths[start.getMonth()] + " " + start.getDate() : start.toLocaleDateString(locale, { month: "short", day: "numeric" });
      out.push({ date: start.toISOString(), label, revenue: +day.reduce((s, o) => s + rev(o), 0).toFixed(2), orders: day.length });
    }
    return out;
  },
  topProducts(vendorId = null, n = 5) {
    const map = {};
    (vendorId ? this.ordersForVendor(vendorId) : this.db.orders).filter((o) => !["cancelled", "refunded"].includes(o.status)).forEach((o) => {
      o.items.filter((i) => !vendorId || i.vendorId === vendorId).forEach((i) => {
        map[i.productId] = map[i.productId] || { productId: i.productId, name: i.name, emoji: i.emoji, units: 0, revenue: 0 };
        map[i.productId].units += i.qty; map[i.productId].revenue += i.price * i.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, n);
  },
  categoryBreakdown(vendorId = null) {
    const out = {};
    this.products(vendorId ? { vendorId } : {}).forEach((p) => { out[p.category] = out[p.category] || { revenue: 0, units: 0, count: 0 }; out[p.category].count++; });
    (vendorId ? this.ordersForVendor(vendorId) : this.db.orders).filter((o) => !["cancelled", "refunded"].includes(o.status)).forEach((o) => {
      o.items.filter((i) => !vendorId || i.vendorId === vendorId).forEach((i) => {
        const p = this.product(i.productId); if (!p) return;
        out[p.category].revenue += i.price * i.qty; out[p.category].units += i.qty;
      });
    });
    return Object.entries(out).map(([k, v]) => ({ category: k, name: CATEGORIES.find((c) => c.id === k)?.name || k, icon: CATEGORIES.find((c) => c.id === k)?.icon || "📦", ...v })).sort((a, b) => b.revenue - a.revenue);
  },
};

/* ---------- Session / auth ---------- */
const Session = {
  user: null, vendor: null, role: null,
  load() {
    try { const raw = sessionStorage.getItem(SS_KEY) || localStorage.getItem(SS_KEY); if (raw) Object.assign(this, JSON.parse(raw)); } catch (e) {}
  },
  persist(remember) {
    const data = JSON.stringify({ user: this.user, vendor: this.vendor, role: this.role });
    sessionStorage.setItem(SS_KEY, data);
    if (remember) localStorage.setItem(SS_KEY, data); else localStorage.removeItem(SS_KEY);
  },
  login(email, password, asVendor, remember) {
    const e = email.trim().toLowerCase();
    const user = Store.db.users.find((u) => u.email.toLowerCase() === e && u.password === password);
    if (user) {
      if (user.status === "banned") return { ok: false, msg: "This account has been suspended." };
      this.user = { ...user }; this.role = user.role === "admin" ? "admin" : "customer";
      this.vendor = null; this.persist(remember); return { ok: true, role: this.role };
    }
    const vendor = Store.db.vendors.find((v) => v.email.toLowerCase() === e && v.password === password);
    if (vendor) {
      if (vendor.status === "suspended") return { ok: false, msg: "Your store has been suspended. Contact support." };
      if (vendor.status === "pending") return { ok: false, msg: "Your application is still under review." };
      this.vendor = { ...vendor }; this.role = "vendor"; this.user = null;
      this.persist(remember); return { ok: true, role: "vendor" };
    }
    return { ok: false, msg: "Invalid email or password. Try a demo account below." };
  },
  register(data, asVendor) {
    const e = data.email.trim().toLowerCase();
    if (Store.db.users.some((u) => u.email.toLowerCase() === e) || Store.db.vendors.some((v) => v.email.toLowerCase() === e))
      return { ok: false, msg: "An account with this email already exists." };
    if (asVendor) {
      const v = { id: uid("v"), name: data.storeName, email: data.email, password: data.password, logo: "🏪", rating: 0, reviews: 0, joined: new Date().toISOString().slice(0, 10), status: Store.db.settings.autoApproveVendors ? "active" : "pending", commission: Store.db.settings.commission, plan: "starter", country: data.country || "—", city: data.city || "—", verified: false, balance: 0, pending: 0, followers: 0, responseRate: 90, shipOnTime: 90, description: data.description || "", banner: "linear-gradient(135deg,#6d5efc,#00e5a0)" };
      Store.upsertVendor(v);
      Store.notify("Vendor application", `${data.storeName} submitted an application`, "vendor");
      this.vendor = v; this.role = "vendor"; this.user = null; this.persist(true);
      return { ok: true, role: "vendor", pending: v.status === "pending" };
    }
    const u = { id: uid("u"), name: data.name, email: data.email, password: data.password, role: "customer", avatar: "🙂", joined: new Date().toISOString().slice(0, 10), phone: "", address: data.address || "", status: "active" };
    Store.upsertUser(u);
    this.user = u; this.role = "customer"; this.vendor = null; this.persist(true);
    return { ok: true, role: "customer" };
  },
  logout() { this.user = null; this.vendor = null; this.role = null; sessionStorage.removeItem(SS_KEY); localStorage.removeItem(SS_KEY); },
};
