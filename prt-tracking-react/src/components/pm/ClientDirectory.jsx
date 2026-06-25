import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Drawer, Tag, Empty, btnGhost } from '../common/UI';

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
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  whiteSpace: "nowrap"
};

const td = {
  fontSize: 13,
  color: C.ink2,
  padding: "11px 12px",
  textAlign: "left",
  borderBottom: `1px solid ${C.line}`,
  verticalAlign: "middle"
};

// ── Client Detail Drawer Component (remains as a full slideout view option) ──
export function ClientDetailDrawer({ client, projects, onClose }) {
  const clientProjects = projects.filter(p => p.clientId === client.id || p.client === client.name);

  return (
    <Drawer
      width={460}
      title={`Client Profile · ${client.name}`}
      onClose={onClose}
      footer={<button className="demo" style={btnGhost} onClick={onClose}>Close profile</button>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-in">
        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
            Client Details
          </div>
          <dl style={{ margin: 0 }}>
            {[
              ["Industry", client.industry],
              ["Website", client.website || "—"],
              ["Country", client.country],
              ["Office Address", client.address || "—"],
              ["Status", client.status]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>
                  {k === "Website" && v && v !== "—" ? (
                    <a href={v.startsWith("http") ? v : `https://${v}`} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>{v}</a>
                  ) : k === "Status" ? (
                    <Tag s={v} />
                  ) : v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
            Primary Contact Person
          </div>
          <dl style={{ margin: 0 }}>
            {[
              ["Contact Name", client.primaryName || client.contact || "—"],
              ["Email Address", client.primaryEmail || client.email || "—"],
              ["Phone Number", client.primaryPhone || client.phone || "—"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>
                  {k === "Email Address" && v && v !== "—" ? (
                    <a href={`mailto:${v}`} style={{ color: C.accent }}>{v}</a>
                  ) : v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
            Secondary Contact Person
          </div>
          <dl style={{ margin: 0 }}>
            {[
              ["Contact Name", client.secondaryName || "—"],
              ["Email Address", client.secondaryEmail || "—"],
              ["Phone Number", client.secondaryPhone || "—"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3 }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, fontWeight: 500 }}>
                  {k === "Email Address" && v && v !== "—" ? (
                    <a href={`mailto:${v}`} style={{ color: C.accent }}>{v}</a>
                  ) : v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {client.notes && (
          <div>
            <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Notes</div>
            <div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.5, background: "#FBFBF9", border: `1px solid ${C.line}`, borderRadius: 6, padding: 10 }}>
              {client.notes}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Projects under this client ({clientProjects.length})
          </div>
          {clientProjects.length === 0 ? (
            <Empty msg="No projects registered for this client." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {clientProjects.map(p => {
                const plannedWeekly = p.resources?.reduce((sum, r) => sum + (r.planned || 0), 0) || 0;
                return (
                  <div key={p.id} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: "11px 13px", background: C.surface }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{p.name}</span>
                      <Tag s={p.status} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.ink3 }} className="num">
                      <span>Staff assigned: {p.resources?.length || 0}</span>
                      <span>Total allocation: {plannedWeekly}h/wk</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

// ── Client Directory Table ─────────────────────────────────────────────
export default function ClientDirectory() {
  const { clients, projects, people } = useDatabase();
  const [q, setQ] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const clientStats = (c) => {
    const ps = projects.filter(p => p.clientId === c.id || p.client === c.name);
    return {
      ps,
      total: ps.length,
      active: ps.filter(p => p.status === "Active").length
    };
  };

  const getResourceName = (resId) => {
    return people.find(r => r.id === resId)?.name || resId;
  };

  const filteredClients = clients.filter(c => {
    const searchStr = (c.name + (c.contact || "") + (c.industry || "") + (c.country || "") + (c.phone || "") + (c.email || "") + (c.address || "") + (c.notes || "")).toLowerCase();
    return searchStr.includes(q.toLowerCase());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-in">
      {/* Search box */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 260 }}>
          <Icon n="search" size={14} color={C.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search clients by name, contact, notes..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
          {q && (
            <button onClick={() => setQ("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <Icon n="x" size={14} color={C.ink3} />
            </button>
          )}
        </div>
        <div style={{ fontSize: 12.5, color: C.ink3 }}>
          {filteredClients.length} clients registered
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <Empty msg="No clients found matching the search query." />
      ) : (
        <Panel pad={false}>
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
                  <th style={{ ...th, textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(c => {
                  const s = clientStats(c);
                  const isExpanded = expandedId === c.id;
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
                        <td style={{ ...td, textAlign: "right" }}>
                          <button
                            title="View Profile Drawer"
                            className="ghost"
                            onClick={() => setSelectedClient(c)}
                            style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}
                          >
                            <Icon n="eye" size={13} color={C.ink2} />
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded projects view */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} style={{ padding: "0 0 12px 0", background: "#FBFBF9", borderBottom: `1px solid ${C.line}` }}>
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
        </Panel>
      )}

      {/* Slideout profile drawer */}
      {selectedClient && (
        <ClientDetailDrawer 
          client={selectedClient} 
          projects={projects}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
