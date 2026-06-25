import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Drawer, Empty, Panel, btnGhost, btnPrimary, inputStyle } from '../common/UI';

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
  err: "#A23B3B",
  errSoft: "#FBF1F0"
};

const CAP = 40;
const hrs = pct => Math.round((pct / 100) * CAP);
const aHours = a => (a.hours != null ? a.hours : hrs(a.pct));
const aBill = a => (a.billable != null ? a.billable : aHours(a));

// ── Client Search Autocomplete ─────────────────────────────────────────

function ClientField({ clients, value, onPick, onCreateNew }) {
  const [q, setQ] = useState(value ? value.name : "");
  const [open, setOpen] = useState(false);
  const matched = clients.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  return (
    <div style={{ position: "relative" }}>
      <input 
        style={inputStyle} 
        value={q} 
        placeholder="Search a client…" 
        onChange={e => {
          setQ(e.target.value);
          setOpen(true);
          if (value) onPick(null);
        }} 
        onFocus={() => setOpen(true)}
      />
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1 }} />
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 2, overflowY: "auto", maxHeight: 250 }}>
            {matched.length > 0 ? (
              matched.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => {
                    onPick(c);
                    setQ(c.name);
                    setOpen(false);
                  }} 
                  style={{ width: "100%", textAlign: "left", border: "none", borderBottom: `1px solid ${C.line}`, background: C.surface, padding: "9px 12px", cursor: "pointer" }}
                >
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: C.ink3 }}>{c.industry} · {c.country}</div>
                </button>
              ))
            ) : (
              <div style={{ padding: "12px 12px 6px", fontSize: 12.5, color: C.ink2 }}>
                No client found {q ? `for “${q}”` : ""}.
              </div>
            )}
            <button 
              onClick={() => {
                setOpen(false);
                onCreateNew(q);
              }} 
              style={{ 
                width: "100%", 
                textAlign: "left", 
                border: "none", 
                borderTop: `1px solid ${C.line}`, 
                background: C.surface, 
                padding: "10px 12px", 
                cursor: "pointer", 
                color: C.accent, 
                fontSize: "12.5px", 
                fontWeight: 600, 
                display: "flex", 
                alignItems: "center", 
                gap: 7 
              }}
            >
              <Icon n="plus" size={13} color={C.accent} /> 
              Create new client {q.trim() ? `“${q.trim()}”` : ""}
            </button>
          </div>
        </>
      )}
      {value && (
        <div style={{ marginTop: 6, fontSize: "11.5px", color: C.ok, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon n="check" size={12} color={C.ok} /> 
          {value.name} selected
        </div>
      )}
    </div>
  );
}

// ── Create Client Sub-Drawer ───────────────────────────────────────────

