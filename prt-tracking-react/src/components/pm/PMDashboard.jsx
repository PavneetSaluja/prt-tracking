import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { KPI, useToast, Drawer, btnGhost, btnPrimary } from '../common/UI';
import MyProjects from './MyProjects';
import ResourcePool from './ResourcePool';
import Approvals from './Approvals';
import ClientDirectory from './ClientDirectory';
import MyTimesheet from './MyTimesheet';
import CreateProject from './CreateProject';
import EditProject from './EditProject';

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  line: "#E7E6E0",
  ok: "#3F7A52",
  warn: "#9A6B1E",
  accent: "#38618C"
};

const TABS = [
  ["My Projects", "folder"],
  ["Resource Pool", "users"],
  ["Approvals", "inbox"],
  ["Clients", "building"],
  ["My Timesheet", "clock"]
];

export default function PMDashboard() {
  const { 
    currentUser, 
    logout, 
    projects, 
    people, 
    timesheets, 
    removeResourceFromProject,
    createProject,
    updateProject,
    deleteProject
  } = useDatabase();

  const [tab, setTab] = useState("My Projects");
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProjId, setEditProjId] = useState(null);
  const [toast, showToast] = useToast();

  if (!currentUser) return null;

  // Reusable resource name helper
  const nameOf = (id) => {
    return people.find(p => p.id === id)?.name || id;
  };

  // ── Org Capacity Metrics Calculation ──────────────────────────────────
  const activeResources = people.filter(r => r.role === "Resource" && r.status === "Active");
  const totalCapacity = activeResources.length * 40;
  
  // Calculate allocations based on projects
  const getResourceAllocs = (resId) => {
    const list = [];
    projects.forEach(p => {
      const match = p.resources.find(r => r.id === resId);
      if (match) list.push({ proj: p.id, pct: match.pct });
    });
    return list;
  };

  const getResourceUtil = (resId) => {
    return getResourceAllocs(resId).reduce((s, a) => s + a.pct, 0);
  };

  const totalAllocatedHours = activeResources.reduce((sum, r) => {
    const utilPct = getResourceUtil(r.id);
    return sum + Math.round((utilPct / 100) * 40);
  }, 0);

  const orgUtil = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
  
  const freeCount = activeResources.filter(r => {
    const utilPct = getResourceUtil(r.id);
    return utilPct < 100;
  }).length;

  const overCount = activeResources.filter(r => {
    const utilPct = getResourceUtil(r.id);
    return utilPct > 100;
  }).length;

  const pendingCount = timesheets.filter(t => t.status === "Submitted").length;

  // PM projects (Sarah Jenkins manages all or can filter)
  const pmProjects = projects.filter(p => p.pmId === currentUser.id);

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
              <Icon n="folder" size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>Company Portal</span>
          </div>
          <button style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", opacity: 0.5 }}>
            <Icon n="left" size={14} color="#fff" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {TABS.map(([label, icon]) => {
            const active = tab === label;
            const badge = label === "Approvals" && pendingCount > 0 ? pendingCount : null;
            return (
              <button
                key={label}
                onClick={() => setTab(label)}
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
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span className="num" style={{ fontSize: 11, color: "#fff", background: "#38618C", borderRadius: 99, padding: "1px 6px" }}>
                    {badge}
                  </span>
                )}
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
              PM
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


      {/* Main body context */}
      <main style={{ width: "100%", maxWidth: 1120, margin: "0 auto", padding: "24px 28px" }}>
        {/* KPI metrics row */}
        {(tab === "My Projects" || tab === "Resource Pool") && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 18 }}>
            <KPI label="Org utilization" value={`${orgUtil}%`} />
            <KPI label="Available Staff" value={freeCount} note="have capacity left" tone={C.ok} />
            <KPI label="Overallocated Staff" value={overCount} note={overCount ? "need resource audit" : "balance clean"} tone={overCount ? C.warn : C.ink3} />
            <KPI label="Pending Approvals" value={pendingCount} note="awaiting your review" tone={pendingCount ? C.accent : C.ink3} />
          </div>
        )}

        {/* Render Tab Contents */}
        {tab === "My Projects" && (
          <MyProjects 
            projects={pmProjects} 
            nameOf={nameOf}
            onNew={() => setCreateOpen(true)}
            onEdit={p => setEditProjId(p.id)}
            onDelete={deleteProject}
            onRemoveResource={removeResourceFromProject}
          />
        )}
        {tab === "Resource Pool" && <ResourcePool showToast={showToast} />}
        {tab === "Approvals" && <Approvals showToast={showToast} />}
        {tab === "Clients" && <ClientDirectory />}
        {tab === "My Timesheet" && <MyTimesheet showToast={showToast} />}
      </main>
      </div>

      {/* Project Wizard Drawer */}
      {createOpen && (
        <CreateProject 
          onClose={() => setCreateOpen(false)}
          onCreate={(pData, pResources, pFiles) => createProject(pData, pResources, pFiles)}
          showToast={showToast}
        />
      )}

      {/* Project Edit Drawer */}
      {editProjId !== null && (
        <EditProject 
          projId={editProjId}
          onClose={() => setEditProjId(null)}
          onSave={(pid, fields, res) => updateProject(pid, fields, res)}
          showToast={showToast}
        />
      )}

      {/* PM Profile Drawer overlay */}
      {profileOpen && (
        <>
          <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.18)", zIndex: 80 }} />
          <aside style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 360, background: C.surface, borderLeft: `1px solid ${C.line}`, zIndex: 90, display: "flex", flexDirection: "column" }} className="fade-in">
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>PM Profile</span>
              <button onClick={() => setProfileOpen(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><Icon n="x" size={16} color={C.ink2} /></button>
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
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Contact Info</div>
              <div style={{ fontSize: 13, color: C.ink, marginBottom: 12 }}>Email: {currentUser.email}</div>
              <div style={{ fontSize: 13, color: C.ink }}>Manager: {currentUser.manager}</div>
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
