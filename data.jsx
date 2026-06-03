// ============================================================
// SYNAPSE — mock catalog + data  (exported to window)
// Premium smart-tech: audio, wearables, accessories.
// ============================================================

// Unsplash IDs chosen for clean, high-contrast tech product shots.
// All <img> render through SmartImg, which falls back to a CSS render tile.
const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "earbuds", label: "Earbuds" },
  { id: "headphones", label: "Headphones" },
  { id: "speakers", label: "Speakers" },
  { id: "wearables", label: "Wearables" },
  { id: "accessories", label: "Accessories" },
];

const PRODUCTS = [
  {
    id: "syn-aura-pro", name: "Aura Pro", category: "earbuds", price: 249, was: 299,
    rating: 4.9, reviews: 1284, color: "Carbon", badge: "Best Seller",
    img: U("photo-1606220588913-b3aacb4d2f46"),
    blurb: "Adaptive ANC earbuds with spatial audio and a 38-hour case.",
    keywords: ["noise cancelling", "anc", "commute", "travel", "spatial", "wireless", "quiet", "flight"],
    specs: { Driver: "11mm dynamic", ANC: "Adaptive hybrid", Battery: "8h + 30h case", Water: "IPX5" },
    colors: ["#1c1c20", "#e9e9ee", "#6b5bd6"],
  },
  {
    id: "syn-aura-air", name: "Aura Air", category: "earbuds", price: 149,
    rating: 4.7, reviews: 842, color: "Frost",
    img: U("photo-1590658268037-6bf12165a8df"),
    blurb: "Featherweight open-ear buds that disappear all day.",
    keywords: ["light", "comfort", "open ear", "running", "gym", "sport", "all day"],
    specs: { Driver: "9mm", ANC: "Transparency", Battery: "6h + 24h case", Water: "IPX4" },
    colors: ["#e9e9ee", "#1c1c20"],
  },
  {
    id: "syn-eclipse", name: "Eclipse Studio", category: "headphones", price: 379, was: 429,
    rating: 4.9, reviews: 2103, color: "Graphite", badge: "Editor's Pick",
    img: "images/hero-headphones.jpg",
    blurb: "Over-ear reference headphones tuned for mastering and deep focus.",
    keywords: ["studio", "mixing", "focus", "over ear", "audiophile", "bass", "premium", "work"],
    specs: { Driver: "40mm planar", ANC: "Hybrid -42dB", Battery: "40h", Weight: "278g" },
    colors: ["#26262c", "#0c0c10"],
  },
  {
    id: "syn-halo", name: "Halo ANC", category: "headphones", price: 299,
    rating: 4.6, reviews: 671, color: "Silver",
    img: U("photo-1583394838336-acd977736f90"),
    blurb: "Cloud-soft cushions and best-in-class noise cancellation.",
    keywords: ["noise cancelling", "travel", "comfort", "plush", "flight", "office"],
    specs: { Driver: "40mm", ANC: "Adaptive", Battery: "32h", Weight: "255g" },
    colors: ["#d7d7dc", "#26262c"],
  },
  {
    id: "syn-pulse", name: "Pulse Mini", category: "speakers", price: 129, was: 159,
    rating: 4.5, reviews: 503, color: "Slate", badge: "New",
    img: U("photo-1608043152269-423dbba4e7e1"),
    blurb: "Pocket speaker with room-filling 360° sound and 20h play.",
    keywords: ["portable", "outdoor", "party", "loud", "bluetooth", "beach", "small"],
    specs: { Output: "20W", Range: "30m", Battery: "20h", Water: "IP67" },
    colors: ["#3a3a42", "#6b5bd6"],
  },
  {
    id: "syn-monolith", name: "Monolith", category: "speakers", price: 449,
    rating: 4.8, reviews: 388, color: "Onyx",
    img: U("photo-1545454675-3531b543be5d"),
    blurb: "Architectural home speaker with adaptive room calibration.",
    keywords: ["home", "living room", "premium", "loud", "bass", "design", "shelf"],
    specs: { Output: "120W", Range: "Wi-Fi", Drivers: "4-way", Calib: "Auto" },
    colors: ["#1c1c20", "#d7d7dc"],
  },
  {
    id: "syn-vita", name: "Vita Watch", category: "wearables", price: 329, was: 379,
    rating: 4.8, reviews: 1567, color: "Titanium", badge: "Best Seller",
    img: U("photo-1579586337278-3befd40fd17a"),
    blurb: "Health-first smartwatch with ECG, SpO2 and 10-day battery.",
    keywords: ["fitness", "health", "ecg", "sleep", "running", "heart rate", "battery", "watch"],
    specs: { Display: "1.8\" LTPO", Battery: "10 days", Health: "ECG · SpO2", Water: "10ATM" },
    colors: ["#9a9aa2", "#1c1c20", "#6b5bd6"],
  },
  {
    id: "syn-band", name: "Trace Band", category: "wearables", price: 99,
    rating: 4.4, reviews: 932, color: "Black",
    img: U("photo-1575311373937-040b8e1fd5b6"),
    blurb: "Minimal fitness band with always-on focus and stress tracking.",
    keywords: ["fitness", "cheap", "light", "sleep", "steps", "stress", "minimal"],
    specs: { Display: "1.1\" AMOLED", Battery: "14 days", Health: "HR · Stress", Water: "5ATM" },
    colors: ["#0c0c10", "#6b5bd6"],
  },
  {
    id: "syn-charge", name: "Field Charger", category: "accessories", price: 79,
    rating: 4.7, reviews: 410, color: "Graphite", badge: "New",
    img: U("photo-1615526675159-e248c3021d3f"),
    blurb: "3-in-1 magnetic charger that folds flat for travel.",
    keywords: ["charging", "travel", "magnetic", "wireless", "desk", "fast", "fold"],
    specs: { Power: "15W max", Ports: "3 devices", Fold: "Yes", Cable: "USB-C" },
    colors: ["#26262c", "#d7d7dc"],
  },
  {
    id: "syn-case", name: "Vault Case", category: "accessories", price: 49,
    rating: 4.6, reviews: 277, color: "Stone",
    img: U("photo-1572569511254-d8f925fe2cbb"),
    blurb: "Crush-proof travel case with magnetic cable management.",
    keywords: ["travel", "organize", "protect", "case", "cables", "tech", "carry"],
    specs: { Material: "EVA shell", Slots: "8", Water: "Resistant", Weight: "180g" },
    colors: ["#8a8a8f", "#1c1c20"],
  },
  {
    id: "syn-sonic", name: "Sonic Buds", category: "earbuds", price: 189,
    rating: 4.6, reviews: 614, color: "Violet",
    img: U("photo-1598331668826-20cecc596b86"),
    blurb: "Bass-forward earbuds engineered for movement and grip.",
    keywords: ["bass", "gym", "sport", "running", "secure", "workout", "loud"],
    specs: { Driver: "12mm", ANC: "Hybrid", Battery: "9h + 27h case", Water: "IPX6" },
    colors: ["#6b5bd6", "#1c1c20"],
  },
  {
    id: "syn-clarity", name: "Clarity Buds", category: "earbuds", price: 219,
    rating: 4.8, reviews: 489, color: "Pearl", badge: "New",
    img: U("photo-1574920162043-b872873f19c8"),
    blurb: "Crystal call quality with 6-mic beamforming for meetings.",
    keywords: ["calls", "meetings", "work", "office", "clear", "voice", "remote"],
    specs: { Driver: "10mm", Mics: "6 beamforming", Battery: "7h + 28h case", Water: "IPX4" },
    colors: ["#ededf0", "#6b5bd6"],
  },
  {
    id: "syn-orbit", name: "Orbit Open", category: "earbuds", price: 169,
    rating: 4.5, reviews: 356, color: "Sand", badge: "New",
    img: U("photo-1606841837239-c5a1a4a07af7"),
    blurb: "Air-conduction buds that keep you aware on every run.",
    keywords: ["open ear", "running", "sport", "aware", "light", "outdoor", "cycling"],
    specs: { Driver: "Air-conduction", ANC: "Ambient", Battery: "8h + 24h case", Water: "IP55" },
    colors: ["#d8cdb8", "#1c1c20"],
  },
  {
    id: "syn-rift", name: "Rift Pro", category: "headphones", price: 459,
    rating: 4.9, reviews: 1142, color: "Midnight", badge: "Editor's Pick",
    img: U("photo-1599669454699-248893623440"),
    blurb: "Flagship wireless cans with lossless 24-bit hi-res streaming.",
    keywords: ["audiophile", "lossless", "hi-res", "premium", "wireless", "studio", "bass"],
    specs: { Driver: "45mm", ANC: "Adaptive -45dB", Battery: "36h", Codec: "LDAC · aptX" },
    colors: ["#161620", "#6b5bd6"],
  },
  {
    id: "syn-nimbus", name: "Nimbus Go", category: "speakers", price: 89,
    rating: 4.4, reviews: 627, color: "Coral",
    img: U("photo-1589003077984-894e133dabab"),
    blurb: "Clip-on speaker built for trails, showers and spontaneity.",
    keywords: ["portable", "outdoor", "rugged", "clip", "bluetooth", "shower", "travel"],
    specs: { Output: "12W", Range: "25m", Battery: "16h", Water: "IP67" },
    colors: ["#e2725b", "#1c1c20"],
  },
  {
    id: "syn-aria", name: "Aria Home", category: "speakers", price: 239, was: 279,
    rating: 4.7, reviews: 441, color: "Linen",
    img: U("photo-1558537348-c0f8e733989d"),
    blurb: "Voice-ready smart speaker with warm, room-aware tuning.",
    keywords: ["home", "smart", "voice", "living room", "wifi", "design", "shelf"],
    specs: { Output: "60W", Range: "Wi-Fi 6", Drivers: "3-way", Calib: "Auto" },
    colors: ["#ece6da", "#3a3a42"],
  },
  {
    id: "syn-pulse-watch", name: "Pulse Sport", category: "wearables", price: 199, was: 229,
    rating: 4.6, reviews: 718, color: "Lime", badge: "New",
    img: U("photo-1434493789847-2f02dc6ca35d"),
    blurb: "GPS sport watch with dual-band tracking and 18-day battery.",
    keywords: ["fitness", "gps", "running", "triathlon", "sport", "battery", "watch"],
    specs: { Display: "1.4\" AMOLED", Battery: "18 days", GPS: "Dual-band", Water: "10ATM" },
    colors: ["#c4f042", "#1c1c20"],
  },
  {
    id: "syn-ring", name: "Aura Ring", category: "wearables", price: 279,
    rating: 4.5, reviews: 503, color: "Graphite",
    img: U("photo-1611591437281-460bfbe1220a"),
    blurb: "Smart ring that reads sleep, recovery and readiness silently.",
    keywords: ["sleep", "recovery", "health", "minimal", "ring", "readiness", "discreet"],
    specs: { Sensors: "HR · Temp · SpO2", Battery: "7 days", Sizes: "6-13", Water: "100m" },
    colors: ["#3a3a42", "#d7d7dc"],
  },
  {
    id: "syn-dock", name: "Tower Dock", category: "accessories", price: 119, was: 139,
    rating: 4.7, reviews: 332, color: "Onyx", badge: "Best Seller",
    img: U("photo-1625948515291-69613efd103f"),
    blurb: "Vertical 4-device charging tower with a hidden cable spine.",
    keywords: ["charging", "desk", "tower", "magnetic", "fast", "home", "organize"],
    specs: { Power: "65W total", Ports: "4 devices", Fold: "No", Cable: "USB-C PD" },
    colors: ["#1c1c20", "#6b5bd6"],
  },
  {
    id: "syn-tips", name: "Seal Tips Kit", category: "accessories", price: 29,
    rating: 4.6, reviews: 894, color: "Assorted",
    img: U("photo-1608156639585-b3a032ef9689"),
    blurb: "Memory-foam ear tips in six sizes for a perfect, quiet seal.",
    keywords: ["earbuds", "comfort", "fit", "foam", "seal", "noise", "accessory"],
    specs: { Material: "Memory foam", Sizes: "6", Pairs: "3", Compat: "Universal" },
    colors: ["#8a8a8f", "#1c1c20"],
  },
];

