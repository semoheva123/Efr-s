/* ============ NEXUS DATA — seed catalog, users, orders ============ */
const CATEGORIES = [
  { id: "solar", name: "Solar Energy & Batteries", icon: "🔋", color: "#ffb020" },
  { id: "electronics", name: "Electronics & Technology", icon: "💻", color: "#6d5efc" },
  { id: "tools", name: "Equipment & Tools", icon: "🛠️", color: "#00e5a0" },
  { id: "home", name: "Home & Living", icon: "🏠", color: "#ff6b9d" },
  { id: "fashion", name: "Fashion & Apparel", icon: "👕", color: "#4dabff" },
];

const VENDORS = [
  { id: "v_solaris", name: "Solaris Power Ltd", email: "vendor@nexus.dev", password: "vendor123", logo: "☀️", rating: 4.8, reviews: 1284, joined: "2023-02-14", status: "active", commission: 8, plan: "pro", country: "United States", city: "Austin, TX", verified: true, balance: 48210.55, pending: 6240.20, followers: 8420, responseRate: 98, shipOnTime: 96, description: "Industry-leading solar panels, inverters and deep-cycle battery systems for residential and commercial installations. 25-year warranty on all PV modules.", banner: "linear-gradient(135deg,#ffb020,#ff6b35)" },
  { id: "v_voltix", name: "Voltix Electronics", email: "voltix@nexus.dev", password: "vendor123", logo: "⚡", rating: 4.6, reviews: 3410, joined: "2022-08-03", status: "active", commission: 10, plan: "business", country: "United States", city: "San Jose, CA", verified: true, balance: 91344.10, pending: 11890.75, followers: 15230, responseRate: 94, shipOnTime: 92, description: "Premium consumer electronics, prosumer audio and computing hardware. Authorized reseller with global shipping.", banner: "linear-gradient(135deg,#6d5efc,#4dabff)" },
  { id: "v_forge", name: "IronForge Tools", email: "forge@nexus.dev", password: "vendor123", logo: "🔨", rating: 4.7, reviews: 892, joined: "2023-05-21", status: "active", commission: 9, plan: "pro", country: "Germany", city: "Munich", verified: true, balance: 27650.40, pending: 3120.90, followers: 5210, responseRate: 97, shipOnTime: 98, description: "Professional-grade power tools, workshop equipment and industrial supplies trusted by contractors worldwide.", banner: "linear-gradient(135deg,#00e5a0,#00b378)" },
  { id: "v_casa", name: "Casa Verde Home", email: "casa@nexus.dev", password: "vendor123", logo: "🌿", rating: 4.5, reviews: 2109, joined: "2023-01-09", status: "active", commission: 11, plan: "starter", country: "Italy", city: "Milan", verified: true, balance: 18320.65, pending: 2210.30, followers: 9870, responseRate: 91, shipOnTime: 89, description: "Sustainable home goods, smart appliances and designer furniture for modern living spaces.", banner: "linear-gradient(135deg,#ff6b9d,#ff4d6a)" },
  { id: "v_atelier", name: "Atelier Nord", email: "atelier@nexus.dev", password: "vendor123", logo: "🧵", rating: 4.9, reviews: 1567, joined: "2022-11-30", status: "active", commission: 12, plan: "business", country: "Sweden", city: "Stockholm", verified: true, balance: 64108.25, pending: 9450.00, followers: 21400, responseRate: 99, shipOnTime: 97, description: "Scandinavian minimalist fashion, sustainable fabrics and timeless outerwear crafted in small batches.", banner: "linear-gradient(135deg,#4dabff,#8b7dff)" },
  { id: "v_nomad", name: "Nomad Gear Co", email: "nomad@nexus.dev", password: "vendor123", logo: "🎒", rating: 4.4, reviews: 634, joined: "2024-03-12", status: "pending", commission: 10, plan: "starter", country: "Canada", city: "Vancouver", verified: false, balance: 0, pending: 0, followers: 1230, responseRate: 88, shipOnTime: 90, description: "Adventure-ready outdoor equipment, hiking gear and travel essentials built for the wild.", banner: "linear-gradient(135deg,#7c8db5,#4a5578)" },
];

