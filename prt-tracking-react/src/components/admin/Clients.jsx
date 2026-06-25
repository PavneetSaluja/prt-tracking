import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Drawer, Modal, Tag, Empty, btnGhost, btnPrimary, inputStyle } from '../common/UI';

const C = {
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  ok: "#3F7A52",
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

// INR helper functions
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const inrC = n => {
  const a = Math.abs(n);
  const s = n < 0 ? "-" : "";
  if (a >= 1e7) return s + "₹" + (a / 1e7).toFixed(2) + " Cr";
  if (a >= 1e5) return s + "₹" + (a / 1e5).toFixed(1) + " L";
  return s + inr(a);
};

export default function Clients({ q }) {
  const { clients, projects, finance, people, createClient, updateClient, toggleClientStatus } = useDatabase();
  const [ind, setInd] = useState("All industries");
  const [filt, setFilt] = useState("All clients");
  const [open, setOpen] = useState(null);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const clientStats = (c) => {
    const ps = projects.filter(p => p.client === c.name || p.clientId === c.id);
    return {
      ps,
      total: ps.length,
      active: ps.filter(p => p.status === "Active").length
    };
  };

  const getResourceName = (resId) => {
    return people.find(r => r.id === resId)?.name || resId;
  };

  const depts = ["All industries", ...Array.from(new Set(clients.map(c => c.industry)))];

  const list = clients.filter(c => {
    const s = clientStats(c);
    if (ind !== "All industries" && c.industry !== ind) return false;
    if (filt !== "Active clients" && c.status !== "Active") return false;
    if (filt !== "Inactive clients" && c.status !== "Inactive") return false;
    if (filt !== "With active projects" && s.active === 0) return false;
    if (filt !== "Without projects" && s.total > 0) return false;
    
    const searchStr = (c.name + (c.contact || "") + (c.industry || "") + (c.country || "") + (c.phone || "") + (c.email || "") + (c.address || "") + (c.notes || "")).toLowerCase();
    return !q || searchStr.includes(q.toLowerCase());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      <Panel
        pad={false}
        title="Client directory"
        sub="Accounts behind every project"
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={ind}
              onChange={e => setInd(e.target.value)}
              style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: "12.5px", color: C.ink, background: C.surface, cursor: "pointer" }}
            >
              {depts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={filt}
              onChange={e => setFilt(e.target.value)}
              style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: "12.5px", color: C.ink, background: C.surface, cursor: "pointer" }}
            >
              {["All clients", "Active clients", "Inactive clients", "With active projects", "Without projects"].map(x => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            <button className="primary" style={{ ...btnPrimary, padding: "7px 12px" }} onClick={() => setAdd(true)}>
              <Icon n="plus" size={14} color="#fff" /> Add client
            </button>
          </div>
        }
      >
        {list.length === 0 ? (
          <Empty msg="No clients match the current filters." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: 40 }}></th>
                  <th style={th}>Client Name</th>
                  <th style={th}>Primary Contact</th>
                  <th style={th}>Secondary Contact</th>
                  <th style={th}>Website</th>
                  <th style={th}>Office Address</th>
                  <th style={th}>Notes</th>
                  <th style={{ ...th, textAlign: "right" }}>Projects</th>
                  <th style={{ ...th, textAlign: "right" }}>Net profit</th>
                  <th style={{ ...th, textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {list.map(c => {
                  const s = clientStats(c);
                  const isExpanded = expandedId === c.id;
                  const rev = s.ps.reduce((a, p) => a + finance.filter(f => f.type === "Income" && f.proj === p.id).reduce((x, f) => x + f.amt, 0), 0);
                  const exp = s.ps.reduce((a, p) => a + finance.filter(f => f.type === "Expense" && f.proj === p.id).reduce((x, f) => x + f.amt, 0), 0);
                  return (
                    <React.Fragment key={c.id}>
                      <tr className="row" style={{ opacity: c.status === "Inactive" ? .6 : 1 }}>
                        <td style={td}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Icon n={isExpanded ? "down" : "right"} size={13} color={C.ink3} />
                          </button>
                        </td>
                        <td style={{ ...td, fontWeight: 600, color: C.ink }}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                            style={{ border: "none", background: "none", cursor: "pointer", color: C.ink, fontWeight: 600, padding: 0, textDecoration: "none", fontSize: 13, textAlign: "left" }}
                          >
                            {c.name}
                          </button>
                        </td>
                        <td style={td}>
                          <div style={{ fontWeight: 500, color: C.ink }}>{c.primaryName || c.contact || "—"}</div>
                          <div style={{ fontSize: 11, color: C.ink3 }}>{c.primaryEmail || c.email || "—"}</div>
                          <div style={{ fontSize: 11, color: C.ink3 }} className="num">{c.primaryPhone || c.phone || "—"}</div>
                        </td>
                        <td style={td}>
                          <div style={{ fontWeight: 500, color: C.ink }}>{c.secondaryName || "—"}</div>
                          <div style={{ fontSize: 11, color: C.ink3 }}>{c.secondaryEmail || "—"}</div>
                          <div style={{ fontSize: 11, color: C.ink3 }} className="num">{c.secondaryPhone || "—"}</div>
                        </td>
                        <td style={td}>
                          {c.website ? (
                            <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>{c.website}</a>
                          ) : "—"}
                        </td>
                        <td style={td}>{c.address || "—"}</td>
                        <td style={{ ...td, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.notes}>{c.notes || "—"}</td>
                        <td className="num" style={{ ...td, textAlign: "right", fontWeight: 500 }}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                            style={{ border: "none", background: "none", color: C.accent, cursor: "pointer", fontWeight: 600, fontSize: 12.5 }}
                          >
                            {s.total} {s.total === 1 ? "project" : "projects"}
                          </button>
                        </td>
                        <td className="num" style={{ ...td, textAlign: "right", color: rev - exp >= 0 ? C.ok : C.err, fontWeight: 500 }}>
                          {s.total ? inrC(rev - exp) : "—"}
                        </td>
                        <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            title="View"
                            className="ghost"
                            onClick={() => setOpen(c)}
                            style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}
                          >
                            <Icon n="eye" size={13} color={C.ink2} />
                          </button>
                          <button
                            title="Edit"
                            className="ghost"
                            onClick={() => setEdit(c)}
                            style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer", marginRight: 6 }}
                          >
                            <Icon n="edit" size={13} color={C.ink2} />
                          </button>
                          <button
                            title={c.status === "Active" ? "Deactivate" : "Reactivate"}
                            className="ghost"
                            onClick={() => toggleClientStatus(c.id)}
                            style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: 6, cursor: "pointer" }}
                          >
                            <Icon n="ban" size={13} color={c.status === "Active" ? C.err : C.ok} />
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded projects view */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={11} style={{ padding: "0 0 12px 0", background: "#FBFBF9", borderBottom: `1px solid ${C.line}` }}>
                            <div style={{ padding: "14px 20px 14px 52px" }} className="fade-in">
                              <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8, fontWeight: 600 }}>
                                Active Projects under {c.name}
                              </div>
                              {s.ps.length === 0 ? (
                                <div style={{ fontSize: 12.5, color: C.ink3, padding: "10px 0" }}>No projects registered for this client.</div>
                              ) : (
                                <table style={{ width: "100%", borderCollapse: "collapse", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6 }}>
                                  <thead>
                                    <tr>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5 }}>Project</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5 }}>PM</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5 }}>Timeline</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5 }}>Priority</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5, textAlign: "right" }}>Estimated Hours</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5, textAlign: "right" }}>Logged Hours</th>
                                      <th style={{ ...th, padding: "8px 10px", fontSize: 10.5 }}>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {s.ps.map(p => (
                                      <tr key={p.id} className="row">
                                        <td style={{ ...td, padding: "8px 10px", fontWeight: 500, color: C.ink }}>{p.name}</td>
                                        <td style={{ ...td, padding: "8px 10px" }}>{p.pmId ? getResourceName(p.pmId) : (p.pm || "Sarah Jenkins")}</td>
                                        <td style={{ ...td, padding: "8px 10px" }} className="num">{p.start} → {p.end}</td>
                                        <td style={{ ...td, padding: "8px 10px" }}><Tag s={p.priority} strong /></td>
                                        <td style={{ ...td, padding: "8px 10px", textAlign: "right" }} className="num">{p.estimated}h</td>
                                        <td style={{ ...td, padding: "8px 10px", textAlign: "right" }} className="num">{p.logged}h</td>
                                        <td style={{ ...td, padding: "8px 10px" }}><Tag s={p.status} strong /></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {open && <ClientDetail client={open} ledger={finance} projects={projects} onClose={() => setOpen(null)} />}
      
      {add && (
        <ClientForm 
          onClose={() => setAdd(false)} 
          onSave={e => {
            createClient(e);
            setAdd(false);
          }} 
        />
      )}
      
      {edit && (
        <ClientForm 
          client={edit} 
          onClose={() => setEdit(null)} 
          onSave={e => {
            updateClient(edit.id, e);
            setEdit(null);
          }} 
        />
      )}
    </div>
  );
}

function ClientForm({ client, onClose, onSave }) {
  const [f, setF] = useState(() => {
    if (client) {
      return {
        ...client,
        primaryName: client.primaryName || client.contact || "",
        primaryEmail: client.primaryEmail || client.email || "",
        primaryPhone: client.primaryPhone || client.phone || "",
        secondaryName: client.secondaryName || "",
        secondaryEmail: client.secondaryEmail || "",
        secondaryPhone: client.secondaryPhone || ""
      };
    }
    return { name: "", industry: "", primaryName: "", primaryEmail: "", primaryPhone: "", secondaryName: "", secondaryEmail: "", secondaryPhone: "", website: "", country: "", address: "", notes: "", status: "Active" };
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <Modal
      title={client ? "Edit client" : "Add client"}
      onClose={onClose}
      w={480}
      footer={
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button className="primary" style={btnPrimary} onClick={() => { if (!f.name.trim()) return; onSave(f); }}>
            {client ? "Save changes" : "Add client"}
          </button>
        </>
      }
    >
      <Field label="Client name *">
        <input style={inputStyle} value={f.name} onChange={e => set("name", e.target.value)} />
      </Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Industry">
            <input style={inputStyle} value={f.industry} onChange={e => set("industry", e.target.value)} placeholder="e.g. Retail" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Country">
            <input style={inputStyle} value={f.country} onChange={e => set("country", e.target.value)} placeholder="e.g. India" />
          </Field>
        </div>
      </div>
      
      {/* Primary Contact Details */}
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, textTransform: "uppercase", marginBottom: 8 }}>Primary Contact Person</div>
        <Field label="Name">
          <input style={inputStyle} value={f.primaryName} onChange={e => set("primaryName", e.target.value)} placeholder="Name" />
        </Field>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Email">
              <input style={inputStyle} value={f.primaryEmail} onChange={e => set("primaryEmail", e.target.value)} placeholder="Email ID" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Phone">
              <input style={inputStyle} value={f.primaryPhone} onChange={e => set("primaryPhone", e.target.value)} placeholder="Phone Number" />
            </Field>
          </div>
        </div>
      </div>

      {/* Secondary Contact Details */}
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, textTransform: "uppercase", marginBottom: 8 }}>Secondary Contact Person</div>
        <Field label="Name">
          <input style={inputStyle} value={f.secondaryName} onChange={e => set("secondaryName", e.target.value)} placeholder="Name" />
        </Field>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Email">
              <input style={inputStyle} value={f.secondaryEmail} onChange={e => set("secondaryEmail", e.target.value)} placeholder="Email ID" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Phone">
              <input style={inputStyle} value={f.secondaryPhone} onChange={e => set("secondaryPhone", e.target.value)} placeholder="Phone Number" />
            </Field>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10, display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Website">
            <input style={inputStyle} value={f.website} onChange={e => set("website", e.target.value)} placeholder="e.g. client.com" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Office address">
            <input style={inputStyle} value={f.address} onChange={e => set("address", e.target.value)} />
          </Field>
        </div>
      </div>
      <Field label="Notes">
        <textarea style={{ ...inputStyle, height: 60, resize: "none" }} value={f.notes} onChange={e => set("notes", e.target.value)} />
      </Field>
      {client && (
        <Field label="Status">
          <select style={inputStyle} value={f.status} onChange={e => set("status", e.target.value)}>
            {["Active", "Inactive"].map(x => <option key={x}>{x}</option>)}
          </select>
        </Field>
      )}
    </Modal>
  );
}

