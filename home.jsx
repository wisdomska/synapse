// ============================================================
// SYNAPSE — Landing page  (hero variants via tweaks)
// ============================================================
const { useState: hS, useEffect: hE, useRef: hRef } = React;

/* ---------------- Carousel (auto-advancing, scroll-snap + arrow nav) ---------------- */
function Carousel({ children, interval = 3200 }) {
  const wrap = hRef(null);
  const track = hRef(null);
  const paused = hRef(false);
  const [atStart, setAtStart] = hS(true);
  const [atEnd, setAtEnd] = hS(false);
  const items = React.Children.toArray(children);
  const update = () => {
    const el = track.current; if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
  hE(() => {
    const el = track.current; if (!el) return;
    update();
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const step = () => {
    const el = track.current; if (!el) return 0;
    const card = el.querySelector("[data-citem]");
    return card ? card.getBoundingClientRect().width + 18 : el.clientWidth * 0.8;
  };
  const go = (dir) => {
    const el = track.current; if (!el) return;
    el.scrollBy({ left: dir * step(), behavior: "smooth" });
  };
  // auto-advance, paused while the section is hovered / focused / touched
  hE(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = track.current; if (!el) return;
    const id = setInterval(() => {
      if (paused.current) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step(), behavior: "smooth" });
    }, interval);
    return () => clearInterval(id);
  }, [interval]);
  const hold = () => { paused.current = true; };
  const release = () => { paused.current = false; };
  const arrow = (dir, disabled) => (
    <button onClick={() => go(dir)} disabled={disabled} aria-label={dir < 0 ? "Previous" : "Next"}
      className="glass-2 carousel-arrow"
      style={{ position: "absolute", top: "42%", [dir < 0 ? "left" : "right"]: -6, transform: "translateY(-50%)", width: 46, height: 46, borderRadius: 99, display: "grid", placeItems: "center", cursor: disabled ? "default" : "pointer", border: "1px solid var(--border-strong)", color: "var(--text)", opacity: disabled ? 0.3 : 1, pointerEvents: disabled ? "none" : "auto", zIndex: 5, boxShadow: "var(--shadow)", transition: "opacity .3s, transform .3s var(--ease-spring)" }}>
      <Icon name={dir < 0 ? "chevL" : "chevR"} size={20} />
    </button>
  );
  return (
    <div ref={wrap} style={{ position: "relative" }}
      onMouseEnter={hold} onMouseLeave={release}
      onFocusCapture={hold} onBlurCapture={release}
      onTouchStart={hold} onTouchEnd={release}>
      <div ref={track} className="no-bar carousel-track" onScroll={update}
        style={{ display: "flex", gap: 18, overflowX: "auto", scrollSnapType: "x proximity", scrollPaddingLeft: 2, paddingBottom: 6, WebkitOverflowScrolling: "touch" }}>
        {items.map((c, i) => (
          <div key={i} data-citem className="carousel-item" style={{ flex: "0 0 auto", scrollSnapAlign: "start", display: "flex" }}>{c}</div>
        ))}
      </div>
      {arrow(-1, atStart)}
      {arrow(1, atEnd)}
    </div>
  );
}

