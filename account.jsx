// ============================================================
// SYNAPSE — Account dashboard + order tracking, Auth
// ============================================================
const { useState: anS, useEffect: anE, useRef: anR } = React;

/* shared profile header */
function AcctHeader({ user, nav, onLogout }) {
  return (
    <div className="glass glass-hi" style={{ borderRadius: "var(--r-xl)", padding: "30px 32px", marginBottom: 26, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, background: "var(--glow)", filter: "blur(10px)" }} />
      <span style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", display: "grid", placeItems: "center", color: "#fff", fontSize: 26, fontWeight: 700, fontFamily: '"Clash Display",sans-serif', position: "relative" }}>{user.name[0]}</span>
      <div style={{ flex: 1, position: "relative" }}>
        <h1 style={{ fontSize: 30, lineHeight: 1 }}>Hi, {user.name.split(" ")[0]}</h1>
        <p className="text-2" style={{ fontSize: 14, marginTop: 6 }}>{user.email} · <span className="tag" style={{ fontSize: 10 }}>{user.role}</span></p>
      </div>
      <div style={{ display: "flex", gap: 10, position: "relative" }}>
        {user.role === "Admin" && <Button variant="ghost" onClick={() => nav("admin")} icon="grid">Admin</Button>}
        <Button variant="ghost" onClick={onLogout} icon="logout">Sign out</Button>
      </div>
    </div>
  );
}