function CreateClientDrawer({ initialName, onClose, onSave }) {
  const [f, setF] = useState({
    name: initialName || "",
    contact: "",
    email: "",
    phone: "",
    website: "",
    industry: "IT Services",
    country: "India",
    address: "",
    notes: ""
  });
  const setField = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <Drawer 
      width={420} 
      title="New client" 
      onClose={onClose}
      footer={(
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button 
            className="primary" 
            style={btnPrimary} 
            onClick={() => {
              if (!f.name.trim()) return;
              onSave({ id: "cl_" + Date.now(), ...f });
            }}
          >
            Save client
          </button>
        </>
      )}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Client name *</div>
        <input style={inputStyle} value={f.name} onChange={e => setField("name", e.target.value)} autoFocus />
      </div>
      
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Primary contact</div>
          <input style={inputStyle} value={f.contact} onChange={e => setField("contact", e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Email</div>
          <input style={inputStyle} value={f.email} onChange={e => setField("email", e.target.value)} />
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Phone</div>
          <input style={inputStyle} value={f.phone} onChange={e => setField("phone", e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Website</div>
          <input style={inputStyle} value={f.website} onChange={e => setField("website", e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Industry</div>
          <select style={inputStyle} value={f.industry} onChange={e => setField("industry", e.target.value)}>
            {["IT Services", "Financial Services", "Retail", "Logistics", "Internet", "Healthcare", "Manufacturing", "Internal", "Other"].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Country</div>
          <input style={inputStyle} value={f.country} onChange={e => setField("country", e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Address</div>
        <input style={inputStyle} value={f.address} onChange={e => setField("address", e.target.value)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Notes</div>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={f.notes} onChange={e => setField("notes", e.target.value)} />
      </div>
    </Drawer>
  );
}

// ── 3-Step Create Project Drawer ────────────────────────────────────────

const OKEXT = ["pdf", "docx", "doc", "xlsx", "xls", "ppt", "pptx", "jpg", "jpeg", "png", "zip"];
const extOf = n => (n.split(".").pop() || "").toLowerCase();

export default function CreateProject({ onClose, onCreate, showToast }) {
  const { people, clients, createClient, projects } = useDatabase();
  const [step, setStep] = useState(1);
  
  const [d, setD] = useState({
    name: "",
    client: "",
    clientId: "",
    type: "Client",
    start: "",
    tentativeEnd: "",
    actualCompletion: "—",
    desc: "",
    priority: "Medium",
    status: "On Track",
    estimated: 400
  });

  const [files, setFiles] = useState([]);
  const [newClientName, setNewClientName] = useState(null);
  
  // Picked resources directory state: id -> { pct, hours, billable, billing }
  const [picked, setPicked] = useState({});

  // Filter criteria
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All departments");
  const [role, setRole] = useState("All roles");
  const [skill, setSkill] = useState("All skills");
  const [availMin, setAvailMin] = useState("Any availability");
  const [utilMax, setUtilMax] = useState("Any utilization");
  const [openRes, setOpenRes] = useState(null);
  const [drag, setDrag] = useState(false);

  const depts = ["All departments", ...Array.from(new Set(people.map(p => p.dept)))];
  const allRoles = ["All roles", ...Array.from(new Set(people.map(p => p.role)))];
  const allSkills = ["All skills", ...Array.from(new Set(people.flatMap(p => p.skills || []))).sort()];

  const getResourceAllocs = (resId) => {
    // Search active project assignments
    const allocs = [];
    projects.forEach(p => {
      const match = p.resources.find(r => r.id === resId);
      if (match) allocs.push({ proj: p.id, name: p.name, pct: match.pct });
    });
    return allocs;
  };

  const getResourceUtil = (resId) => {
    return getResourceAllocs(resId).reduce((s, a) => s + a.pct, 0);
  };

  const getResourceAvailHours = (resId) => {
    const planned = getResourceAllocs(resId).reduce((s, a) => s + hrs(a.pct), 0);
    return Math.max(0, CAP - planned);
  };

  const availThresh = {
    "Any availability": 0,
    "Available > 10 hrs": 10,
    "Available > 20 hrs": 20,
    "Available > 30 hrs": 30
  }[availMin];

  const utilCap = {
    "Any utilization": 101,
    "Utilization < 70%": 70,
    "Utilization < 80%": 80,
    "Utilization < 90%": 90
  }[utilMax];

  // Resource pool filtering
  const resourcesList = people.filter(r => {
    if (r.status !== "Active" || r.role !== "Resource") return false;
    const matchesDept = dept === "All departments" || r.dept === dept;
    const matchesRole = role === "All roles" || r.role === role;
    const matchesSkill = skill === "All skills" || (r.skills && r.skills.includes(skill));
    const u = getResourceUtil(r.id);
    const matchesUtil = u < utilCap;
    const matchesAvail = getResourceAvailHours(r.id) >= availThresh;
    const matchesSearch = (r.name + r.role + (r.skills || []).join(" ")).toLowerCase().includes(q.toLowerCase());
    return matchesDept && matchesRole && matchesSkill && matchesUtil && matchesAvail && matchesSearch;
  });

  const setPct = (id, v) => {
    setPicked(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        pct: v,
        hours: hrs(v),
        billable: prev[id].billing === "Non-Billable" ? 0 : hrs(v)
      }
    }));
  };

  const setPickedField = (id, k, v) => {
    setPicked(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [k]: v
      }
    }));
  };

  const setBilling = (id, b) => {
    setPicked(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        billing: b,
        billable: b === "Non-Billable" ? 0 : (prev[id].billable || prev[id].hours)
      }
    }));
  };

  const toggleResource = (id) => {
    setPicked(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = {
          pct: 25,
          hours: hrs(25),
          billable: hrs(25),
          billing: "Billable"
        };
      }
      return next;
    });
  };

  const addFiles = (fl) => {
    const arr = Array.from(fl);
    const bad = [];
    setFiles(prev => {
      const next = [...prev];
      arr.forEach(f => {
        const ext = extOf(f.name);
        if (!OKEXT.includes(ext)) {
          bad.push(f.name);
          return;
        }
        const version = "v" + (next.filter(x => x.name === f.name).length + 1);
        next.push({
          name: f.name,
          type: ext.toUpperCase(),
          by: "Sarah Jenkins",
          date: "Today",
          version
        });
      });
      return next;
    });
    if (bad.length) showToast(`Unsupported extensions: ${bad.join(", ")}`, "err");
  };

  const handleCreate = () => {
    onCreate(d, picked, files);
    onClose();
  };

  const handleClientSave = (client) => {
    const newClient = createClient(client);
    setD(prev => ({
      ...prev,
      clientId: newClient.id,
      client: newClient.name
    }));
    setNewClientName(null);
  };

  return (
    <>
      <Drawer
        width={560}
        title={`New project · Step ${step} of 3`}
        onClose={onClose}
        footer={(
          <>
            <div style={{ display: "flex", gap: 5, marginRight: "auto" }}>
              {[1, 2, 3].map(i => (
                <span key={i} style={{ width: 22, height: 3, borderRadius: 9, background: i <= step ? C.ink : C.line }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {step > 1 && <button className="demo" style={btnGhost} onClick={() => setStep(s => s - 1)}>Back</button>}
              {step < 3 ? (
                <button 
                  className="primary" 
                  style={btnPrimary} 
                  onClick={() => {
                    if (step === 1 && !d.name.trim()) {
                      showToast("Add a project name", "err");
                      return;
                    }
                    if (step === 1 && !d.clientId) {
                      showToast("Select or create a client", "err");
                      return;
                    }
                    setStep(s => s + 1);
                  }}
                >
                  Continue <Icon n="arrow" size={13} color="#fff" />
                </button>
              ) : (
                <button className="primary" style={btnPrimary} onClick={handleCreate}>
                  Create project
                </button>
              )}
            </div>
          </>
        )}
      >
        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="fade-in">
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Project name *</div>
              <input style={inputStyle} value={d.name} onChange={e => setD({ ...d, name: e.target.value })} placeholder="e.g. Helios Mobile App" />
            </div>

            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Client *</div>
              <ClientField 
                clients={clients} 
                value={d.clientId ? clients.find(c => c.id === d.clientId) : null} 
                onPick={c => setD({ ...d, clientId: c ? c.id : "", client: c ? c.name : "" })} 
                onCreateNew={name => setNewClientName(name || "")}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 13 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Type</div>
                <select style={inputStyle} value={d.type} onChange={e => setD({ ...d, type: e.target.value })}>
                  {["Client", "Internal", "R&D"].map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Priority</div>
                <select style={inputStyle} value={d.priority} onChange={e => setD({ ...d, priority: e.target.value })}>
                  {["High", "Medium", "Low"].map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 13 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Start date</div>
                <input style={inputStyle} value={d.start} onChange={e => setD({ ...d, start: e.target.value })} placeholder="01 Jul 2026" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Tentative End Date</div>
                <input style={inputStyle} value={d.tentativeEnd} onChange={e => setD({ ...d, tentativeEnd: e.target.value })} placeholder="30 Sep 2026" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Actual Completion Date</div>
                <input style={inputStyle} value={d.actualCompletion} onChange={e => setD({ ...d, actualCompletion: e.target.value })} placeholder="—" />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 13 }}>
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

            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Description</div>
              <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} value={d.desc} onChange={e => setD({ ...d, desc: e.target.value })} />
            </div>

            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>
              Attachments <span style={{ color: C.ink3 }}>· SOW, specs, briefs</span>
            </div>
            
            <label 
              onDragOver={e => { e.preventDefault(); setDrag(true); }} 
              onDragLeave={() => setDrag(false)} 
              onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              style={{ 
                display: "block", 
                border: `1.5px dashed ${drag ? C.accent : C.lineStrong}`, 
                borderRadius: 8, 
                padding: "18px 14px", 
                textAlign: "center", 
                cursor: "pointer", 
                background: drag ? C.accentSoft : "#FBFBF9" 
              }}
            >
              <input type="file" multiple accept=".pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.zip" style={{ display: "none" }} onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <Icon n="upload" size={18} color={C.ink3} />
                <div style={{ fontSize: 12.5, color: C.ink2 }}>
                  <span style={{ color: C.accent, fontWeight: 600 }}>Click to upload</span> or drag & drop
                </div>
                <div style={{ fontSize: 11, color: C.ink3 }}>PDF, DOCX, XLSX, PPT, JPG, PNG, ZIP</div>
              </div>
            </label>

            {files.length > 0 && (
              <div style={{ marginTop: 10, border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden" }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderBottom: i < files.length - 1 ? `1px solid ${C.line}` : "none" }}>
                    <span style={{ fontSize: "9.5px", fontWeight: 700, color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 4, padding: "2px 5px", minWidth: 38, textAlign: "center" }}>{f.type}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: C.ink3 }}>{f.by} · {f.date} · {f.version}</div>
                    </div>
                    <button onClick={e => { e.preventDefault(); setFiles(prev => prev.filter((_, x) => x !== i)); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 3, display: "flex" }}>
                      <Icon n="x" size={14} color={C.ink3} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Staff Capacity Allocations */}
        {step === 2 && (
          <div className="fade-in">
            <div style={{ fontSize: "12.5px", color: C.ink2, marginBottom: 12 }}>
              Discover resources by skill, role and live availability. Weekly capacity is 40h = 100%.
            </div>
            
            {/* Filter controls */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, width: "100%" }}>
                <Icon n="search" size={14} color={C.ink3} />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, role, skill..." style={{ border: "none", outline: "none", fontSize: "12.5px", color: C.ink, background: "transparent", width: "100%" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <select value={skill} onChange={e => setSkill(e.target.value)} style={{ ...inputStyle, border: `1px solid ${C.line}`, width: "auto", padding: "7px 10px", fontSize: "12.5px", background: C.surface, cursor: "pointer", outline: "none" }}>
                {allSkills.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, border: `1px solid ${C.line}`, width: "auto", padding: "7px 10px", fontSize: "12.5px", background: C.surface, cursor: "pointer", outline: "none" }}>
                {allRoles.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={dept} onChange={e => setDept(e.target.value)} style={{ ...inputStyle, border: `1px solid ${C.line}`, width: "auto", padding: "7px 10px", fontSize: "12.5px", background: C.surface, cursor: "pointer", outline: "none" }}>
                {depts.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={availMin} onChange={e => setAvailMin(e.target.value)} style={{ ...inputStyle, border: `1px solid ${C.line}`, width: "auto", padding: "7px 10px", fontSize: "12.5px", background: C.surface, cursor: "pointer", outline: "none" }}>
                {["Any availability", "Available > 10 hrs", "Available > 20 hrs", "Available > 30 hrs"].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={utilMax} onChange={e => setUtilMax(e.target.value)} style={{ ...inputStyle, border: `1px solid ${C.line}`, width: "auto", padding: "7px 10px", fontSize: "12.5px", background: C.surface, cursor: "pointer", outline: "none" }}>
                {["Any utilization", "Utilization < 70%", "Utilization < 80%", "Utilization < 90%"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Resources list */}
            {resourcesList.length === 0 ? (
              <Empty msg="No resources match these filters." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {resourcesList.map(r => {
                  const sel = !!picked[r.id];
                  const u = getResourceUtil(r.id);
                  const allocH = hrs(u);
                  const newU = u + (sel ? picked[r.id].pct : 0);
                  const over = newU > 100;
                  const showBreak = openRes === r.id;

                  return (
                    <div key={r.id} style={{ border: `1px solid ${sel ? C.accent : C.line}`, borderRadius: 8, padding: "12px 14px", background: C.surface }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{r.name}</div>
                          <div style={{ fontSize: 11.5, color: C.ink3 }}>{r.designation} · {r.dept}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 7 }}>
                            {(r.skills || []).map(s => (
                              <span key={s} style={{ fontSize: 10.5, color: C.ink2, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 99, padding: "2px 8px" }}>{s}</span>
                            ))}
                          </div>
                        </div>
                        <button 
                          className={sel ? "primary" : "demo"} 
                          style={sel ? { ...btnPrimary, padding: "6px 12px" } : btnGhost} 
                          onClick={() => { toggleResource(r.id); if (!sel) setOpenRes(null); }}
                        >
                          {sel ? "Added" : "Add"}
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 16, marginTop: 11, flexWrap: "wrap" }}>
                        {[
                          ["Capacity", "40h"],
                          ["Allocated", allocH + "h"],
                          ["Available", getResourceAvailHours(r.id) + "h"],
                          ["Utilization", u + "%"]
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div style={{ fontSize: 10, color: C.ink3, textTransform: "uppercase", letterSpacing: ".03em" }}>{k}</div>
                            <div className="num" style={{ fontSize: 13, color: k === "Utilization" && u > 100 ? C.warn : C.ink, marginTop: 1 }}>{v}</div>
                          </div>
                        ))}
                        <button 
                          className="lnk" 
                          onClick={() => setOpenRes(showBreak ? null : r.id)} 
                          style={{ border: "none", background: "none", color: C.ink2, fontSize: "11.5px", cursor: "pointer", marginLeft: "auto", alignSelf: "flex-end", display: "inline-flex", alignItems: "center", gap: 3 }}
                        >
                          Allocations <Icon n={showBreak ? "down" : "right"} size={12} color={C.ink3} />
                        </button>
                      </div>

                      {showBreak && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }} className="fade-in">
                          {getResourceAllocs(r.id).map((a, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: C.ink2 }}>
                              <span>{a.name}</span>
                              <span className="num">{a.pct}% · {hrs(a.pct)}h</span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: getResourceAvailHours(r.id) > 0 ? C.ok : C.ink3, fontWeight: 600 }}>
                            <span>Available</span>
                            <span className="num">{Math.round((getResourceAvailHours(r.id) / CAP) * 100)}% · {getResourceAvailHours(r.id)}h</span>
                          </div>
                        </div>
                      )}

                      {/* Expanded slider when added */}
                      {sel && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}` }} className="fade-in">
                          <div style={{ fontSize: 11, color: C.ink3, marginBottom: 6 }}>Capacity allocation</div>
                          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                            {[10, 25, 50, 75, 100].map(v => (
                              <button 
                                key={v} 
                                onClick={() => setPct(r.id, v)} 
                                style={{ 
                                  flex: 1, 
                                  border: `1px solid ${picked[r.id].pct === v ? C.ink : C.line}`, 
                                  background: picked[r.id].pct === v ? C.ink : C.surface, 
                                  color: picked[r.id].pct === v ? "#fff" : C.ink2, 
                                  borderRadius: 6, 
                                  padding: "6px 0", 
                                  fontSize: 12, 
                                  cursor: "pointer", 
                                  fontWeight: 500 
                                }}
                              >
                                {v}%
                              </button>
                            ))}
                          </div>
                          
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, color: C.ink3, marginBottom: 4 }}>Planned hours/wk (auto)</div>
                              <input 
                                className="num" 
                                type="number" 
                                min="0" 
                                max="40" 
                                value={picked[r.id].hours} 
                                onChange={e => {
                                  const h = Math.min(CAP, Math.max(0, parseInt(e.target.value) || 0));
                                  setPickedField(r.id, "hours", h);
                                  setPickedField(r.id, "pct", Math.round((h / CAP) * 100));
                                }} 
                                style={{ ...inputStyle, padding: "7px 9px" }} 
                              />
                            </div>
                            <div style={{ flex: 1.3 }}>
                              <div style={{ fontSize: 11, color: C.ink3, marginBottom: 4 }}>Billing type</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {["Billable", "Non-Billable"].map(b => (
                                  <button 
                                    key={b} 
                                    onClick={() => setBilling(r.id, b)} 
                                    style={{ 
                                      flex: 1, 
                                      border: `1px solid ${picked[r.id].billing === b ? C.ink : C.line}`, 
                                      background: picked[r.id].billing === b ? C.ink : C.surface, 
                                      color: picked[r.id].billing === b ? "#fff" : C.ink2, 
                                      borderRadius: 6, 
                                      padding: "7px 0", 
                                      fontSize: "11.5px", 
                                      cursor: "pointer", 
                                      fontWeight: 500 
                                    }}
                                  >
                                    {b}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {picked[r.id].billing === "Billable" && (
                            <div style={{ marginTop: 10 }} className="fade-in">
                              <div style={{ fontSize: 11, color: C.ink3, marginBottom: 4 }}>Billable hours/wk</div>
                              <input 
                                className="num" 
                                type="number" 
                                min="0" 
                                max="40" 
                                value={picked[r.id].billable} 
                                onChange={e => setPickedField(r.id, "billable", Math.min(CAP, Math.max(0, parseInt(e.target.value) || 0)))} 
                                style={{ ...inputStyle, padding: "7px 9px", maxWidth: 120 }} 
                              />
                            </div>
                          )}
                          {over && (
                            <div style={{ marginTop: 10, fontSize: "11.5px", color: C.warn, display: "flex", alignItems: "center", gap: 6, background: C.warnSoft, padding: "8px 10px", borderRadius: 6 }}>
                              <Icon n="alert" size={13} color={C.warn} /> 
                              This resource exceeds available capacity by {newU - 100}%. PM override allowed.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Project Summary Review */}
        {step === 3 && (
          <div className="fade-in">
            <Panel title="Project summary" sub="Confirm settings before creating">
              <dl style={{ margin: 0 }}>
                {[
                  ["Project", d.name || "—"],
                  ["Client", d.client || "—"],
                  ["Type", d.type],
                  ["Priority", d.priority],
                  ["Timeline", `${d.start || "—"} → ${d.tentativeEnd || "—"} (Actual: ${d.actualCompletion || "—"})`],
                  ["Estimated Budgeted Hours", `${d.estimated}h`],
                  ["Status", d.status]
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                    <dt style={{ color: C.ink3 }}>{k}</dt>
                    <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>{v}</dd>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}>
                  <dt style={{ color: C.ink3 }}>Attachments</dt>
                  <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>{files.length ? `${files.length} file(s)` : "None"}</dd>
                </div>
              </dl>
              {d.desc && (
                <div style={{ fontSize: "12.5px", color: C.ink2, marginTop: 10, borderTop: `1px solid ${C.line}`, paddingTop: 10, lineHeight: 1.5 }}>
                  <strong>Description:</strong> {d.desc}
                </div>
              )}
            </Panel>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
                Resource Allocations ({Object.keys(picked).length})
              </div>
              {Object.keys(picked).length === 0 ? (
                <Empty msg="No resources allocated to this project." />
              ) : (
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, padding: "8px 12px" }}>
                  {Object.keys(picked).map(id => {
                    const name = people.find(r => r.id === id)?.name || id;
                    const pResource = picked[id];
                    return (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }} className="row">
                        <span style={{ fontWeight: 500, color: C.ink }}>{name}</span>
                        <span className="num" style={{ color: C.ink2 }}>
                          {pResource.pct}% capacity ({pResource.hours}h/wk) · {pResource.billing}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Sub-drawer to create a client */}
      {newClientName !== null && (
        <CreateClientDrawer 
          initialName={newClientName} 
          onClose={() => setNewClientName(null)} 
          onSave={handleClientSave} 
        />
      )}
    </>
  );
}
