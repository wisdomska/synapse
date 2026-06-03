// ============================================================
// SYNAPSE — UI primitives (exported to window)
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- icon set (Lucide-style stroke paths) ---------- */
const ICONS = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  cart: "M2 3h2l2.6 13.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6 M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  user: "M20 21a8 8 0 1 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  heart: "M19.5 5.5a5 5 0 0 0-7 0L12 6l-.5-.5a5 5 0 0 0-7 7L12 20l7.5-7.5a5 5 0 0 0 0-7Z",
  star: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z",
  chevR: "M9 6l6 6-6 6", chevL: "M15 6l-6 6 6 6",
  chevD: "M6 9l6 6 6-6", chevU: "M6 15l6-6 6 6",
  close: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14", minus: "M5 12h14",
  check: "M5 12l5 5L20 7",
  filter: "M3 5h18M6 12h12M10 19h4",
  sliders: "M4 6h10M18 6h2M4 12h2M10 12h10M4 18h6M14 18h6 M14 4v4M6 10v4M10 16v4",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z",
  bot: "M12 7V4 M9 4h6 M5 7h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z M9 12h.01M15 12h.01 M2 12v3M22 12v3",
  send: "M22 2 11 13 M22 2l-7 20-4-9-9-4 20-7Z",
  truck: "M3 6h11v9H3zM14 9h4l3 3v3h-7 M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  shield: "M12 3l8 3v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6l8-3Z",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5",
  menu: "M3 6h18M3 12h18M3 18h18",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6 4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18 M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  moon: "M21 12.8A8 8 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  box: "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8",
  trend: "M3 17l6-6 4 4 8-8 M21 7v5h-5",
  bag: "M6 8h12l1 12H5L6 8ZM9 8a3 3 0 0 1 6 0",
  google: "M21.8 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.6c-.9.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.7A10 10 0 0 0 12 22Z M6.2 13.7a6 6 0 0 1 0-3.8V7.2H2.9a10 10 0 0 0 0 9l3.3-2.5Z M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 2.9 7.2l3.3 2.7C7 7.6 9.3 5.9 12 5.9Z",
  lock: "M6 10V8a6 6 0 0 1 12 0v2 M5 10h14v10H5z M12 14v3",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  pkg: "M16 3l5 3v6c0 5-3 7-9 9-6-2-9-4-9-9V6l5-3M3 8l9 4 9-4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  edit: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",
  trash: "M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14",
  dollar: "M12 2v20M17 6.5C17 4.6 14.8 4 12 4s-5 .8-5 3 2.5 2.7 5 3 5 .9 5 3-2.2 3-5 3-5-.7-5-2.6",
  package2: "M21 16V8l-9-5-9 5v8l9 5 9-5Z",
  zap: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
};
function Icon({ name, size = 20, stroke = 2, fill = "none", className = "", style }) {
  const d = ICONS[name] || "";
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => <path key={i} d={(i ? "M" : "") + seg} />)}
    </svg>
  );
}

/* ---------- SmartImg: Unsplash with graceful CSS fallback ---------- */
function SmartImg({ src, alt, className = "", style, glyph = "package2" }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={"render " + className} style={style} role="img" aria-label={alt}>
        <Icon name={glyph} size={54} stroke={1.3} style={{ color: "var(--text-3)", opacity: 0.7, position: "relative", zIndex: 1 }} />
      </div>
    );
  }
  return (
    <div className={"render " + className} style={style}>
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

/* ---------- Button with optional magnetic pull ---------- */
function Button({ children, variant = "primary", size = "", magnetic = false, className = "", onClick, disabled, type, icon, iconRight, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.28}px, ${y * 0.4}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <button ref={ref} type={type || "button"} disabled={disabled} onClick={onClick}
      onMouseMove={onMove} onMouseLeave={reset}
      className={`btn btn-${variant} ${size ? "btn-" + size : ""} ${magnetic ? "magnetic" : ""} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 18} />}
    </button>
  );
}

/* ---------- rating ---------- */
function Stars({ value, size = 14, showNum = false, count }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-flex", gap: 1 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon key={i} name="star" size={size} stroke={0}
            fill={i <= Math.round(value) ? "var(--accent-bright)" : "var(--border-strong)"} />
        ))}
      </span>
      {showNum && <span className="mono" style={{ fontSize: size, color: "var(--text-2)", fontWeight: 600 }}>{value}</span>}
      {count != null && <span className="mono" style={{ fontSize: size - 1, color: "var(--text-3)" }}>({count.toLocaleString()})</span>}
    </span>
  );
}

/* ---------- price ---------- */
const money = (n) => "₵" + n.toLocaleString(undefined, { minimumFractionDigits: 0 });
function Price({ value, was, size = 22 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 9 }}>
      <span className="mono" style={{ fontFamily: '"Clash Display", sans-serif', fontWeight: 600, fontSize: size, color: "var(--text)" }}>{money(value)}</span>
      {was && <span className="mono" style={{ fontSize: size * 0.62, color: "var(--text-3)", textDecoration: "line-through" }}>{money(was)}</span>}
    </span>
  );
}

/* ---------- skeleton ---------- */
function Skeleton({ w = "100%", h = 16, r = 8, style }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

/* ---------- reveal-on-scroll hook ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const els = el.matches?.(".reveal") ? [el] : el.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((n) => io.observe(n));
    return () => io.disconnect();
  });
  return ref;
}

/* ---------- toast ---------- */
const ToastCtx = React.createContext(() => {});
function ToastHost({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, icon = "check") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 400, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", pointerEvents: "none" }}>
        {toasts.map((t) => (
          <div key={t.id} className="glass-2 scale-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 999, boxShadow: "var(--shadow)", fontSize: 14, fontWeight: 600 }}>
            <span style={{ display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: 99, background: "var(--accent)", color: "#fff" }}><Icon name={t.icon} size={14} stroke={2.6} /></span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

Object.assign(window, {
  Icon, SmartImg, Button, Stars, Price, Skeleton, useReveal, money,
  ToastHost, useToast,
});
