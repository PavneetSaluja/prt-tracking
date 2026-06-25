import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Tag, Empty } from '../common/UI';
import { inr, inrC } from './Finance';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  ok: "#3F7A52",
  err: "#A23B3B"
};

const th = {
  fontSize: 11,
  fontWeight: 600,
  color: C.ink3,
  padding: "10px 10px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  whiteSpace: "nowrap"
};

const td = {
  fontSize: 13,
  color: C.ink2,
  padding: "11px 10px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  verticalAlign: "middle"
};

// Static mockup metrics for completion %
const COMPLETION_SEEDS = {
  ipo: 65,
  astra: 72,
  lms: 40,
  phoenix: 55,
  helios: 8
};

function ProjectRow({ p, finance, people, timesheets, isExpanded, onToggleExpand }) {
  const [tab, setTab] = useState("Overview");

  // Dynamic project financials
  const rev = finance.filter(f => f.type === "Income" && f.proj === p.id).reduce((s, f) => s + f.amt, 0);
  const exp = finance.filter(f => f.type === "Expense" && f.proj === p.id).reduce((s, f) => s + f.amt, 0);
  const profit = rev - exp;
  const comp = COMPLETION_SEEDS[p.id] || 0;

  const getResourceName = (resId) => {
    return people.find(x => x.id === resId)?.name || resId;
  };

  const getResourceRole = (resId) => {
    return people.find(x => x.id === resId)?.designation || "Resource";
  };

  const getWeekTimesheetStatus = (resId, weekIdx = 0) => {
    const ts = timesheets.find(t => t.employeeId === resId && t.weekIdx === weekIdx);
    return ts ? ts.status : "Missing";
  };

  return (
    <>
      <tr className="row">
        <td style={{ ...td, color: C.ink, fontWeight: 500 }}>
          {p.name}
          <div style={{ fontSize: 11, color: C.ink3, fontWeight: 400 }}>Sales · {p.sales || "—"}</div>
        </td>
        <td style={td}>{p.client}</td>
        <td style={td}>{nameOfPM(p.pmId, people)}</td>
        <td style={td}><Tag s={p.status} strong /></td>
        <td className="num" style={{ ...td, textAlign: "right" }}>{p.resources.length}</td>
        
        {/* Completion progress bar */}
        <td style={td}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ height: 3, background: C.line, borderRadius: 99, overflow: "hidden", flex: 1 }}>
              <div style={{ height: "100%", width: `${comp}%`, background: C.accent }} />
            </div>
            <span className="num" style={{ fontSize: "11.5px", color: C.ink2, width: 30, textAlign: "right" }}>
              {comp}%
            </span>
          </div>
        </td>
        
        <td className="num" style={{ ...td, textAlign: "right", color: C.ink }}>{inrC(rev)}</td>
        <td className="num" style={{ ...td, textAlign: "right", color: profit >= 0 ? C.ok : C.err, fontWeight: 600 }}>
          {inrC(profit)}
        </td>
        <td style={{ ...td, textAlign: "right" }}>
          <button 
            className="lnk" 
            onClick={onToggleExpand} 
            style={{ border: "none", background: "none", color: C.ink2, fontSize: "12.5px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            Detail <Icon n={isExpanded ? "down" : "right"} size={13} color={C.ink3} />
          </button>
        </td>
      </tr>

      {/* Expanded sub-tabs */}
      {isExpanded && (
        <tr className="fade-in">
          <td colSpan={9} style={{ padding: 0, borderBottom: `1px solid ${C.line}`, background: "#FBFBF9" }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 12, borderBottom: `1px solid ${C.line}` }}>
                {["Overview", "Resources", "Finance"].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTab(t)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: "7px 11px",
                      fontSize: "12.5px",
                      fontWeight: tab === t ? 600 : 500,
                      color: tab === t ? C.ink : C.ink3,
                      borderBottom: `2px solid ${tab === t ? C.ink : "transparent"}`,
                      marginBottom: -1,
                      outline: "none"
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Overview Subtab */}
              {tab === "Overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14 }} className="fade-in">
                  {[
                    ["Client", p.client],
                    ["Project Manager", nameOfPM(p.pmId, people)],
                    ["Sales Owner", p.sales || "—"],
                    ["Status", p.status],
                    ["Timeline Start", p.start],
                    ["Tentative End Date", p.tentativeEnd || p.end || "—"],
                    ["Actual Completion Date", p.actualCompletion || "—"],
                    ["Estimated Budgeted Hours", `${p.estimated}h`],
                    ["Net Profit Margin", inrC(profit)]
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
                      <div style={{ fontSize: "13.5px", color: C.ink, marginTop: 3, fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                  {p.desc && (
                    <div style={{ gridColumn: "1 / -1", fontSize: 12.5, color: C.ink2, marginTop: 6 }}>
                      <strong>Description:</strong> {p.desc}
                    </div>
                  )}
                </div>
              )}

              {/* Resources Subtab */}
              {tab === "Resources" && (
                <div className="fade-in">
                  {p.resources.length === 0 ? (
                    <div style={{ fontSize: 13, color: C.ink3 }}>No resources allocated.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={th}>Resource</th>
                          <th style={th}>Designation</th>
                          <th style={th}>Allocated Hours</th>
                          <th style={th}>Utilization Percentage</th>
                          <th style={th}>This Week Timesheet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.resources.map(r => (
                          <tr key={r.id} className="row">
                            <td style={{ ...td, color: C.ink, fontWeight: 500 }}>{getResourceName(r.id)}</td>
                            <td style={td}>{getResourceRole(r.id)}</td>
                            <td className="num" style={td}>{r.planned}h/wk</td>
                            <td className="num" style={td}>{r.pct}%</td>
                            <td style={td}><Tag s={getWeekTimesheetStatus(r.id, 0)} strong /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Finance Subtab */}
              {tab === "Finance" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="fade-in">
                  <div>
                    <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Revenue Entries</div>
                    {finance.filter(f => f.type === "Income" && f.proj === p.id).length === 0 ? (
                      <div style={{ fontSize: 12.5, color: C.ink3 }}>No revenue recorded.</div>
                    ) : (
                      finance.filter(f => f.type === "Income" && f.proj === p.id).map(f => (
                        <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", padding: "5px 0", borderBottom: `1px solid ${C.line}` }}>
                          <span style={{ color: C.ink }}>{f.cat} <span style={{ color: C.ink3 }}>· {f.date}</span></span>
                          <span className="num" style={{ color: C.ok }}>{inr(f.amt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Expense Entries</div>
                    {finance.filter(f => f.type === "Expense" && f.proj === p.id).length === 0 ? (
                      <div style={{ fontSize: 12.5, color: C.ink3 }}>No expenses recorded.</div>
                    ) : (
                      finance.filter(f => f.type === "Expense" && f.proj === p.id).map(f => (
                        <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", padding: "5px 0", borderBottom: `1px solid ${C.line}` }}>
                          <span style={{ color: C.ink }}>{f.cat} <span style={{ color: C.ink3 }}>· {f.date}</span></span>
                          <span className="num" style={{ color: C.ink2 }}>−{inr(f.amt)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
                    {[
                      { k: "Total Revenue", v: inr(rev), c: C.ink },
                      { k: "Total Cost", v: inr(exp), c: C.ink },
                      { k: "Net Profit", v: inr(profit), c: profit >= 0 ? C.ok : C.err }
                    ].map(({ k, v, c }) => (
                      <div key={k}>
                        <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase" }}>{k}</div>
                        <div className="num" style={{ fontSize: 15, color: c, fontWeight: 600, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const nameOfPM = (pmId, people) => {
  return people.find(x => x.id === pmId)?.name || pmId;
};

export default function Projects() {
  const { projects, finance, people, timesheets } = useDatabase();
  const [q, setQ] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredProjects = projects.filter(p => {
    return (p.name + p.client + nameOfPM(p.pmId, people) + (p.sales || "")).toLowerCase().includes(q.toLowerCase());
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 220 }}>
          <Icon n="search" size={14} color={C.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
        </div>
        <div style={{ fontSize: 12.5, color: C.ink3 }}>
          {filteredProjects.length} projects total
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Empty msg="No projects found." />
      ) : (
        <Panel pad={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
              <thead>
                <tr>
                  <th style={th}>Project</th>
                  <th style={th}>Client</th>
                  <th style={th}>PM</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Resources</th>
                  <th style={{ ...th, width: 120 }}>Completion</th>
                  <th style={{ ...th, textAlign: "right" }}>Revenue</th>
                  <th style={{ ...th, textAlign: "right" }}>Profit</th>
                  <th style={{ ...th, textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(p => (
                  <ProjectRow 
                    key={p.id} 
                    p={p} 
                    finance={finance} 
                    people={people} 
                    timesheets={timesheets} 
                    isExpanded={expandedId === p.id}
                    onToggleExpand={() => toggleExpand(p.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
