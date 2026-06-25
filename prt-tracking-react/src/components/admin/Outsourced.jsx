import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Modal, Tag, Empty, btnGhost, btnPrimary, inputStyle } from '../common/UI';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  ok: "#3F7A52",
  warn: "#9A6B1E",
  err: "#A23B3B"
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

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>{label}</div>
    {children}
  </div>
);

export default function Outsourced({ q }) {
  const { outsourced, clients, projects, addOutsourced, updateOutsourced, deleteOutsourced } = useDatabase();
  const [clientFilt, setClientFilt] = useState("All clients");
  const [sourceFilt, setSourceFilt] = useState("All sources");
  const [statusFilt, setStatusFilt] = useState("All statuses");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(null);

  const clientList = ["All clients", ...Array.from(new Set(clients.map(c => c.name)))];
  const sourceList = ["All sources", ...Array.from(new Set(outsourced.map(o => o.source)))];

  const getProjectName = (projId) => {
    return projects.find(p => p.id === projId)?.name || projId || "—";
  };

  const list = outsourced.filter(o => {
    const clientObj = clients.find(c => c.id === o.clientId);
    const clientName = clientObj ? clientObj.name : "";
    const projName = getProjectName(o.projId);
    if (clientFilt !== "All clients" && clientName !== clientFilt) return false;
    if (sourceFilt !== "All sources" && o.source !== sourceFilt) return false;
    if (statusFilt !== "All statuses" && o.status !== statusFilt) return false;
    
    return (
      !q ||
      o.name.toLowerCase().includes(q.toLowerCase()) ||
      clientName.toLowerCase().includes(q.toLowerCase()) ||
      o.profile.toLowerCase().includes(q.toLowerCase()) ||
      o.source.toLowerCase().includes(q.toLowerCase()) ||
      projName.toLowerCase().includes(q.toLowerCase())
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <select
          value={clientFilt}
          onChange={e => setClientFilt(e.target.value)}
          style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: "12.5px", color: C.ink, background: C.surface, cursor: "pointer" }}
        >
          {clientList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sourceFilt}
          onChange={e => setSourceFilt(e.target.value)}
          style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: "12.5px", color: C.ink, background: C.surface, cursor: "pointer" }}
        >
          {sourceList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={statusFilt}
          onChange={e => setStatusFilt(e.target.value)}
          style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: "12.5px", color: C.ink, background: C.surface, cursor: "pointer" }}
        >
          {["All statuses", "Active", "Inactive"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: C.ink3 }}>{list.length} of {outsourced.length}</span>
          <button className="primary" style={{ ...btnPrimary, padding: "7px 12px" }} onClick={() => setAdd(true)}>
            <Icon n="plus" size={14} color="#fff" /> Add resource
          </button>
        </div>
      </div>

      <Panel pad={false} title="Outsourced resources directory" sub="Hired from external vendors with rate margins">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Aligned Client & Project</th>
                <th style={th}>Profile</th>
                <th style={th}>Vendor Source</th>
                <th style={{ ...th, textAlign: "right" }}>Input Rate</th>
                <th style={{ ...th, textAlign: "right" }}>Billing Rate</th>
                <th style={{ ...th, textAlign: "right" }}>Margin</th>
                <th style={th}>Timeline</th>
                <th style={th}>Allocation</th>
                <th style={th}>Contract</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={12}>
                    <Empty msg="No outsourced resources match the current filters." />
                  </td>
                </tr>
              ) : (
                list.map(o => {
                  const clientObj = clients.find(c => c.id === o.clientId);
                  const clientName = clientObj ? clientObj.name : "—";
                  const projName = getProjectName(o.projId);
                  const inputNum = parseFloat(o.input.replace(/[^0-9.]/g, "")) || 0;
                  const billingNum = parseFloat(o.billing.replace(/[^0-9.]/g, "")) || 0;
                  const marginVal = billingNum - inputNum;
                  const marginStr = marginVal > 0 ? "₹" + marginVal.toLocaleString("en-IN") + " + GST" : "—";

                  return (
                    <tr key={o.id} className="row" style={{ opacity: o.status === "Inactive" ? .55 : 1 }}>
                      <td style={{ ...td, color: C.ink, fontWeight: 500 }}>
                        {o.name}
                        {o.note && <div style={{ fontSize: 11, color: C.warn, fontWeight: 400 }}>{o.note}</div>}
                      </td>
                      <td style={td}>
                        {clientName}
                        <div style={{ fontSize: 11, color: C.ink3 }}>{projName}</div>
                      </td>
                      <td style={td}>
                        {o.profile}
                        <div style={{ fontSize: 11, color: C.ink3 }}>{o.skills || "—"}</div>
                      </td>
                      <td style={td}>{o.source}</td>
                      <td className="num" style={{ ...td, textAlign: "right" }}>{o.input}</td>
                      <td className="num" style={{ ...td, textAlign: "right", color: C.ok, fontWeight: 500 }}>{o.billing}</td>
                      <td className="num" style={{ ...td, textAlign: "right", color: C.accent, fontWeight: 600 }}>{marginStr}</td>
                      <td style={td}>
                        {o.start}
                        <div style={{ fontSize: 11, color: C.ink3 }}>{o.end ? `to ${o.end}` : "Ongoing"}</div>
                      </td>
                      <td style={td}>{o.allocation || "100%"}</td>
                      <td style={td}>{o.duration || "—"}</td>
                      <td style={td}><Tag s={o.status} /></td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          title="Edit"
                          className="ghost"
                          onClick={() => setEdit(o)}
                          style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}
                        >
                          <Icon n="edit" size={13} color={C.ink2} />
                        </button>
                        <button
                          title="Delete"
                          className="ghost"
                          onClick={() => deleteOutsourced(o.id)}
                          style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer" }}
                        >
                          <Icon n="ban" size={13} color={C.err} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {add && (
        <OutsourcedForm 
          clients={clients} 
          projects={projects}
          onClose={() => setAdd(false)} 
          onSave={e => {
            addOutsourced(e);
            setAdd(false);
          }} 
        />
      )}
      
      {edit && (
        <OutsourcedForm 
          clients={clients} 
          projects={projects}
          resource={edit} 
          onClose={() => setEdit(null)} 
          onSave={e => {
            updateOutsourced(edit.id, e);
            setEdit(null);
          }} 
        />
      )}
    </div>
  );
}

function OutsourcedForm({ resource, clients, projects, onClose, onSave }) {
  const [f, setF] = useState(resource || { name: "", clientId: clients[0]?.id || "", status: "Active", start: "", end: "", profile: "", source: "", input: "", billing: "", note: "", skills: "", duration: "", allocation: "100%", projId: projects[0]?.id || "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <Modal
      title={resource ? "Edit outsourced resource" : "Add outsourced resource"}
      onClose={onClose}
      w={460}
      footer={
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button className="primary" style={btnPrimary} onClick={() => { if (!f.name.trim()) return; onSave(f); }}>
            {resource ? "Save changes" : "Add resource"}
          </button>
        </>
      }
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Resource name *">
            <input style={inputStyle} value={f.name} onChange={e => set("name", e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Profile/Role">
            <input style={inputStyle} value={f.profile} onChange={e => set("profile", e.target.value)} placeholder="e.g. QA" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Aligned client">
            <select style={inputStyle} value={f.clientId} onChange={e => set("clientId", e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Aligned project">
            <select style={inputStyle} value={f.projId} onChange={e => set("projId", e.target.value)}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Vendor source">
            <input style={inputStyle} value={f.source} onChange={e => set("source", e.target.value)} placeholder="e.g. Habilelabs" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Allocation">
            <input style={inputStyle} value={f.allocation} onChange={e => set("allocation", e.target.value)} placeholder="e.g. 100%" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Input rate (cost)">
            <input style={inputStyle} value={f.input} onChange={e => set("input", e.target.value)} placeholder="e.g. 20,000 + GST" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Billing rate">
            <input style={inputStyle} value={f.billing} onChange={e => set("billing", e.target.value)} placeholder="e.g. 28,000 + GST" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Start date">
            <input style={inputStyle} value={f.start} onChange={e => set("start", e.target.value)} placeholder="e.g. 15-Dec-25" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="End date">
            <input style={inputStyle} value={f.end} onChange={e => set("end", e.target.value)} placeholder="e.g. 15-Jun-26" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Contract duration">
            <input style={inputStyle} value={f.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 6 Months" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Status">
            <select style={inputStyle} value={f.status} onChange={e => set("status", e.target.value)}>
              {["Active", "Inactive"].map(x => <option key={x}>{x}</option>)}
            </select>
          </Field>
        </div>
      </div>
      <Field label="Skill set">
        <input style={inputStyle} value={f.skills} onChange={e => set("skills", e.target.value)} placeholder="e.g. React, Testing" />
      </Field>
      <Field label="Notes">
        <input style={inputStyle} value={f.note} onChange={e => set("note", e.target.value)} placeholder="e.g. 0 paid leaves" />
      </Field>
    </Modal>
  );
}