const PRODUCT_SEED = [
  ["v_solaris", "solar", "Solaris 450W Monocrystalline Solar Panel", 389, 449, 142, "☀️", "High-efficiency monocrystalline PV module with 21.3% conversion rate. Half-cell technology reduces shading loss. IP68 junction box, 25-year linear power warranty.", ["450W peak output", "21.3% efficiency", "IP68 rated", "25-year warranty"], 4.8, 312, 87],
  ["v_solaris", "solar", "PowerWall 5.12kWh LiFePO4 Battery", 1899, 2299, 38, "🔋", "Stackable lithium iron phosphate home battery. 6000+ cycle life, integrated BMS, wall or rack mount. Expandable to 51.2kWh.", ["5.12kWh capacity", "6000+ cycles", "Integrated BMS", "Stackable design"], 4.9, 184, 45],
  ["v_solaris", "solar", "Hybrid Inverter 8kW Pure Sine Wave", 1249, 1499, 61, "🔌", "8kW hybrid inverter with dual MPPT trackers, grid-tie and off-grid modes, WiFi monitoring and generator input.", ["8kW continuous", "Dual MPPT", "WiFi monitoring", "Grid + off-grid"], 4.7, 221, 72],
  ["v_solaris", "solar", "Portable Solar Generator 2000W", 1599, 1899, 25, "⚡", "All-in-one portable power station with folding solar input. 2000W AC output, 2048Wh capacity, charges in 1.6 hours.", ["2000W AC output", "2048Wh capacity", "Fast recharge", "Solar ready"], 4.6, 156, 38],
  ["v_voltix", "electronics", "Aurora Pro 16\" Laptop — M4 Max, 32GB", 2799, 3199, 47, "💻", "16-inch Liquid Retina XDR display, M4 Max chip, 32GB unified memory, 1TB SSD. Up to 22 hours battery life.", ["M4 Max chip", "32GB RAM", "1TB SSD", "22hr battery"], 4.9, 428, 64],
  ["v_voltix", "electronics", "SonicWave ANC Wireless Headphones", 249, 329, 318, "🎧", "Hybrid active noise cancellation with 40mm beryllium drivers, 45-hour battery and multipoint Bluetooth 5.3.", ["Hybrid ANC", "45hr battery", "Bluetooth 5.3", "Multipoint"], 4.7, 1892, 78],
  ["v_voltix", "electronics", "Vista 27\" 4K OLED Monitor 144Hz", 899, 1199, 92, "🖥️", "27-inch 4K OLED panel with 144Hz refresh, 0.03ms response, HDR400 True Black and 99% DCI-P3 coverage.", ["4K OLED", "144Hz", "0.03ms GtG", "USB-C 90W"], 4.8, 764, 71],
  ["v_voltix", "electronics", "Nexus Watch Ultra — Titanium GPS", 599, 749, 156, "⌚", "Aerospace titanium case, 100m water resistance, dual-band GPS and 36-day battery in low power mode.", ["Titanium case", "100m WR", "Dual-band GPS", "36-day battery"], 4.6, 1120, 69],
  ["v_voltix", "electronics", "Drone X4 Pro — 8K Camera, 45min Flight", 1299, 1599, 33, "🛸", "Foldable 8K drone with 3-axis gimbal, obstacle sensing in 6 directions and 15km transmission range.", ["8K video", "45min flight", "6-way sensing", "15km range"], 4.7, 340, 55],
  ["v_forge", "tools", "Titan 20V Brushless Hammer Drill Kit", 229, 299, 204, "🔧", "20V brushless motor delivering 650 in-lbs torque, 2-speed gearbox, LED worklight and 2x 5.0Ah batteries.", ["650 in-lbs torque", "Brushless motor", "2 batteries", "Hard case"], 4.8, 934, 82],
  ["v_forge", "tools", "ForgeMaster 200A MIG Welder", 749, 949, 44, "⚙️", "Multi-process MIG/TIG/Stick welder with synergic control, 220V input and digital display. Welds up to 1/2 inch steel.", ["200A output", "MIG/TIG/Stick", "Synergic control", "Digital display"], 4.6, 287, 63],
  ["v_forge", "tools", "ProLift Hydraulic Scissor Lift 1500kg", 1899, 2399, 12, "🏗️", "Heavy-duty hydraulic scissor lift table with 1500kg capacity, foot pump and locking safety bar.", ["1500kg capacity", "Foot pump", "Safety lock", "Steel deck"], 4.5, 96, 48],
  ["v_forge", "tools", "LaserLine Rotary Laser Level Kit", 449, 549, 87, "📐", "Self-leveling rotary laser with 500m range, IP67 rating, remote control and tripod included.", ["500m range", "IP67", "Self-leveling", "Tripod kit"], 4.7, 412, 74],
  ["v_casa", "home", "AeroPure HEPA 13 Air Purifier — 1200 sqft", 349, 449, 128, "🌬️", "True HEPA H13 filtration with activated carbon, quiet 22dB operation and real-time AQI display.", ["HEPA H13", "1200 sqft", "22dB quiet", "AQI display"], 4.7, 823, 79],
  ["v_casa", "home", "Nordic Oak Dining Table — Seats 8", 1299, 1599, 19, "🪑", "Solid white oak dining table with tapered legs and natural oil finish. Handcrafted in Northern Italy.", ["Solid white oak", "Seats 8", "Natural oil finish", "Handcrafted"], 4.8, 214, 58],
  ["v_casa", "home", "Barista Pro Espresso Machine 15-Bar", 649, 799, 76, "☕", "15-bar Italian pump, PID temperature control, built-in conical burr grinder and steam wand.", ["15-bar pump", "PID control", "Burr grinder", "Steam wand"], 4.6, 1456, 81],
  ["v_casa", "home", "Smart Thermostat Pro — WiFi Learning", 199, 249, 241, "🌡️", "AI learning thermostat with room sensors, geofencing, and energy reports. Works with all major HVAC.", ["AI learning", "Room sensors", "Geofencing", "Energy reports"], 4.5, 1678, 70],
  ["v_atelier", "fashion", "Merino Wool Overcoat — Charcoal", 489, 649, 52, "🧥", "Italian merino wool overcoat with full satin lining and hand-finished lapels. Tailored regular fit.", ["100% merino wool", "Satin lined", "Hand-finished", "Regular fit"], 4.9, 731, 88],
  ["v_atelier", "fashion", "Cashmere Crewneck Sweater", 219, 289, 164, "🧶", "Grade-A Mongolian cashmere, 12-gauge knit with ribbed collar, cuffs and hem. Exceptionally soft.", ["Grade-A cashmere", "12-gauge knit", "Ribbed trim", "Machine washable"], 4.8, 1204, 84],
  ["v_atelier", "fashion", "Selvedge Denim Jacket — Raw Indigo", 249, 329, 98, "👖", "14.5oz Japanese selvedge denim with copper rivets, chain-stitched hems and raw indigo finish.", ["14.5oz selvedge", "Japanese denim", "Copper rivets", "Raw indigo"], 4.7, 654, 76],
  ["v_atelier", "fashion", "Leather Weekender Bag — Full Grain", 379, 479, 41, "👜", "Full-grain vegetable-tanned leather duffel with brass hardware and cotton twill lining. Ages beautifully.", ["Full-grain leather", "Veg-tanned", "Brass hardware", "Lifetime repair"], 4.9, 892, 91],
  ["v_atelier", "fashion", "Alpine Down Parka −30°C Rated", 599, 799, 63, "🧊", "800-fill responsible down parka with waterproof shell, fully taped seams and detachable fur hood.", ["800-fill down", "Waterproof shell", "Taped seams", "Rated −30°C"], 4.8, 512, 86],
  ["v_solaris", "solar", "Foldable Solar Blanket 200W", 299, 379, 114, "🏕️", "Portable 200W folding solar blanket with ETFE coating, USB-C PD output and reinforced carry handle.", ["200W output", "ETFE coated", "USB-C PD", "Folds to briefcase"], 4.5, 388, 73],
  ["v_voltix", "electronics", "Pulse 5 Portable Bluetooth Speaker", 179, 229, 187, "🔊", "360° sound with dual passive radiators, IP67 waterproofing and 24-hour playtime. Stereo pairing.", ["360° audio", "IP67", "24hr playtime", "Stereo pairing"], 4.6, 2140, 77],
  ["v_forge", "tools", "Precision Digital Multimeter 6000-Count", 129, 169, 233, "📊", "True RMS multimeter with 6000-count display, auto-ranging, temperature probe and CAT IV safety rating.", ["True RMS", "6000 count", "Auto-ranging", "CAT IV"], 4.7, 1043, 83],
  ["v_casa", "home", "Bamboo Sheet Set — King, 400TC", 129, 179, 312, "🛏️", "400 thread count organic bamboo lyocell sheets. Thermo-regulating, hypoallergenic and silky soft.", ["400TC bamboo", "Organic", "Thermo-regulating", "King size"], 4.6, 2311, 75],
  ["v_atelier", "fashion", "Suede Chelsea Boots — Tobacco", 329, 429, 79, "👢", "Italian suede Chelsea boots with Goodyear welted sole and elastic side gores. Resolable for life.", ["Italian suede", "Goodyear welt", "Resolable", "Leather lined"], 4.8, 688, 85],
  ["v_voltix", "electronics", "Thunderbolt 5 Dock — 14-in-1", 349, 429, 68, "🔗", "14-port Thunderbolt 5 dock with dual 8K output, 140W passthrough charging and 2.5GbE networking.", ["Thunderbolt 5", "Dual 8K", "140W charging", "2.5GbE"], 4.7, 456, 80],
  ["v_casa", "home", "Ceramic Nonstick Cookware Set — 10pc", 279, 359, 145, "🍳", "10-piece ceramic nonstick cookware set, PFOA-free, induction compatible and oven safe to 450°F.", ["10 pieces", "PFOA-free", "Induction ready", "Oven safe"], 4.5, 1876, 72],
  ["v_forge", "tools", "Bench Grinder 8\" Variable Speed", 219, 279, 56, "🪚", "8-inch variable speed bench grinder with LED worklights, cast iron base and adjustable tool rests.", ["8-inch wheels", "Variable speed", "LED lights", "Cast iron base"], 4.6, 342, 68],
];