function Hero({ variant, nav, onAdd, hero }) {
  const heroVisualRef = hRef(null);
  hE(() => {
    const el = heroVisualRef.current; if (!el) return;
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = el.closest("section") || el;
    let raf = 0;
    const onMove = (e) => {
      const r = target.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1..1
      const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);
    return () => { target.removeEventListener("pointermove", onMove); target.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, [variant]);
  const sub = "Premium and smart audio tech, with sounds that connect to your synapses. Next-Gen audio synced to your mind";
  const ctas = (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: variant === "split" ? "flex-start" : "center" }}>
      <Button variant="primary" size="lg" magnetic onClick={() => nav("catalog")} iconRight="arrowR">Shop the collection</Button>
      <Button variant="ghost" size="lg" onClick={() => nav("catalog")} icon="sparkle">Ask the AI</Button>
    </div>
  );
  const productHero = (
    <div ref={heroVisualRef} className="hero-parallax" style={{ position: "relative", display: "grid", placeItems: "center" }}>
      {/* glow (counter-moves) */}
      <div className="par par-glow" style={{ position: "absolute", width: "120%", height: "120%", background: "var(--glow)", filter: "blur(10px)" }} />
      {/* pedestal (counter-moves) */}
      <div className="par par-glow" style={{ position: "absolute", bottom: variant === "split" ? "8%" : "6%", width: "62%", height: "30%", background: "var(--pedestal)", borderRadius: "50%", filter: "blur(26px)", opacity: 0.9 }} />
      <div className="float" style={{ position: "relative", zIndex: 2 }}>
        {/* electric-purple aura behind the product */}
        <div aria-hidden="true" className="hero-aura" style={{ position: "absolute", inset: "-16%", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 48%, rgba(var(--accent-rgb),0.72), rgba(var(--accent-rgb),0.28) 46%, transparent 72%)", filter: "blur(44px)", pointerEvents: "none" }} />
        <div className="par par-img" style={{ position: "relative", zIndex: 1 }}>
          <SmartImg src={hero.img} alt={hero.name}
            style={{ width: variant === "split" ? 420 : 460, maxWidth: "78vw", aspectRatio: "1/1", borderRadius: "var(--r-xl)", boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)", border: "1px solid var(--border-strong)" }} />
        </div>
        {/* floating spec chips */}
        <div className="par par-tag" style={{ position: "absolute", zIndex: 4, top: "12%", left: "-14%" }}>
          <div className="glass-2 fade-up" style={{ padding: "10px 14px", borderRadius: 14, fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, animationDelay: ".3s", boxShadow: "var(--shadow)" }}>
            <Icon name="shield" size={15} style={{ color: "var(--accent-bright)" }} /> Adaptive ANC
          </div>
        </div>
        <div className="par par-tag" style={{ position: "absolute", zIndex: 4, bottom: "16%", right: "-12%" }}>
          <div className="glass-2 fade-up" style={{ padding: "10px 14px", borderRadius: 14, fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, animationDelay: ".5s", boxShadow: "var(--shadow)" }}>
            <Icon name="zap" size={15} style={{ color: "var(--accent-bright)" }} /> 38h battery
          </div>
        </div>
        <div className="par par-cta" style={{ position: "absolute", zIndex: 4, bottom: "-4%", left: "50%" }}>
          <button onClick={() => nav("catalog")} className="glass-2 lift" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px 10px 16px", borderRadius: 99, boxShadow: "var(--shadow)", cursor: "pointer", border: "1px solid var(--border-strong)", color: "var(--text)" }}>
            <span style={{ textAlign: "left" }}><span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>{hero.name}</span><span className="text-3" style={{ fontSize: 11 }}>from {money(hero.price)}</span></span>
            <span style={{ width: 34, height: 34, borderRadius: 99, background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="arrowR" size={16} /></span>
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === "split") {
    return (
      <section style={{ paddingTop: 150, paddingBottom: 40 }}>
        <div className="wrap hero-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center" }}>
          <div className="fade-up hero-copy">
            <span className="eyebrow" style={{ marginBottom: 22 }}>Your number 1 premium audio store</span>
            <h1 style={{ fontSize: "clamp(44px,6.4vw,84px)", lineHeight: 0.96, margin: "18px 0 0" }}><span style={{ color: "var(--accent-bright)" }}>Redefine</span><br />Your Sound<br />Experience</h1>
            <p className="text-2" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 520, margin: "24px 0 32px", textWrap: "balance" }}>{sub}</p>
            {ctas}
            <div className="hero-stats" style={{ display: "flex", gap: 30, marginTop: 40 }}>
              {[["50k+", "5-star reviews"], ["2-yr", "warranty"], ["30-day", "free returns"]].map(([a, b]) => (
                <div key={b}><div style={{ fontFamily: '"Clash Display",sans-serif', fontSize: 26, fontWeight: 600 }}>{a}</div><div className="text-3" style={{ fontSize: 13 }}>{b}</div></div>
              ))}
            </div>
          </div>
          <div className="scale-in" style={{ height: 560 }}>{productHero}</div>
        </div>
      </section>
    );
  }

  if (variant === "ghost") {
    return (
      <section style={{ paddingTop: 130, paddingBottom: 30, position: "relative", textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", top: "20%", left: 0, right: 0, textAlign: "center", fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: "clamp(120px,26vw,360px)", lineHeight: 0.8, color: "transparent", WebkitTextStroke: "1px var(--border-strong)", opacity: 0.5, pointerEvents: "none", letterSpacing: "-.04em" }}>SYNAPSE</div>
        <div className="wrap" style={{ position: "relative" }}>
          <span className="eyebrow fade-up" style={{ justifyContent: "center", marginBottom: 18 }}>Your number 1 premium audio store</span>
          <h1 className="fade-up" style={{ fontSize: "clamp(48px,9vw,140px)", lineHeight: 0.9, letterSpacing: "-.03em" }}>Sound<br />Engineered</h1>
          <p className="text-2 fade-up" style={{ fontSize: 18, maxWidth: 520, margin: "26px auto 30px", lineHeight: 1.6 }}>{sub}</p>
          {ctas}
          <div style={{ height: 480, marginTop: 10 }}>{productHero}</div>
        </div>
      </section>
    );
  }

  // default: centered (BeatzY-style)
  return (
    <section style={{ paddingTop: 138, paddingBottom: 30, textAlign: "center", position: "relative" }}>
      <div className="wrap" style={{ position: "relative" }}>
        <span className="eyebrow fade-up" style={{ justifyContent: "center", marginBottom: 22 }}>Your number 1 premium audio store</span>
        <h1 className="fade-up" style={{ fontSize: "clamp(46px,8.4vw,116px)", lineHeight: 0.92, letterSpacing: "-.03em", margin: "0 auto", maxWidth: 1000 }}>
          <span style={{ color: "var(--accent-bright)" }}>Redefine</span><br />Your Sound<br />Experience
        </h1>
        <p className="text-2 fade-up" style={{ fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.6, maxWidth: 560, margin: "26px auto 34px", animationDelay: ".1s" }}>{sub}</p>
        <div className="fade-up" style={{ animationDelay: ".15s" }}>{ctas}</div>
        <div style={{ height: 520, marginTop: 4 }} className="scale-in">{productHero}</div>
      </div>
    </section>
  );
}

function CategoryRail({ nav, setCat }) {
  const { CATEGORIES } = window.SYN;
  const cats = CATEGORIES.filter((c) => c.id !== "all");
  const icon = { earbuds: "sparkle", headphones: "package2", speakers: "box", wearables: "shield", accessories: "zap" };
  return (
    <section className="wrap" style={{ marginTop: 30 }}>
      <div className="cat-rail" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
        {cats.map((c, i) => (
          <button key={c.id} onClick={() => { setCat(c.id); nav("catalog"); }} className="glass glass-hi lift reveal" style={{ padding: "22px 18px", borderRadius: "var(--r-md)", textAlign: "left", cursor: "pointer", transitionDelay: i * 50 + "ms", color: "var(--text)" }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(var(--accent-rgb),.14)", display: "grid", placeItems: "center", color: "var(--accent-bright)", marginBottom: 30 }}><Icon name={icon[c.id]} size={20} /></span>
            <div style={{ fontWeight: 600, fontSize: 16, fontFamily: '"Clash Display",sans-serif' }}>{c.label}</div>
            <div className="text-3" style={{ fontSize: 12.5, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>Explore <Icon name="arrowR" size={12} /></div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, action, onAction }) {
  return (
    <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
      <div>
        <span className="eyebrow" style={{ marginBottom: 12, display: "inline-flex" }}>{eyebrow}</span>
        <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", lineHeight: 1.02, marginTop: 10 }}>{title}</h2>
      </div>
      {action && <button onClick={onAction} className="btn btn-ghost btn-sm" >{action} <Icon name="arrowR" size={15} /></button>}
    </div>
  );
}

function Home({ nav, onOpen, onAdd, favs, onFav, setCat, openChat }) {
  const reveal = useReveal();
  const { PRODUCTS, byId, recsFor, REVIEWS } = window.SYN;
  const hero = byId("syn-eclipse");
  const recs = recsFor("syn-aura-pro", 10);
  const faves = PRODUCTS.filter((p) => p.badge).slice(0, 8);
  const heroVariant = window.__heroVariant || "split";

  return (
    <div ref={reveal} style={{ position: "relative", zIndex: 1 }}>
      <Hero variant={heroVariant} nav={nav} onAdd={onAdd} hero={hero} />
      <CategoryRail nav={nav} setCat={setCat} />

      {/* AI recommendations */}
      <section className="wrap" style={{ marginTop: 90 }}>
        <div className="glass-hi reveal" style={{ borderRadius: "var(--r-xl)", padding: "clamp(24px,4vw,48px)", position: "relative", overflow: "hidden", background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <div style={{ position: "absolute", top: -80, right: -60, width: 280, height: 280, background: "var(--glow)", filter: "blur(20px)" }} />
          <div style={{ position: "relative" }}>
            <SectionHead eyebrow={<><Icon name="sparkle" size={13} /> Picked for you</>} title="Recommended" />
            <Carousel>
              {recs.map((p, i) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} fav={favs.includes(p.id)} onFav={onFav} delay={i * 60} />)}
            </Carousel>
          </div>
        </div>
      </section>

      {/* favorites */}
      <section className="wrap" style={{ marginTop: 90 }}>
        <SectionHead eyebrow="Loved by thousands" title="Customer favorites" action="View all" onAction={() => nav("catalog")} />
        <div className="rec-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {faves.map((p, i) => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} fav={favs.includes(p.id)} onFav={onFav} delay={i * 50} />)}
        </div>
      </section>

      {/* value props */}
      <section className="wrap" style={{ marginTop: 90 }}>
        <div className="value-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {[["truck", "Free 2-day shipping", "On every order over $200, delivered carbon-neutral."],
            ["refresh", "30-day easy returns", "Changed your mind? Free returns, no questions asked."],
            ["shield", "2-year warranty", "Every device is covered, with priority AI support."]].map(([ic, t, d], i) => (
            <div key={t} className="glass glass-hi reveal lift" style={{ padding: 28, borderRadius: "var(--r-lg)", transitionDelay: i * 70 + "ms" }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(var(--accent-rgb),.14)", color: "var(--accent-bright)", display: "grid", placeItems: "center", marginBottom: 18 }}><Icon name={ic} size={21} /></span>
              <h3 style={{ fontSize: 19, marginBottom: 8 }}>{t}</h3>
              <p className="text-2" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section className="wrap" style={{ marginTop: 90 }}>
        <SectionHead eyebrow="What people say" title="Trusted by 50,000+ listeners" />
        <div className="rec-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {REVIEWS.map((r, i) => (
            <div key={r.name} className="glass glass-hi reveal" style={{ padding: 26, borderRadius: "var(--r-lg)", transitionDelay: i * 70 + "ms" }}>
              <Stars value={r.rating} size={15} />
              <h3 style={{ fontSize: 18, margin: "14px 0 8px" }}>{r.title}</h3>
              <p className="text-2" style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>"{r.body}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{ width: 40, height: 40, borderRadius: 99, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{r.avatar}</span>
                <div><div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div><div className="text-3" style={{ fontSize: 12 }}>{r.product} · {r.date}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="wrap" style={{ marginTop: 90 }}>
        <div className="glass-2 reveal" style={{ borderRadius: "var(--r-xl)", padding: "clamp(40px,6vw,72px) 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "var(--glow)", opacity: 0.7 }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1 }}>Let AI find your<br />perfect match.</h2>
            <p className="text-2" style={{ fontSize: 17, maxWidth: 480, margin: "20px auto 30px" }}>Describe your life. Synth recommends the gear that fits it.</p>
            <Button variant="primary" size="lg" magnetic onClick={openChat} icon="sparkle">Chat with Synth</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Home, SectionHead });
