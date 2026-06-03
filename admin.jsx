// ============================================================
// SYNAPSE — Admin dashboard
// ============================================================
const { useState: adS } = React;

function Sparkbars({ data, h = 70 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: h }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: (v / max * 100) + "%", borderRadius: 4, background: i === data.length - 1 ? "var(--accent)" : "var(--border-strong)", transition: "height .6s var(--ease-out)", transitionDelay: i * 30 + "ms" }} />
      ))}
    </div>
  );
}

function Admin({ nav, user }) {
  const { ADMIN_PRODUCTS, ORDERS, SALES_SPARK, byId } = window.SYN;
  const [tab, setTab] = adS("overview");
  const revenue = ADMIN_PRODUCTS.reduce((s, p) => s + p.sold * p.price, 0);
  const lowStock = ADMIN_PRODUCTS.filter((p) => p.stock <= 8);

  const stockTag = (n) => n === 0 ? ["Out", "#ff5a5a", "rgba(255,90,90,.14)"] : n <= 8 ? ["Low", "#ffb020", "rgba(255,176,32,.14)"] : ["In stock", "#3ad07a", "rgba(58,208,122,.14)"];

  return (
    <div style={{ position: "relative", zIndex: 1, paddingTop: 116 }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: 12, display: "inline-flex" }}>Admin console</span>
            <h1 style={{ fontSize: "clamp(30px,4vw,48px)", lineHeight: 1, marginTop: 12 }}>Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["overview", "products", "orders"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className="chip" style={{ textTransform: "capitalize", background: tab === t ? "rgba(var(--accent-rgb),.16)" : undefined, borderColor: tab === t ? "rgba(var(--accent-rgb),.55)" : undefined, color: tab === t ? "var(--text)" : undefined }}>{t}</button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="admin-kpi" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
          {[["dollar", money(revenue), "Revenue", "+12.4%"], ["bag", ORDERS.length + 128, "Orders", "+8.1%"], ["user", "3,204", "Customers", "+5.6%"], ["trend", "4.7%", "Conversion", "+0.9%"]].map(([ic, n, l, d]) => (
            <div key={l} className="glass glass-hi" style={{ padding: "22px 24px", borderRadius: "var(--r-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(var(--accent-rgb),.14)", color: "var(--accent-bright)", display: "grid", placeItems: "center" }}><Icon name={ic} size={19} /></span>
                <span style={{ fontSize: 12, color: "#3ad07a", fontWeight: 600 }}>{d}</span>
              </div>
              <div style={{ fontFamily: '"Clash Display",sans-serif', fontSize: 28, fontWeight: 600 }}>{n}</div>
              <div className="text-3" style={{ fontSize: 13, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {tab === "overview" && (
          <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 22, alignItems: "start" }}>
            <div className="glass glass-hi" style={{ padding: 26, borderRadius: "var(--r-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <h3 style={{ fontSize: 19 }}>Revenue · last 12 weeks</h3>
                <span className="tag-muted tag">Weekly</span>
              </div>
              <Sparkbars data={SALES_SPARK} h={150} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11.5, color: "var(--text-3)" }}><span>Mar</span><span>Apr</span><span>May</span></div>
            </div>
            {/* AI insight */}
            <div className="glass-2 glass-hi" style={{ padding: 24, borderRadius: "var(--r-lg)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -50, right: -40, width: 170, height: 170, background: "var(--glow)", filter: "blur(8px)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", display: "grid", placeItems: "center", color: "#fff" }}><Icon name="sparkle" size={18} /></span>
                  <h3 style={{ fontSize: 17 }}>AI insights</h3>
                </div>
                {["Eclipse Studio is trending — restock recommended within 5 days.", "Bundle Aura Pro + Vault Case to lift AOV by ~18%.", "Conversion dips on mobile checkout step 2 — review form."].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "12px 0", borderTop: i ? "1px solid var(--border)" : "none", fontSize: 13.5, lineHeight: 1.5, color: "var(--text-2)" }}>
                    <Icon name="zap" size={15} style={{ color: "var(--accent-bright)", flexShrink: 0, marginTop: 2 }} />{t}
                  </div>
                ))}
              </div>
            </div>

            {/* low stock */}
            <div className="glass glass-hi" style={{ padding: 24, borderRadius: "var(--r-lg)", gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: 19, marginBottom: 16 }}>Low stock alerts</h3>
              <div className="admin-low" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                {lowStock.map((p) => { const [t, c, bg] = stockTag(p.stock); return (
                  <div key={p.id} className="glass" style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 12 }}>
                    <SmartImg src={p.img} alt={p.name} style={{ width: 46, height: 46, borderRadius: 9, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><span style={{ fontSize: 11.5, color: c, fontWeight: 600 }}>{p.stock} left · {t}</span></div>
                  </div>
                ); })}
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="glass glass-hi" style={{ padding: 8, borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            <div className="admin-table-head" style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "14px 18px", fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)" }}>
              <span>Product</span><span>Price</span><span>Stock</span><span>Sold</span><span></span>
            </div>
            {ADMIN_PRODUCTS.map((p) => { const [t, c, bg] = stockTag(p.stock); return (
              <div key={p.id} className="admin-row" style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr 0.6fr", gap: 12, padding: "12px 18px", alignItems: "center", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <SmartImg src={p.img} alt={p.name} style={{ width: 42, height: 42, borderRadius: 9, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div className="text-3" style={{ fontSize: 12, textTransform: "capitalize" }}>{p.category}</div></div>
                </div>
                <span className="mono" style={{ fontWeight: 600 }}>{money(p.price)}</span>
                <span><span style={{ fontSize: 12, fontWeight: 600, color: c, background: bg, padding: "5px 10px", borderRadius: 99 }}>{p.stock} · {t}</span></span>
                <span className="mono text-2">{p.sold.toLocaleString()}</span>
                <span style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-2)" }} aria-label="Edit"><Icon name="edit" size={14} /></button>
                </span>
              </div>
            ); })}
          </div>
        )}

        {tab === "orders" && (
          <div className="glass glass-hi" style={{ padding: 8, borderRadius: "var(--r-lg)" }}>
            {ORDERS.map((o, i) => (
              <div key={o.id} className="admin-row" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(var(--accent-rgb),.14)", display: "grid", placeItems: "center", color: "var(--accent-bright)", flexShrink: 0 }}><Icon name="bag" size={18} /></span>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</div><div className="text-3" style={{ fontSize: 12.5 }}>{o.date} · {o.items.map((it) => byId(it.id).name).join(", ")}</div></div>
                <span className="tag" style={{ fontSize: 10, background: o.status === "Delivered" ? "rgba(58,208,122,.15)" : undefined, color: o.status === "Delivered" ? "#3ad07a" : undefined, borderColor: o.status === "Delivered" ? "rgba(58,208,122,.3)" : undefined }}>{o.status}</span>
                <span className="mono" style={{ fontWeight: 600, minWidth: 60, textAlign: "right" }}>{money(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Admin });
