import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Drawer, Empty, btnGhost, btnPrimary, inputStyle } from '../common/UI';

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
  warnSoft: "#FAF3E6",
  err: "#A23B3B"
};

const CAP = 40;
const hrs = pct => Math.round((pct / 100) * CAP);

export default function EditProject({ projId, onClose, onSave, showToast }) {
  const { people, clients, projects } = useDatabase();
  const proj = projects.find(p => p.id === projId);

  if (!proj) return null;

  const [d, setD] = useState({
    name: proj.name,
    client: proj.client,
    clientId: proj.clientId,
    type: proj.type,
    status: proj.status,
    start: proj.start,
    tentativeEnd: proj.tentativeEnd || proj.end || "",
    actualCompletion: proj.actualCompletion || "—",
    priority: proj.priority,
    estimated: proj.estimated,
    desc: proj.desc || ""
  });

  // Resources state: array of { id, pct, planned, actual, billable, billing }
  const [resources, setResources] = useState([...proj.resources]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const handleSave = () => {
    if (!d.name.trim()) {
      showToast("Project name is required", "err");
      return;
    }
    onSave(proj.id, d, resources);
    onClose();
  };

  const removeResource = (resId) => {
    setResources(prev => prev.filter(r => r.id !== resId));
  };

  const updateResourceField = (resId, k, v) => {
    setResources(prev => prev.map(r => {
      if (r.id !== resId) return r;
      const updated = { ...r, [k]: v };
      if (k === 'pct') {
        updated.planned = hrs(v);
        if (r.billing !== 'Non-Billable') {
          updated.billable = hrs(v);
        }
      }
      if (k === 'billing') {
        updated.billable = v === 'Non-Billable' ? 0 : r.planned;
      }
      return updated;
    }));
  };

  // Find resources not currently allocated to this project
  const availableResources = people.filter(r => {
    if (r.status !== "Active" || r.role !== "Resource") return false;
    const isAllocated = resources.some(pr => pr.id === r.id);
    const matchesSearch = r.name.toLowerCase().includes(q.toLowerCase());
    return !isAllocated && matchesSearch;
  });

  const addResource = (resId) => {
    // Add default allocation
    const newAlloc = {
      id: resId,
      pct: 25,
      planned: hrs(25),
      actual: 0,
      billable: hrs(25),
      billing: "Billable"
    };
    setResources(prev => [...prev, newAlloc]);
    setQ("");
    setSearchOpen(false);
    showToast("Resource added to project");
  };

  const getResourceName = (resId) => {
    return people.find(r => r.id === resId)?.name || resId;
  };

  return (
    <Drawer
      width={520}
      title={`Edit Project · ${proj.name}`}
      onClose={onClose}
      footer={(
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button className="primary" style={btnPrimary} onClick={handleSave}>
            Save changes
          </button>
        </>
      )}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
        {/* Project info fields */}
        <div>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Project name *</div>
          <input style={inputStyle} value={d.name} onChange={e => setD({ ...d, name: e.target.value })} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Client</div>
            <select 
              style={inputStyle} 
              value={d.clientId} 
              onChange={e => {
                const c = clients.find(cl => cl.id === e.target.value);
                setD({ ...d, clientId: e.target.value, client: c ? c.name : "" });
              }}
            >
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Type</div>
            <select style={inputStyle} value={d.type} onChange={e => setD({ ...d, type: e.target.value })}>
              {["Client", "Internal", "R&D"].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Start date</div>
            <input style={inputStyle} value={d.start} onChange={e => setD({ ...d, start: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Tentative End Date</div>
            <input style={inputStyle} value={d.tentativeEnd} onChange={e => setD({ ...d, tentativeEnd: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Actual Completion Date</div>
            <input style={inputStyle} value={d.actualCompletion} onChange={e => setD({ ...d, actualCompletion: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Estimated Budgeted Hours</div>
            <input style={inputStyle} type="number" value={d.estimated} onChange={e => setD({ ...d, estimated: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Status</div>
            <select style={inputStyle} value={d.status} onChange={e => setD({ ...d, status: e.target.value })}>
              {["On Track", "Delayed", "Completed", "On Hold"].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Description</div>
          <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={d.desc} onChange={e => setD({ ...d, desc: e.target.value })} />
        </div>

        {/* Resources list editor */}
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em" }}>
              Project Staff & Allocation ({resources.length})
            </span>
            <button 
              className="lnk" 
              onClick={() => setSearchOpen(!searchOpen)} 
              style={{ border: "none", background: "none", color: C.accent, fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
              <Icon n="plus" size={13} color={C.accent} /> Add Staff
            </button>
          </div>

          {searchOpen && (
            <div style={{ background: "#FBFBF9", border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, marginBottom: 14 }} className="fade-in">
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 10px", background: C.surface, marginBottom: 8 }}>
                <Icon n="search" size={13} color={C.ink3} />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources..." style={{ border: "none", outline: "none", fontSize: 12, color: C.ink, background: "transparent", width: "100%" }} />
              </div>
              <div style={{ maxHeight: 150, overflowY: "auto" }}>
                {availableResources.length === 0 ? (
                  <div style={{ fontSize: 12, color: C.ink3, padding: 8, textAlign: "center" }}>No resources found.</div>
                ) : (
                  availableResources.map(r => (
                    <button 
                      key={r.id} 
                      onClick={() => addResource(r.id)} 
                      style={{ width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${C.line}`, padding: "8px 10px", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.ink }}
                      className="ghost"
                    >
                      <span>{r.name}</span>
                      <span style={{ color: C.ink3 }}>{r.designation}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {resources.length === 0 ? (
            <Empty msg="No staff allocated to this project." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {resources.map(r => (
                <div key={r.id} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, background: C.surface }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{getResourceName(r.id)}</span>
                    <button 
                      onClick={() => removeResource(r.id)} 
                      style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}
                    >
                      <Icon n="x" size={14} color={C.ink3} />
                    </button>
                  </div>
                  
                  {/* Allocation percentage selector */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    {[10, 25, 50, 75, 100].map(v => (
                      <button 
                        key={v} 
                        onClick={() => updateResourceField(r.id, "pct", v)} 
                        style={{ 
                          flex: 1, 
                          border: `1px solid ${r.pct === v ? C.ink : C.line}`, 
                          background: r.pct === v ? C.ink : C.surface, 
                          color: r.pct === v ? "#fff" : C.ink2, 
                          borderRadius: 6, 
                          padding: "4px 0", 
                          fontSize: 11.5, 
                          cursor: "pointer", 
                          fontWeight: 500 
                        }}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, color: C.ink3, marginBottom: 4 }}>Hours/wk</div>
                      <input 
                        className="num" 
                        type="number" 
                        value={r.planned} 
                        onChange={e => {
                          const h = Math.min(CAP, Math.max(0, parseInt(e.target.value) || 0));
                          updateResourceField(r.id, "planned", h);
                          updateResourceField(r.id, "pct", Math.round((h / CAP) * 100));
                        }} 
                        style={{ ...inputStyle, padding: "5px 7px", fontSize: 12 }} 
                      />
                    </div>
                    <div style={{ flex: 1.2 }}>
                      <div style={{ fontSize: 10.5, color: C.ink3, marginBottom: 4 }}>Billing</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {["Billable", "Non-Billable"].map(b => (
                          <button 
                            key={b} 
                            onClick={() => updateResourceField(r.id, "billing", b)} 
                            style={{ 
                              flex: 1, 
                              border: `1px solid ${r.billing === b ? C.ink : C.line}`, 
                              background: r.billing === b ? C.ink : C.surface, 
                              color: r.billing === b ? "#fff" : C.ink2, 
                              borderRadius: 6, 
                              padding: "5px 0", 
                              fontSize: "11px", 
                              cursor: "pointer", 
                              fontWeight: 500 
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    {r.billing === "Billable" && (
                      <div style={{ flex: 0.8 }}>
                        <div style={{ fontSize: 10.5, color: C.ink3, marginBottom: 4 }}>Billable h</div>
                        <input 
                          className="num" 
                          type="number" 
                          value={r.billable} 
                          onChange={e => updateResourceField(r.id, "billable", Math.min(CAP, Math.max(0, parseInt(e.target.value) || 0)))} 
                          style={{ ...inputStyle, padding: "5px 7px", fontSize: 12 }} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
