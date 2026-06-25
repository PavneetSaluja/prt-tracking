import React from 'react';
import { Empty } from '../common/UI';

const C = {
  line: "#E7E6E0",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  accentSoft: "#EDF1F6",
  ok: "#3F7A52",
  warn: "#9A6B1E"
};

function AllocCard({ p, logged }) {
  const remaining = Math.max(0, p.allocated - logged);
  const percent = p.allocated > 0 ? (logged / p.allocated) * 100 : 0;
  
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{p.name}</span>
        <span className="num" style={{ fontSize: 12, color: logged > p.allocated ? C.warn : C.ink3, whiteSpace: "nowrap" }}>
          {logged}/{p.allocated}h
        </span>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Allocated</div>
          <div className="num" style={{ fontSize: 14, color: C.ink, marginTop: 2 }}>{p.allocated}h</div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Logged</div>
          <div className="num" style={{ fontSize: 14, color: C.ink, marginTop: 2 }}>{logged}h</div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>Remaining</div>
          <div className="num" style={{ fontSize: 14, color: remaining === 0 ? C.ok : C.ink, marginTop: 2 }}>{remaining}h</div>
        </div>
      </div>
      <div style={{ height: 3, background: C.line, borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
        <div 
          style={{ 
            height: "100%", 
            width: `${Math.min(100, percent)}%`, 
            background: logged > p.allocated ? C.warn : C.accent 
          }} 
        />
      </div>
    </div>
  );
}

export default function Allocations({ projects, getProjectLoggedHours, capacity }) {
  // Map project allocations
  const allocProjects = projects.map(proj => {
    // Find allocation percentage for current resource
    return {
      id: proj.id,
      name: proj.name,
      allocated: proj.resources.reduce((sum, r) => sum + (r.planned || 0), 0) // fallback planned
    };
  });

  const allocatedTotal = projects.reduce((sum, p) => sum + (p.allocated || 0), 0);
  const loggedTotal = projects.reduce((sum, p) => sum + getProjectLoggedHours(p.id), 0);
  const remainingTotal = Math.max(0, capacity - loggedTotal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: ".05em" }}>
        My allocations
      </div>
      
      {projects.length === 0 ? (
        <Empty msg="No projects have been allocated to you for this week." />
      ) : (
        projects.map(p => (
          <AllocCard 
            key={p.id} 
            p={p} 
            logged={getProjectLoggedHours(p.id)} 
          />
        ))
      )}

      {/* Weekly Capacity summary */}
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, padding: "14px 16px", marginTop: 2 }}>
        <div style={{ fontSize: 11.5, color: C.ink3, marginBottom: 12 }}>Weekly capacity</div>
        {[
          { k: "Capacity", v: capacity, col: C.ink },
          { k: "Allocated", v: allocatedTotal, col: C.ink },
          { k: "Logged", v: loggedTotal, col: C.ink },
          { k: "Remaining", v: remainingTotal, col: remainingTotal === 0 ? C.ok : C.ink }
        ].map(({ k, v, col }) => (
          <div 
            key={k} 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "6px 0", 
              borderTop: k === "Capacity" ? "none" : `1px solid ${C.line}` 
            }}
          >
            <span style={{ fontSize: 13, color: C.ink2 }}>{k}</span>
            <span className="num" style={{ fontSize: 14, fontWeight: k === "Remaining" ? 600 : 500, color: col }}>{v}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}
