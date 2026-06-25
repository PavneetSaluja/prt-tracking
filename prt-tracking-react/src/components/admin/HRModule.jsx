import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Tag, Dot, Empty, Modal, Drawer, btnGhost, btnPrimary, inputStyle } from '../common/UI';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  ok: "#3F7A52",
  err: "#A23B3B",
  warn: "#9A6B1E"
};

const th = {
  fontSize: 11,
  fontWeight: 600,
  color: C.ink3,
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  whiteSpace: "nowrap"
};

const td = {
  fontSize: 13,
  color: C.ink2,
  padding: "11px 12px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  verticalAlign: "middle"
};

// Form Field helper
const HRField = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>{label}</div>
    {children}
  </div>
);

export default function HRModule({ showToast }) {
  const { 
    people, 
    leaves, 
    approveLeave, 
    rejectLeave, 
    updateOnboardingChecklist, 
    updatePerformanceRating, 
    updateEmployeeHRDetails, 
    currentUser 
  } = useDatabase();

  const [activeTab, setActiveTab] = useState("Employees");
  const [q, setQ] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [rejectLeaveId, setRejectLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const hasSalaryView = currentUser.role === "Admin" || currentUser.role === "HR";

  // Filtered employees list
  const filteredEmployees = people.filter(p => {
    const searchStr = (p.name + p.empId + p.dept + p.designation).toLowerCase();
    return searchStr.includes(q.toLowerCase());
  });

  const handleSaveHRInfo = (e) => {
    e.preventDefault();
    const data = {
      leaveBalance: parseInt(editEmp.leaveBalance) || 0,
      leavesTaken: parseInt(editEmp.leavesTaken) || 0,
      performanceRating: parseFloat(editEmp.performanceRating) || 0
    };
    if (hasSalaryView) {
      data.ctc = parseInt(editEmp.ctc) || 0;
    }
    updateEmployeeHRDetails(editEmp.id, data);
    showToast(`HR details updated for ${editEmp.name}`);
    setEditEmp(null);
  };

  const handleRejectSubmit = () => {
    if (rejectLeaveId) {
      rejectLeave(rejectLeaveId, rejectReason);
      setRejectLeaveId(null);
      setRejectReason("");
      showToast("Leave request rejected", "warn");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      {/* Subtab Navigation */}
      <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.line}`, paddingBottom: 0, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {["Employees", "Leave Requests", "Onboarding Pipeline"].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "8px 16px",
                border: "none",
                background: "none",
                borderBottom: activeTab === t ? `2px solid ${C.accent}` : "2px solid transparent",
                fontWeight: 600,
                color: activeTab === t ? C.accent : C.ink2,
                cursor: "pointer",
                fontSize: 14,
                outline: "none",
                marginBottom: -1
              }}
            >
              {t}
            </button>
          ))}
        </div>
        
        {activeTab === "Employees" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 10px", background: C.surface, minWidth: 220 }}>
            <Icon n="search" size={13} color={C.ink3} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search records..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
          </div>
        )}
      </div>

      {/* ── TAB 1: Employees HR Records ──────────────────────────────────── */}
      {activeTab === "Employees" && (
        <Panel pad={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Employee</th>
                  <th style={th}>Department</th>
                  <th style={th}>Designation</th>
                  <th style={th}>Onboarding</th>
                  <th style={th}>Leaves (Taken / Bal)</th>
                  <th style={th}>Rating</th>
                  {hasSalaryView && <th style={{ ...th, textAlign: "right" }}>CTC (Annual)</th>}
                  <th style={{ ...th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(p => (
                  <tr key={p.id} className="row">
                    <td style={{ ...td, color: C.ink, fontWeight: 500 }}>
                      {p.name}
                      <div style={{ fontSize: 11, color: C.ink3 }} className="num">{p.empId} · joined {p.joined}</div>
                    </td>
                    <td style={td}>{p.dept}</td>
                    <td style={td}>{p.designation}</td>
                    <td style={td}>
                      <Tag s={p.onboardingStatus === "Complete" ? "Approved" : "Pending"} strong />
                      <span style={{ fontSize: 11, color: C.ink3, marginLeft: 6 }}>{p.onboardingStatus || "Pending"}</span>
                    </td>
                    <td style={td} className="num">{p.leavesTaken || 0} / {p.leaveBalance || 12} days</td>
                    <td style={td} className="num">★ {p.performanceRating != null ? p.performanceRating.toFixed(1) : "—"}</td>
                    {hasSalaryView && (
                      <td style={{ ...td, textAlign: "right", color: C.ink }} className="num">
                        ₹{(p.ctc || 0).toLocaleString("en-IN")}
                      </td>
                    )}
                    <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        title="View Details"
                        className="ghost"
                        onClick={() => setSelectedEmp(p)}
                        style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}
                      >
                        <Icon n="eye" size={13} color={C.ink2} />
                      </button>
                      <button
                        title="Edit HR Details"
                        className="ghost"
                        onClick={() => setEditEmp({ ...p })}
                        style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer" }}
                      >
                        <Icon n="edit" size={13} color={C.ink2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* ── TAB 2: Leave Requests ────────────────────────────────────────── */}
      {activeTab === "Leave Requests" && (
        <Panel pad={false}>
          {leaves.length === 0 ? (
            <div style={{ padding: 24 }}><Empty msg="No leave requests submitted." /></div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Employee</th>
                    <th style={th}>Timeline</th>
                    <th style={{ ...th, textAlign: "right" }}>Days</th>
                    <th style={th}>Type</th>
                    <th style={th}>Reason</th>
                    <th style={th}>Status</th>
                    <th style={{ ...th, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id} className="row">
                      <td style={{ ...td, color: C.ink, fontWeight: 500 }}>{l.name}</td>
                      <td style={td} className="num">{l.start} → {l.end}</td>
                      <td style={{ ...td, textAlign: "right" }} className="num">{l.days}</td>
                      <td style={td}><Tag s={l.type === "Sick Leave" ? "Rejected" : "Submitted"} strong /> <span style={{ fontSize: 11, color: C.ink3 }}>{l.type}</span></td>
                      <td style={{ ...td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
                      <td style={td}>
                        <Tag s={l.status} strong />
                        {l.status === "Rejected" && l.comment && (
                          <div style={{ fontSize: 10, color: C.err }}>"{l.comment}"</div>
                        )}
                      </td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                        {l.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => approveLeave(l.id)}
                              title="Approve Leave"
                              className="ghost"
                              style={{ border: `1px solid ${C.line}`, background: C.surface, color: C.ok, borderRadius: 6, padding: "5px 7px", cursor: "pointer", marginRight: 6 }}
                            >
                              <Icon n="check" size={13} color={C.ok} /> Approve
                            </button>
                            <button
                              onClick={() => setRejectLeaveId(l.id)}
                              title="Reject Leave"
                              className="ghost"
                              style={{ border: `1px solid ${C.line}`, background: C.surface, color: C.err, borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}
                            >
                              <Icon n="x" size={13} color={C.err} /> Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: C.ink3 }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}

      {/* ── TAB 3: Onboarding Pipeline ───────────────────────────────────── */}
      {activeTab === "Onboarding Pipeline" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="fade-in">
          {["Offered", "In Progress", "Complete"].map(stage => {
            const stageList = people.filter(p => {
              const status = p.onboardingStatus || "Offered";
              return status === stage;
            });
            
            return (
              <Panel key={stage} title={`${stage} (${stageList.length})`} pad={true}>
                {stageList.length === 0 ? (
                  <div style={{ padding: "20px 0" }}><Empty msg={`No hires in ${stage}`} /></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {stageList.map(emp => {
                      const checklist = emp.onboardingChecklist || { bgCheck: false, contractSigned: false, hardwareIssued: false, bankDetailsAdded: false };
                      const totalDone = Object.values(checklist).filter(Boolean).length;
                      
                      return (
                        <div key={emp.id} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, background: C.surface }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                            <div style={{ fontWeight: 600, color: C.ink, fontSize: 13 }}>{emp.name}</div>
                            <span className="num" style={{ fontSize: 11, color: C.ink3 }}>{emp.dept}</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 8 }}>{emp.designation}</div>
                          
                          {/* Checklist checkboxes */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: `1px solid ${C.line}`, paddingTop: 8, marginTop: 8 }}>
                            {[
                              ["bgCheck", "Background Verification"],
                              ["contractSigned", "Signed SOW & Contract"],
                              ["hardwareIssued", "Hardware/Laptop Shipped"],
                              ["bankDetailsAdded", "Bank Account Setup"]
                            ].map(([key, label]) => (
                              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: checklist[key] ? C.ink : C.ink3, cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={!!checklist[key]}
                                  onChange={(e) => {
                                    const updated = { ...checklist, [key]: e.target.checked };
                                    updateOnboardingChecklist(emp.id, updated);
                                    showToast(`Updated checklist for ${emp.name}`);
                                  }}
                                />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                          
                          {/* Progress indicator */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: C.ink3, marginTop: 10 }}>
                            <span>Tasks completed</span>
                            <span className="num" style={{ fontWeight: 600, color: totalDone === 4 ? C.ok : C.accent }}>{totalDone} / 4</span>
                          </div>
                          <div style={{ height: 3, background: C.line, borderRadius: 99, overflow: "hidden", marginTop: 4 }}>
                            <div style={{ height: "100%", width: `${(totalDone / 4) * 100}%`, background: totalDone === 4 ? C.ok : C.accent }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Rejection Comment ────────────────────────────────────── */}
      {rejectLeaveId && (
        <Modal
          title="Reject Leave Request"
          onClose={() => { setRejectLeaveId(null); setRejectReason(""); }}
          footer={
            <>
              <button className="demo" style={btnGhost} onClick={() => { setRejectLeaveId(null); setRejectReason(""); }}>Cancel</button>
              <button className="primary" style={{ ...btnPrimary, background: C.err }} onClick={handleRejectSubmit}>
                Confirm Rejection
              </button>
            </>
          }
        >
          <div style={{ fontSize: 13, color: C.ink2, marginBottom: 8 }}>Please state the reason for rejecting this leave application:</div>
          <textarea
            style={{ ...inputStyle, minHeight: 64, resize: "none" }}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="e.g. Peak project delivery timelines require resource availability."
          />
        </Modal>
      )}

      {/* ── DRAWER: Employee Details ─────────────────────────────────────── */}
      {selectedEmp && (
        <Drawer width={440} title={`HR Record · ${selectedEmp.name}`} onClose={() => setSelectedEmp(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-in">
            <div>
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Employee Overview</div>
              <dl style={{ margin: 0 }}>
                {[
                  ["Employee ID", selectedEmp.empId],
                  ["Designation", selectedEmp.designation],
                  ["Department", selectedEmp.dept],
                  ["Role", selectedEmp.role],
                  ["Email ID", selectedEmp.email],
                  ["Phone Number", selectedEmp.phone || "—"],
                  ["Date of Joining", selectedEmp.joined],
                  ["Manager", selectedEmp.manager]
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                    <dt style={{ color: C.ink3 }}>{k}</dt>
                    <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Leave Balances</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: C.ink3, textTransform: "uppercase" }}>Leaves Taken</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 4 }}>{selectedEmp.leavesTaken || 0} days</div>
                </div>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: C.ink3, textTransform: "uppercase" }}>Leave Balance</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 600, color: C.ok, marginTop: 4 }}>{selectedEmp.leaveBalance || 12} days</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Performance Metrics</div>
              <dl style={{ margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                  <dt style={{ color: C.ink3 }}>Rating</dt>
                  <dd style={{ margin: 0, color: C.warn, fontWeight: 600 }}>★ {selectedEmp.performanceRating != null ? selectedEmp.performanceRating.toFixed(1) : "—"} / 5.0</dd>
                </div>
                {hasSalaryView && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                    <dt style={{ color: C.ink3 }}>CTC (Annual Salary)</dt>
                    <dd style={{ margin: 0, color: C.ink, fontWeight: 600 }} className="num">₹{(selectedEmp.ctc || 0).toLocaleString("en-IN")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Drawer>
      )}

      {/* ── MODAL: Edit HR Details Form ──────────────────────────────────── */}
      {editEmp && (
        <Modal
          title={`Edit HR Details · ${editEmp.name}`}
          onClose={() => setEditEmp(null)}
          footer={
            <>
              <button className="demo" style={btnGhost} onClick={() => setEditEmp(null)}>Cancel</button>
              <button className="primary" style={btnPrimary} onClick={handleSaveHRInfo}>
                Save HR Info
              </button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <HRField label="Leaves Taken (days)">
                  <input style={inputStyle} type="number" value={editEmp.leavesTaken} onChange={e => setEditEmp({ ...editEmp, leavesTaken: parseInt(e.target.value) || 0 })} />
                </HRField>
              </div>
              <div style={{ flex: 1 }}>
                <HRField label="Leave Balance (days)">
                  <input style={inputStyle} type="number" value={editEmp.leaveBalance} onChange={e => setEditEmp({ ...editEmp, leaveBalance: parseInt(e.target.value) || 0 })} />
                </HRField>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <HRField label="Performance Rating (0.0 - 5.0)">
                  <input style={inputStyle} type="number" step="0.1" value={editEmp.performanceRating} onChange={e => setEditEmp({ ...editEmp, performanceRating: parseFloat(e.target.value) || 0 })} />
                </HRField>
              </div>
              {hasSalaryView && (
                <div style={{ flex: 1 }}>
                  <HRField label="CTC (Annual Salary in INR)">
                    <input style={inputStyle} type="number" value={editEmp.ctc} onChange={e => setEditEmp({ ...editEmp, ctc: parseInt(e.target.value) || 0 })} />
                  </HRField>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
