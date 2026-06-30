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

const ROLES = ["Unassigned", "Resource", "PM", "COO", "Admin", "Sales", "Finance", "HR"];
const DEPTS = ["Delivery", "Product Design", "Engineering", "Quality", "Sales", "Executive", "Operations"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Person Detail Drawer ───────────────────────────────────────────────

function PersonDetailDrawer({ p, onClose, getProjectName, timesheets }) {
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

export function EmployeeForm({ emp, onClose, onSave }) {
  const [f, setF] = useState({
    name: emp ? emp.name : "",
    empId: emp ? emp.empId : "EMP-" + (Math.floor(Math.random() * 9000) + 1000),
    designation: emp ? emp.designation : "",
    dept: emp ? emp.dept : "Delivery",
    role: emp ? emp.role : "Unassigned",
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
  const { people, addEmployee, updateEmployee, timesheets, projects, bulkAssignRoles } = useDatabase();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [activeForm, setActiveForm] = useState(null); // 'add' | employee_object_to_edit
  const [viewPerson, setViewPerson] = useState(null); // employee object
  const [showBulkAssign, setShowBulkAssign] = useState(false);

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
          <button className="primary" style={{ ...btnPrimary, padding: "7px 12px" }} onClick={() => setShowBulkAssign(true)}>
            <Icon n="users" size={14} color="#fff" /> Assign Role
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

      {/* Bulk Role Assignment Modal */}
      {showBulkAssign && (
        <BulkRoleAssignmentModal
          people={people}
          onClose={() => setShowBulkAssign(false)}
          onAssign={(empIds, newRole) => {
            bulkAssignRoles(empIds, newRole);
            showToast(`Assigned role ${newRole} to ${empIds.length} employees`);
            setShowBulkAssign(false);
          }}
        />
      )}
    </div>
  );
}

// ── Bulk Role Assignment Modal Component ───────────────────────────────

function BulkRoleAssignmentModal({ people, onClose, onAssign }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All departments");
  const [designationFilter, setDesignationFilter] = useState("All designations");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const depts = ["All departments", ...Array.from(new Set(people.map(p => p.dept)))];
  const designations = ["All designations", ...Array.from(new Set(people.map(p => p.designation).filter(Boolean)))];
  const assignableRoles = ["Resource", "PM", "Admin", "Sales", "Finance", "HR"];

  // Filtered employees list (only unassigned roles)
  const filteredList = people.filter(p => {
    if (p.role !== "Unassigned") return false;
    const matchesSearch = (p.name + p.empId + p.designation + p.dept).toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All departments" || p.dept === deptFilter;
    const matchesDesig = designationFilter === "All designations" || p.designation === designationFilter;
    const matchesStatus = statusFilter === "All statuses" || p.status === statusFilter;
    return matchesSearch && matchesDept && matchesDesig && matchesStatus;
  });

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredList.map(p => p.id);
    const allSelected = allFilteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setDeptFilter("All departments");
    setDesignationFilter("All designations");
    setStatusFilter("All statuses");
  };

  const handleAssignClick = () => {
    if (selectedIds.length === 0) {
      setConfirmError("No employee selected");
      return;
    }
    if (!targetRole) {
      setConfirmError("No role selected");
      return;
    }

    // Validation: Assignment to inactive employees
    const hasInactive = selectedIds.some(id => {
      const emp = people.find(p => p.id === id);
      return emp && emp.status === "Inactive";
    });
    if (hasInactive) {
      setConfirmError("Cannot assign roles to inactive employees.");
      return;
    }

    // Validation: Duplicate role assignments
    const allHaveSameRole = selectedIds.every(id => {
      const emp = people.find(p => p.id === id);
      return emp && emp.role === targetRole;
    });
    if (allHaveSameRole) {
      setConfirmError(`Selected employees are already assigned to the ${targetRole} role.`);
      return;
    }

    setConfirmError("");
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onAssign(selectedIds, targetRole);
    setShowConfirm(false);
  };

  return (
    <Modal title="Bulk Role Assignment" onClose={onClose} w={960}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        
        {/* Filters Header */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", background: "#FBFBF9", padding: 12, borderRadius: 8, border: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 8px", background: C.surface, flex: 1, minWidth: 160 }}>
            <Icon n="search" size={13} color={C.ink3} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name, ID..." 
              style={{ border: "none", outline: "none", fontSize: 12, color: C.ink, background: "transparent", width: "100%" }} 
            />
          </div>
          
          <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 8px", fontSize: 12, background: C.surface }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            {depts.map(d => <option key={d}>{d}</option>)}
          </select>

          <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 8px", fontSize: 12, background: C.surface }} value={designationFilter} onChange={e => setDesignationFilter(e.target.value)}>
            {designations.map(d => <option key={d}>{d}</option>)}
          </select>



          <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "5px 8px", fontSize: 12, background: C.surface }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="ghost" style={{ ...btnGhost, padding: "5px 10px", fontSize: 12 }} onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Directory Table inside Modal */}
        <div style={{ maxHeight: 360, overflowY: "auto", border: `1px solid ${C.line}`, borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FBFBF9" }}>
              <tr>
                <th style={{ ...th, width: 40, textAlign: "center" }}>
                  <input 
                    type="checkbox" 
                    checked={filteredList.length > 0 && filteredList.every(p => selectedIds.includes(p.id))} 
                    onChange={handleSelectAll} 
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={th}>Employee ID</th>
                <th style={th}>Employee Name</th>
                <th style={th}>Department</th>
                <th style={th}>Designation</th>
                <th style={th}>Current Role</th>
                <th style={th}>Reporting Manager</th>
                <th style={th}>Employment Status</th>
                <th style={th}>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 24, textAlign: "center" }}><Empty msg="No employees found." /></td>
                </tr>
              ) : (
                filteredList.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  const initials = p.name.split(" ").map(n => n[0]).join("");
                  
                  return (
                    <tr 
                      key={p.id} 
                      className="row" 
                      style={{ 
                        background: isSelected ? C.accentSoft : "none", 
                        opacity: p.status === "Inactive" ? 0.6 : 1,
                        borderBottom: `1px solid ${C.line}`,
                        cursor: "pointer"
                      }}
                      onClick={() => handleSelectRow(p.id)}
                    >
                      <td style={{ ...td, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleSelectRow(p.id)} 
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td style={{ ...td, fontWeight: 500 }} className="num">{p.empId}</td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 99, background: C.lineStrong, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: C.ink }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight: 500, color: C.ink }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={td}>{p.dept}</td>
                      <td style={td}>{p.designation}</td>
                      <td style={td}><Tag s={p.role} strong /></td>
                      <td style={td}>{p.manager}</td>
                      <td style={td}><Tag s={p.status} /></td>
                      <td style={td} className="num">{p.joined}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Validation error display */}
        {confirmError && (
          <div style={{ padding: "8px 12px", background: C.err + "15", border: `1px solid ${C.err}`, color: C.err, borderRadius: 6, fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon n="alert" size={14} color={C.err} />
            <span>{confirmError}</span>
          </div>
        )}

        {/* Footer actions for Bulk Assignment */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.line}`, paddingTop: 12, marginTop: 4 }}>
          <div style={{ fontSize: 13, color: C.ink2 }}>
            <strong className="num" style={{ color: C.ink }}>{selectedIds.length}</strong> employees selected
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12.5, color: C.ink2 }}>Target Role:</span>
            <select 
              style={{ ...inputStyle, width: 160, padding: "6px 10px", fontSize: 12.5 }}
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            >
              <option value="">Choose Role...</option>
              {assignableRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="primary" style={btnPrimary} onClick={handleAssignClick} disabled={selectedIds.length === 0 || !targetRole}>
              Assign Selected Roles
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <Modal 
          title="Confirm Role Assignment" 
          onClose={() => setShowConfirm(false)}
          footer={
            <>
              <button className="demo" style={btnGhost} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="primary" style={btnPrimary} onClick={handleConfirmSubmit}>
                Confirm Assignment
              </button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon n="alert" size={20} color={C.warn} style={{ marginTop: 2 }} />
              <div>
                <h4 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: C.ink }}>Bulk Update Permissions</h4>
                <p style={{ margin: 0, fontSize: 13, color: C.ink2, lineHeight: 1.4 }}>
                  You are assigning the role of <strong>{targetRole}</strong> to <strong>{selectedIds.length}</strong> selected employees.
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 12.5, color: C.ink3, lineHeight: 1.4 }}>
                  This will update their access control policies and permissions immediately.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