/* ---------------- Orders (order history + tracking) ---------------- */
function Orders({ user, nav, onOpen, byId, onLogout }) {
  const { ORDERS } = window.SYN;
  const [open, setOpen] = anS(ORDERS[0].id);
  if (!user) { nav("auth"); return null; }
  const steps = ["Placed", "Packed", "In transit", "Delivered"];
  const inTransit = ORDERS.filter((o) => o.status !== "Delivered").length;
  const delivered = ORDERS.filter((o) => o.status === "Delivered").length;

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 120 }}>
      <div className="wrap">
        <AcctHeader user={user} nav={nav} onLogout={onLogout} />

        {/* stat cards */}
        <div className="acct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 26 }}>
          {[["pkg", ORDERS.length, "Orders"], ["truck", inTransit, "In transit"], ["check", delivered, "Delivered"], ["dollar", money(ORDERS.reduce((s, o) => s + o.total, 0)), "Lifetime"]].map(([ic, n, l]) => (
            <div key={l} className="glass glass-hi" style={{ padding: "20px 22px", borderRadius: "var(--r-md)" }}>
              <Icon name={ic} size={20} style={{ color: "var(--accent-bright)", marginBottom: 12 }} />
              <div style={{ fontFamily: '"Clash Display",sans-serif', fontSize: 26, fontWeight: 600 }}>{n}</div>
              <div className="text-3" style={{ fontSize: 13 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 22 }}>Order history</h2>
          <Button variant="ghost" size="sm" onClick={() => nav("account")} icon="user">Account</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ORDERS.map((o) => {
            const isOpen = open === o.id;
            return (
              <div key={o.id} className="glass glass-hi" style={{ borderRadius: "var(--r-lg)", overflow: "hidden" }}>
                <button onClick={() => setOpen(isOpen ? null : o.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--text)" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: o.status === "Delivered" ? "rgba(58,208,122,.15)" : "rgba(var(--accent-rgb),.15)", display: "grid", placeItems: "center", color: o.status === "Delivered" ? "#3ad07a" : "var(--accent-bright)", flexShrink: 0 }}><Icon name={o.status === "Delivered" ? "check" : "truck"} size={20} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontWeight: 700, fontSize: 15 }}>{o.id}</span><span className="tag" style={{ fontSize: 10, background: o.status === "Delivered" ? "rgba(58,208,122,.15)" : undefined, color: o.status === "Delivered" ? "#3ad07a" : undefined, borderColor: o.status === "Delivered" ? "rgba(58,208,122,.3)" : undefined }}>{o.status}</span></div>
                    <div className="text-3" style={{ fontSize: 12.5, marginTop: 3 }}>{o.date} · {o.items.length} item{o.items.length > 1 ? "s" : ""} · {money(o.total)}</div>
                  </div>
                  <Icon name={isOpen ? "chevU" : "chevD"} size={18} style={{ color: "var(--text-3)" }} />
                </button>
                {isOpen && (
                  <div className="fade-up" style={{ padding: "0 22px 22px" }}>
                    {/* tracking */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                      {steps.map((s, i) => (
                        <div key={s} style={{ flex: 1 }}>
                          <div style={{ height: 5, borderRadius: 99, background: i <= o.step ? "var(--accent)" : "var(--border)", position: "relative" }}>{i === o.step && o.status !== "Delivered" && <span style={{ position: "absolute", right: 0, top: "50%", transform: "translate(50%,-50%)", width: 11, height: 11, borderRadius: 99, background: "var(--accent)", boxShadow: "0 0 0 4px rgba(var(--accent-rgb),.25)", animation: "pulseDot 1.5s infinite" }} />}</div>
                          <div style={{ fontSize: 11, marginTop: 7, color: i <= o.step ? "var(--text-2)" : "var(--text-3)", textAlign: "center" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="glass" style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Icon name="truck" size={15} style={{ color: "var(--accent-bright)" }} /> {o.eta}</div>
                    {o.items.map((it) => { const p = byId(it.id); return (
                      <button key={it.id} onClick={() => onOpen(p)} style={{ display: "flex", gap: 14, alignItems: "center", width: "100%", padding: "10px 0", background: "none", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", textAlign: "left", color: "var(--text)" }}>
                        <SmartImg src={p.img} alt={p.name} style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div className="text-3" style={{ fontSize: 12 }}>Qty {it.qty}</div></div>
                        <Price value={p.price * it.qty} size={14} />
                      </button>
                    ); })}
                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      <Button variant="ghost" size="sm" icon="refresh">Buy again</Button>
                      {o.status !== "Delivered" && <Button variant="ghost" size="sm" icon="bot">Track with AI</Button>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Account (saved items + settings) ---------------- */
function Account({ user, nav, onOpen, onLogout, favs }) {
  const { PRODUCTS } = window.SYN;
  if (!user) { nav("auth"); return null; }
  const favList = PRODUCTS.filter((p) => favs.includes(p.id));

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 120 }}>
      <div className="wrap">
        <AcctHeader user={user} nav={nav} onLogout={onLogout} />

        <div className="acct-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, alignItems: "start" }}>
          {/* saved items */}
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Saved items</h2>
            <div className="glass glass-hi" style={{ borderRadius: "var(--r-lg)", padding: favList.length ? 14 : 28 }}>
              {favList.length === 0 ? (
                <div className="center-col" style={{ gap: 10, color: "var(--text-3)", padding: "12px 0" }}>
                  <Icon name="heart" size={28} />
                  <span style={{ fontSize: 13.5 }}>No saved items yet</span>
                  <Button variant="ghost" size="sm" onClick={() => nav("catalog")} icon="bag">Browse the shop</Button>
                </div>
              ) : favList.map((p) => (
                <button key={p.id} onClick={() => onOpen(p)} style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", padding: 8, background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--text)", borderRadius: 10 }}>
                  <SmartImg src={p.img} alt={p.name} style={{ width: 48, height: 48, borderRadius: 9, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div><Price value={p.price} size={13} /></div>
                  <Icon name="arrowR" size={15} style={{ color: "var(--text-3)" }} />
                </button>
              ))}
            </div>
          </div>

          {/* settings */}
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Settings</h2>
            <div className="glass glass-hi" style={{ borderRadius: "var(--r-lg)", overflow: "hidden" }}>
              <button onClick={() => nav("orders")} style={{ display: "flex", alignItems: "center", gap: 13, width: "100%", padding: "15px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--text)", fontSize: 14 }}>
                <Icon name="pkg" size={18} style={{ color: "var(--accent-bright)" }} /><span style={{ flex: 1 }}>Order history</span><Icon name="chevR" size={16} style={{ color: "var(--text-3)" }} />
              </button>
              {[["user", "Profile & addresses"], ["dollar", "Payment methods"], ["shield", "Privacy & security"], ["bot", "AI preferences"]].map(([ic, t]) => (
                <button key={t} style={{ display: "flex", alignItems: "center", gap: 13, width: "100%", padding: "15px 18px", background: "none", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", textAlign: "left", color: "var(--text)", fontSize: 14 }}>
                  <Icon name={ic} size={18} style={{ color: "var(--text-3)" }} /><span style={{ flex: 1 }}>{t}</span><Icon name="chevR" size={16} style={{ color: "var(--text-3)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Auth ---------------- */
function Auth({ onAuth, nav }) {
  const [mode, setMode] = anS("login");
  const [role, setRole] = anS("Customer");
  const [form, setForm] = anS({ name: "", email: "", pass: "" });
  const submit = (e) => {
    e?.preventDefault();
    const name = form.name || (mode === "login" ? "Alex Rivera" : "New User");
    onAuth({ name, email: form.email || "alex@synapse.io", role });
    nav("home");
  };
  const heroImg = window.SYN.byId("syn-eclipse");
  const stageRef = anR(null);
  anE(() => {
    const el = stageRef.current; if (!el) return;
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--apx", px.toFixed(3));
        el.style.setProperty("--apy", py.toFixed(3));
      });
    };
    const onLeave = () => { el.style.setProperty("--apx", "0"); el.style.setProperty("--apy", "0"); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={stageRef} style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", placeItems: "center", padding: "120px 20px 60px" }}>
      <div className="auth-stage" aria-hidden="true">
        <div className="auth-wash" />
        <div className="auth-aurora a1" />
        <div className="auth-aurora a2" />
        <div className="auth-aurora a3" />
        <div className="auth-grid" />
        <div className="auth-streak" />
        <span className="auth-orb o1" /><span className="auth-orb o2" /><span className="auth-orb o3" /><span className="auth-orb o4" />
        <div className="auth-product"><div className="auth-par"><SmartImg src={heroImg.img} alt="" glyph="package2" /></div></div>
        <div className="auth-vignette" />
      </div>
      <div className="auth-card on-scene glass-hi scale-in" style={{ width: "min(440px,100%)", borderRadius: "var(--r-xl)", padding: "38px 34px", boxShadow: "var(--shadow)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -70, right: -50, width: 200, height: 200, background: "var(--glow)", filter: "blur(10px)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="zap" size={18} fill="#fff" stroke={0} style={{ color: "#fff" }} /></span>
            <span style={{ fontFamily: '"Clash Display",sans-serif', fontWeight: 600, fontSize: 22 }}>SYNAPSE</span>
          </div>
          <h1 style={{ fontSize: 28, marginTop: 18 }}>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-2" style={{ fontSize: 14, marginTop: 6, marginBottom: 24 }}>{mode === "login" ? "Sign in to track orders and get AI picks." : "Join 50,000+ smart shoppers."}</p>

          <button onClick={submit} className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }}>
            <Icon name="google" size={18} fill="currentColor" stroke={0} /> Continue with Google
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 18px", color: "var(--text-3)", fontSize: 12 }}><span className="divider" style={{ flex: 1 }} /> or <span className="divider" style={{ flex: 1 }} /></div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && <Field label="Full name" span value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Alex Rivera" />}
            <Field label="Email" span value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" />
            <Field label="Password" span value={form.pass} onChange={(v) => setForm({ ...form, pass: v })} placeholder="••••••••" />
            <div>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-2)", marginBottom: 8, fontWeight: 500 }}>Sign in as</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["Customer", "Admin"].map((r) => (
                  <button type="button" key={r} onClick={() => setRole(r)} className="chip" style={{ flex: 1, justifyContent: "center", background: role === r ? "rgba(var(--accent-rgb),.16)" : undefined, borderColor: role === r ? "rgba(var(--accent-rgb),.55)" : undefined, color: role === r ? "var(--text)" : undefined }}>{r}</button>
                ))}
              </div>
            </div>
            <Button type="submit" variant="primary" magnetic style={{ width: "100%", marginTop: 4 }}>{mode === "login" ? "Sign in" : "Create account"}</Button>
          </form>

          <p className="text-2" style={{ fontSize: 13.5, textAlign: "center", marginTop: 20 }}>
            {mode === "login" ? "New to SYNAPSE? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", color: "var(--accent-bright)", cursor: "pointer", fontWeight: 600, fontSize: 13.5 }}>{mode === "login" ? "Create account" : "Sign in"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Account, Orders, Auth });
