import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  accent: "#38618C",
  accentSoft: "#EDF1F6",
  ok: "#3F7A52",
  okSoft: "#EEF4EF",
  warn: "#9A6B1E",
  warnSoft: "#FAF3E6",
  err: "#A23B3B",
  errSoft: "#FBF1F0",
  violet: "#6B5B95"
};

export function Dot({ c }) {
  return <span style={{ width: 6, height: 6, borderRadius: 99, background: c, display: "inline-block" }} />;
}

export const statusColor = (s) => {
  return {
    Draft: C.ink3,
    Submitted: C.accent,
    Approved: C.ok,
    Rejected: C.err,
    Active: C.ok,
    "On Track": C.ok,
    Planning: C.accent,
    Delayed: C.err,
    "On-Hold": C.warn,
    "On Hold": C.warn,
    Completed: C.ink3,
    Pipeline: C.accent,
    Inactive: C.ink3,
    PM: C.accent,
    Resource: C.ink2,
    Sales: C.violet,
    Admin: C.ink,
    COO: C.ok,
    Missing: C.err,
    Late: C.warn,
    High: C.warn,
    Medium: C.accent,
    Low: C.ink3,
    Billable: C.ok,
    "Non-Billable": C.ink3,
    Income: C.ok,
    Expense: C.err
  }[s] || C.ink3;
};

export function StatusPill({ s }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.ink2 }}>
      <Dot c={statusColor(s)} />
      {s}
    </span>
  );
}

export function Tag({ s, strong }) {
  const c = statusColor(s);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: strong ? c : C.ink2, whiteSpace: "nowrap" }}>
      <Dot c={c} />
      {s}
    </span>
  );
}

export function Notice({ tone, title, body, icon }) {
  const c = tone === "err" ? C.err : tone === "ok" ? C.ok : tone === "warn" ? C.warn : C.accent;
  return (
    <div style={{ padding: "11px 14px", background: C.surface, border: `1px solid ${C.line}`, borderLeft: `2px solid ${c}`, display: "flex", gap: 10, alignItems: "flex-start", borderRadius: 4 }}>
      {icon && <span style={{ marginTop: 2 }}><Icon n={icon} size={15} color={c} /></span>}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{title}</div>
        {body && <div style={{ fontSize: 12.5, color: C.ink2, marginTop: 3, lineHeight: 1.5 }}>{body}</div>}
      </div>
    </div>
  );
}

export function Panel({ title, sub, right, children, pad = true }) {
  return (
    <section style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{sub}</div>}
          </div>
          {right}
        </div>
      )}
      <div style={pad ? { padding: 16 } : undefined}>{children}</div>
    </section>
  );
}

export function KPI({ label, value, note, tone }) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, padding: "14px 16px" }}>
      <div style={{ fontSize: 11.5, color: C.ink3 }}>{label}</div>
      <div className="num" style={{ fontSize: 22, fontWeight: 600, color: C.ink, marginTop: 6, letterSpacing: "-0.02em" }}>{value}</div>
      {note && (
        <div style={{ fontSize: 11.5, color: tone || C.ink3, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
          {tone && <Dot c={tone} />}
          {note}
        </div>
      )}
    </div>
  );
}

export function Empty({ msg }) {
  return (
    <div style={{ padding: "34px 16px", textAlign: "center", color: C.ink3, fontSize: 13, border: `1px dashed ${C.lineStrong}`, borderRadius: 8 }}>
      {msg}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, w = 440 }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,20,25,.22)" }} />
      <div style={{ position: "relative", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, width: w, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 30px rgba(0,0,0,.14)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.surface, zIndex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</span>
          <button className="ghost" onClick={onClose} style={{ border: "none", background: "none", borderRadius: 6, padding: 4, cursor: "pointer", display: "flex" }}>
            <Icon n="x" size={16} color={C.ink2} />
          </button>
        </div>
        <div style={{ padding: 18, overflowY: "auto" }}>{children}</div>
        {footer && (
          <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 8, position: "sticky", bottom: 0, background: C.surface, zIndex: 1 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children, footer, width = 460 }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.2)", zIndex: 80 }} />
      <aside style={{ position: "fixed", top: 0, right: 0, height: "100%", width, maxWidth: "95%", background: C.surface, borderLeft: `1px solid ${C.line}`, zIndex: 90, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</span>
          <button className="ghost" onClick={onClose} style={{ border: "none", background: "none", borderRadius: 6, padding: 5, cursor: "pointer", display: "flex" }}>
            <Icon n="x" size={16} color={C.ink2} />
          </button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>{children}</div>
        {footer && (
          <div style={{ padding: "14px 22px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 8, background: C.surface }}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

// ── Custom Toast Implementation ─────────────────────────────────────────

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (m, tone = "ok") => {
    setToast({ m, tone, k: Date.now() });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const node = toast ? (
    <div
      key={toast.k}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 120,
        background: C.ink,
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 8,
        fontSize: 13,
        boxShadow: "0 6px 20px rgba(0,0,0,.2)",
        display: "flex",
        alignItems: "center",
        gap: 9,
        animation: "toastin .2s ease"
      }}
    >
      {toast.tone === "ok" && <Icon n="check" size={15} color="#8fd6a5" />}
      {toast.tone === "err" && <Icon n="alert" size={15} color="#e7a3a3" />}
      {toast.m}
    </div>
  ) : null;

  return [node, show];
}

// Shared constant style definitions
export const btnGhost = {
  border: `1px solid ${C.line}`,
  background: C.surface,
  color: C.ink2,
  padding: "7px 12px",
  fontSize: "12.5px",
  fontWeight: 500,
  borderRadius: 6,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6
};

export const btnPrimary = {
  border: "none",
  background: C.ink,
  color: "#fff",
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 600,
  borderRadius: 6,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 7
};

export const inputStyle = {
  width: "100%",
  border: `1px solid ${C.lineStrong}`,
  borderRadius: 6,
  padding: "9px 11px",
  fontSize: "13.5px",
  color: C.ink,
  background: C.surface
};
