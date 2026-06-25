import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import { Panel, Tag, StatusPill, btnPrimary, btnGhost, Empty } from '../common/UI';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  accentSoft: "#EDF1F6",
  ok: "#3F7A52",
  warn: "#9A6B1E",
  err: "#A23B3B"
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PM_ROWS = [
  { id: "pm", name: "Project Management" },
  { id: "calls", name: "Client Calls" },
  { id: "plan", name: "Planning" },
  { id: "review", name: "Reviews" },
  { id: "meet", name: "Internal Meetings" }
];
const TODAY = 2;
const LIMIT = 8;

function PMEntryEditor({ rowName, day, val, onChange, onDone, onClose, lastDay }) {
  return (
    <div style={{ border: `1px solid ${C.accent}`, borderRadius: 8, background: C.accentSoft, padding: 14 }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: "12.5px", fontWeight: 600, color: C.ink }}>
          {DAY_FULL[day]} work details · {rowName}
        </span>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", padding: 2, display: "flex" }}>
          <Icon n="x" size={15} color={C.ink2} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: 80 }}>
          <div style={{ fontSize: 11, color: C.ink2, marginBottom: 5 }}>Hours</div>
          <input 
            className="num" 
            type="number" 
            min="0" 
            max="24" 
            step="0.5"
            value={val.h || ""} 
            placeholder="0" 
            autoFocus
            onChange={e => {
              let n = parseFloat(e.target.value);
              n = isNaN(n) || n < 0 ? 0 : Math.min(24, n);
              onChange({ ...val, h: n });
            }}
            style={{ 
              width: "100%", 
              border: `1px solid ${C.lineStrong}`, 
              borderRadius: 6, 
              padding: "8px 10px", 
              fontSize: 14, 
              color: C.ink, 
              textAlign: "center", 
              background: C.surface 
            }}
          />
        </div>
        
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 11, color: C.ink2, marginBottom: 5 }}>Work description (optional for PMs)</div>
          <textarea 
            value={val.d || ""} 
            onChange={e => onChange({ ...val, d: e.target.value })} 
            placeholder="Log details of PM tasks..."
            style={{ 
              width: "100%", 
              minHeight: 60, 
              resize: "vertical", 
              border: `1px solid ${C.lineStrong}`, 
              borderRadius: 6, 
              padding: "9px 11px", 
              fontSize: "13.5px", 
              color: C.ink, 
              background: C.surface, 
              lineHeight: 1.5 
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button 
              className="primary" 
              style={{ ...btnPrimary, padding: "7px 14px", whiteSpace: "nowrap" }} 
              onClick={onDone}
            >
              {lastDay ? "Done" : "Done & next day"} {!lastDay && <Icon n="arrow" size={13} color="#fff" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyTimesheet({ showToast }) {
  const [status, setStatus] = useState("Draft");
  const [entries, setEntries] = useState(() => {
    // Seed default PM hours
    return {
      pm: [{ h: 2, d: "Project setup & resource discovery check." }, { h: 2, d: "" }, { h: 3, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }],
      calls: [{ h: 1, d: "Client alignment call Meridian." }, { h: 2, d: "" }, { h: 1, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }],
      plan: [{ h: 2, d: "" }, { h: 1, d: "" }, { h: 2, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }],
      review: [{ h: 1, d: "" }, { h: 2, d: "" }, { h: 1, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }],
      meet: [{ h: 2, d: "Internal design critique sync." }, { h: 1, d: "" }, { h: 2, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }, { h: 0, d: "" }]
    };
  });
  
  const [sel, setSel] = useState(null); // { row, day }
  const [saved, setSaved] = useState(true);
  const locked = status === "Submitted" || status === "Approved";

  useEffect(() => {
    if (locked) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 900);
    return () => clearTimeout(t);
  }, [entries, locked]);

  const dayTotals = DAYS.map((_, d) => 
    PM_ROWS.reduce((sum, r) => sum + (entries[r.id][d].h || 0), 0)
  );

  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const remainingTotal = Math.max(0, 40 - weekTotal);
  const overDay = dayTotals.some(t => t > LIMIT);

  const setEntry = (rid, day, val) => {
    if (locked) return;
    setEntries(prev => ({
      ...prev,
      [rid]: prev[rid].map((e, i) => i === day ? val : e)
    }));
  };

  const open = (rid, day) => {
    if (!locked) setSel({ row: rid, day });
  };

  const doneNext = (rid, day) => {
    showToast("Saved draft");
    if (day < 6) {
      setSel({ row: rid, day: day + 1 });
    } else {
      setSel(null);
    }
  };

  const handleSubmit = () => {
    if (weekTotal === 0) {
      showToast("Log some hours first", "err");
      return;
    }
    setStatus("Submitted");
    showToast("Submitted timesheet");
  };

  const handleApprove = () => {
    setStatus("Approved");
    showToast("Self-approved timesheet");
  };

  const editorFor = (rid, day) => {
    const row = PM_ROWS.find(r => r.id === rid);
    return (
      <PMEntryEditor 
        rowName={row ? row.name : rid} 
        day={day} 
        val={entries[rid][day]}
        onChange={v => setEntry(rid, day, v)}
        onDone={() => doneNext(rid, day)}
        onClose={() => setSel(null)}
        lastDay={day === 6}
      />
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: ".05em" }}>
            My Weekly Timesheet
          </div>
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 3 }}>
            Log hours against internal operational categories.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="num" style={{ fontSize: 13, color: C.ink2 }}>
            <span style={{ color: C.ink, fontWeight: 600, fontSize: 16 }}>{weekTotal}h</span> logged · {remainingTotal}h left
          </div>
          {!locked && (
            <div style={{ fontSize: "11.5px", color: saved ? C.ok : C.ink3, marginTop: 3, display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
              {saved ? <><Icon n="check" size={12} color={C.ok} /> Draft saved</> : "Saving…"}
            </div>
          )}
        </div>
      </div>

      {status === "Submitted" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Tag s="Submitted" />
          <button className="primary" style={{ ...btnPrimary, alignSelf: "flex-start" }} onClick={handleApprove}>
            Self-Approve Timesheet
          </button>
        </div>
      )}
      {status === "Approved" && (
        <span style={{ color: C.ok, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon n="check" size={14} color={C.ok} /> Approved & locked.
        </span>
      )}

      {/* Desktop Table Grid */}
      <section style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ fontSize: 11, fontWeight: 600, color: C.ink3, padding: "11px 12px", textAlign: "left", borderBottom: `1px solid ${C.line}`, width: "30%" }}>Category</th>
                {DAYS.map((d, i) => (
                  <th key={d} style={{ fontSize: 11, fontWeight: 600, padding: "11px 12px", textAlign: "center", borderBottom: `1px solid ${C.line}`, color: i === TODAY ? C.accent : C.ink3 }}>
                    {d}
                  </th>
                ))}
                <th style={{ fontSize: 11, fontWeight: 600, color: C.ink, padding: "11px 12px", textAlign: "center", borderBottom: `1px solid ${C.line}` }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {PM_ROWS.map(row => {
                const rt = entries[row.id].reduce((sum, e) => sum + (e.h || 0), 0);
                const mainRow = (
                  <tr key={row.id} className="row">
                    <td style={{ fontSize: 13, color: C.ink2, padding: "11px 12px", borderBottom: `1px solid ${C.line}` }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{row.name}</span>
                    </td>
                    {DAYS.map((_, d) => {
                      const e = entries[row.id][d] || { h: 0, d: "" };
                      const se = sel && sel.row === row.id && sel.day === d;
                      return (
                        <td 
                          key={d} 
                          onClick={() => open(row.id, d)} 
                          style={{ 
                            padding: 0, 
                            borderBottom: `1px solid ${C.line}`, 
                            cursor: locked ? "default" : "pointer", 
                            background: se ? C.accentSoft : d === TODAY ? "rgba(56,97,140,.035)" : "transparent"
                          }}
                        >
                          <input 
                            className="hcell num" 
                            value={e.h || ""} 
                            placeholder="·" 
                            disabled={locked} 
                            onFocus={() => open(row.id, d)}
                            onChange={ev => {
                              let n = parseFloat(ev.target.value);
                              n = isNaN(n) || n < 0 ? 0 : Math.min(24, n);
                              setEntry(row.id, d, { ...e, h: n });
                              open(row.id, d);
                            }}
                            style={{ 
                              width: "100%", 
                              border: "none", 
                              background: "transparent", 
                              textAlign: "center", 
                              padding: "13px 0", 
                              fontSize: "13.5px", 
                              color: e.h ? C.ink : C.ink3, 
                              cursor: locked ? "not-allowed" : "pointer" 
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className="num" style={{ fontSize: 13, color: C.ink, padding: "11px 12px", borderBottom: `1px solid ${C.line}`, textAlign: "center", fontWeight: 600 }}>
                      {rt || "—"}
                    </td>
                  </tr>
                );

                const out = [mainRow];
                if (sel && sel.row === row.id) {
                  out.push(
                    <tr key={row.id + "-ed"}>
                      <td colSpan={9} style={{ padding: "10px 12px", borderBottom: `1px solid ${C.line}`, background: "#FBFBF9" }}>
                        {editorFor(row.id, sel.day)}
                      </td>
                    </tr>
                  );
                }
                return out;
              })}
              <tr style={{ borderTop: `1px solid ${C.lineStrong}` }}>
                <td style={{ fontSize: 12, fontWeight: 600, color: C.ink2, padding: "11px 12px", borderBottom: `1px solid ${C.line}` }}>Daily total</td>
                {dayTotals.map((t, i) => (
                  <td key={i} className="num" style={{ fontSize: 13, color: t > LIMIT ? C.warn : t ? C.ink : C.ink3, padding: "11px 12px", borderBottom: `1px solid ${C.line}`, textAlign: "center", fontWeight: 600 }}>
                    {t || "—"}
                  </td>
                ))}
                <td className="num" style={{ fontSize: 13, color: C.ink, padding: "11px 12px", borderBottom: `1px solid ${C.line}`, textAlign: "center", fontWeight: 700 }}>
                  {weekTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {overDay && !locked && (
          <div style={{ padding: "9px 16px", borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.warn, display: "flex", alignItems: "center", gap: 8, background: C.warnSoft }}>
            <Icon n="alert" size={14} color={C.warn} />
            A day exceeds {LIMIT}h.
          </div>
        )}
      </section>

      {!locked && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button className="primary" style={btnPrimary} onClick={handleSubmit}>
            Submit Timesheet
          </button>
        </div>
      )}
    </div>
  );
}