function ClientDetail({ client, ledger, projects, onClose }) {
  const ps = projects.filter(p => p.client === client.name || p.clientId === client.id);
  const entries = ledger.filter(f => ps.some(p => p.id === f.proj));
  const rev = entries.filter(f => f.type === "Income").reduce((s, f) => s + f.amt, 0);
  const exp = entries.filter(f => f.type === "Expense").reduce((s, f) => s + f.amt, 0);
  const resources = ps.reduce((s, p) => s + (p.resources?.length || 0), 0);
  const timeline = [
    ...entries.map(f => ({ t: `${f.type === "Income" ? "Revenue" : "Expense"} added — ${f.cat} (${inrC(f.amt)})`, d: f.date, c: f.type === "Income" ? C.ok : C.ink3 })),
    ...ps.map(p => ({ t: `Project created — ${p.name}`, d: p.start || "—", c: C.accent }))
  ];

  return (
    <Drawer width={480} title={client.name} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-in">
        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Overview</div>
          <dl style={{ margin: "0" }}>
            {[
              ["Industry", client.industry],
              ["Website", client.website],
              ["Country", client.country],
              ["Office Address", client.address],
              ["Status", client.status]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, textAlign: "right" }}>
                  {k === "Status" ? <Tag s={v} /> : v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Primary Contact Person</div>
          <dl style={{ margin: "0" }}>
            {[
              ["Name", client.primaryName || client.contact || "—"],
              ["Email", client.primaryEmail || client.email || "—"],
              ["Phone", client.primaryPhone || client.phone || "—"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, textAlign: "right", fontWeight: 500 }}>
                  {k === "Email" && v !== "—" ? <a href={`mailto:${v}`} style={{ color: C.accent }}>{v}</a> : v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Secondary Contact Person</div>
          <dl style={{ margin: "0" }}>
            {[
              ["Name", client.secondaryName || "—"],
              ["Email", client.secondaryEmail || "—"],
              ["Phone", client.secondaryPhone || "—"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, textAlign: "right", fontWeight: 500 }}>
                  {k === "Email" && v !== "—" ? <a href={`mailto:${v}`} style={{ color: C.accent }}>{v}</a> : v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Financial summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              ["Revenue", inrC(rev), C.ink],
              ["Expenses", inrC(exp), C.ink],
              ["Net profit", inrC(rev - exp), rev - exp >= 0 ? C.ok : C.err]
            ].map(([k, v, col]) => (
              <div key={k} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
                <div className="num" style={{ fontSize: 15, color: col, marginTop: 3, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Projects ({ps.length}) · {resources} resources
          </div>
          {ps.length === 0 ? (
            <Empty msg="No projects yet for this client." />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Project</th>
                  <th style={th}>PM</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, textAlign: "right" }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {ps.map(p => {
                  const r = ledger.filter(f => f.type === "Income" && f.proj === p.id).reduce((a, f) => a + f.amt, 0);
                  const e = ledger.filter(f => f.type === "Expense" && f.proj === p.id).reduce((a, f) => a + f.amt, 0);
                  return (
                    <tr key={p.id} className="row">
                      <td style={{ ...td, color: C.ink }}>{p.name}</td>
                      <td style={td}>{p.pm || "—"}</td>
                      <td style={td}><Tag s={p.status} strong /></td>
                      <td className="num" style={{ ...td, textAlign: "right", color: r - e >= 0 ? C.ok : C.err }}>{inrC(r - e)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Activity timeline</div>
          <div>
            {timeline.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < timeline.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ marginTop: 5 }}><Dot c={e.c} /></span>
                <div style={{ fontSize: 12.5, color: C.ink }}>
                  {e.t}
                  <span style={{ color: C.ink3 }} className="num"> · {e.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