const REVIEW_POOL = [
  ["Absolutely stellar quality — exceeded every expectation. Shipping was fast and packaging was immaculate.", 5, "Verified Purchase"],
  ["Works exactly as described. Been using it daily for three weeks with zero issues. Highly recommend.", 5, "Verified Purchase"],
  ["Great value for the price point. Not perfect but punch above its weight class for sure.", 4, "Verified Purchase"],
  ["Solid build quality, though delivery took a couple days longer than the estimate. Still very happy.", 4, "Verified Purchase"],
  ["The vendor was responsive when I had a question about setup. Product itself is fantastic.", 5, "Verified Purchase"],
  ["Good product overall. Instructions could be clearer but nothing a quick search couldn't solve.", 4, "Verified Purchase"],
  ["Exactly what I needed for my project. Second purchase from this vendor and they never disappoint.", 5, "Verified Purchase"],
  ["Decent, but I expected slightly better finish on the details given the price. Functionally sound though.", 3, "Verified Purchase"],
];
const REVIEWERS = ["James Whitfield", "Sofia Marchetti", "Daniel Okafor", "Emma Lindqvist", "Rafael Costa", "Aisha Rahman", "Liam O'Connor", "Yuki Tanaka", "Marta Kowalski", "Noah Bergström", "Priya Nair", "Lucas Meyer"];

