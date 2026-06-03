// ============================================================
// SYNAPSE — App root: routing, state, tweaks
// ============================================================
const { useState: aS, useEffect: aE, useCallback: aCB } = React;

const ACCENTS = {
  "#7c5cff": { bright: "#a78bff", deep: "#5b3fe0", rgb: "124, 92, 255" },
  "#2f9bff": { bright: "#6cbcff", deep: "#1d6fd0", rgb: "47, 155, 255" },
  "#19c37d": { bright: "#4fe0a3", deep: "#0e9460", rgb: "25, 195, 125" },
  "#ff5da2": { bright: "#ff8dc0", deep: "#e0357e", rgb: "255, 93, 162" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#7c5cff",
  "hero": "split",
  "theme": "dark",
  "blur": 20
}/*EDITMODE-END*/;

function applyAccent(hex) {
  const a = ACCENTS[hex] || ACCENTS["#7c5cff"];
  const r = document.documentElement.style;
  r.setProperty("--accent", hex);
  r.setProperty("--accent-bright", a.bright);
  r.setProperty("--accent-deep", a.deep);
  r.setProperty("--accent-rgb", a.rgb);
}

function AppInner() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = aS("home");
  const [activeProduct, setActiveProduct] = aS(null);
  const [catalogCat, setCatalogCat] = aS(null);
  const [cart, setCart] = aS([]);
  const [favs, setFavs] = aS([]);
  const [user, setUser] = aS(null);
  const [theme, setTheme] = aS(t.theme || "dark");
  const [cartOpen, setCartOpen] = aS(false);
  const [searchOpen, setSearchOpen] = aS(false);
  const [chatOpen, setChatOpen] = aS(false);
  const [cartBounce, setCartBounce] = aS(false);
  const toast = useToast();
  const { byId } = window.SYN;

  // apply theme + accent + hero + blur
  aE(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  aE(() => { applyAccent(t.accent); }, [t.accent]);
  aE(() => { window.__heroVariant = t.hero; }, [t.hero]);
  aE(() => { document.documentElement.style.setProperty("--blur", t.blur + "px"); }, [t.blur]);
  aE(() => { if (t.theme !== theme) setTheme(t.theme); /* sync from tweak */ }, [t.theme]);
  aE(() => { document.body.classList.toggle("no-scroll", cartOpen || searchOpen || chatOpen); }, [cartOpen, searchOpen, chatOpen]);

  // esc closes overlays
  aE(() => {
    const h = (e) => { if (e.key === "Escape") { setCartOpen(false); setSearchOpen(false); setChatOpen(false); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const nav = aCB((r) => { setRoute(r); if (r !== "product") setActiveProduct(null); window.scrollTo(0, 0); }, []);
  const openProduct = aCB((p) => { setActiveProduct(p); setRoute("product"); window.scrollTo(0, 0); }, []);

  const addToCart = aCB((p, qty = 1) => {
    setCart((c) => { const ex = c.find((x) => x.id === p.id); return ex ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + qty } : x) : [...c, { id: p.id, qty }]; });
    setCartBounce(true); setTimeout(() => setCartBounce(false), 600);
    toast(`${p.name} added to cart`, "cart");
  }, [toast]);
  const changeQty = aCB((id, d) => setCart((c) => c.map((x) => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x)), []);
  const removeItem = aCB((id) => setCart((c) => c.filter((x) => x.id !== id)), []);
  const toggleFav = aCB((id) => setFavs((f) => { const has = f.includes(id); toast(has ? "Removed from saved" : "Saved to wishlist", "heart"); return has ? f.filter((x) => x !== id) : [...f, id]; }), [toast]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const toCheckout = () => { setCartOpen(false); nav("checkout"); };

  let page;
  if (route === "home") page = <Home nav={nav} onOpen={openProduct} onAdd={addToCart} favs={favs} onFav={toggleFav} setCat={setCatalogCat} openChat={() => setChatOpen(true)} />;
  else if (route === "catalog") page = <Catalog nav={nav} onOpen={openProduct} onAdd={addToCart} favs={favs} onFav={toggleFav} initialCat={catalogCat} />;
  else if (route === "product" && activeProduct) page = <ProductDetail p={activeProduct} nav={nav} onOpen={openProduct} onAdd={addToCart} favs={favs} onFav={toggleFav} openChat={() => setChatOpen(true)} />;
  else if (route === "checkout") page = <Checkout items={cart} byId={byId} onQty={changeQty} onRemove={removeItem} nav={nav} clearCart={() => setCart([])} user={user} />;
  else if (route === "account") page = user ? <Account user={user} nav={nav} onOpen={openProduct} onLogout={() => { setUser(null); nav("home"); }} favs={favs} /> : <Auth onAuth={setUser} nav={nav} />;
  else if (route === "orders") page = user ? <Orders user={user} nav={nav} onOpen={openProduct} byId={byId} onLogout={() => { setUser(null); nav("home"); }} /> : <Auth onAuth={setUser} nav={nav} />;
  else if (route === "auth") page = <Auth onAuth={setUser} nav={nav} />;
  else if (route === "admin") page = (user && user.role === "Admin") ? <Admin nav={nav} user={user} /> : <Auth onAuth={(u) => setUser({ ...u, role: "Admin" })} nav={nav} />;
  else page = <Home nav={nav} onOpen={openProduct} onAdd={addToCart} favs={favs} onFav={toggleFav} setCat={setCatalogCat} openChat={() => setChatOpen(true)} />;

  return (
    <>
      <div className="app-bg" />
      <TopNav route={route} nav={nav} cartCount={cartCount} onCart={() => setCartOpen(true)} onSearch={() => setSearchOpen(true)} onChat={() => setChatOpen(true)} theme={theme} toggleTheme={() => { const n = theme === "dark" ? "light" : "dark"; setTheme(n); setTweak("theme", n); }} user={user} onAccount={() => nav("account")} cartBounce={cartBounce} />
      <main key={route + (activeProduct?.id || "")} className="fade-in">{page}</main>
      {route !== "auth" && <Footer nav={nav} />}

      <MiniCart open={cartOpen} items={cart} byId={byId} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} onCheckout={toCheckout} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpen={openProduct} />
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} onOpen={(p) => { setChatOpen(false); openProduct(p); }} onAdd={addToCart} />

      {/* floating AI button */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} aria-label="AI assistant" className="ai-fab" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 180, width: 60, height: 60, borderRadius: 99, border: "none", cursor: "pointer", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 14px 40px -8px rgba(var(--accent-rgb),.7)" }}>
          <Icon name="sparkle" size={26} fill="#fff" stroke={0} style={{ color: "#fff" }} />
        </button>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Hero layout" />
        <TweakRadio label="Composition" value={t.hero} options={["centered", "split", "ghost"]} onChange={(v) => setTweak("hero", v)} />
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={theme} options={["dark", "light"]} onChange={(v) => { setTheme(v); setTweak("theme", v); }} />
        <TweakColor label="Accent" value={t.accent} options={Object.keys(ACCENTS)} onChange={(v) => setTweak("accent", v)} />
        <TweakSlider label="Glass blur" value={t.blur} min={6} max={32} step={2} unit="px" onChange={(v) => setTweak("blur", v)} />
      </TweaksPanel>
    </>
  );
}

function App() { return <ToastHost><AppInner /></ToastHost>; }

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
