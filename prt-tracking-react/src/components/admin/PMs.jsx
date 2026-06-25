import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Tag, Empty } from '../common/UI';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C"
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

const COMPLETION_SEEDS = {
  ipo: 65,
  astra: 72,
  lms: 40,
  phoenix: 55,
  helios: 8
};

function PMCard({ pm, projects, people, timesheets, isExpanded, onToggle }) {
  const pmProjects = projects.filter(p => p.pmId === pm.id);
  const resourceIds = Array.from(new Set(pmProjects.flatMap(p => p.resources.map(r => r.id))));
  
  const pendingCount = timesheets.filter(t => 
    resourceIds.includes(t.employeeId) && t.status === "Submitted" && t.weekIdx === 0
  ).length;

  const approvedCount = timesheets.filter(t => 
    resourceIds.includes(t.employeeId) && t.status === "Approved" && t.weekIdx === 0
  ).length;

  // Sarah Jenkins has logged 38h, David Okoye 32h in seed stats. Fallback to 38h.
  const ownHours = pm.id === "sarah" ? 38 : pm.id === "david_pm" ? 32 : 0;

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
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, marginBottom: 14 }}>
      <button 
        onClick={onToggle} 
        style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer", padding: "15px 16px", outline: "none" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 34, height: 34, borderRadius: 99, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.ink }}>
              {pm.name.split(" ").map(n => n[0]).join("")}
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{pm.name}</div>
              <div style={{ fontSize: 12, color: C.ink3 }}>{pm.designation} · {pm.dept}</div>
            </div>
          </div>
          <Icon n={isExpanded ? "down" : "right"} size={15} color={C.ink3} />
        </div>
        
        <div style={{ display: "flex", gap: 24, marginTop: 14, flexWrap: "wrap" }}>
          {[
            ["Projects Managed", pmProjects.length],
            ["Assigned Staff", resourceIds.length],
            ["Pending Approvals", pendingCount],
            ["Approved Logs", approvedCount],
            ["Own Logged Hours", `${ownHours}h`]
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
              <div className="num" style={{ fontSize: 15, color: k === "Pending Approvals" && v > 0 ? C.accent : C.ink, marginTop: 2, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div style={{ borderTop: `1px solid ${C.line}`, padding: 16 }} className="fade-in">
          {/* Projects List */}
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Projects Managed
          </div>
          {pmProjects.length === 0 ? (
            <div style={{ fontSize: 12.5, color: C.ink3, marginBottom: 16 }}>No projects assigned.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
              <thead>
                <tr>
                  <th style={th}>Project Name</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Completion</th>
                </tr>
              </thead>
              <tbody>
                {pmProjects.map(p => (
                  <tr key={p.id} className="row">
                    <td style={{ ...td, color: C.ink }}>{p.name}</td>
                    <td style={td}><Tag s={p.status} strong /></td>
                    <td className="num" style={{ ...td, textAlign: "right" }}>{COMPLETION_SEEDS[p.id] || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Resources under PM */}
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Assigned Resources & Timesheet Status (Current Week)
          </div>
          {resourceIds.length === 0 ? (
            <div style={{ fontSize: 12.5, color: C.ink3 }}>No resources allocated.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Employee</th>
                  <th style={th}>Designation</th>
                  <th style={{ ...th, textAlign: "right" }}>Timesheet Status</th>
                </tr>
              </thead>
              <tbody>
                {resourceIds.map(resId => (
                  <tr key={resId} className="row">
                    <td style={{ ...td, color: C.ink }}>{getResourceName(resId)}</td>
                    <td style={td}>{getResourceRole(resId)}</td>
                    <td style={{ ...td, textAlign: "right" }}><Tag s={getWeekTimesheetStatus(resId, 0)} strong /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default function PMs() {
  const { people, projects, timesheets } = useDatabase();
  const [q, setQ] = useState("");
  const [expandedName, setExpandedName] = useState(null);

  const pmEmployees = people.filter(p => p.role === "PM" && p.status === "Active");
  const filteredPMs = pmEmployees.filter(pm => pm.name.toLowerCase().includes(q.toLowerCase()));

  const handleToggle = (name) => {
    setExpandedName(expandedName === name ? null : name);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 220 }}>
          <Icon n="search" size={14} color={C.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search project managers..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
        </div>
        <div style={{ fontSize: 12.5, color: C.ink3 }}>
          {filteredPMs.length} managers active
        </div>
      </div>

      {filteredPMs.length === 0 ? (
        <Empty msg="No project managers found." />
      ) : (
        filteredPMs.map(pm => (
          <PMCard 
            key={pm.id} 
            pm={pm} 
            projects={projects} 
            people={people} 
            timesheets={timesheets} 
            isExpanded={expandedName === pm.name}
            onToggle={() => handleToggle(pm.name)}
          />
        ))
      )}
    </div>
  );
}