// rich gallery for the product detail page (reuses same image + render variants)
function galleryFor(p) {
  return [p.img, p.img, p.img];
}

// AI "frequently bought together" graph (simple curated adjacency)
const PAIRINGS = {
  "syn-aura-pro": ["syn-case", "syn-charge", "syn-vita"],
  "syn-eclipse": ["syn-case", "syn-monolith", "syn-charge"],
  "syn-vita": ["syn-band", "syn-charge", "syn-aura-air"],
  "syn-pulse": ["syn-monolith", "syn-charge", "syn-case"],
};

function recsFor(id, n = 4) {
  const seed = PAIRINGS[id] || [];
  const rest = PRODUCTS.filter((p) => p.id !== id && !seed.includes(p.id)).map((p) => p.id);
  return [...seed, ...rest].slice(0, n).map((pid) => PRODUCTS.find((p) => p.id === pid));
}

// Semantic-search synonym expansion (simulated embedding intent)
const INTENT = {
  "quiet": ["noise cancelling", "anc", "focus"],
  "plane": ["travel", "flight", "noise cancelling"],
  "airplane": ["travel", "flight", "noise cancelling"],
  "work from home": ["calls", "meetings", "office"],
  "wfh": ["calls", "meetings", "office"],
  "workout": ["gym", "sport", "running"],
  "exercise": ["gym", "sport", "running"],
  "cheap": ["cheap", "light"],
  "affordable": ["cheap", "light"],
  "loud": ["bass", "party", "loud"],
  "party": ["party", "loud", "outdoor"],
  "study": ["focus", "studio", "work"],
  "concentrate": ["focus", "studio"],
  "health": ["fitness", "heart rate", "ecg"],
};

