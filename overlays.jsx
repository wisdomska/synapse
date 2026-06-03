// ============================================================
// SYNAPSE — overlays: MiniCart, SearchOverlay, ChatDrawer
// ============================================================
const { useState: oS, useEffect: oE, useRef: oR } = React;

/* ---------------- backdrop ---------------- */
function Scrim({ onClose }) {
  return <div onClick={onClose} className="fade-in" style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />;
}

/* ---------------- Mini Cart (slide-in sheet) ---------------- */
function MiniCart({ open, items, onClose, onQty, onRemove, onCheckout, byId }) {
  if (!open) return null;
  const lines = items.map((it) => ({ ...it, p: byId(it.id) })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const free = subtotal >= 200;
  return (
    <>
      <Scrim onClose={onClose} />
      <aside aria-label="Cart" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 92vw)", zIndex: 320, display: "flex", flexDirection: "column", animation: "slideInRight .45s var(--ease-out) both" }}
        className="glass-2">
        <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 21, display: "flex", alignItems: "center", gap: 10 }}><Icon name="cart" size={20} /> Your cart <span className="text-3" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 15 }}>({lines.reduce((s, l) => s + l.qty, 0)})</span></h3>
          <button onClick={onClose} style={{ ...iconBtn, color: "var(--text-2)" }} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>

        {lines.length === 0 ? (
          <div className="center-col" style={{ flex: 1, justifyContent: "center", gap: 14, padding: 30 }}>
            <span className="glass" style={{ width: 72, height: 72, borderRadius: 99, display: "grid", placeItems: "center", color: "var(--text-3)" }}><Icon name="cart" size={30} /></span>
            <p className="text-2" style={{ margin: 0 }}>Your cart is empty.</p>
            <Button variant="ghost" onClick={onClose}>Continue shopping</Button>
          </div>
        ) : (
          <>
            <div className="no-bar" style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {!free && (
                <div className="glass" style={{ padding: "12px 14px", borderRadius: 12, fontSize: 13 }}>
                  <div className="text-2">Add <b style={{ color: "var(--accent-bright)" }}>{money(200 - subtotal)}</b> for free shipping</div>
                  <div style={{ height: 6, borderRadius: 99, background: "var(--border)", marginTop: 8, overflow: "hidden" }}><div style={{ height: "100%", width: Math.min(100, subtotal / 200 * 100) + "%", background: "var(--accent)", transition: "width .5s" }} /></div>
                </div>
              )}
              {lines.map((l) => (
                <div key={l.id} className="glass" style={{ display: "flex", gap: 14, padding: 12, borderRadius: 14 }}>
                  <SmartImg src={l.p.img} alt={l.p.name} style={{ width: 74, height: 74, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <h4 style={{ fontSize: 15.5, fontFamily: '"Clash Display",sans-serif' }}>{l.p.name}</h4>
                      <button onClick={() => onRemove(l.id)} aria-label="Remove" style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer" }}><Icon name="trash" size={15} /></button>
                    </div>
                    <div className="text-3" style={{ fontSize: 12, textTransform: "capitalize" }}>{l.p.color}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <div className="glass" style={{ display: "flex", alignItems: "center", borderRadius: 99, padding: 3 }}>
                        <button onClick={() => onQty(l.id, -1)} style={qtyBtn} aria-label="Decrease"><Icon name="minus" size={14} /></button>
                        <span className="mono" style={{ width: 26, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{l.qty}</span>
                        <button onClick={() => onQty(l.id, 1)} style={qtyBtn} aria-label="Increase"><Icon name="plus" size={14} /></button>
                      </div>
                      <Price value={l.p.price * l.qty} size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "18px 24px 24px", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span className="text-2">Subtotal</span><span className="mono" style={{ fontWeight: 600 }}>{money(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13 }}><span className="text-3">Shipping</span><span className="text-3">{free ? "Free" : "Calculated at checkout"}</span></div>
              <Button variant="primary" magnetic className="" onClick={onCheckout} style={{ width: "100%" }} iconRight="arrowR">Checkout · {money(subtotal)}</Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
const qtyBtn = { width: 28, height: 28, borderRadius: 99, border: "none", background: "none", color: "var(--text-2)", cursor: "pointer", display: "grid", placeItems: "center" };

/* ---------------- Search Overlay (semantic) ---------------- */
const SAMPLE_QUERIES = ["something quiet for flights", "buds for the gym", "watch for health tracking", "loud speaker for parties"];
function SearchOverlay({ open, onClose, onOpen }) {
  const [q, setQ] = oS("");
  const [thinking, setThinking] = oS(false);
  const [results, setResults] = oS([]);
  const inputRef = oR(null);
  oE(() => { if (open) setTimeout(() => inputRef.current?.focus(), 60); }, [open]);
  oE(() => {
    if (!q.trim()) { setResults([]); setThinking(false); return; }
    setThinking(true);
    const t = setTimeout(() => { setResults(window.semanticSearch(q)); setThinking(false); }, 480);
    return () => clearTimeout(t);
  }, [q]);
  if (!open) return null;
  return (
    <>
      <Scrim onClose={onClose} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 320, display: "flex", justifyContent: "center", padding: "14vh 16px 0" }}>
        <div className="glass-2 scale-in" style={{ width: "min(680px,100%)", borderRadius: 22, boxShadow: "var(--shadow)", border: "1px solid var(--border-strong)", overflow: "hidden", maxHeight: "72vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
            <Icon name="sparkle" size={20} style={{ color: "var(--accent-bright)" }} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Describe what you need — AI understands intent…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 17, fontFamily: "Inter" }} />
            <button onClick={onClose} aria-label="Close search" className="glass lift" style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", color: "var(--text-3)", cursor: "pointer", border: "1px solid var(--border)", flexShrink: 0 }}>
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="no-bar" style={{ overflowY: "auto", padding: 14 }}>
            {!q.trim() && (
              <div style={{ padding: 8 }}>
                <div className="text-3" style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12, paddingLeft: 6 }}>Try natural language</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SAMPLE_QUERIES.map((s) => <button key={s} className="chip" onClick={() => setQ(s)}><Icon name="search" size={13} />{s}</button>)}
                </div>
              </div>
            )}
            {thinking && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 12px", color: "var(--text-2)", fontSize: 14 }}>
                <span className="dots"><i></i><i></i><i></i></span> Understanding intent &amp; matching embeddings…
              </div>
            )}
            {!thinking && q.trim() && results.length === 0 && <div className="text-2" style={{ padding: 20, textAlign: "center" }}>No matches — try different words.</div>}
            {!thinking && results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="text-3" style={{ fontSize: 12, padding: "4px 8px" }}>{results.length} smart matches</div>
                {results.map((p) => (
                  <button key={p.id} onClick={() => { onOpen(p); onClose(); }} style={{ display: "flex", gap: 14, alignItems: "center", padding: 10, borderRadius: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }} className="search-row">
                    <SmartImg src={p.img} alt={p.name} style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{p.name}</div>
                      <div className="text-3" style={{ fontSize: 12.5 }}>{p.blurb}</div>
                    </div>
                    <Price value={p.price} size={15} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Scrim, MiniCart, SearchOverlay, qtyBtn });