function buildProducts() {
  return PRODUCT_SEED.map((p, i) => {
    const [vendorId, cat, name, price, compare, stock, emoji, desc, features, rating, reviews, discount] = p;
    const v = VENDORS.find((x) => x.id === vendorId);
    const rv = [];
    const count = 3 + (i % 3);
    for (let k = 0; k < count; k++) {
      const r = REVIEW_POOL[(i * 3 + k) % REVIEW_POOL.length];
      rv.push({ id: uid("rv"), user: REVIEWERS[(i * 5 + k) % REVIEWERS.length], rating: r[1], text: r[0], date: new Date(Date.now() - (i * 7 + k * 3 + 2) * 864e5).toISOString(), verified: true, helpful: (i * 13 + k * 7) % 48 });
    }
    const sold = 40 + ((i * 137) % 900);
    return {
      id: "p_" + slug(name).slice(0, 28) + "_" + i,
      vendorId, category: cat, name, emoji,
      price, compareAt: compare, stock,
      sku: "NX-" + String(i + 1).padStart(4, "0") + "-" + cat.slice(0, 3).toUpperCase(),
      description: desc, features,
      rating, reviews: rv, reviewCount: reviews, sold,
      discount,
      createdAt: new Date(Date.now() - (400 - i * 11) * 864e5).toISOString(),
      status: "active",
      freeShipping: price > 250,
      tags: [cat, features[0].toLowerCase(), v.name.split(" ")[0].toLowerCase()],
      views: sold * 7 + 200,
      gallery: [emoji, emoji, emoji],
    };
  });
}