const ORDERS = [
  {
    id: "SYN-48201", date: "May 28, 2026", status: "In transit", eta: "Arrives Jun 2",
    total: 298, step: 2,
    items: [{ id: "syn-aura-pro", qty: 1 }, { id: "syn-case", qty: 1 }],
  },
  {
    id: "SYN-47788", date: "May 19, 2026", status: "Delivered", eta: "Delivered May 23",
    total: 329, step: 3,
    items: [{ id: "syn-vita", qty: 1 }],
  },
  {
    id: "SYN-47120", date: "May 04, 2026", status: "Delivered", eta: "Delivered May 8",
    total: 568, step: 3,
    items: [{ id: "syn-eclipse", qty: 1 }, { id: "syn-band", qty: 1 }],
  },
];

const REVIEWS = [
  { name: "Maya R.", avatar: "M", rating: 5, title: "Silence on demand", body: "The ANC genuinely erased my open-plan office. Battery outlasts my workday twice over.", date: "2 weeks ago", product: "Aura Pro" },
  { name: "Daniel K.", avatar: "D", rating: 5, title: "Studio-grade", body: "Flat, honest response. I mixed an entire EP on these and translated perfectly to monitors.", date: "1 month ago", product: "Eclipse Studio" },
  { name: "Priya S.", avatar: "P", rating: 4, title: "Lives on my wrist", body: "The 10-day battery claim is real. ECG flagged something my doctor confirmed. Worth it.", date: "3 weeks ago", product: "Vita Watch" },
];

const ADMIN_PRODUCTS = PRODUCTS.slice(0, 8).map((p, i) => ({
  ...p,
  stock: [124, 8, 56, 0, 212, 33, 90, 4][i],
  sold: [1284, 2103, 1567, 503, 842, 388, 671, 932][i],
}));

const SALES_SPARK = [42, 38, 55, 61, 49, 73, 68, 81, 77, 94, 88, 102];

Object.assign(window, {
  SYN: {
    U, CATEGORIES, PRODUCTS, ORDERS, REVIEWS, ADMIN_PRODUCTS, SALES_SPARK,
    INTENT, galleryFor, recsFor,
    byId: (id) => PRODUCTS.find((p) => p.id === id),
  },
});
