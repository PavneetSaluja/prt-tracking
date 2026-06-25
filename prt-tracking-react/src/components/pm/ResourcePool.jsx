import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Empty, Panel, Modal, btnGhost, btnPrimary, inputStyle } from '../common/UI';

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
  warn: "#9A6B1E",
  err: "#A23B3B"
};

const CAP = 40;
const hrs = pct => Math.round((pct / 100) * CAP);

// ── Capacity bar visualizer ───────────────────────────────────────────

export function CapBar({ u }) {
  const over = u > 100;
  const cap = Math.min(100, u);
  return (
    <div style={{ height: 6, background: C.line, borderRadius: 99, overflow: "hidden", display: "flex", marginTop: 6 }}>
      <div style={{ width: `${cap}%`, background: over ? C.warn : C.accent }} />
      {over && <div style={{ width: `${Math.min(40, u - 100)}%`, background: C.err }} />}
    </div>
  );
}

// ── Resource Capacity card ────────────────────────────────────────────

function ResourceCapacity({ r, allocations, onAllocateClick }) {
  const u = allocations.reduce((s, a) => s + a.pct, 0);
  const over = u > 100;
  const freePct = Math.max(0, 100 - u);
  const freeHrs = Math.max(0, CAP - allocations.reduce((s, a) => s + hrs(a.pct), 0));

  return (
    <div style={{ border: `1px solid ${over ? C.warn : C.line}`, borderRadius: 8, background: C.surface, padding: "14px 16px" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{r.name}</div>
          <div style={{ fontSize: 12, color: C.ink3 }}>{r.designation} · {r.dept}</div>
        </div>
        <button className="demo" style={btnGhost} onClick={() => onAllocateClick(r)}>
          Allocate
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "10px 0" }}>
        {(r.skills || []).map(s => (
          <span key={s} style={{ fontSize: 11, color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 5, padding: "2px 7px" }}>{s}</span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 5 }}>
        <span style={{ color: C.ink2 }}>Utilized <b className="num" style={{ color: over ? C.warn : C.ink }}>{u}%</b></span>
        <span style={{ color: C.ink3 }} className="num">
          {over ? `over by ${u - 100}% (${hrs(u - 100)}h)` : `${freePct}% free · ${freeHrs}h`}
        </span>
      </div>

      <CapBar u={u} />

      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
        {allocations.length === 0 ? (
          <div style={{ fontSize: 11.5, color: C.ink3 }}>No current allocations.</div>
        ) : (
          allocations.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
              <span style={{ color: C.ink }}>{a.name}</span>
              <span className="num" style={{ color: C.ink2 }}>{a.pct}% · {hrs(a.pct)}h</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Resource Pool ─────────────────────────────────────────────────────

export default function ResourcePool({ showToast }) {
  const { people, projects, updateProject } = useDatabase();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [role, setRole] = useState("All roles");
  const [allocTarget, setAllocTarget] = useState(null); // resource object
  const [selectedProj, setSelectedProj] = useState("");
  const [selectedPct, setSelectedPct] = useState(25);

  const depts = ["All departments", ...Array.from(new Set(people.map(p => p.dept)))];
  const roles = ["All roles", "Resource", "PM", "Sales"];

  // Fetch dynamic allocations for a resource
  const getResourceAllocs = (resId) => {
    const list = [];
    projects.forEach(p => {
      const match = p.resources.find(r => r.id === resId);
      if (match) {
        list.push({ id: p.id, name: p.name, pct: match.pct });
      }
    });
    return list;
  };

  const activeResources = people.filter(r => {
    if (r.status !== "Active" || r.role !== "Resource") return false;
    const matchesDept = dept === "All departments" || r.dept === dept;
    const matchesRole = role === "All roles" || r.role === role;
    const searchStr = (r.name + r.designation + (r.skills || []).join(" ")).toLowerCase();
    const matchesSearch = searchStr.includes(q.toLowerCase());
    return matchesDept && matchesRole && matchesSearch;
  });

  const handleAllocate = () => {
    if (!allocTarget || !selectedProj) return;
    const proj = projects.find(p => p.id === selectedProj);
    if (!proj) return;

    // Check if already on project
    const isAssigned = proj.resources.some(r => r.id === allocTarget.id);
    let updatedResources;

    if (isAssigned) {
      updatedResources = proj.resources.map(r => 
        r.id === allocTarget.id ? { ...r, pct: selectedPct, planned: hrs(selectedPct) } : r
      );
    } else {
      updatedResources = [
        ...proj.resources,
        {
          id: allocTarget.id,
          pct: selectedPct,
          planned: hrs(selectedPct),
          actual: 0,
          billable: hrs(selectedPct),
          billing: "Billable"
        }
      ];
    }

    updateProject(selectedProj, { name: proj.name }, updatedResources);
    showToast(`Allocated ${allocTarget.name} to ${proj.name}`);
    setAllocTarget(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Search and Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 200, flex: 1 }}>
          <Icon n="search" size={14} color={C.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, role, skill..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
        </div>
        <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }} value={dept} onChange={e => setDept(e.target.value)}>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }} value={role} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <div style={{ fontSize: 12.5, color: C.ink3, marginLeft: "auto" }}>
          {activeResources.length} resources active
        </div>
      </div>

      {/* Grid of resource cards */}
      {activeResources.length === 0 ? (
        <Empty msg="No resources found matching filters." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {activeResources.map(r => (
            <ResourceCapacity 
              key={r.id} 
              r={r} 
              allocations={getResourceAllocs(r.id)} 
              onAllocateClick={setAllocTarget}
            />
          ))}
        </div>
      )}

      {/* Allocate resource modal */}
      {allocTarget && (
        <Modal
          title={`Allocate Capacity · ${allocTarget.name}`}
          onClose={() => setAllocTarget(null)}
          footer={(
            <>
              <button className="demo" style={btnGhost} onClick={() => setAllocTarget(null)}>Cancel</button>
              <button className="primary" style={btnPrimary} onClick={handleAllocate} disabled={!selectedProj}>
                Save allocation
              </button>
            </>
          )}
        >
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: C.ink2, display: "block", marginBottom: 6 }}>Select Project</label>
            <select 
              style={inputStyle} 
              value={selectedProj} 
              onChange={e => setSelectedProj(e.target.value)}
            >
              <option value="">-- Choose a project --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: C.ink2, display: "block", marginBottom: 6 }}>Allocation Percentage</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[10, 25, 50, 75, 100].map(v => (
                <button 
                  key={v} 
                  onClick={() => setSelectedPct(v)}
                  style={{ 
                    flex: 1, 
                    border: `1px solid ${selectedPct === v ? C.ink : C.line}`, 
                    background: selectedPct === v ? C.ink : C.surface, 
                    color: selectedPct === v ? "#fff" : C.ink2, 
                    borderRadius: 6, 
                    padding: "7px 0", 
                    fontSize: 12, 
                    cursor: "pointer", 
                    fontWeight: 500 
                  }}
                >
                  {v}%
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.ink3, marginTop: 6 }}>
              Equal to {hrs(selectedPct)} hours planned work per week.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
