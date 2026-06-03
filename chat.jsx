// ============================================================
// SYNAPSE — AI Assistant chat drawer (simulated gpt-4o)
// ============================================================
const { useState: cS, useEffect: cE, useRef: cR } = React;

const QUICK = [
  { label: "Track my order", q: "Where is my order?" },
  { label: "Recommend earbuds", q: "Recommend earbuds for the gym" },
  { label: "Return policy", q: "What is your return policy?" },
  { label: "Best for travel", q: "What's best for travel and flights?" },
];

function botReply(text) {
  const { ORDERS, byId } = window.SYN;
  const q = text.toLowerCase();
  // order tracking
  if (/(track|where|order|delivery|shipping status|arrive)/.test(q)) {
    const o = ORDERS[0];
    return {
      text: `Your most recent order **${o.id}** is currently *${o.status.toLowerCase()}* and ${o.eta.toLowerCase()}. It contains ${o.items.length} item${o.items.length > 1 ? "s" : ""}. Want the full timeline?`,
      track: o,
    };
  }
  // returns
  if (/(return|refund|exchange|warranty|broken|faulty)/.test(q)) {
    return { text: "Returns are easy 👌 — you have **30 days** for a full refund, no questions asked, and every product carries a **2-year warranty**. Start a return from *Orders → select item → Return*. Shipping labels are free." };
  }
  // recommendation
  if (/(recommend|suggest|best|which|looking for|need|gym|travel|work|calls|bass|cheap|quiet|study|run)/.test(q)) {
    const matches = window.semanticSearch(q).slice(0, 3);
    if (matches.length) {
      return { text: "Based on what you described, here's what I'd pick for you:", products: matches.map((p) => p.id) };
    }
  }
  // greeting
  if (/(hi|hello|hey|help)/.test(q)) {
    return { text: "Hey! I'm **Synth**, your shopping assistant. I can track orders, explain returns, or find the perfect product from a plain-English description. What are you after?" };
  }
  // fallback semantic
  const m = window.semanticSearch(q).slice(0, 3);
  if (m.length) return { text: "Here are a few things that match:", products: m.map((p) => p.id) };
  return { text: "I can help with **order tracking**, **returns & warranty**, or **product recommendations** — try describing what you need and I'll match it." };
}

function md(t) {
  // tiny markdown: **bold** *italic*
  const parts = t.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((s, i) => {
    if (s.startsWith("**")) return <b key={i}>{s.slice(2, -2)}</b>;
    if (s.startsWith("*")) return <i key={i} style={{ color: "var(--accent-bright)" }}>{s.slice(1, -1)}</i>;
    return <React.Fragment key={i}>{s}</React.Fragment>;
  });
}

function ChatDrawer({ open, onClose, onOpen, onAdd }) {
  const { byId } = window.SYN;
  const [msgs, setMsgs] = cS([{ from: "bot", text: "Hi, I'm **Synth** ⚡ — your SYNAPSE assistant. Ask me to track an order, explain returns, or find the right gear." }]);
  const [val, setVal] = cS("");
  const [typing, setTyping] = cS(false);
  const scrollRef = cR(null);
  cE(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, typing]);

  const send = (text) => {
    const t = (text ?? val).trim(); if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]); setVal(""); setTyping(true);
    setTimeout(() => {
      const r = botReply(t);
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", ...r }]);
    }, 750 + Math.random() * 500);
  };
  if (!open) return null;
  return (
    <>
      <Scrim onClose={onClose} />
      <aside aria-label="AI assistant" className="glass-2" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,94vw)", zIndex: 320, display: "flex", flexDirection: "column", animation: "slideInRight .45s var(--ease-out) both" }}>
        <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
          <span style={{ position: "relative", width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", display: "grid", placeItems: "center", boxShadow: "0 8px 22px -6px rgba(var(--accent-rgb),.7)" }}>
            <Icon name="sparkle" size={20} fill="#fff" stroke={0} style={{ color: "#fff" }} />
            <span style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderRadius: 99, background: "#3ad07a", border: "2px solid var(--bg-2)" }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: '"Clash Display",sans-serif' }}>Synth</div>
            <div className="text-3" style={{ fontSize: 12 }}>AI assistant · gpt-4o · online</div>
          </div>
          <button onClick={onClose} style={iconBtn} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>

        <div ref={scrollRef} className="no-bar" style={{ flex: 1, overflowY: "auto", padding: "18px 18px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: m.from === "user" ? "flex-end" : "flex-start" }} className="fade-up">
              <div style={{ maxWidth: "86%", padding: "11px 15px", borderRadius: 16, fontSize: 14.5, lineHeight: 1.55,
                background: m.from === "user" ? "var(--accent)" : "var(--glass)",
                color: m.from === "user" ? "#fff" : "var(--text)",
                border: m.from === "user" ? "none" : "1px solid var(--border)",
                borderBottomRightRadius: m.from === "user" ? 4 : 16, borderBottomLeftRadius: m.from === "bot" ? 4 : 16 }}>
                {md(m.text)}
              </div>
              {m.track && (
                <div className="glass" style={{ width: "86%", padding: 14, borderRadius: 14 }}>
                  <OrderMini o={m.track} />
                </div>
              )}
              {m.products && (
                <div style={{ width: "86%", display: "flex", flexDirection: "column", gap: 8 }}>
                  {m.products.map((pid) => { const p = byId(pid); return (
                    <div key={pid} className="glass" style={{ display: "flex", gap: 11, padding: 9, borderRadius: 13, alignItems: "center" }}>
                      <SmartImg src={p.img} alt={p.name} style={{ width: 46, height: 46, borderRadius: 9, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
                        <Price value={p.price} size={13} />
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => onOpen(p)} style={{ padding: "7px 12px" }}>View</button>
                    </div>
                  ); })}
                </div>
              )}
            </div>
          ))}
          {typing && <div style={{ alignSelf: "flex-start", padding: "13px 16px", borderRadius: 16, borderBottomLeftRadius: 4, background: "var(--glass)", border: "1px solid var(--border)" }}><span className="dots"><i></i><i></i><i></i></span></div>}
        </div>

        <div style={{ padding: "10px 16px 6px", display: "flex", gap: 7, flexWrap: "wrap" }}>
          {QUICK.map((qq) => <button key={qq.label} className="chip" style={{ fontSize: 12, padding: "6px 11px", minHeight: 0 }} onClick={() => send(qq.q)}>{qq.label}</button>)}
        </div>
        <div style={{ padding: "8px 16px 18px", display: "flex", gap: 10, alignItems: "center" }}>
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message Synth…" className="field" style={{ borderRadius: 99, flex: 1 }} />
          <button onClick={() => send()} className="btn btn-primary" style={{ width: 48, height: 48, padding: 0, borderRadius: 99, flexShrink: 0 }} aria-label="Send"><Icon name="send" size={18} /></button>
        </div>
      </aside>
    </>
  );
}

function OrderMini({ o }) {
  const steps = ["Placed", "Packed", "In transit", "Delivered"];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</span>
        <span className="tag" style={{ fontSize: 10 }}>{o.status}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 99, background: i <= o.step ? "var(--accent)" : "var(--border)" }} />
            <div style={{ fontSize: 9.5, marginTop: 5, color: i <= o.step ? "var(--text-2)" : "var(--text-3)", textAlign: "center" }}>{s}</div>
          </div>
        ))}
      </div>
      <div className="text-3" style={{ fontSize: 12, marginTop: 10 }}>{o.eta}</div>
    </div>
  );
}

Object.assign(window, { ChatDrawer, OrderMini });
