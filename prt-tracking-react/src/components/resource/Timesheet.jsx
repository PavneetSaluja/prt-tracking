import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import { Empty, Notice, StatusPill, btnPrimary, btnGhost, Panel, Tag } from '../common/UI';

const th = {
  fontSize: 11,
  fontWeight: 600,
  color: "#9A9AA1",
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid #E7E6E0",
  whiteSpace: "nowrap"
};

const td = {
  fontSize: 13,
  color: "#5C5C63",
  padding: "11px 12px",
  textAlign: "left",
  borderBottom: "1px solid #E7E6E0",
  verticalAlign: "middle"
};

function HistoricalTimesheetsList({ list, projects, onGoToWeek, type }) {
  const [openId, setOpenId] = useState(null);

  const getTimesheetTotal = (ts) => {
    return Object.keys(ts.entries).reduce((sum, pid) => {
      return sum + ts.entries[pid].reduce((a, e) => a + (e ? (e.h || 0) : 0), 0);
    }, 0);
  };

  const getProjName = (projId) => projects.find(p => p.id === projId)?.name || projId;

  if (list.length === 0) {
    return <Empty msg={`No ${type.toLowerCase()} timesheets found.`} />;
  }

  return (
    <Panel pad={false}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Week</th>
              <th style={th}>Projects & Hours</th>
              <th className="num" style={{ ...th, textAlign: "right" }}>Logged</th>
              <th style={th}>Status</th>
              <th style={{ ...th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(ts => {
              const total = getTimesheetTotal(ts);
              const isExpanded = openId === ts.id;
              
              // Get active daily entries
              const activeEntries = [];
              Object.keys(ts.entries).forEach(pid => {
                ts.entries[pid].forEach((dayLog, dayIdx) => {
                  if (dayLog && dayLog.h > 0) {
                    activeEntries.push({
                      projectName: getProjName(pid),
                      day: DAY_FULL[dayIdx],
                      hours: dayLog.h,
                      desc: dayLog.d
                    });
                  }
                });
              });

              return (
                <React.Fragment key={ts.id}>
                  <tr className="row">
                    <td style={{ ...td, color: "#18181B", fontWeight: 500 }}>
                      {ts.weekLabel}
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {Object.keys(ts.entries).map(pid => {
                          const hrs = ts.entries[pid].reduce((a, b) => a + (b ? b.h : 0), 0);
                          if (hrs === 0) return null;
                          return (
                            <span key={pid} style={{ fontSize: 12.5, color: "#18181B" }}>
                              {getProjName(pid)} <span className="num" style={{ color: "#9A9AA1" }}>· {hrs}h</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="num" style={{ ...td, textAlign: "right", color: "#18181B", fontWeight: 500 }}>
                      {total}h
                    </td>
                    <td style={td}>
                      <Tag s={ts.status} strong />
                    </td>
                    <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button 
                        className="lnk" 
                        onClick={() => setOpenId(isExpanded ? null : ts.id)} 
                        style={{ border: "none", background: "none", color: "#38618C", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3, marginRight: 10 }}
                      >
                        Details <Icon n={isExpanded ? "down" : "right"} size={13} color="#38618C" />
                      </button>
                      <button
                        title="Go to Week"
                        className="ghost"
                        onClick={() => onGoToWeek(ts.weekIdx)}
                        style={{ border: "1px solid #E7E6E0", background: "#FFFFFF", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11.5, fontWeight: 500 }}
                      >
                        Go to Week
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="fade-in">
                      <td colSpan={5} style={{ padding: "0 12px 14px", borderBottom: "1px solid #E7E6E0", background: "#FBFBF9" }}>
                        <div style={{ border: "1px solid #E7E6E0", borderRadius: 6, padding: "12px 14px", background: "#FFFFFF", marginTop: 6 }}>
                          <div style={{ fontSize: 11, color: "#9A9AA1", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>
                            Daily Work Log Descriptions
                          </div>

                          {activeEntries.length === 0 ? (
                            <Empty msg="No hours logged for this week." />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: ts.comment ? 12 : 0 }}>
                              {activeEntries.map((e, idx) => (
                                <div key={idx} style={{ padding: "8px 10px", borderBottom: idx < activeEntries.length - 1 ? "1px solid #E7E6E0" : "none", display: "flex", flexDirection: "column", gap: 4 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                    <span style={{ fontWeight: 600, color: "#18181B" }}>{e.projectName} · {e.day}</span>
                                    <span className="num" style={{ fontWeight: 600, color: "#38618C" }}>{e.hours}h</span>
                                  </div>
                                  <div style={{ fontSize: 12.5, color: "#5C5C63", lineHeight: 1.4, fontStyle: "italic" }}>
                                    "{e.desc || "No description provided."}"
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {ts.comment && (
                            <div style={{ padding: "8px 10px", background: ts.status === "Rejected" ? "#FBF1F0" : "#EEF4EF", border: `1px solid ${ts.status === "Rejected" ? "#A23B3B" : "#3F7A52"}`, borderRadius: 4, fontSize: 12.5, color: ts.status === "Rejected" ? "#A23B3B" : "#3F7A52" }}>
                              <strong>PM Comment:</strong> "{ts.comment}"
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

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
  okSoft: "#EEF4EF",
  warn: "#9A6B1E",
  warnSoft: "#FAF3E6",
  err: "#A23B3B",
  errSoft: "#FBF1F0"
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TODAY = 2; // Fixed Wednesday index for seed UI simulation
const LIMIT = 8;
const MIN_DESC = 20;

const validDesc = d => d && d.trim().length >= MIN_DESC;
const needsDesc = e => e && e.h > 0 && !validDesc(e.d);

function EntryEditor({ projName, day, entry, onChange, onDone, onClose, lastDay }) {
  const [tried, setTried] = useState(false);
  const len = entry.d ? entry.d.trim().length : 0;
  
  let err = "";
  if (tried) {
    if (!(entry.h > 0)) {
      err = "Enter the hours worked for this day.";
    } else if (len === 0) {
      err = "Please describe the work completed before saving your hours.";
    } else if (len < MIN_DESC) {
      err = `Add a little more detail — at least ${MIN_DESC} characters.`;
    }
  }

  const handleDone = () => {
    if (!(entry.h > 0) || !validDesc(entry.d)) {
      setTried(true);
      return;
    }
    onDone();
  };

  return (
    <div style={{ border: `1px solid ${C.accent}`, borderRadius: 8, background: C.accentSoft, padding: 14 }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: "12.5px", fontWeight: 600, color: C.ink }}>
          {DAY_FULL[day]} work details · {projName}
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
            value={entry.h || ""} 
            placeholder="0" 
            autoFocus
            onChange={e => {
              let n = parseFloat(e.target.value);
              n = isNaN(n) || n < 0 ? 0 : Math.min(24, n);
              onChange({ ...entry, h: n });
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
          <div style={{ fontSize: 11, color: C.ink2, marginBottom: 5 }}>
            Work description <span style={{ color: C.err }}>*</span>
          </div>
          <textarea 
            value={entry.d || ""} 
            onChange={e => onChange({ ...entry, d: e.target.value })} 
            placeholder="Describe the work completed during these hours..."
            style={{ 
              width: "100%", 
              minHeight: 64, 
              resize: "vertical", 
              border: `1px solid ${err ? C.err : C.lineStrong}`, 
              borderRadius: 6, 
              padding: "9px 11px", 
              fontSize: "13.5px", 
              color: C.ink, 
              background: C.surface, 
              lineHeight: 1.5 
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, gap: 10 }}>
            <span style={{ fontSize: "11.5px", color: err ? C.err : len >= MIN_DESC ? C.ok : C.ink3, display: "flex", alignItems: "center", gap: 5 }}>
              {err ? <Icon n="alert" size={12} color={C.err} /> : (len >= MIN_DESC && entry.h > 0) ? <Icon n="check" size={12} color={C.ok} /> : null}
              {err || `${len} / ${MIN_DESC} characters minimum`}
            </span>
            <button 
              className="primary" 
              style={{ ...btnPrimary, padding: "7px 14px", whiteSpace: "nowrap" }} 
              onClick={handleDone}
            >
              {lastDay ? "Done" : "Done & next day"} {!lastDay && <Icon n="arrow" size={13} color="#fff" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Timesheet({ projects, timesheet, onSaveDraft, onSubmit, showToast, mobile, capacity, timesheets = [], setWeekIdx }) {
  const locked = timesheet.status === "Submitted" || timesheet.status === "Approved";
  const [activeTab, setActiveTab] = useState("Weekly Timesheet");
  const [sel, setSel] = useState(null); // { proj: projectId, day: dayIdx }
  const [saved, setSaved] = useState(true);

  // Trigger auto-save indicator when entries modify (excluding load state)
  useEffect(() => {
    if (locked) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 900);
    return () => clearTimeout(t);
  }, [timesheet.entries, locked]);

  if (projects.length === 0) {
    return <Empty msg="You have no project allocations. Contact your PM." />;
  }

  // Calculate day and week totals
  const dayTotals = DAYS.map((_, d) => 
    projects.reduce((sum, p) => {
      const projEntries = timesheet.entries[p.id] || [];
      const entry = projEntries[d];
      return sum + (entry ? (entry.h || 0) : 0);
    }, 0)
  );

  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const remainingTotal = Math.max(0, capacity - weekTotal);
  const anyHours = projects.some(p => {
    const projEntries = timesheet.entries[p.id] || [];
    return projEntries.some(e => e && e.h > 0);
  });

  const incomplete = projects.flatMap(p => {
    const projEntries = timesheet.entries[p.id] || [];
    return projEntries.map((e, d) => e && needsDesc(e) ? { proj: p.id, day: d } : null);
  }).filter(Boolean);

  const overDay = dayTotals.some(t => t > LIMIT);

  const setEntry = (pid, day, val) => {
    if (locked) return;
    const updatedEntries = { ...timesheet.entries };
    if (!updatedEntries[pid]) {
      updatedEntries[pid] = Array(7).fill(null).map(() => ({ h: 0, d: "" }));
    }
    updatedEntries[pid] = updatedEntries[pid].map((e, i) => i === day ? val : e);
    onSaveDraft(timesheet.employeeId, timesheet.weekIdx, updatedEntries);
  };

  const open = (pid, day) => {
    if (!locked) setSel({ proj: pid, day });
  };

  const doneNext = (pid, day) => {
    showToast("Saved draft");
    if (day < 6) {
      setSel({ proj: pid, day: day + 1 });
    } else {
      setSel(null);
    }
  };

  const handleSubmit = () => {
    if (weekTotal === 0) {
      showToast("Log some hours first", "err");
      return;
    }
    if (incomplete.length > 0) {
      setSel(incomplete[0]);
      showToast("Add a description to every logged day first", "err");
      return;
    }
    onSubmit(timesheet.employeeId, timesheet.weekIdx, timesheet.entries);
    showToast("Week submitted");
    setSel(null);
  };

  const editorFor = (pid, day) => {
    const projEntries = timesheet.entries[pid] || Array(7).fill(null).map(() => ({ h: 0, d: "" }));
    const entry = projEntries[day] || { h: 0, d: "" };
    const proj = projects.find(p => p.id === pid);
    return (
      <EntryEditor 
        projName={proj ? proj.name : pid} 
        day={day} 
        entry={entry}
        onChange={v => setEntry(pid, day, v)} 
        onDone={() => doneNext(pid, day)} 
        onClose={() => setSel(null)} 
        lastDay={day === 6}
      />
    );
  };

  const approvedTimesheets = timesheets.filter(ts => ts.employeeId === timesheet.employeeId && ts.status === "Approved");
  const rejectedTimesheets = timesheets.filter(ts => ts.employeeId === timesheet.employeeId && ts.status === "Rejected");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Tab bar header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.line}`, paddingBottom: 2, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["Weekly Timesheet", "Approved Timesheets", "Rejected Timesheets"].map(t => {
            const active = activeTab === t;
            let count = 0;
            if (t === "Approved Timesheets") {
              count = approvedTimesheets.length;
            } else if (t === "Rejected Timesheets") {
              count = rejectedTimesheets.length;
            }
            
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.ink : C.ink3,
                  borderBottom: `2px solid ${active ? C.ink : "transparent"}`,
                  marginBottom: -3,
                  outline: "none"
                }}
              >
                {t}
                {t !== "Weekly Timesheet" && (
                  <span className="num" style={{ fontSize: 11, marginLeft: 5, color: C.ink3 }}>({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Weekly Timesheet" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: ".05em" }}>
                Weekly timesheet
              </div>
              <div style={{ fontSize: 12, color: C.ink3, marginTop: 3 }}>
                Every logged hour needs a short work description.
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

          {timesheet.status === "Submitted" && (
            <Notice tone="accent" icon="lock" title="Pending PM approval" body="Your week is submitted and locked. You'll be notified once it's reviewed." />
          )}
          {timesheet.status === "Approved" && (
            <Notice tone="ok" icon="check" title="Approved" body={timesheet.comment ? `Feedback: "${timesheet.comment}"` : "Sent to billing. Nothing more to do this week."} />
          )}
          {timesheet.status === "Rejected" && (
            <Notice tone="err" icon="alert" title="Changes requested by your PM" body={timesheet.comment || "Please review and resubmit."} />
          )}

          {!anyHours && !locked ? (
            <Empty msg="Start logging your hours to track your work." />
          ) : mobile ? (
            /* Mobile structure: Cards and day-chips */
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {projects.map(p => {
                const projEntries = timesheet.entries[p.id] || Array(7).fill(null).map(() => ({ h: 0, d: "" }));
                const rt = projEntries.reduce((sum, e) => sum + (e ? e.h : 0), 0);
                return (
                  <div key={p.id} style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, overflow: "hidden" }}>
                    <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.name}</span>
                      <span className="num" style={{ fontSize: "12.5px", color: C.ink2 }}>{rt}h</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, padding: "12px 14px", flexWrap: "wrap" }}>
                      {DAYS.map((d, di) => {
                        const e = projEntries[di] || { h: 0, d: "" };
                        const se = sel && sel.proj === p.id && sel.day === di;
                        const need = needsDesc(e);
                        return (
                          <button 
                            key={d} 
                            onClick={() => open(p.id, di)} 
                            disabled={locked} 
                            style={{ 
                              flex: "1 1 0", 
                              minWidth: 40, 
                              border: `1px solid ${se ? C.accent : need ? C.warn : C.line}`, 
                              borderRadius: 6, 
                              padding: "7px 4px", 
                              background: se ? C.accentSoft : C.surface, 
                              cursor: locked ? "default" : "pointer" 
                            }}
                          >
                            <div style={{ fontSize: 10, color: C.ink3 }}>{d}</div>
                            <div className="num" style={{ fontSize: 13, color: e.h ? (need ? C.warn : C.ink) : C.ink3, marginTop: 1 }}>
                              {e.h || "·"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {sel && sel.proj === p.id && (
                      <div style={{ padding: "0 14px 14px" }}>
                        {editorFor(p.id, sel.day)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Desktop structure: Table layout with in-table sub-editor rows */
            <section style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: 11, fontWeight: 600, color: C.ink3, padding: "11px 12px", textAlign: "left", borderBottom: `1px solid ${C.line}`, width: "30%" }}>Project</th>
                      {DAYS.map((d, i) => (
                        <th key={d} style={{ fontSize: 11, fontWeight: 600, padding: "11px 12px", textAlign: "center", borderBottom: `1px solid ${C.line}`, color: i === TODAY ? C.accent : C.ink3 }}>
                          {d}
                        </th>
                      ))}
                      <th style={{ fontSize: 11, fontWeight: 600, color: C.ink, padding: "11px 12px", textAlign: "center", borderBottom: `1px solid ${C.line}` }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => {
                      const projEntries = timesheet.entries[p.id] || Array(7).fill(null).map(() => ({ h: 0, d: "" }));
                      const rt = projEntries.reduce((sum, e) => sum + (e ? e.h : 0), 0);
                      
                      return (
                        <React.Fragment key={p.id}>
                          <tr className="row">
                            <td style={{ fontSize: 13, color: C.ink2, padding: "11px 12px", borderBottom: `1px solid ${C.line}` }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{p.name}</span>
                            </td>
                            {DAYS.map((_, d) => {
                              const e = projEntries[d] || { h: 0, d: "" };
                              const need = needsDesc(e);
                              const se = sel && sel.proj === p.id && sel.day === d;
                              return (
                                <td 
                                  key={d} 
                                  onClick={() => open(p.id, d)} 
                                  style={{ 
                                    padding: 0, 
                                    borderBottom: `1px solid ${C.line}`, 
                                    cursor: locked ? "default" : "pointer", 
                                    background: se ? C.accentSoft : d === TODAY ? "rgba(56,97,140,.035)" : "transparent",
                                    boxShadow: need ? `inset 0 -2px 0 ${C.warn}` : undefined
                                  }}
                                >
                                  <input 
                                    className="hcell num" 
                                    value={e.h || ""} 
                                    placeholder="·" 
                                    disabled={locked} 
                                    onFocus={() => open(p.id, d)}
                                    onChange={ev => {
                                      let n = parseFloat(ev.target.value);
                                      n = isNaN(n) || n < 0 ? 0 : Math.min(24, n);
                                      setEntry(p.id, d, { ...e, h: n });
                                      open(p.id, d);
                                    }}
                                    style={{ 
                                      width: "100%", 
                                      border: "none", 
                                      background: "transparent", 
                                      textAlign: "center", 
                                      padding: "13px 0", 
                                      fontSize: "13.5px", 
                                      color: e.h ? (need ? C.warn : C.ink) : C.ink3, 
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
                          {sel && sel.proj === p.id && (
                            <tr>
                              <td colSpan={9} style={{ padding: "10px 12px", borderBottom: `1px solid ${C.line}`, background: "#FBFBF9" }}>
                                {editorFor(p.id, sel.day)}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
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
          )}

          {incomplete.length > 0 && !locked && (
            <div style={{ fontSize: 12, color: C.warn, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: C.warn, display: "inline-block" }} />
              {incomplete.length} logged {incomplete.length === 1 ? "day needs" : "days need"} a work description before you can submit.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
            <StatusPill s={timesheet.status} />
            {timesheet.status === "Rejected" ? (
              <button className="primary" style={btnPrimary} onClick={handleSubmit}>Resubmit</button>
            ) : (
              <button 
                className="primary" 
                style={{ ...btnPrimary, opacity: locked ? 0.4 : 1, pointerEvents: locked ? "none" : "auto" }} 
                onClick={handleSubmit}
              >
                Submit week
              </button>
            )}
          </div>
        </>
      ) : activeTab === "Approved Timesheets" ? (
        <HistoricalTimesheetsList 
          list={approvedTimesheets} 
          projects={projects} 
          onGoToWeek={(wIdx) => {
            setWeekIdx(wIdx);
            setActiveTab("Weekly Timesheet");
          }} 
          type="Approved"
        />
      ) : (
        <HistoricalTimesheetsList 
          list={rejectedTimesheets} 
          projects={projects} 
          onGoToWeek={(wIdx) => {
            setWeekIdx(wIdx);
            setActiveTab("Weekly Timesheet");
          }} 
          type="Rejected"
        />
      )}
    </div>
  );
}
