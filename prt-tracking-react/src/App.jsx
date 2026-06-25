import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './state/db';
import Login from './components/landing/Login';
import ResourceDashboard from './components/resource/ResourceDashboard';
import PMDashboard from './components/pm/PMDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Icon from './components/common/Icon';
import { btnGhost } from './components/common/UI';

const C = {
  ink: "#18181B",
  surface: "#FFFFFF",
  line: "#E7E6E0",
  ink2: "#5C5C63",
  accentSoft: "#EDF1F6"
};

// ── Developer Quick Switcher for Reviewing ─────────────────────────────

function DevSwitcher() {
  const { currentUser, loginAs, people } = useDatabase();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  const quickUsers = [
    { id: "marcus", name: "Marcus (Resource)" },
    { id: "sarah", name: "Sarah (PM)" },
    { id: "fiona", name: "Fiona (Finance)" },
    { id: "harriet", name: "Harriet (HR)" },
    { id: "rahul_sales", name: "Rahul (Sales)" },
    { id: "arjun", name: "Arjun (Admin)" }
  ];

  return (
    <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 200, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      {open && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, boxShadow: "0 4px 12px rgba(0,0,0,.1)", display: "flex", flexDirection: "column", gap: 4 }} className="fade-in">
          <div style={{ fontSize: 11, fontWeight: 600, color: C.ink2, padding: "4px 8px", borderBottom: `1px solid ${C.line}` }}>
            Quick Role Jump
          </div>
          {quickUsers.map(u => {
            const active = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  loginAs(u.id);
                  setOpen(false);
                }}
                style={{
                  border: "none",
                  background: active ? C.accentSoft : "none",
                  textAlign: "left",
                  padding: "6px 10px",
                  fontSize: 12.5,
                  cursor: "pointer",
                  borderRadius: 5,
                  color: C.ink,
                  fontWeight: active ? 600 : 500
                }}
                className="ghost"
              >
                {u.name}
              </button>
            );
          })}
        </div>
      )}
      
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...btnGhost,
          borderRadius: 99,
          padding: "8px 12px",
          background: C.ink,
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
          cursor: "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6
        }}
        className="primary"
      >
        <Icon n="shield" size={14} color="#fff" />
        <span>Dev Switcher</span>
      </button>
    </div>
  );
}

// ── Upcoming Roles Placeholder screen ──────────────────────────────────

function PlaceholderDashboard({ role, onLogout }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F6F5F1", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} className="fade-in">
      <div style={{ background: "#FFF", border: "1px solid #E7E6E0", borderRadius: 10, padding: 32, maxWidth: 460, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,.03)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#EDF1F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon n="alert" size={24} color="#38618C" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#18181B", margin: "0 0 10px" }}>
          {role} Portal Coming Soon
        </h2>
        <p style={{ fontSize: 13.5, color: "#5C5C63", lineHeight: 1.5, margin: "0 0 24px" }}>
          The <strong>{role}</strong> dashboard is scheduled for the Phase 2 roadmap. Currently, you can test the **Resource (Marcus)**, **PM (Sarah)**, and **Admin (Arjun)** prototypes.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="primary" style={{ ...btnGhost, background: "#18181B", color: "#FFF", border: "none" }} onClick={onLogout}>
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Role Router Router ──────────────────────────────────────────────────

function MainApp() {
  const { currentUser, logout } = useDatabase();

  if (!currentUser) {
    return <Login />;
  }

  // Route based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case "Resource":
        return <ResourceDashboard />;
      case "PM":
        return <PMDashboard />;
      case "Admin":
      case "Finance":
      case "HR":
      case "Sales":
        return <AdminDashboard />;
      default:
        // COO placeholder
        return <PlaceholderDashboard role={currentUser.role} onLogout={logout} />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <DevSwitcher />
    </>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <MainApp />
    </DatabaseProvider>
  );
}
