import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Empty, Tag, Modal, Panel, btnGhost, btnPrimary, inputStyle } from '../common/UI';

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
  err: "#A23B3B"
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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ApprovalRow({ t, empName, projName, onApprove, onReject, onExport }) {
  const [open, setOpen] = useState(false);

  // Calculate total hours logged in this timesheet
  const weekTotal = Object.keys(t.entries).reduce((sum, pid) => {
    return sum + t.entries[pid].reduce((a, e) => a + (e ? (e.h || 0) : 0), 0);
  }, 0);

  // Collect all project entries that have hours logged
  const activeEntries = [];
  Object.keys(t.entries).forEach(pid => {
    t.entries[pid].forEach((dayLog, dayIdx) => {
      if (dayLog && dayLog.h > 0) {
        activeEntries.push({
          project: pid,
          projectName: projName(pid),
          day: DAYS[dayIdx],
          hours: dayLog.h,
          desc: dayLog.d
        });
      }
    });
  });

  return (
    <>
      <tr className="row">
        <td style={{ ...td, color: C.ink, fontWeight: 500 }}>
          {empName(t.employeeId)}
          <div style={{ fontSize: 11, color: C.ink3, fontWeight: 400 }}>{t.weekLabel}</div>
        </td>
        <td style={td}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Object.keys(t.entries).map(pid => (
              <span key={pid} style={{ fontSize: 12.5, color: C.ink }}>
                {projName(pid)}
              </span>
            ))}
          </div>
        </td>
        <td className="num" style={{ ...td, textAlign: "right", color: C.ink, fontWeight: 500 }}>
          {weekTotal}h
        </td>
        <td style={td}>
          <Tag s={t.status} strong />
        </td>
        <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
          <button
            title="Export Timesheet"
            className="ghost"
            onClick={() => onExport({ id: t.employeeId, name: empName(t.employeeId) })}
            style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 8 }}
          >
            <Icon n="download" size={13} color={C.ink2} />
          </button>
          <button 
            className="lnk" 
            onClick={() => setOpen(!open)} 
            style={{ border: "none", background: "none", color: C.accent, fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}
          >
            Review <Icon n={open ? "down" : "right"} size={13} color={C.accent} />
          </button>
        </td>
      </tr>
      
      {open && (
        <tr className="fade-in">
          <td colSpan={5} style={{ padding: "0 12px 14px", borderBottom: `1px solid ${C.line}`, background: "#FBFBF9" }}>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "12px 14px", background: C.surface, marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  Logged Hours & Daily Work Descriptions
                </div>
                <button
                  className="ghost"
                  style={{ ...btnGhost, padding: "3px 8px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                  onClick={() => onExport({ id: t.employeeId, name: empName(t.employeeId) })}
                >
                  <Icon n="download" size={11} color={C.ink2} /> Export Month
                </button>
              </div>
              
              {activeEntries.length === 0 ? (
                <Empty msg="No hours were logged in this draft." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {activeEntries.map((e, idx) => (
                    <div key={idx} style={{ padding: "8px 10px", borderBottom: idx < activeEntries.length - 1 ? `1px solid ${C.line}` : "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: C.ink }}>{e.projectName} · {e.day}</span>
                        <span className="num" style={{ fontWeight: 600, color: C.accent }}>{e.hours}h</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.4, fontStyle: "italic" }}>
                        "{e.desc || "No description provided."}"
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {t.status === "Rejected" && t.comment && (
                <div style={{ marginBottom: 12, padding: "8px 10px", background: "#FBF1F0", border: `1px solid ${C.err}`, borderRadius: 4, fontSize: 12.5, color: C.err }}>
                  <strong>Your comment (changes requested):</strong> {t.comment}
                </div>
              )}

              {t.status === "Submitted" && (
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button className="demo" style={{ ...btnGhost, color: C.err, borderColor: C.line }} onClick={() => onReject(t.id)}>
                    Request changes
                  </button>
                  <button className="primary" style={btnPrimary} onClick={() => onApprove(t.id)}>
                    Approve timesheet
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Approvals({ showToast }) {
  const { timesheets, people, projects, currentUser, approveTimesheet, rejectTimesheet } = useDatabase();
  const [filterStatus, setFilterStatus] = useState("All");
  const [commentModal, setCommentModal] = useState(null); // timesheetId to reject
  const [commentText, setCommentText] = useState("");
  const [exportEmployee, setExportEmployee] = useState(null); // 'all' | employee_object | null
  const [exportMonth, setExportMonth] = useState("June 2026");

  const handleExportTimesheets = () => {
    const monthMap = {
      "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
      "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };
    const [monthStr, yearStr] = exportMonth.split(" ");
    const targetMonth = monthMap[monthStr];
    const targetYear = parseInt(yearStr, 10);

    const getEmpName = (empId) => people.find(p => p.id === empId)?.name || empId;
    const getEmpIdStr = (empId) => people.find(p => p.id === empId)?.empId || "";
    const getProjName = (projId) => projects.find(p => p.id === projId)?.name || projId;
    
    // Filter projects managed by this PM
    const pmProjectIds = projects.filter(p => p.pmId === currentUser?.id || p.pm === currentUser?.name).map(p => p.id);
    
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const csvRows = [
      ["Employee ID", "Employee Name", "Project Name", "Date", "Day", "Hours Logged", "Work Description", "Timesheet Status"]
    ];

    timesheets.forEach(ts => {
      if (exportEmployee !== "all" && ts.employeeId !== exportEmployee.id) return;
      Object.keys(ts.entries).forEach(projId => {
        // Only include if managed by this PM
        if (pmProjectIds.includes(projId)) {
          ts.entries[projId].forEach((dayLog, dayIdx) => {
            if (dayLog && dayLog.h > 0) {
              const entryDate = new Date("2026-06-24");
              entryDate.setDate(entryDate.getDate() + ts.weekIdx * 7 + dayIdx);
              
              if (entryDate.getMonth() === targetMonth && entryDate.getFullYear() === targetYear) {
                const formattedDate = entryDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                csvRows.push([
                  getEmpIdStr(ts.employeeId),
                  getEmpName(ts.employeeId),
                  getProjName(projId),
                  formattedDate,
                  DAYS[dayIdx],
                  dayLog.h.toString(),
                  (dayLog.d || "").replace(/"/g, '""'),
                  ts.status
                ]);
              }
            }
          });
        }
      });
    });

    if (csvRows.length === 1) {
      const displayTargetName = exportEmployee === "all" ? "any resources" : exportEmployee.name;
      showToast(`No timesheet entries found for ${displayTargetName} in ${exportMonth} under your projects`, "err");
      return;
    }

    const csvContent = "\uFEFF" + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filename = exportEmployee === "all"
      ? `timesheets_export_${exportMonth.replace(" ", "_").toLowerCase()}.csv`
      : `timesheet_${exportEmployee.id}_${exportMonth.replace(" ", "_").toLowerCase()}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    const displayTargetNameMsg = exportEmployee === "all" ? "All active resources" : exportEmployee.name;
    showToast(`Timesheets exported for ${displayTargetNameMsg} (${exportMonth})`);
    setExportEmployee(null);
  };

  const getEmpName = (empId) => {
    return people.find(p => p.id === empId)?.name || empId;
  };

  const getProjName = (projId) => {
    return projects.find(p => p.id === projId)?.name || projId;
  };

  // Filter timesheets (exclude drafts, only show Submitted, Approved, Rejected)
  const approvalsQueue = timesheets.filter(t => {
    if (t.status === "Draft") return false;
    if (filterStatus === "All") return true;
    return t.status === filterStatus;
  });

  const handleApprove = (tid) => {
    approveTimesheet(tid);
    showToast("Timesheet approved");
  };

  const handleRejectClick = (tid) => {
    setCommentModal(tid);
    setCommentText("");
  };

  const handleRejectSubmit = () => {
    if (!commentText.trim()) {
      showToast("Please provide a revision comment", "err");
      return;
    }
    rejectTimesheet(commentModal, commentText);
    showToast("Changes requested");
    setCommentModal(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filter tabs and export button container */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.line}`, paddingBottom: 2, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Submitted", "Approved", "Rejected"].map(s => {
            const active = filterStatus === s;
            const count = timesheets.filter(t => t.status === (s === "All" ? t.status : s) && t.status !== "Draft").length;
            
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
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
                {s === "Submitted" ? "Pending Approval" : s === "Rejected" ? "Changes Requested" : s} 
                <span className="num" style={{ fontSize: 11, marginLeft: 5, color: C.ink3 }}>({count})</span>
              </button>
            );
          })}
        </div>
        <button className="ghost" style={{ ...btnGhost, padding: "7px 12px", marginBottom: 3 }} onClick={() => setExportEmployee("all")}>
          <Icon n="download" size={14} color={C.ink2} /> Export Timesheets
        </button>
      </div>

      {approvalsQueue.length === 0 ? (
        <Empty msg={`No timesheets in the queue for status: ${filterStatus}`} />
      ) : (
        <Panel pad={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Resource</th>
                  <th style={th}>Allocations</th>
                  <th style={{ ...th, textAlign: "right" }}>Logged</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvalsQueue.map(t => (
                  <ApprovalRow 
                    key={t.id} 
                    t={t} 
                    empName={getEmpName} 
                    projName={getProjName} 
                    onApprove={handleApprove} 
                    onReject={handleRejectClick}
                    onExport={(emp) => setExportEmployee(emp)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Reject revision comment Modal */}
      {commentModal && (
        <Modal
          title="Request timesheet changes"
          onClose={() => setCommentModal(null)}
          footer={(
            <>
              <button className="demo" style={btnGhost} onClick={() => setCommentModal(null)}>Cancel</button>
              <button className="primary" style={{ ...btnPrimary, background: C.err }} onClick={handleRejectSubmit}>
                Request revisions
              </button>
            </>
          )}
        >
          <div style={{ fontSize: 13, color: C.ink, marginBottom: 10 }}>
            Specify the revisions needed for the resource's log:
          </div>
          <textarea
            placeholder="e.g. Tuesday hours on IPO Platform look too high. Please separate developer hours from client meetings."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            autoFocus
          />
        </Modal>
      )}

      {/* Export Monthly Timesheets Modal */}
      {exportEmployee && (
        <Modal
          title={exportEmployee === "all" ? "Export resource timesheets" : `Export timesheet: ${exportEmployee.name}`}
          onClose={() => setExportEmployee(null)}
          footer={
            <>
              <button className="demo" style={btnGhost} onClick={() => setExportEmployee(null)}>Cancel</button>
              <button className="primary" style={btnPrimary} onClick={handleExportTimesheets}>
                <Icon n="download" size={14} color="#fff" /> Export CSV
              </button>
            </>
          }
        >
          <div style={{ fontSize: 13, color: C.ink, marginBottom: 14 }}>
            Select the month to export timesheet logs for {exportEmployee === "all" ? "resources on your projects" : exportEmployee.name}:
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 6 }}>Select Month</div>
            <select
              style={inputStyle}
              value={exportMonth}
              onChange={e => setExportMonth(e.target.value)}
            >
              {["June 2026", "July 2026", "August 2026"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
