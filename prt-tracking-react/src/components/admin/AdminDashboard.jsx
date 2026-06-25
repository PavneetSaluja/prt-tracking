import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, useToast, Tag, Empty, btnGhost } from '../common/UI';
import Business from './Business';
import PMs from './PMs';
import People from './People';
import Finance, { inr, inrC } from './Finance';
import Projects from './Projects';
import Clients from './Clients';
import Outsourced from './Outsourced';
import HRModule from './HRModule';

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  line: "#E7E6E0",
  accent: "#38618C",
  ok: "#3F7A52",
  accentSoft: "#EDF1F6",
  lineStrong: "#D8D7CF",
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

const TABS = [
  ["Dashboard", "bars", "viewDashboard"],
  ["User Management", "users", "viewUsers"],
  ["Projects", "folder", "viewProjects"],
  ["Clients", "building", "viewProjects"],
  ["Vendor Resources", "globe", "viewHRModule"],
  ["HR Module", "users", "viewHRModule"],
  ["Finance", "wallet", "viewFinanceModule"],
  ["Salesperson", "trend", "viewIncentives"],
  ["PM Oversight", "user", "viewProjects"]
];

// ── Sparkline component ────────────────────────────────────────────────

function Spark({ pts, color = C.accent }) {
  const W = 110;
  const H = 30;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const xs = i => (i / (pts.length - 1)) * W;
  const ys = v => H - 2 - ((v - min) / ((max - min) || 1)) * (H - 4);
  const pathData = pts.map((p, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Permission matrix definitions ──────────────────────────────────────

const DEFAULT_ROLE_PERMS = {
  finance: {
    name: "Finance",
    desc: "Finance team member",
    // Dashboard
    viewDashboard: true,
    viewFinancialSummary: true,
    viewPLCharts: true,
    viewRecentFinanceEntries: true,
    // Finance
    viewFinanceModule: true,
    viewAllFinanceEntries: true,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: true,
    createFinanceEntries: true,
    deleteFinanceEntries: true,
    // HR
    viewHRModule: false,
    createEmployees: false,
    deleteEmployees: false,
    editEmployees: false,
    exportEmployees: false,
    viewEmployeeSalaryInfo: false,
    viewEmployees: true,
    // Incentives
    viewIncentives: true,
    approveRejectIncentiveCalculations: false,
    editIncentives: false,
    exportIncentives: false,
    viewAllIncentives: true,
    viewOwnIncentivesOnly: false,
    // Projects
    viewProjects: true,
    createProjects: false,
    deleteProjects: false,
    editProjects: false,
    exportProjects: false,
    viewAllProjects: true,
    viewManageProjectResources: false,
    viewOwnProjectsOnly: false,
    viewProjectFinancials: true,
    // User Management
    viewUsers: false,
    viewRoles: false,
    createRoles: false,
    createUsers: false,
    deleteRoles: false,
    deleteUsers: false,
    editRoles: false,
    editUsers: false
  },
  hr: {
    name: "HR",
    desc: "Human Resources team member",
    // Dashboard
    viewDashboard: true,
    viewFinancialSummary: false,
    viewPLCharts: false,
    viewRecentFinanceEntries: false,
    // Finance
    viewFinanceModule: false,
    viewAllFinanceEntries: false,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: false,
    createFinanceEntries: false,
    deleteFinanceEntries: false,
    // HR
    viewHRModule: true,
    createEmployees: true,
    deleteEmployees: true,
    editEmployees: true,
    exportEmployees: true,
    viewEmployeeSalaryInfo: false,
    viewEmployees: true,
    // Incentives
    viewIncentives: false,
    approveRejectIncentiveCalculations: false,
    editIncentives: false,
    exportIncentives: false,
    viewAllIncentives: false,
    viewOwnIncentivesOnly: false,
    // Projects
    viewProjects: false,
    createProjects: false,
    deleteProjects: false,
    editProjects: false,
    exportProjects: false,
    viewAllProjects: false,
    viewManageProjectResources: false,
    viewOwnProjectsOnly: false,
    viewProjectFinancials: false,
    // User Management
    viewUsers: true,
    viewRoles: false,
    createRoles: false,
    createUsers: true,
    deleteRoles: false,
    deleteUsers: true,
    editRoles: false,
    editUsers: true
  },
  "project manager": {
    name: "Project Manager",
    desc: "Project Manager overseeing resource allocations",
    // Dashboard
    viewDashboard: true,
    viewFinancialSummary: false,
    viewPLCharts: false,
    viewRecentFinanceEntries: false,
    // Finance
    viewFinanceModule: false,
    viewAllFinanceEntries: false,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: false,
    createFinanceEntries: false,
    deleteFinanceEntries: false,
    // HR
    viewHRModule: false,
    createEmployees: false,
    deleteEmployees: false,
    editEmployees: false,
    exportEmployees: false,
    viewEmployeeSalaryInfo: false,
    viewEmployees: true,
    // Incentives
    viewIncentives: false,
    approveRejectIncentiveCalculations: false,
    editIncentives: false,
    exportIncentives: false,
    viewAllIncentives: false,
    viewOwnIncentivesOnly: false,
    // Projects
    viewProjects: true,
    createProjects: true,
    deleteProjects: false,
    editProjects: true,
    exportProjects: true,
    viewAllProjects: true,
    viewManageProjectResources: true,
    viewOwnProjectsOnly: true,
    viewProjectFinancials: false,
    // User Management
    viewUsers: false,
    viewRoles: false,
    createRoles: false,
    createUsers: false,
    deleteRoles: false,
    deleteUsers: false,
    editRoles: false,
    editUsers: false
  },
  sales: {
    name: "Sales",
    desc: "Sales department representative",
    // Dashboard
    viewDashboard: true,
    viewFinancialSummary: false,
    viewPLCharts: false,
    viewRecentFinanceEntries: false,
    // Finance
    viewFinanceModule: false,
    viewAllFinanceEntries: false,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: false,
    createFinanceEntries: false,
    deleteFinanceEntries: false,
    // HR
    viewHRModule: false,
    createEmployees: false,
    deleteEmployees: false,
    editEmployees: false,
    exportEmployees: false,
    viewEmployeeSalaryInfo: false,
    viewEmployees: false,
    // Incentives
    viewIncentives: true,
    approveRejectIncentiveCalculations: false,
    editIncentives: false,
    exportIncentives: true,
    viewAllIncentives: true,
    viewOwnIncentivesOnly: true,
    // Projects
    viewProjects: false,
    createProjects: false,
    deleteProjects: false,
    editProjects: false,
    exportProjects: false,
    viewAllProjects: false,
    viewManageProjectResources: false,
    viewOwnProjectsOnly: false,
    viewProjectFinancials: false,
    // User Management
    viewUsers: false,
    viewRoles: false,
    createRoles: false,
    createUsers: false,
    deleteRoles: false,
    deleteUsers: false,
    editRoles: false,
    editUsers: false
  },
  resources: {
    name: "Resources",
    desc: "Active company employee/resource",
    // Dashboard
    viewDashboard: true,
    viewFinancialSummary: false,
    viewPLCharts: false,
    viewRecentFinanceEntries: false,
    // Finance
    viewFinanceModule: false,
    viewAllFinanceEntries: false,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: false,
    createFinanceEntries: false,
    deleteFinanceEntries: false,
    // HR
    viewHRModule: false,
    createEmployees: false,
    deleteEmployees: false,
    editEmployees: false,
    exportEmployees: false,
    viewEmployeeSalaryInfo: false,
    viewEmployees: false,
    // Incentives
    viewIncentives: false,
    approveRejectIncentiveCalculations: false,
    editIncentives: false,
    exportIncentives: false,
    viewAllIncentives: false,
    viewOwnIncentivesOnly: false,
    // Projects
    viewProjects: true,
    createProjects: false,
    deleteProjects: false,
    editProjects: false,
    exportProjects: false,
    viewAllProjects: false,
    viewManageProjectResources: false,
    viewOwnProjectsOnly: true,
    viewProjectFinancials: false,
    // User Management
    viewUsers: false,
    viewRoles: false,
    createRoles: false,
    createUsers: false,
    deleteRoles: false,
    deleteUsers: false,
    editRoles: false,
    editUsers: false
  },
  admin: {
    name: "Admin",
    desc: "Operations Admin",
    viewDashboard: true,
    viewFinancialSummary: true,
    viewPLCharts: true,
    viewRecentFinanceEntries: true,
    viewFinanceModule: true,
    viewAllFinanceEntries: true,
    viewOwnFinanceEntriesOnly: false,
    viewFinancialReports: true,
    createFinanceEntries: true,
    deleteFinanceEntries: true,
    viewHRModule: true,
    createEmployees: true,
    deleteEmployees: true,
    editEmployees: true,
    exportEmployees: true,
    viewEmployeeSalaryInfo: true,
    viewEmployees: true,
    viewIncentives: true,
    approveRejectIncentiveCalculations: true,
    editIncentives: true,
    exportIncentives: true,
    viewAllIncentives: true,
    viewOwnIncentivesOnly: false,
    viewProjects: true,
    createProjects: true,
    deleteProjects: true,
    editProjects: true,
    exportProjects: true,
    viewAllProjects: true,
    viewManageProjectResources: true,
    viewOwnProjectsOnly: false,
    viewProjectFinancials: true,
    viewUsers: true,
    viewRoles: true,
    createRoles: true,
    createUsers: true,
    deleteRoles: true,
    deleteUsers: true,
    editRoles: true,
    editUsers: true
  }
};

const ACCESS_SECTIONS = [
  {
    key: "Dashboard",
    label: "Dashboard",
    permissions: [
      { key: "viewDashboard", label: "View Dashboard" },
      { key: "viewFinancialSummary", label: "View Financial Summary (Revenue, Expenses, Net Income)" },
      { key: "viewPLCharts", label: "View P&L Charts" },
      { key: "viewRecentFinanceEntries", label: "View Recent Finance Entries" }
    ]
  },
  {
    key: "Finance",
    label: "Finance",
    permissions: [
      { key: "viewFinanceModule", label: "View Finance Module (Base Permission)" },
      { key: "viewAllFinanceEntries", label: "View All Finance Entries (Full Access)" },
      { key: "viewOwnFinanceEntriesOnly", label: "View Own Finance Entries Only (Restricted)" },
      { key: "viewFinancialReports", label: "View Financial Reports" },
      { key: "createFinanceEntries", label: "Create Finance Entries" },
      { key: "deleteFinanceEntries", label: "Delete Finance Entries" }
    ]
  },
  {
    key: "Hr",
    label: "Hr",
    permissions: [
      { key: "viewHRModule", label: "View HR Module" },
      { key: "createEmployees", label: "Create Employees" },
      { key: "deleteEmployees", label: "Delete Employees" },
      { key: "editEmployees", label: "Edit Employees" },
      { key: "exportEmployees", label: "Export Employees" },
      { key: "viewEmployeeSalaryInfo", label: "View Employee Salary Information" },
      { key: "viewEmployees", label: "View Employees" }
    ]
  },
  {
    key: "Incentives",
    label: "Incentives",
    permissions: [
      { key: "viewIncentives", label: "View Incentives (Base Permission)" },
      { key: "approveRejectIncentiveCalculations", label: "Approve/Reject Incentive Calculations" },
      { key: "editIncentives", label: "Edit Incentives" },
      { key: "exportIncentives", label: "Export Incentives" },
      { key: "viewAllIncentives", label: "View All Incentives (Full Access)" },
      { key: "viewOwnIncentivesOnly", label: "View Own Incentives Only (Restricted)" }
    ]
  },
  {
    key: "Projects",
    label: "Projects",
    permissions: [
      { key: "viewProjects", label: "View Projects (Base Permission)" },
      { key: "createProjects", label: "Create Projects" },
      { key: "deleteProjects", label: "Delete Projects" },
      { key: "editProjects", label: "Edit Projects" },
      { key: "exportProjects", label: "Export Projects" },
      { key: "viewAllProjects", label: "View All Projects (Full Access)" },
      { key: "viewManageProjectResources", label: "View and Manage Project Resources" },
      { key: "viewOwnProjectsOnly", label: "View Own Projects Only (Restricted)" },
      { key: "viewProjectFinancials", label: "View Project Financials" }
    ]
  },
  {
    key: "UserManagement",
    label: "User Management",
    permissions: [
      { key: "viewUsers", label: "View Users" },
      { key: "viewRoles", label: "View Roles" },
      { key: "createRoles", label: "Create Roles" },
      { key: "createUsers", label: "Create Users" },
      { key: "deleteRoles", label: "Delete Roles" },
      { key: "deleteUsers", label: "Delete Users" },
      { key: "editRoles", label: "Edit Roles" },
      { key: "editUsers", label: "Edit Users" }
    ]
  }
];

const loadRolePermissions = () => {
  const saved = localStorage.getItem("pulse_role_perms");
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEFAULT_ROLE_PERMS;
};

const saveRolePermissions = (perms) => {
  localStorage.setItem("pulse_role_perms", JSON.stringify(perms));
};

const hasPermission = (role, permissionKey) => {
  if (role === "Admin") return true;
  const perms = loadRolePermissions();
  const roleKey = role.toLowerCase();
  if (perms[roleKey] && perms[roleKey][permissionKey] !== undefined) {
    return perms[roleKey][permissionKey];
  }
  if (DEFAULT_ROLE_PERMS[roleKey]) {
    return DEFAULT_ROLE_PERMS[roleKey][permissionKey];
  }
  return false;
};

// ── Admin Dashboard Component ──────────────────────────────────────────

// ── Roles Access Manager Component ─────────────────────────────────────

function RolesAccessManager({ onPermissionsChange, showToast }) {
  const [rolePerms, setRolePerms] = useState(loadRolePermissions);
  const [selectedRole, setSelectedRole] = useState("finance");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const rolesList = ["finance", "hr", "project manager", "sales", "resources"];
  const activePerms = rolePerms[selectedRole] || {};

  const handleToggle = (permKey) => {
    setRolePerms(prev => {
      const next = {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [permKey]: !prev[selectedRole]?.[permKey]
        }
      };
      return next;
    });
  };

  const handleSectionAll = (sectionKey, value) => {
    const section = ACCESS_SECTIONS.find(s => s.key === sectionKey);
    if (!section) return;

    setRolePerms(prev => {
      const updatedRolePerms = { ...prev[selectedRole] };
      section.permissions.forEach(p => {
        updatedRolePerms[p.key] = value;
      });

      return {
        ...prev,
        [selectedRole]: updatedRolePerms
      };
    });
  };

  const handleSave = () => {
    saveRolePermissions(rolePerms);
    if (onPermissionsChange) {
      onPermissionsChange(rolePerms);
    }
    showToast("Role permissions saved successfully!");
  };

  const handleCancel = () => {
    setRolePerms(loadRolePermissions());
    showToast("Changes discarded");
  };

  const handleEditName = () => {
    setTempName(activePerms.name || selectedRole.toUpperCase());
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setRolePerms(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        name: tempName.trim()
      }
    }));
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
  };

  const toggleSectionCollapse = (sectionKey) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <div style={{ display: "flex", gap: 24, minHeight: 500, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: 24 }} className="fade-in">
      {/* Left panel: List of roles */}
      <div style={{ width: 220, borderRight: `1px solid ${C.line}`, paddingRight: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Roles</div>
        {rolesList.map(roleKey => {
          const roleData = rolePerms[roleKey] || DEFAULT_ROLE_PERMS[roleKey] || {};
          const active = selectedRole === roleKey;
          return (
            <button
              key={roleKey}
              onClick={() => {
                setSelectedRole(roleKey);
                setIsEditingName(false);
              }}
              style={{
                border: "none",
                background: active ? C.accentSoft : "transparent",
                color: active ? C.accent : C.ink2,
                fontWeight: active ? 600 : 500,
                textAlign: "left",
                padding: "10px 14px",
                fontSize: 13.5,
                cursor: "pointer",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                outline: "none"
              }}
            >
              <span>{roleData.name || roleKey.toUpperCase()}</span>
              <Icon n="right" size={12} color={active ? C.accent : C.ink3} />
            </button>
          );
        })}
      </div>

      {/* Right panel: Permissions Editor */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Role Details */}
        <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            {isEditingName ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  style={{
                    border: `1px solid ${C.lineStrong}`,
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.ink,
                    outline: "none",
                    background: C.paper
                  }}
                />
                <button
                  onClick={handleSaveName}
                  style={{
                    border: "none",
                    background: C.ok,
                    color: "#fff",
                    borderRadius: 6,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEditName}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: C.ink2,
                    cursor: "pointer",
                    fontSize: 12
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>
                  {activePerms.name || selectedRole.toUpperCase()}
                </h3>
                <button
                  onClick={handleEditName}
                  style={{
                    border: "none",
                    background: "none",
                    color: C.accent,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 4,
                    textTransform: "uppercase"
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <p style={{ fontSize: 13, color: C.ink2, margin: 0 }}>
            {activePerms.desc || DEFAULT_ROLE_PERMS[selectedRole]?.desc || ""}
          </p>
        </div>

        {/* Access Management sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Access Management
          </div>

          {ACCESS_SECTIONS.map(section => {
            const isCollapsed = !!collapsedSections[section.key];
            return (
              <div
                key={section.key}
                style={{
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  overflow: "hidden"
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    background: C.paper,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: isCollapsed ? "none" : `1px solid ${C.line}`
                  }}
                >
                  <div
                    onClick={() => toggleSectionCollapse(section.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      userSelect: "none"
                    }}
                  >
                    <Icon n={isCollapsed ? "right" : "down"} size={14} color={C.ink2} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
                      {section.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleSectionAll(section.key, true)}
                      style={{
                        border: "none",
                        background: "none",
                        color: C.accent,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      Full Access
                    </button>
                    <button
                      onClick={() => handleSectionAll(section.key, false)}
                      style={{
                        border: "none",
                        background: "none",
                        color: C.err,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      No Access
                    </button>
                  </div>
                </div>

                {/* Section Body (Grid of checkboxes) */}
                {!isCollapsed && (
                  <div
                    style={{
                      padding: 16,
                      background: C.surface,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: 12
                    }}
                  >
                    {section.permissions.map(p => {
                      const checked = !!activePerms[p.key];
                      return (
                        <label
                          key={p.key}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            cursor: "pointer",
                            fontSize: 12.5,
                            color: C.ink2,
                            userSelect: "none"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggle(p.key)}
                            style={{
                              marginTop: 2,
                              cursor: "pointer"
                            }}
                          />
                          <span>{p.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: `1px solid ${C.line}`, paddingTop: 16, marginTop: 12 }}>
          <button
            onClick={handleCancel}
            style={{
              ...btnGhost,
              border: `1px solid ${C.lineStrong}`,
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: C.ink2
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              border: "none",
              background: C.ink,
              color: "#fff",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard Component ──────────────────────────────────────────

export default function AdminDashboard() {
  const { currentUser, logout, sales, notifications } = useDatabase();
  const [rolePerms, setRolePerms] = useState(loadRolePermissions);
  const [profileOpen, setProfileOpen] = useState(false);
  const [q, setQ] = useState(""); // global search passed down
  const [toast, showToast] = useToast();

  const hasPerm = (permissionKey) => {
    if (currentUser.role === "Admin") return true;
    const roleKey = currentUser.role.toLowerCase();
    return rolePerms[roleKey]?.[permissionKey] ?? DEFAULT_ROLE_PERMS[roleKey]?.[permissionKey] ?? false;
  };

  const visibleTabs = TABS.filter(([label, _, permKey]) => {
    if (label === "User Management") {
      return hasPerm("viewUsers") || hasPerm("viewRoles");
    }
    return hasPerm(permKey);
  });

  const [tab, setTab] = useState(() => {
    return visibleTabs.length > 0 ? visibleTabs[0][0] : "Dashboard";
  });

  const [subTab, setSubTab] = useState(() => {
    if (hasPerm("viewUsers")) return "Users";
    if (hasPerm("viewRoles")) return "Roles";
    return "Users";
  });

  useEffect(() => {
    if (tab === "User Management") {
      if (hasPerm("viewUsers")) setSubTab("Users");
      else if (hasPerm("viewRoles")) setSubTab("Roles");
    }
  }, [tab]);

  if (!currentUser) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex" }} className="fade-in">
      {/* Left Sidebar */}
      <aside style={{
        width: 240,
        background: "#0B1930",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.08)"
      }}>
        {/* Sidebar Header */}
        <div style={{
          height: 58,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon n="shield" size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>Company Portal</span>
          </div>
          <button style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", opacity: 0.5 }}>
            <Icon n="left" size={14} color="#fff" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {visibleTabs.map(([label, icon]) => {
            const active = tab === label;
            return (
              <button
                key={label}
                onClick={() => {
                  setTab(label);
                  setQ("");
                }}
                style={{
                  border: "none",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  cursor: "pointer",
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                  outline: "none",
                  transition: "background 0.15s, color 0.15s"
                }}
                className="sidebar-item"
              >
                <Icon n={icon} size={15} color={active ? "#ffffff" : "rgba(255,255,255,0.65)"} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Profile */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, overflow: "hidden", flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={currentUser.email}>
              {currentUser.email}
            </span>
            <span style={{
              alignSelf: "flex-start",
              fontSize: 10,
              fontWeight: 700,
              color: "#1E429F",
              background: "#E1EFFE",
              padding: "2px 6px",
              borderRadius: 4,
              textTransform: "uppercase"
            }}>
              {currentUser.role || "ADMIN"}
            </span>
          </div>
          <button
            onClick={logout}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              color: "rgba(255,255,255,0.65)",
              transition: "color 0.15s"
            }}
            title="Log out"
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.65)"}
          >
            <Icon n="logout" size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Main Area Header */}
        <header 
          style={{ 
            background: C.surface, 
            borderBottom: `1px solid ${C.line}`, 
            padding: "0 28px", 
            height: 58, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            position: "sticky", 
            top: 0, 
            zIndex: 30 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{tab}</h1>
          </div>

          {/* Global Search Bar */}
          <div style={{ flex: 1, maxWidth: 300, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 7, padding: "6px 10px", background: C.surface, margin: "0 16px" }}>
            <Icon n="search" size={14} color={C.ink3} />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{ border: "none", outline: "none", fontSize: "12.5px", color: C.ink, background: "transparent", width: "100%" }} />
            {q && (
              <button onClick={()=>setQ("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <Icon n="x" size={14} color={C.ink3} />
              </button>
            )}
          </div>

          {/* User profile avatar */}
          <button 
            onClick={() => setProfileOpen(true)} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              border: `1px solid ${C.line}`, 
              borderRadius: 99, 
              padding: "3px 3px 3px 11px", 
              background: C.surface, 
              cursor: "pointer" 
            }}
          >
            <span style={{ fontSize: "12.5px", fontWeight: 500, color: C.ink }}>{currentUser.name.split(" ")[0]}</span>
            <span style={{ width: 28, height: 28, borderRadius: 99, background: C.ink, color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>
              {currentUser.name.split(" ").map(n => n[0]).join("")}
            </span>
          </button>
        </header>

        {/* Main dashboard content */}
        <main style={{ width: "100%", maxWidth: 1120, margin: "0 auto", padding: "24px 28px", flex: 1 }}>

        {tab === "Dashboard" && <Business />}
        {tab === "PM Oversight" && <PMs />}
        {tab === "User Management" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
            {/* Sub-navigation */}
            {hasPerm("viewUsers") && hasPerm("viewRoles") && (
              <div style={{ display: "flex", gap: 16, borderBottom: `1px solid ${C.line}`, paddingBottom: 0, marginBottom: 12 }}>
                <button
                  onClick={() => setSubTab("Users")}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    background: "none",
                    borderBottom: subTab === "Users" ? `2px solid ${C.accent}` : "2px solid transparent",
                    fontWeight: 600,
                    color: subTab === "Users" ? C.accent : C.ink2,
                    cursor: "pointer",
                    fontSize: 14,
                    outline: "none"
                  }}
                >
                  Users
                </button>
                <button
                  onClick={() => setSubTab("Roles")}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    background: "none",
                    borderBottom: subTab === "Roles" ? `2px solid ${C.accent}` : "2px solid transparent",
                    fontWeight: 600,
                    color: subTab === "Roles" ? C.accent : C.ink2,
                    cursor: "pointer",
                    fontSize: 14,
                    outline: "none"
                  }}
                >
                  Roles
                </button>
              </div>
            )}
            {subTab === "Users" && hasPerm("viewUsers") && <People showToast={showToast} />}
            {subTab === "Roles" && hasPerm("viewRoles") && <RolesAccessManager onPermissionsChange={setRolePerms} showToast={showToast} />}
          </div>
        )}
        {tab === "Clients" && <Clients q={q} />}
        {tab === "Vendor Resources" && <Outsourced q={q} />}
        {tab === "HR Module" && <HRModule showToast={showToast} />}
        {tab === "Finance" && <Finance showToast={showToast} />}
        {tab === "Projects" && <Projects />}
        
        {/* Sales Target oversight with Sparkline graphs */}
        {tab === "Salesperson" && (
          <div className="fade-in">
            <Panel title="Sales Pipeline & Commissions" sub="Acquisition targets and commission payouts (Q2 FY26)">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Sales Owner</th>
                      <th style={{ ...th, textAlign: "right" }}>Target (Q2)</th>
                      <th style={{ ...th, textAlign: "right" }}>Achieved</th>
                      <th style={th}>Completion Progress</th>
                      <th style={{ ...th, textAlign: "right" }}>Opps</th>
                      <th style={{ ...th, textAlign: "right" }}>Revenue closed</th>
                      <th style={{ ...th, textAlign: "center" }}>Trend (6-wk)</th>
                      <th style={{ ...th, textAlign: "right" }}>Incentive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => {
                      const progress = Math.round((s.achieved / s.target) * 100);
                      return (
                        <tr key={s.name} className="row">
                          <td style={{ ...td, color: C.ink, fontWeight: 500 }}>{s.name}</td>
                          <td className="num" style={{ ...td, textAlign: "right" }}>{inrC(s.target)}</td>
                          <td className="num" style={{ ...td, textAlign: "right", color: C.ink, fontWeight: 500 }}>{inrC(s.achieved)}</td>
                          <td style={td}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ height: 3, background: C.line, borderRadius: 99, overflow: "hidden", width: 80 }}>
                                <div style={{ height: "100%", width: `${Math.min(100, progress)}%`, background: progress >= 90 ? C.ok : C.accent }} />
                              </div>
                              <span className="num" style={{ fontSize: 11.5, color: C.ink2 }}>{progress}%</span>
                            </div>
                          </td>
                          <td className="num" style={{ ...td, textAlign: "right" }}>{s.opps}</td>
                          <td className="num" style={{ ...td, textAlign: "right" }}>{inrC(s.revenue)}</td>
                          <td style={{ ...td, textAlign: "center", padding: "6px 12px" }}>
                            <Spark pts={s.trend} color={progress >= 90 ? C.ok : C.accent} />
                          </td>
                          <td className="num" style={{ ...td, textAlign: "right", color: C.ok, fontWeight: 600 }}>{inr(s.incentive)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}
      </main>
      </div>

      {/* Admin Profile Drawer */}
      {profileOpen && (
        <>
          <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.18)", zIndex: 80 }} />
          <aside style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 360, background: C.surface, borderLeft: `1px solid ${C.line}`, zIndex: 90, display: "flex", flexDirection: "column" }} className="fade-in">
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Admin Profile</span>
              <button onClick={() => setProfileOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}><Icon n="x" size={16} color={C.ink2} /></button>
            </div>
            <div style={{ padding: 22, flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 99, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
                  {currentUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{currentUser.name}</div>
                  <div style={{ fontSize: 12, color: C.ink3 }}>{currentUser.designation} · {currentUser.dept}</div>
                </div>
              </div>
              
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Recent Operations Activity</div>
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 12.5, color: C.ink2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: n.tone, display: "inline-block", marginTop: 6 }} />
                  <div>
                    <div>{n.t}</div>
                    <div style={{ fontSize: 10, color: C.ink3, marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 22, borderTop: `1px solid ${C.line}`, display: "flex" }}>
              <button className="demo" style={{ ...btnGhost, width: "100%", justifyContent: "center" }} onClick={logout}>
                <Icon n="logout" size={15} /> Log out
              </button>
            </div>
          </aside>
        </>
      )}

      {toast}
    </div>
  );
}
