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
  accentSoft: "#EDF1F6",
  ok: "#3F7A52",
  err: "#A23B3B",
  warn: "#9A6B1E"
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

const ROLES = ["Resource", "PM", "COO", "Admin", "Sales"];
const DEPTS = ["Delivery", "Product Design", "Engineering", "Quality", "Sales", "Executive", "Operations"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Person Detail Drawer ───────────────────────────────────────────────

function PersonDetailDrawer({ p, onClose, getProjectName, timesheets, onExport }) {
  const isRes = p.role === "Resource";
  
  // Aggregate work logs dynamically from timesheets
  const userTimesheets = timesheets.filter(t => t.employeeId === p.id);
  const workLogs = [];
  
  userTimesheets.forEach(ts => {
    Object.keys(ts.entries).forEach(pid => {
      ts.entries[pid].forEach((dayLog, idx) => {
        if (dayLog && dayLog.h > 0) {
          workLogs.push({
            id: `${ts.id}_${pid}_${idx}`,
            weekLabel: ts.weekLabel,
            day: DAYS[idx],
            projName: getProjectName(pid),
            hours: dayLog.h,
            desc: dayLog.d
          });
        }
      });
    });
  });

  const info = [
    ["Role Profile", p.role],
    ["Department", p.dept],
    ["Designation", p.designation],
    ["Reporting Manager", p.manager],
    ["Current Project", p.project || "—"],
    ["Last Engagement", p.last || "—"],
    ["Joined Date", p.joined],
    ["Account Status", p.status]
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.18)", zIndex: 80 }} />
      <aside 
        style={{ 
          position: "fixed", 
          top: 0, 
          right: 0, 
          height: "100%", 
          width: 440, 
          maxWidth: "94%", 
          background: C.surface, 
          borderLeft: `1px solid ${C.line}`, 
          zIndex: 90, 
          display: "flex", 
          flexDirection: "column" 
        }} 
        className="fade-in"
      >
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{p.name}</div>
            <div style={{ fontSize: 11.5, color: C.ink3 }} className="num">{p.empId}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="ghost" onClick={() => onExport(p)} title="Export Timesheet" style={{ border: "none", background: "none", borderRadius: 6, padding: 5, cursor: "pointer", display: "flex" }}>
              <Icon n="download" size={15} color={C.ink2} />
            </button>
            <button className="ghost" onClick={onClose} style={{ border: "none", background: "none", borderRadius: 6, padding: 5, cursor: "pointer", display: "flex" }}>
              <Icon n="x" size={16} color={C.ink2} />
            </button>
          </div>
        </div>

        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Overview
          </div>
          <dl style={{ margin: "0 0 20px" }}>
            {info.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, textAlign: "right", fontWeight: 500 }}>
                  {k === "Account Status" ? <Tag s={v} /> : v}
                </dd>
              </div>
            ))}
          </dl>

          {isRes && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Utilization</div>
                  <div style={{ fontSize: 13.5, color: p.util > 100 ? C.warn : C.ok, marginTop: 3, fontWeight: 600 }} className="num">
                    {p.util || 0}% allocated
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
                Work Log Audit Trail ({workLogs.length})
              </div>
              
              {workLogs.length === 0 ? (
                <Empty msg="No logs submitted by this employee yet." />
              ) : (
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden" }}>
                  {workLogs.map((log, idx) => (
                    <div key={log.id} style={{ padding: "11px 13px", borderBottom: idx < workLogs.length - 1 ? `1px solid ${C.line}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{log.projName} · {log.day}</span>
                        <span className="num" style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{log.hours}h</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.4 }}>
                        "{log.desc || "No description provided."}"
                      </div>
                      <div style={{ fontSize: 10, color: C.ink3, marginTop: 4 }}>
                        {log.weekLabel}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Employee Add/Edit Form Modal ───────────────────────────────────────

function EmployeeForm({ emp, onClose, onSave }) {
  const [f, setF] = useState({
    name: emp ? emp.name : "",
    empId: emp ? emp.empId : "EMP-" + (Math.floor(Math.random() * 9000) + 1000),
    designation: emp ? emp.designation : "",
    dept: emp ? emp.dept : "Delivery",
    role: emp ? emp.role : "Resource",
    email: emp ? emp.email : "",
    manager: emp ? emp.manager : "Sarah Jenkins",
    capacity: emp ? emp.capacity : 40,
    status: emp ? emp.status : "Active"
  });

  const [skillsStr, setSkillsStr] = useState(emp ? (emp.skills || []).join(", ") : "");

  const handleSave = () => {
    if (!f.name.trim() || !f.email.trim()) return;
    const skills = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
    onSave({
      ...f,
      skills
    });
  };

  return (
    <Modal
      title={emp ? `Edit Employee · ${emp.name}` : "Add New Employee"}
      onClose={onClose}
      footer={(
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button className="primary" style={btnPrimary} onClick={handleSave} disabled={!f.name.trim() || !f.email.trim()}>
            Save Employee
          </button>
        </>
      )}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Employee Name *</div>
            <input style={inputStyle} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} autoFocus />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Employee ID</div>
            <input style={inputStyle} value={f.empId} onChange={e => setF({ ...f, empId: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Email Address *</div>
            <input style={inputStyle} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Designation</div>
            <input style={inputStyle} value={f.designation} onChange={e => setF({ ...f, designation: e.target.value })} placeholder="e.g. Senior Designer" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Department</div>
            <select style={inputStyle} value={f.dept} onChange={e => setF({ ...f, dept: e.target.value })}>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Role</div>
            <select style={inputStyle} value={f.role} onChange={e => setF({ ...f, role: e.target.value })}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Reporting Manager</div>
            <input style={inputStyle} value={f.manager} onChange={e => setF({ ...f, manager: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Weekly Capacity (hrs)</div>
            <input style={inputStyle} type="number" value={f.capacity} onChange={e => setF({ ...f, capacity: parseInt(e.target.value) || 40 })} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Skills (comma separated)</div>
          <input style={inputStyle} value={skillsStr} onChange={e => setSkillsStr(e.target.value)} placeholder="e.g. Figma, React, Prototyping" />
        </div>
      </div>
    </Modal>
  );
}

// ── People Manager ─────────────────────────────────────────────────────

export default function People({ showToast }) {
  const { people, addEmployee, updateEmployee, timesheets, projects } = useDatabase();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [activeForm, setActiveForm] = useState(null); // 'add' | employee_object_to_edit
  const [viewPerson, setViewPerson] = useState(null); // employee object
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
    
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const csvRows = [
      ["Employee ID", "Employee Name", "Project Name", "Date", "Day", "Hours Logged", "Work Description", "Timesheet Status"]
    ];

    timesheets.forEach(ts => {
      if (exportEmployee !== "all" && ts.employeeId !== exportEmployee.id) return;
      Object.keys(ts.entries).forEach(projId => {
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
      });
    });

    if (csvRows.length === 1) {
      const displayTargetName = exportEmployee === "all" ? "any resources" : exportEmployee.name;
      showToast(`No timesheet entries found for ${displayTargetName} in ${exportMonth}`, "err");
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

  const depts = ["All departments", ...Array.from(new Set(people.map(p => p.dept)))];
  
  const getProjectName = (projId) => {
    return projects.find(p => p.id === projId)?.name || projId;
  };

  // Check utilization dynamically
  const getResourceUtil = (resId) => {
    let sum = 0;
    projects.forEach(p => {
      const match = p.resources.find(r => r.id === resId);
      if (match) sum += match.pct;
    });
    return sum;
  };

  const availLabel = (u) => {
    if (u === 0) return "Available";
    if (u < 100) return "Partially Allocated";
    if (u === 100) return "Fully Allocated";
    return "Overallocated";
  };

  const availColor = (u) => {
    if (u === 0) return C.ok;
    if (u < 100) return C.accent;
    if (u === 100) return C.lineStrong;
    return C.warn;
  };

  const list = people.filter(p => {
    const matchesDept = dept === "All departments" || p.dept === dept;
    const matchesRole = role === "All roles" || p.role === role;
    const matchesStatus = status === "All statuses" || p.status === status;
    const matchesSearch = (p.name + p.id + p.designation + p.dept + p.role).toLowerCase().includes(q.toLowerCase());
    return matchesDept && matchesRole && matchesStatus && matchesSearch;
  });

  const handleFormSave = (data) => {
    if (activeForm === 'add') {
      addEmployee({
        id: "emp_" + Date.now(),
        joined: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        ...data
      });
    } else {
      updateEmployee(activeForm.id, data);
    }
    setActiveForm(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      {/* Filtering grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 200, flex: 1 }}>
          <Icon n="search" size={14} color={C.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search employee, designation, ID..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
        </div>
        <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }} value={dept} onChange={e => setDept(e.target.value)}>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }} value={role} onChange={e => setRole(e.target.value)}>
          <option value="All roles">All roles</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All statuses">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
          <span style={{ fontSize: 12, color: C.ink3 }}>{list.length} displayed</span>
          <button className="ghost" style={{ ...btnGhost, padding: "7px 12px" }} onClick={() => setExportEmployee("all")}>
            <Icon n="download" size={14} color={C.ink2} /> Export Timesheets
          </button>
          <button className="primary" style={{ ...btnPrimary, padding: "7px 12px" }} onClick={() => setActiveForm('add')}>
            <Icon n="plus" size={14} color="#fff" /> Add employee
          </button>
        </div>
      </div>

      {/* Directory Table */}
      {list.length === 0 ? (
        <Empty msg="No employees match your search criteria." />
      ) : (
        <Panel pad={false}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={th}>Employee</th>
                  <th style={th}>Dept</th>
                  <th style={th}>Designation</th>
                  <th style={th}>Role</th>
                  <th style={th}>Availability</th>
                  <th style={th}>Manager</th>
                  <th style={th}>Account Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => {
                  const isResource = p.role === "Resource";
                  const utilPct = getResourceUtil(p.id);
                  
                  return (
                    <tr key={p.id} className="row" style={{ opacity: p.status === "Inactive" ? 0.55 : 1 }}>
                      <td style={{ ...td, color: C.ink, fontWeight: 500 }}>
                        {p.name}
                        <div style={{ fontSize: 11, color: C.ink3, fontWeight: 400 }} className="num">
                          {p.empId} · joined {p.joined}
                        </div>
                      </td>
                      <td style={td}>{p.dept}</td>
                      <td style={td}>{p.designation}</td>
                      <td style={td}><Tag s={p.role} strong /></td>
                      <td style={td}>
                        {isResource ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: availColor(utilPct) }}>
                            <Dot c={availColor(utilPct)} />
                            {availLabel(utilPct)} <span className="num" style={{ color: C.ink3 }}>· {utilPct}%</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: C.ink3 }}>—</span>
                        )}
                      </td>
                      <td style={td}>{p.manager}</td>
                      <td style={td}><Tag s={p.status} /></td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }} onClick={e => e.stopPropagation()}>
                        <button title="View Detail" className="ghost" onClick={() => setViewPerson(p)} style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}>
                          <Icon n="eye" size={13} color={C.ink2} />
                        </button>
                        <button title="Export Timesheet" className="ghost" onClick={() => setExportEmployee(p)} style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}>
                          <Icon n="download" size={13} color={C.ink2} />
                        </button>
                        <button title="Edit Employee" className="ghost" onClick={() => setActiveForm(p)} style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}>
                          <Icon n="edit" size={13} color={C.ink2} />
                        </button>
                        <button 
                          title={p.status === "Active" ? "Deactivate" : "Activate"} 
                          className="ghost" 
                          onClick={() => {
                            const newStatus = p.status === "Active" ? "Inactive" : "Active";
                            updateEmployee(p.id, { status: newStatus });
                            showToast(newStatus === "Active" ? "Employee activated" : "Employee deactivated");
                          }} 
                          style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer" }}
                        >
                          <Icon n="ban" size={13} color={p.status === "Active" ? C.err : C.ok} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Details drawer audit */}
      {viewPerson && (
        <PersonDetailDrawer 
          p={viewPerson} 
          onClose={() => setViewPerson(null)} 
          getProjectName={getProjectName}
          timesheets={timesheets}
          onExport={(emp) => setExportEmployee(emp)}
        />
      )}

      {/* Add / Edit Form Modal */}
      {activeForm && (
        <EmployeeForm 
          emp={activeForm === 'add' ? null : activeForm} 
          onClose={() => setActiveForm(null)}
          onSave={handleFormSave}
        />
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
            Select the month to export timesheet logs for {exportEmployee === "all" ? "all active resources" : exportEmployee.name}:
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
