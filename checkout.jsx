// ============================================================
// SYNAPSE — Checkout (multi-step), Account/Orders, Auth
// ============================================================
const { useState: acS, useEffect: acE } = React;

/* ---------------- Multi-step Checkout ---------------- */
const STEPS = ["Cart", "Shipping", "Payment", "Done"];
function Checkout({ items, byId, onQty, onRemove, nav, clearCart, user }) {
  const [step, setStep] = acS(0);
  const [ship, setShip] = acS({ name: user?.name || "", email: user?.email || "", address: "", city: "", zip: "", method: "express" });
  const [pay, setPay] = acS({ card: "", exp: "", cvc: "", save: true });
  const [processing, setProcessing] = acS(false);
  acE(() => window.scrollTo(0, 0), [step]);

  const lines = items.map((it) => ({ ...it, p: byId(it.id) })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const shipCost = ship.method === "express" ? (subtotal >= 200 ? 0 : 12) : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipCost + tax;

  const next = () => {
    if (step === 2) { setProcessing(true); setTimeout(() => { setProcessing(false); setStep(3); clearCart(); }, 1600); return; }
    setStep((s) => Math.min(3, s + 1));
  };
  const canNext = step === 1 ? ship.name && ship.email && ship.address && ship.city : step === 2 ? pay.card.length >= 12 && pay.exp && pay.cvc : true;

  if (lines.length === 0 && step < 3) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 150, minHeight: "70vh" }}>
        <div className="wrap center-col" style={{ gap: 16, paddingTop: 40 }}>
          <span className="glass" style={{ width: 84, height: 84, borderRadius: 99, display: "grid", placeItems: "center", color: "var(--text-3)" }}><Icon name="cart" size={34} /></span>
          <h2 style={{ fontSize: 30 }}>Your cart is empty</h2>
          <p className="text-2">Add a few things and they'll show up here.</p>
          <Button variant="primary" magnetic onClick={() => nav("catalog")} iconRight="arrowR">Browse the shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 120 }}>
      <div className="wrap">
        <h1 style={{ fontSize: "clamp(32px,4.4vw,52px)", marginBottom: 8 }}>Checkout</h1>
        {/* stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 34, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, background: i <= step ? "var(--accent)" : "var(--glass)", color: i <= step ? "#fff" : "var(--text-3)", border: i <= step ? "none" : "1px solid var(--border)", transition: "all .3s" }}>{i < step ? <Icon name="check" size={15} stroke={3} /> : i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: i <= step ? "var(--text)" : "var(--text-3)" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, minWidth: 20, height: 2, borderRadius: 99, background: i < step ? "var(--accent)" : "var(--border)", maxWidth: 90 }} />}
            </React.Fragment>
          ))}
        </div>

        {step === 3 ? (
          <div className="glass glass-hi scale-in" style={{ padding: "60px 32px", borderRadius: "var(--r-xl)", textAlign: "center", position: "relative", overflow: "hidden", maxWidth: 640, margin: "0 auto" }}>
            <div style={{ position: "absolute", inset: 0, background: "var(--glow)", opacity: 0.6 }} />
            <div style={{ position: "relative" }}>
              <span style={{ width: 76, height: 76, borderRadius: 99, background: "var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 22px", color: "#fff", boxShadow: "0 14px 40px -8px rgba(var(--accent-rgb),.7)" }} className="bounce"><Icon name="check" size={36} stroke={3} /></span>
              <h2 style={{ fontSize: 34, marginBottom: 10 }}>Order confirmed</h2>
              <p className="text-2" style={{ fontSize: 16, marginBottom: 6 }}>Thanks{ship.name ? ", " + ship.name.split(" ")[0] : ""} — your order is on its way.</p>
              <p className="mono" style={{ color: "var(--accent-bright)", fontWeight: 600, marginBottom: 26 }}>Order #SYN-{Math.floor(48000 + Math.random() * 999)}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="primary" magnetic onClick={() => nav("account")} icon="truck">Track order</Button>
                <Button variant="ghost" onClick={() => nav("catalog")}>Keep shopping</Button>
              </div>
              <p className="text-3" style={{ fontSize: 13, marginTop: 22 }}>A receipt has been emailed to {ship.email || "you"}.</p>
            </div>
          </div>
        ) : (
          <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
            <div className="glass glass-hi" style={{ padding: "28px", borderRadius: "var(--r-lg)" }}>
              {step === 0 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: 20, marginBottom: 18 }}>Review your cart</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {lines.map((l) => (
                      <div key={l.id} style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                        <SmartImg src={l.p.img} alt={l.p.name} style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 16, fontFamily: '"Clash Display",sans-serif' }}>{l.p.name}</h4>
                          <div className="text-3" style={{ fontSize: 12.5, textTransform: "capitalize", marginBottom: 8 }}>{l.p.color}</div>
                          <div className="glass" style={{ display: "inline-flex", alignItems: "center", borderRadius: 99, padding: 3 }}>
                            <button onClick={() => onQty(l.id, -1)} style={qtyBtn} aria-label="Decrease"><Icon name="minus" size={13} /></button>
                            <span className="mono" style={{ width: 26, textAlign: "center", fontWeight: 600, fontSize: 13 }}>{l.qty}</span>
                            <button onClick={() => onQty(l.id, 1)} style={qtyBtn} aria-label="Increase"><Icon name="plus" size={13} /></button>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Price value={l.p.price * l.qty} size={17} />
                          <button onClick={() => onRemove(l.id)} style={{ display: "block", marginLeft: "auto", marginTop: 8, background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 12 }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: 20, marginBottom: 18 }}>Shipping details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Full name" span value={ship.name} onChange={(v) => setShip({ ...ship, name: v })} placeholder="Alex Rivera" />
                    <Field label="Email" span value={ship.email} onChange={(v) => setShip({ ...ship, email: v })} placeholder="alex@email.com" />
                    <Field label="Address" span value={ship.address} onChange={(v) => setShip({ ...ship, address: v })} placeholder="221B Baker Street" />
                    <Field label="City" value={ship.city} onChange={(v) => setShip({ ...ship, city: v })} placeholder="London" />
                    <Field label="ZIP / Postal" value={ship.zip} onChange={(v) => setShip({ ...ship, zip: v })} placeholder="NW1 6XE" />
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <div className="text-3" style={{ fontSize: 13, marginBottom: 10 }}>Delivery method</div>
                    {[["express", "Express", subtotal >= 200 ? "Free" : "$12", "2 business days"], ["standard", "Standard", "Free", "5–7 business days"]].map(([id, t, price, eta]) => (
                      <label key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, border: ship.method === id ? "1.5px solid var(--accent)" : "1px solid var(--border)", marginBottom: 10, cursor: "pointer", background: ship.method === id ? "rgba(var(--accent-rgb),.08)" : "transparent" }}>
                        <input type="radio" checked={ship.method === id} onChange={() => setShip({ ...ship, method: id })} style={{ accentColor: "var(--accent)" }} />
                        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{t}</div><div className="text-3" style={{ fontSize: 12.5 }}>{eta}</div></div>
                        <span className="mono" style={{ fontWeight: 600 }}>{price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="fade-up">
                  <h3 style={{ fontSize: 20, marginBottom: 6 }}>Payment</h3>
                  <p className="text-3" style={{ fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", gap: 7 }}><Icon name="lock" size={14} /> Encrypted &amp; secure · powered by Stripe</p>
                  <Field label="Card number" span value={pay.card} onChange={(v) => setPay({ ...pay, card: v.replace(/[^0-9 ]/g, "").slice(0, 19) })} placeholder="4242 4242 4242 4242" mono />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                    <Field label="Expiry" value={pay.exp} onChange={(v) => setPay({ ...pay, exp: v.slice(0, 5) })} placeholder="12/28" mono />
                    <Field label="CVC" value={pay.cvc} onChange={(v) => setPay({ ...pay, cvc: v.replace(/[^0-9]/g, "").slice(0, 4) })} placeholder="123" mono />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 14, color: "var(--text-2)", cursor: "pointer" }}>
                    <input type="checkbox" checked={pay.save} onChange={(e) => setPay({ ...pay, save: e.target.checked })} style={{ accentColor: "var(--accent)" }} /> Save card for faster checkout
                  </label>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
                {step > 0 ? <Button variant="ghost" onClick={() => setStep((s) => s - 1)} icon="chevL">Back</Button> : <Button variant="ghost" onClick={() => nav("catalog")}>Continue shopping</Button>}
                <Button variant="primary" magnetic disabled={!canNext || processing} onClick={next} iconRight={step === 2 ? null : "arrowR"}>
                  {processing ? <><span className="dots" style={{ marginRight: 4 }}><i></i><i></i><i></i></span> Processing…</> : step === 2 ? "Pay " + money(total) : step === 1 ? "Continue to payment" : "Continue to shipping"}
                </Button>
              </div>
            </div>

            {/* summary */}
            <aside className="glass-2 glass-hi" style={{ padding: 24, borderRadius: "var(--r-lg)", position: "sticky", top: 100 }}>
              <h3 style={{ fontSize: 17, marginBottom: 16 }}>Order summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {lines.map((l) => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                    <span className="text-2">{l.p.name} <span className="text-3">×{l.qty}</span></span>
                    <span className="mono">{money(l.p.price * l.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="divider" style={{ margin: "4px 0 14px" }} />
              {[["Subtotal", money(subtotal)], ["Shipping", shipCost === 0 ? "Free" : money(shipCost)], ["Tax (8%)", money(tax)]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 9 }}><span className="text-3">{k}</span><span className="mono text-2">{v}</span></div>
              ))}
              <div className="divider" style={{ margin: "8px 0 14px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontWeight: 600 }}>Total</span><Price value={total} size={24} /></div>
              <div className="glass" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, marginTop: 16, fontSize: 12.5, color: "var(--text-2)" }}><Icon name="shield" size={15} style={{ color: "var(--accent-bright)" }} /> Buyer protection on every order</div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, span, mono }) {
  return (
    <label style={{ display: "block", gridColumn: span ? "1 / -1" : "auto" }}>
      <span style={{ display: "block", fontSize: 13, color: "var(--text-2)", marginBottom: 7, fontWeight: 500 }}>{label}</span>
      <input className={"field " + (mono ? "mono" : "")} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

Object.assign(window, { Checkout, Field, CHECKOUT_STEPS: STEPS });
