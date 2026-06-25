import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { StatusPill, useToast } from '../common/UI';
import Allocations from './Allocations';
import Timesheet from './Timesheet';
import Profile from './Profile';

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  line: "#E7E6E0"
};

export default function ResourceDashboard() {
  const { 
    currentUser, 
    logout, 
    projects, 
    getTimesheet, 
    saveTimesheetDraft, 
    submitTimesheet, 
    updateSkills,
    getWeekLabel,
    timesheets
  } = useDatabase();

  const [toast, showToast] = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [weekIdx, setWeekIdx] = useState(0);
  const [tab, setTab] = useState("timesheet"); // Mobile tabs: 'allocations' | 'timesheet'
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.matchMedia("(max-width:760px)").matches);

  useEffect(() => {
    const m = window.matchMedia("(max-width:760px)");
    const fn = e => setMobile(e.matches);
    m.addEventListener ? m.addEventListener("change", fn) : m.addListener(fn);
    return () => {
      m.removeEventListener ? m.removeEventListener("change", fn) : m.removeListener(fn);
    };
  }, []);

  if (!currentUser) return null;

  // Filter projects where this resource is allocated
  const allocatedProjects = projects.filter(p => p.resources.some(r => r.id === currentUser.id));

  // Get timesheet for current week
  const timesheet = getTimesheet(currentUser.id, weekIdx);

  const getProjectLoggedHours = (projId) => {
    if (!timesheet || !timesheet.entries[projId]) return 0;
    return timesheet.entries[projId].reduce((sum, d) => sum + (d.h || 0), 0);
  };

  const week = getWeekLabel(weekIdx);

  const allocationsEl = (
    <Allocations 
      projects={allocatedProjects} 
      getProjectLoggedHours={getProjectLoggedHours} 
      capacity={currentUser.capacity || 40}
    />
  );

  const timesheetEl = (
    <Timesheet 
      projects={allocatedProjects} 
      timesheet={timesheet}
      onSaveDraft={saveTimesheetDraft}
      onSubmit={submitTimesheet}
      showToast={showToast}
      mobile={mobile}
      capacity={currentUser.capacity || 40}
      timesheets={timesheets}
      setWeekIdx={setWeekIdx}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", flexDirection: mobile ? "column" : "row" }} className="fade-in">
      {!mobile && (
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
                <Icon n="clock" size={15} color="#fff" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>Company Portal</span>
            </div>
            <button style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", opacity: 0.5 }}>
              <Icon n="left" size={14} color="#fff" />
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            {[
              ["timesheet", "clock", "Weekly Timesheet"],
              ["allocations", "folder", "Allocations"],
              ["profile", "user", "Profile"]
            ].map(([id, ic, lb]) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "profile") {
                      setProfileOpen(true);
                    } else {
                      setTab(id);
                    }
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
                  <Icon n={ic} size={15} color={active ? "#ffffff" : "rgba(255,255,255,0.65)"} />
                  <span>{lb}</span>
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
                RESOURCE
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
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Main Area Header */}
        <header 
          style={{ 
            background: C.surface, 
            borderBottom: `1px solid ${C.line}`, 
            padding: mobile ? "0 16px" : "0 28px", 
            height: 58, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            position: "sticky", 
            top: 0, 
            zIndex: 30 
          }}
        >
          {mobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n="clock" size={15} color="#fff" />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>Pulse</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>
                {tab === "timesheet" ? "Weekly Timesheet" : "Allocations"}
              </h1>
            </div>
          )}

          {/* Week navigation / actions */}
          <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 18 }}>
            {tab === "timesheet" && (
              <div style={{ display: "flex", alignItems: "center", gap: 2, color: C.ink2 }}>
                <button className="ghost" onClick={() => setWeekIdx(w => w - 1)} style={navBtn}>
                  <Icon n="left" size={16} color={C.ink2} />
                </button>
                <span className="num" style={{ minWidth: mobile ? 116 : 140, textAlign: "center", fontSize: 13, color: C.ink }}>
                  {week}
                </span>
                <button className="ghost" onClick={() => setWeekIdx(w => w + 1)} style={navBtn}>
                  <Icon n="right" size={16} color={C.ink2} />
                </button>
              </div>
            )}
            
            {tab === "timesheet" && !mobile && <StatusPill s={timesheet.status} />}
            
            <button 
              onClick={() => setProfileOpen(true)} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8, 
                border: `1px solid ${C.line}`, 
                borderRadius: 99, 
                padding: mobile ? "3px" : "3px 3px 3px 11px", 
                background: C.surface, 
                cursor: "pointer" 
              }}
            >
              {!mobile && <span style={{ fontSize: "12.5px", fontWeight: 500, color: C.ink }}>{currentUser.name.split(" ")[0]}</span>}
              <span style={{ width: 28, height: 28, borderRadius: 99, background: C.ink, color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {currentUser.name.split(" ").map(n => n[0]).join("")}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main style={{ flex: 1, width: "100%", maxWidth: 1120, margin: "0 auto", padding: mobile ? "18px 16px 90px" : "26px 28px" }}>
          {mobile ? (
            tab === "allocations" ? allocationsEl : tab === "profile" ? null : timesheetEl
          ) : (
            tab === "allocations" ? allocationsEl : timesheetEl
          )}
        </main>
      </div>


      {/* Mobile bottom nav */}
      {mobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: C.surface, borderTop: `1px solid ${C.line}`, display: "flex", zIndex: 40 }}>
          {[
            ["allocations", "grid", "Allocations"],
            ["timesheet", "clock", "Timesheet"],
            ["profile", "user", "Profile"]
          ].map(([id, ic, lb]) => {
            const active = id === "profile" ? profileOpen : (tab === id && !profileOpen);
            return (
              <button 
                key={id} 
                onClick={() => {
                  if (id === "profile") {
                    setProfileOpen(true);
                  } else {
                    setProfileOpen(false);
                    setTab(id);
                  }
                }}
                style={{ 
                  flex: 1, 
                  border: "none", 
                  background: "none", 
                  cursor: "pointer", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 4, 
                  color: active ? C.ink : C.ink3 
                }}
              >
                <Icon n={ic} size={19} color={active ? C.ink : C.ink3} />
                <span style={{ fontSize: "10.5px", fontWeight: active ? 600 : 500 }}>{lb}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Profile drawer rendering */}
      {profileOpen && (
        <Profile 
          user={currentUser} 
          skillsList={currentUser.skills || []}
          onSaveSkills={updateSkills}
          onClose={() => setProfileOpen(false)} 
          onLogout={logout} 
          showToast={showToast}
        />
      )}
      
      {toast}
    </div>
  );
}

const navBtn = {
  width: 28,
  height: 28,
  border: "none",
  background: "none",
  borderRadius: 6,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
