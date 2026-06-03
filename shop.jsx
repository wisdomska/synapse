// ============================================================
// SYNAPSE — Catalog (filters/sort/search) + Product detail
// ============================================================
const { useState: sgS, useEffect: sgE, useMemo: sgM } = React;

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rating", label: "Top rated" },
];

function Catalog({ nav, onOpen, onAdd, favs, onFav, initialCat }) {
  const { PRODUCTS, CATEGORIES } = window.SYN;
  const [cat, setCat] = sgS(initialCat || "all");
  const [sort, setSort] = sgS("featured");
  const [maxPrice, setMaxPrice] = sgS(500);
  const [q, setQ] = sgS("");
  const [loading, setLoading] = sgS(true);
  const reveal = useReveal();

  sgE(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, [cat, sort, maxPrice, q]);
  sgE(() => { if (initialCat) setCat(initialCat); }, [initialCat]);

  const list = sgM(() => {
    let r = q.trim() ? window.semanticSearch(q) : [...PRODUCTS];
    if (cat !== "all") r = r.filter((p) => p.category === cat);
    r = r.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [cat, sort, maxPrice, q]);

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 120 }} ref={reveal}>
      <div className="wrap">
        {/* header */}
        <div style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ marginBottom: 14, display: "inline-flex" }}>The collection</span>
          <h1 style={{ fontSize: "clamp(34px,5vw,60px)", lineHeight: 1, marginTop: 12 }}>Shop everything</h1>
        </div>

        {/* search + sort bar */}
        <div className="glass-2 glass-hi" style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 16, position: "sticky", top: 86, zIndex: 50, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200, paddingLeft: 8 }}>
            <Icon name="search" size={18} style={{ color: "var(--text-3)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search — try 'quiet for flights'…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 15, fontFamily: "Inter" }} />
            {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}><Icon name="close" size={16} /></button>}
          </div>
          <div style={{ position: "relative" }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field" style={{ borderRadius: 99, paddingRight: 38, cursor: "pointer", appearance: "none", minWidth: 170 }}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <Icon name="chevD" size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-3)" }} />
          </div>
        </div>

        <div className="catalog-layout" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }}>
          {/* filters */}
          <aside className="catalog-filters glass glass-hi" style={{ padding: 22, borderRadius: "var(--r-lg)", position: "sticky", top: 158 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18, fontWeight: 600 }}><Icon name="sliders" size={17} /> Filters</div>
            <div style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12 }}>Category</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: cat === c.id ? "rgba(var(--accent-rgb),.14)" : "transparent", color: cat === c.id ? "var(--text)" : "var(--text-2)", fontSize: 14, fontWeight: cat === c.id ? 600 : 500, fontFamily: "Inter", textAlign: "left" }}>
                  {c.label}
                  {cat === c.id && <Icon name="check" size={15} style={{ color: "var(--accent-bright)" }} />}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 14 }}>Max price · <span className="mono" style={{ color: "var(--accent-bright)" }}>{money(maxPrice)}</span></div>
            <input type="range" min={49} max={500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="range" style={{ width: "100%" }} />
            <button onClick={() => { setCat("all"); setMaxPrice(500); setQ(""); setSort("featured"); }} className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 22 }}>Reset filters</button>
          </aside>

          {/* grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="text-2" style={{ fontSize: 14 }}>{loading ? "Loading…" : <><b style={{ color: "var(--text)" }}>{list.length}</b> products</>}</span>
            </div>
            {loading ? (
              <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
                    <Skeleton h={230} r={0} />
                    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                      <Skeleton w="60%" h={18} /><Skeleton w="90%" h={13} /><Skeleton w="40%" h={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="glass center-col" style={{ padding: 60, borderRadius: "var(--r-lg)", gap: 12 }}>
                <Icon name="search" size={34} style={{ color: "var(--text-3)" }} />
                <p className="text-2">No products match. Try widening your filters.</p>
              </div>
            ) : (
              <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                {list.map((p, i) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} fav={favs.includes(p.id)} onFav={onFav} delay={i * 40} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Product detail ---------------- */
function ProductDetail({ p, nav, onOpen, onAdd, favs, onFav, openChat }) {
  const { recsFor, galleryFor, REVIEWS } = window.SYN;
  const [active, setActive] = sgS(0);
  const [color, setColor] = sgS(0);
  const [qty, setQty] = sgS(1);
  const [added, setAdded] = sgS(false);
  const reveal = useReveal();
  const gallery = galleryFor(p);
  const recs = recsFor(p.id, 4);
  sgE(() => { setActive(0); setColor(0); setQty(1); window.scrollTo(0, 0); }, [p.id]);

  const add = () => { onAdd(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1400); };

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 110 }} ref={reveal}>
      <div className="wrap">
        <button onClick={() => nav("catalog")} className="btn btn-ghost btn-sm" style={{ marginBottom: 22 }}><Icon name="chevL" size={16} /> Back to shop</button>
        <div className="pdp-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 44, alignItems: "start" }}>
          {/* gallery */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="glass glass-hi" style={{ borderRadius: "var(--r-xl)", padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "var(--glow)", opacity: 0.5 }} />
              <SmartImg src={gallery[active]} alt={p.name} className={"pdp-shot pv" + active} style={{ width: "100%", aspectRatio: "1/1", borderRadius: "var(--r-lg)", position: "relative" }} />
              {p.badge && <span className="badge" style={{ position: "absolute", top: 32, left: 32 }}>{p.badge}</span>}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} className="glass" style={{ width: 84, height: 84, borderRadius: 14, padding: 6, cursor: "pointer", border: active === i ? "2px solid var(--accent)" : "1px solid var(--border)", overflow: "hidden" }}>
                  <SmartImg src={g} alt="" className={"pdp-shot pv" + i} style={{ width: "100%", height: "100%", borderRadius: 9 }} />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span className="tag-muted tag" style={{ textTransform: "capitalize" }}>{p.category}</span>
              <Stars value={p.rating} size={14} count={p.reviews} />
            </div>
            <h1 style={{ fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1, marginBottom: 14 }}>{p.name}</h1>
            <p className="text-2" style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 22, maxWidth: 480 }}>{p.blurb}</p>
            <div style={{ marginBottom: 24 }}><Price value={p.price} was={p.was} size={34} /></div>

            {/* color */}
            <div style={{ marginBottom: 22 }}>
              <div className="text-3" style={{ fontSize: 13, marginBottom: 10 }}>Finish · <span style={{ color: "var(--text-2)" }}>{["Carbon", "Frost", "Violet"][color] || "Default"}</span></div>
              <div style={{ display: "flex", gap: 10 }}>
                {p.colors.map((c, i) => (
                  <button key={i} onClick={() => setColor(i)} aria-label={"Color " + (i + 1)} style={{ width: 38, height: 38, borderRadius: 99, background: c, cursor: "pointer", border: color === i ? "2px solid var(--accent-bright)" : "1px solid var(--border-strong)", outline: color === i ? "2px solid transparent" : "none", outlineOffset: 3, boxShadow: color === i ? "0 0 0 4px rgba(var(--accent-rgb),.2)" : "none" }} />
                ))}
              </div>
            </div>

            {/* qty + add */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
              <div className="glass" style={{ display: "flex", alignItems: "center", borderRadius: 99, padding: 5 }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ ...qtyBtn, width: 38, height: 38 }} aria-label="Decrease"><Icon name="minus" size={16} /></button>
                <span className="mono" style={{ width: 36, textAlign: "center", fontWeight: 600, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ ...qtyBtn, width: 38, height: 38 }} aria-label="Increase"><Icon name="plus" size={16} /></button>
              </div>
              <Button variant="primary" size="lg" magnetic onClick={add} className={added ? "bounce" : ""} style={{ flex: 1, minWidth: 200 }} icon={added ? "check" : "cart"}>{added ? "Added to cart" : "Add to cart · " + money(p.price * qty)}</Button>
              <button onClick={() => onFav(p.id)} aria-label="Save" className="glass" style={{ width: 56, height: 56, borderRadius: 16, display: "grid", placeItems: "center", border: "1px solid var(--border)", cursor: "pointer", color: favs.includes(p.id) ? "var(--accent-bright)" : "var(--text-2)" }}><Icon name="heart" size={20} fill={favs.includes(p.id) ? "var(--accent-bright)" : "none"} /></button>
            </div>

            {/* trust row */}
            <div className="glass" style={{ display: "flex", justifyContent: "space-around", padding: "14px 10px", borderRadius: 14, marginBottom: 26 }}>
              {[["truck", "Free shipping"], ["refresh", "30-day returns"], ["shield", "2-yr warranty"]].map(([ic, t]) => (
                <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" }}><Icon name={ic} size={18} style={{ color: "var(--accent-bright)" }} />{t}</div>
              ))}
            </div>

            {/* specs */}
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Specifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)" }}>
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} style={{ padding: "13px 16px", background: "var(--bg-2)" }}>
                  <div className="text-3" style={{ fontSize: 12 }}>{k}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>

            <button onClick={openChat} className="glass lift" style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 16, borderRadius: 14, marginTop: 18, cursor: "pointer", border: "1px solid var(--border)", textAlign: "left", color: "var(--text)" }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}><Icon name="sparkle" size={18} /></span>
              <span style={{ flex: 1 }}><span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>Ask Synth about this product</span><span className="text-3" style={{ fontSize: 12.5 }}>Compatibility, comparisons, what's in the box…</span></span>
              <Icon name="arrowR" size={18} style={{ color: "var(--text-3)" }} />
            </button>
          </div>
        </div>

        {/* frequently bought together */}
        <section style={{ marginTop: 80 }}>
          <SectionHead eyebrow={<><Icon name="sparkle" size={13} /> AI suggests</>} title="Frequently bought together" />
          <div className="rec-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {recs.map((r, i) => <ProductCard key={r.id} p={r} onOpen={onOpen} onAdd={onAdd} fav={favs.includes(r.id)} onFav={onFav} delay={i * 50} />)}
          </div>
        </section>

        {/* reviews */}
        <section style={{ marginTop: 80 }}>
          <SectionHead eyebrow="Verified buyers" title={`${p.rating} · ${p.reviews.toLocaleString()} reviews`} />
          <div className="rec-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {REVIEWS.map((r, i) => (
              <div key={r.name} className="glass glass-hi reveal" style={{ padding: 24, borderRadius: "var(--r-lg)", transitionDelay: i * 60 + "ms" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 99, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{r.avatar}</span>
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div><div className="text-3" style={{ fontSize: 11.5 }}>{r.date}</div></div>
                  </div>
                  <Stars value={r.rating} size={13} />
                </div>
                <h4 style={{ fontSize: 15, marginBottom: 6 }}>{r.title}</h4>
                <p className="text-2" style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>"{r.body}"</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { Catalog, ProductDetail });