/* ---------- demo customers & orders ---------- */
const DEMO_CUSTOMERS = [
  { id: "u_admin", name: "Nadia Administrator", email: "admin@nexus.dev", password: "admin123", role: "admin", avatar: "👩‍💼", joined: "2022-01-04", phone: "+1 (512) 555-0142", address: "900 Congress Ave, Austin, TX 78701", status: "active" },
  { id: "u_demo", name: "Alex Morgan", email: "customer@nexus.dev", password: "demo123", role: "customer", avatar: "🙂", joined: "2023-06-18", phone: "+1 (415) 555-0198", address: "128 Market St, San Francisco, CA 94103", status: "active" },
  { id: "u_1", name: "James Whitfield", email: "james.w@example.com", password: "pass123", role: "customer", avatar: "🧑", joined: "2023-02-11", phone: "+1 (212) 555-0177", address: "55 Broadway, New York, NY 10006", status: "active" },
  { id: "u_2", name: "Sofia Marchetti", email: "sofia.m@example.com", password: "pass123", role: "customer", avatar: "👩", joined: "2023-09-02", phone: "+39 02 5550 1234", address: "Via Montenapoleone 8, Milan", status: "active" },
  { id: "u_3", name: "Daniel Okafor", email: "daniel.o@example.com", password: "pass123", role: "customer", avatar: "🧔", joined: "2024-01-19", phone: "+44 20 5550 1188", address: "12 Shoreditch High St, London", status: "active" },
  { id: "u_4", name: "Emma Lindqvist", email: "emma.l@example.com", password: "pass123", role: "customer", avatar: "👩‍🦰", joined: "2023-11-27", phone: "+46 8 5550 2210", address: "Sveavägen 44, Stockholm", status: "active" },
  { id: "u_5", name: "Rafael Costa", email: "rafael.c@example.com", password: "pass123", role: "customer", avatar: "🧑‍🦱", joined: "2024-04-08", phone: "+55 11 5550 9931", address: "Av. Paulista 1000, São Paulo", status: "banned" },
];

const ORDER_STATUS = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
const STATUS_META = {
  pending: { label: "Pending", cls: "chip-warn" },
  processing: { label: "Processing", cls: "chip-pri" },
  shipped: { label: "Shipped", cls: "chip" },
  delivered: { label: "Delivered", cls: "chip-ok" },
  cancelled: { label: "Cancelled", cls: "chip-bad" },
  refunded: { label: "Refunded", cls: "chip-bad" },
  paid: { label: "Paid", cls: "chip-ok" },
  unpaid: { label: "Unpaid", cls: "chip-warn" },
  approved: { label: "Approved", cls: "chip-ok" },
  rejected: { label: "Rejected", cls: "chip-bad" },
  active: { label: "Active", cls: "chip-ok" },
  draft: { label: "Draft", cls: "chip-warn" },
  out_of_stock: { label: "Out of Stock", cls: "chip-bad" },
};

