// ============================================================
// SYNAPSE — shared shell: ProductCard, Nav, Footer, MiniCart,
// ChatDrawer, SearchOverlay  (exported to window)
// ============================================================
const { useState: uS, useEffect: uE, useRef: uR } = React;

/* ---------------- semantic search (simulated embeddings) ---------------- */
function semanticSearch(query) {
  const { PRODUCTS, INTENT, CATEGORIES } = window.SYN;
  const q = query.toLowerCase().trim();
  if (!q) return [];
  // expand intent + simple typo tolerance
  let terms = q.split(/\s+/);
  let expanded = new Set(terms);
  Object.keys(INTENT).forEach((k) => { if (q.includes(k)) INTENT[k].forEach((t) => expanded.add(t)); });
  const score = (p) => {
    let s = 0;
    const hay = (p.name + " " + p.blurb + " " + p.category + " " + p.keywords.join(" ")).toLowerCase();
    expanded.forEach((t) => {
      if (!t) return;
      if (hay.includes(t)) s += 3;
      else if (t.length > 3 && hay.includes(t.slice(0, t.length - 1))) s += 1; // crude typo tolerance
    });
    if (p.name.toLowerCase().includes(q)) s += 6;
    if (p.category.includes(q)) s += 4;
    return s;
  };
  return PRODUCTS.map((p) => ({ p, s: score(p) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.p);
}

/* ---------------- ProductCard ---------------- */
function ProductCard({ p, onOpen, onAdd, fav, onFav, delay = 0 }) {
  const [adding, setAdding] = uS(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true); onAdd(p); setTimeout(() => setAdding(false), 600);
  };
  return (
    <article className="glass glass-hi product-card reveal" style={{ borderRadius: "var(--r-md)", overflow: "hidden", cursor: "pointer", transitionDelay: delay + "ms", display: "flex", flexDirection: "column" }}
      onClick={() => onOpen(p)}>
      <div style={{ position: "relative", aspectRatio: "1/1" }}>
        <SmartImg src={p.img} alt={p.name} style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
        {p.badge && <span className="badge" style={{ position: "absolute", top: 12, left: 12 }}>{p.badge}</span>}
        <button aria-label="Save" onClick={(e) => { e.stopPropagation(); onFav(p.id); }}
          className="glass-2" style={{ position: "absolute", top: 10, right: 10, width: 38, height: 38, borderRadius: 99, display: "grid", placeItems: "center", color: fav ? "var(--accent-bright)" : "var(--text-2)", cursor: "pointer", border: "1px solid var(--border)" }}>
          <Icon name="heart" size={17} fill={fav ? "var(--accent-bright)" : "none"} />
        </button>
      </div>
      <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 18, fontFamily: '"Clash Display",sans-serif' }}>{p.name}</h3>
            <div className="text-3" style={{ fontSize: 12.5, textTransform: "capitalize", marginTop: 2 }}>{p.category} · {p.color}</div>
          </div>
          <Stars value={p.rating} size={12} />
        </div>
        <p className="text-2" style={{ fontSize: 13, lineHeight: 1.5, margin: 0, flex: 1 }}>{p.blurb}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <Price value={p.price} was={p.was} size={19} />
          <button aria-label={"Add " + p.name + " to cart"} onClick={handleAdd}
            className={"btn btn-primary btn-sm " + (adding ? "bounce" : "")} style={{ borderRadius: 99, width: 42, height: 42, padding: 0 }}>
            <Icon name={adding ? "check" : "plus"} size={18} stroke={2.4} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Top Nav ---------------- */
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "catalog", label: "Shop" },
  { id: "orders", label: "Orders" },
  { id: "admin", label: "Admin" },
];
function TopNav({ route, nav, cartCount, onCart, onSearch, onChat, theme, toggleTheme, user, onAccount, cartBounce }) {
  const [scrolled, setScrolled] = uS(false);
  const [menuOpen, setMenuOpen] = uS(false);
  uE(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f); f(); return () => window.removeEventListener("scroll", f);
  }, []);
  const close = () => setMenuOpen(false);
  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, transition: "all .4s var(--ease-out)", padding: scrolled ? "10px 0" : "18px 0" }}>
        <div className="wrap">
          <nav className={scrolled ? "glass-2" : ""} style={{ display: "flex", alignItems: "center", gap: 18, height: 58, padding: "0 12px 0 20px", borderRadius: 999, border: scrolled ? "1px solid var(--border)" : "1px solid transparent", boxShadow: scrolled ? "var(--shadow)" : "none", transition: "all .4s var(--ease-out)" }}>

            {/* Logo — hidden on mobile */}
            <button className="nav-logo" onClick={() => nav("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "0 6px 18px -4px rgba(var(--accent-rgb),.7)" }}>
                <Icon name="zap" size={17} fill="#fff" stroke={0} style={{ color: "#fff" }} />
              </span>
              <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: 21, letterSpacing: "-.02em" }}>SYNAPSE</span>
            </button>

            {/* Desktop nav links */}
            <div className="nav-links" style={{ display: "flex", gap: 4, marginLeft: 14 }}>
              {NAV_LINKS.map((l) => (
                <button key={l.id} onClick={() => nav(l.id)} className={"nav-link" + (route === l.id ? " active" : "")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14.5, fontWeight: 500, padding: "9px 14px", borderRadius: 99, color: route === l.id ? "var(--text)" : "var(--text-3)", position: "relative", transition: "color .25s var(--ease-out), transform .3s var(--ease-spring)" }}>
                  {l.label}
                  {route === l.id && <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: 99, background: "var(--accent)" }} />}
                </button>
              ))}
            </div>

            {/* Desktop-only action icons */}
            <div className="nav-actions" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <button className="nav-icon" aria-label="Search" onClick={onSearch} style={iconBtn}><Icon name="search" size={19} /></button>
              <button className="nav-icon" aria-label="AI assistant" onClick={onChat} style={iconBtn}><Icon name="sparkle" size={19} /></button>
              <button aria-label="Toggle theme" onClick={toggleTheme} style={iconBtn}><Icon name={theme === "dark" ? "sun" : "moon"} size={19} /></button>
              <button aria-label="Cart" onClick={onCart} style={{ ...iconBtn, position: "relative" }} className={cartBounce ? "bounce" : ""}>
                <Icon name="cart" size={19} />
                {cartCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 99, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }} className="mono">{cartCount}</span>}
              </button>
              <button onClick={() => user ? onAccount() : nav("auth")} className="btn btn-ghost btn-sm signin-btn" style={{ marginLeft: 4 }}>
                {user ? <><span style={{ width: 22, height: 22, borderRadius: 99, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{user.name[0]}</span>{user.name.split(" ")[0]}</> : <>Sign in</>}
              </button>
            </div>

            {/* Mobile-only: search + cart + burger */}
            <div className="mobile-nav-actions" style={{ marginLeft: "auto", display: "none", alignItems: "center", gap: 4 }}>
              <button aria-label="Search" onClick={onSearch} style={iconBtn}><Icon name="search" size={19} /></button>
              <button aria-label="Cart" onClick={onCart} style={{ ...iconBtn, position: "relative" }} className={cartBounce ? "bounce" : ""}>
                <Icon name="cart" size={19} />
                {cartCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 99, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }} className="mono">{cartCount}</span>}
              </button>
              <button className="menu-btn" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((v) => !v)} style={iconBtn}>
                <Icon name={menuOpen ? "x" : "menu"} size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full menu */}
      {menuOpen && (
        <div className="glass-strong fade-in" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 199, display: "flex", flexDirection: "column", padding: "80px 20px 32px" }}>
          {/* Logo inside menu */}
          <button onClick={() => { nav("home"); close(); }} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", color: "var(--text)", marginBottom: 36 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "0 6px 18px -4px rgba(var(--accent-rgb),.7)" }}>
              <Icon name="zap" size={20} fill="#fff" stroke={0} />
            </span>
            <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: 26, letterSpacing: "-.02em" }}>SYNAPSE</span>
          </button>

          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => { nav(l.id); close(); }}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", background: route === l.id ? "rgba(var(--accent-rgb),.12)" : "none", border: "none", padding: "16px 18px", fontSize: 20, fontWeight: 600, fontFamily: '"Clash Display",sans-serif', color: route === l.id ? "var(--accent-bright)" : "var(--text)", cursor: "pointer", borderRadius: 16, transition: "background .2s" }}>
                {route === l.id && <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent-bright)", flexShrink: 0 }} />}
                {l.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="divider" style={{ margin: "20px 0" }} />

          {/* Action row — AI, theme, sign in */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <button aria-label="AI assistant" onClick={() => { onChat(); close(); }} style={iconBtn}><Icon name="sparkle" size={21} /></button>
              <button aria-label="Toggle theme" onClick={toggleTheme} style={iconBtn}><Icon name={theme === "dark" ? "sun" : "moon"} size={21} /></button>
            </div>
            <button onClick={() => { user ? onAccount() : nav("auth"); close(); }} className="btn btn-primary" style={{ flex: 1, maxWidth: 200 }}>
              {user ? <><span style={{ width: 22, height: 22, borderRadius: 99, background: "rgba(255,255,255,.25)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{user.name[0]}</span>{user.name.split(" ")[0]}</> : <>Sign in</>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
const iconBtn = { width: 42, height: 42, borderRadius: 99, display: "grid", placeItems: "center", background: "none", border: "none", color: "var(--text-2)", cursor: "pointer", transition: "color .25s, background .25s" };

/* ---------------- Footer ---------------- */
function Footer({ nav }) {
  const cols = [
    { h: "Shop", links: ["Earbuds", "Headphones", "Speakers", "Wearables", "Accessories"] },
    { h: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
    { h: "Support", links: ["Help center", "Shipping", "Returns", "Warranty"] },
  ];
  return (
    <footer style={{ position: "relative", zIndex: 1, marginTop: 80, borderTop: "1px solid var(--border)", paddingTop: 64 }}>
      <div className="wrap">
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40, paddingBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="zap" size={17} fill="#fff" stroke={0} style={{ color: "#fff" }} /></span>
              <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: 22 }}>SYNAPSE</span>
            </div>
            <p className="text-2" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: "0 0 20px" }}>Smart shopping, styled smooth. Premium audio &amp; smart tech, curated by AI.</p>
            <div style={{ display: "flex", gap: 10 }}>
              {["box", "sparkle", "user"].map((i, k) => <span key={k} className="glass" style={{ width: 38, height: 38, borderRadius: 99, display: "grid", placeItems: "center", color: "var(--text-2)" }}><Icon name={i} size={16} /></span>)}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "Inter", fontWeight: 600, marginBottom: 16 }}>{c.h}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {c.links.map((l) => <button key={l} onClick={() => nav("catalog")} style={{ background: "none", border: "none", textAlign: "left", color: "var(--text-2)", fontSize: 14, cursor: "pointer", padding: 0 }}>{l}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "22px 0 40px", fontSize: 13, color: "var(--text-3)" }}>
          <span>© 2026 SYNAPSE. Prototype — design artifact.</span>
          <span style={{ display: "flex", gap: 22 }}><a style={fl}>Privacy</a><a style={fl}>Terms</a><a style={fl}>Cookies</a></span>
        </div>
      </div>
    </footer>
  );
}
const fl = { color: "var(--text-3)", cursor: "pointer", textDecoration: "none" };

Object.assign(window, { semanticSearch, ProductCard, TopNav, Footer, iconBtn });