function buildOrders(products) {
  const orders = [];
  const rnd = mulberry32(20240617);
  for (let i = 0; i < 68; i++) {
    const cust = DEMO_CUSTOMERS[2 + Math.floor(rnd() * (DEMO_CUSTOMERS.length - 2))];
    const nItems = 1 + Math.floor(rnd() * 3);
    const items = [];
    let subtotal = 0;
    for (let k = 0; k < nItems; k++) {
      const p = products[Math.floor(rnd() * products.length)];
      if (items.find((x) => x.productId === p.id)) continue;
      const qty = 1 + Math.floor(rnd() * 2);
      subtotal += p.price * qty;
      items.push({ productId: p.id, name: p.name, emoji: p.emoji, price: p.price, qty, vendorId: p.vendorId, sku: p.sku });
    }
    const shipping = subtotal > 500 ? 0 : 14.99;
    const tax = +(subtotal * 0.0825).toFixed(2);
    const daysAgo = Math.floor(rnd() * 120);
    const createdAt = new Date(Date.now() - daysAgo * 864e5 - Math.floor(rnd() * 86400)).toISOString();
    let status;
    if (daysAgo < 2) status = rnd() > 0.4 ? "pending" : "processing";
    else if (daysAgo < 6) status = rnd() > 0.5 ? "processing" : "shipped";
    else if (daysAgo < 20) status = rnd() > 0.25 ? "delivered" : "shipped";
    else status = rnd() > 0.12 ? "delivered" : rnd() > 0.5 ? "refunded" : "cancelled";
    orders.push({
      id: "NX-" + (102400 + i * 7),
      customerId: cust.id, customerName: cust.name, customerEmail: cust.email,
      items, subtotal: +subtotal.toFixed(2), shipping, tax,
      total: +(subtotal + shipping + tax).toFixed(2),
      status, paymentStatus: ["cancelled", "refunded"].includes(status) ? status : "paid",
      createdAt,
      address: cust.address || "—",
      tracking: ["shipped", "delivered"].includes(status) ? "1Z" + String(Math.floor(rnd() * 1e9)).padStart(9, "0") : null,
      carrier: ["shipped", "delivered"].includes(status) ? ["UPS", "FedEx", "DHL"][Math.floor(rnd() * 3)] : null,
      timeline: buildTimeline(status, createdAt),
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
function buildTimeline(status, createdAt) {
  const base = new Date(createdAt).getTime();
  const steps = [{ s: "pending", label: "Order placed", at: base }];
  const order = ["pending", "processing", "shipped", "delivered"];
  const idx = order.indexOf(status);
  if (idx > 0) steps.push({ s: "processing", label: "Payment confirmed", at: base + 36e5 });
  if (idx > 1 || status === "cancelled") steps.push({ s: "shipped", label: status === "cancelled" ? "Order cancelled" : "Shipped", at: base + 864e5 });
  if (idx > 2) steps.push({ s: "delivered", label: "Delivered", at: base + 3 * 864e5 });
  if (status === "refunded") steps.push({ s: "refunded", label: "Refund issued", at: base + 5 * 864e5 });
  return steps;
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PAYOUTS_SEED = [
  { id: "PO-8841", vendorId: "v_solaris", amount: 12480.5, status: "paid", requested: "2024-05-02", paidAt: "2024-05-05", method: "Bank Transfer ••4471" },
  { id: "PO-8842", vendorId: "v_voltix", amount: 28910.0, status: "paid", requested: "2024-05-02", paidAt: "2024-05-05", method: "Bank Transfer ••8820" },
  { id: "PO-8855", vendorId: "v_solaris", amount: 8240.75, status: "processing", requested: "2024-06-01", paidAt: null, method: "Bank Transfer ••4471" },
  { id: "PO-8856", vendorId: "v_forge", amount: 5120.3, status: "pending", requested: "2024-06-10", paidAt: null, method: "PayPal" },
  { id: "PO-8857", vendorId: "v_atelier", amount: 18900.0, status: "processing", requested: "2024-06-12", paidAt: null, method: "Bank Transfer ••1190" },
  { id: "PO-8858", vendorId: "v_casa", amount: 3960.4, status: "rejected", requested: "2024-06-14", paidAt: null, method: "PayPal" },
];

const COUPONS = [
  { code: "NEXUS10", type: "percent", value: 10, min: 0, uses: 842, limit: 5000, active: true, expires: "2026-12-31" },
  { code: "SOLAR50", type: "fixed", value: 50, min: 500, uses: 128, limit: 500, active: true, expires: "2026-10-01" },
  { code: "FREESHIP", type: "shipping", value: 0, min: 100, uses: 2310, limit: 99999, active: true, expires: "2026-12-31" },
  { code: "WELCOME5", type: "percent", value: 5, min: 0, uses: 4102, limit: 10000, active: false, expires: "2026-06-01" },
];
