import React, { useState } from 'react';
import Icon from '../common/Icon';
import { Empty, Tag, Modal, Panel, btnPrimary, btnGhost } from '../common/UI';

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

function ProjectCard({ p, nameOf, onEdit, onDelete, onRemoveResource }) {
  const [open, setOpen] = useState(false);
  
  const planned = p.resources.reduce((sum, r) => sum + (r.planned || 0), 0);
  const billable = p.resources.reduce((sum, r) => sum + (r.billable != null ? r.billable : r.planned || 0), 0);
  const actual = p.resources.reduce((sum, r) => sum + (r.actual || 0), 0);
  const consume = p.estimated ? Math.round((p.logged / p.estimated) * 100) : 0;
  
  const iconBtn = {
    border: `1px solid ${C.line}`,
    background: C.surface,
    borderRadius: 6,
    padding: 6,
    cursor: "pointer",
    display: "flex"
  };

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: C.surface, marginBottom: 14 }}>
      {/* Clickable Header card */}
      <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "15px 16px" }}>
        <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{p.client} · {p.type}</div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
            <Tag s={p.status} strong />
            <button title="Edit project" onClick={() => onEdit(p)} className="ghost" style={iconBtn}>
              <Icon n="edit" size={14} color={C.ink2} />
            </button>
            <button title="Delete project" onClick={() => onDelete(p)} className="ghost" style={iconBtn}>
              <Icon n="trash" size={14} color={C.err} />
            </button>
            <button className="ghost" onClick={() => setOpen(o => !o)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}>
              <Icon n={open ? "down" : "right"} size={15} color={C.ink3} />
            </button>
          </div>
        </div>

        {/* Project KPI Grid */}
        <div style={{ display: "flex", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
          {[
            ["Resources", p.resources.length],
            ["Planned", `${planned}h/wk`],
            ["Billable", `${billable}h/wk`],
            ["Pending Logs", p.pending || 0],
            ["Budget Spent", `${consume}%`]
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
              <div className="num" style={{ fontSize: 15, color: k === "Pending Logs" && v > 0 ? C.accent : C.ink, marginTop: 2, fontWeight: 500 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded resource audit details */}
      {open && (
        <div style={{ borderTop: `1px solid ${C.line}`, padding: 16 }} className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14, marginBottom: 14 }}>
            {[
              ["Estimated Budgeted Hours", `${p.estimated}h`, C.ink],
              ["Logged to Date", `${p.logged}h`, C.ink],
              ["Remaining Budgeted Hours", `${Math.max(0, p.estimated - p.logged)}h`, C.ink],
              ["Consumption", `${consume}%`, consume > 90 ? C.warn : C.ink]
            ].map(([k, v, col]) => (
              <div key={k}>
                <div style={{ fontSize: 10.5, color: C.ink3, textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
                <div className="num" style={{ fontSize: 15, color: col, marginTop: 3, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          
          <div style={{ height: 4, background: C.line, borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${Math.min(100, consume)}%`, background: consume > 90 ? C.warn : C.accent }} />
          </div>

          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Resource audit · planned vs actual (weekly)
          </div>
          
          {p.resources.length === 0 ? (
            <Empty msg="No resources on this project. Click edit to assign staff." />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Resource</th>
                    <th style={{ ...th, textAlign: "right" }}>Utilization Percentage</th>
                    <th style={{ ...th, textAlign: "right" }}>Allocated Hours</th>
                    <th style={{ ...th, textAlign: "right" }}>Billable</th>
                    <th style={{ ...th, textAlign: "right" }}>Actual</th>
                    <th style={{ ...th, textAlign: "right" }}>Variance</th>
                    <th style={{ ...th, textAlign: "right" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {p.resources.map(r => {
                    const v = (r.actual || 0) - (r.planned || 0);
                    return (
                      <tr key={r.id} className="row">
                        <td style={{ ...td, color: C.ink }}>{nameOf(r.id)}</td>
                        <td className="num" style={{ ...td, textAlign: "right" }}>{r.pct}%</td>
                        <td className="num" style={{ ...td, textAlign: "right" }}>{r.planned}h</td>
                        <td className="num" style={{ ...td, textAlign: "right" }}>{r.billable != null ? r.billable : r.planned}h</td>
                        <td className="num" style={{ ...td, textAlign: "right", color: C.ink }}>{r.actual || 0}h</td>
                        <td className="num" style={{ ...td, textAlign: "right", color: v > 0 ? C.warn : v < 0 ? C.ink3 : C.ok }}>
                          {v > 0 ? "+" : ""}{v}h
                        </td>
                        <td style={{ ...td, textAlign: "right" }}>
                          <button 
                            title="Remove from project" 
                            onClick={() => onRemoveResource(p.id, r.id)} 
                            className="ghost" 
                            style={{ border: "none", background: "none", cursor: "pointer", padding: 4, borderRadius: 5, display: "inline-flex" }}
                          >
                            <Icon n="trash" size={13} color={C.ink3} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ borderTop: `1px solid ${C.lineStrong}` }}>
                    <td style={{ ...td, fontWeight: 600, color: C.ink2 }}>Total</td>
                    <td style={td}></td>
                    <td className="num" style={{ ...td, textAlign: "right", fontWeight: 600 }}>{planned}h</td>
                    <td className="num" style={{ ...td, textAlign: "right", fontWeight: 600 }}>{billable}h</td>
                    <td className="num" style={{ ...td, textAlign: "right", fontWeight: 600 }}>{actual}h</td>
                    <td className="num" style={{ ...td, textAlign: "right", fontWeight: 600, color: actual - planned > 0 ? C.warn : C.ok }}>
                      {actual - planned > 0 ? "+" : ""}{actual - planned}h
                    </td>
                    <td style={td}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyProjects({ projects, nameOf, onNew, onEdit, onDelete, onRemoveResource }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const pendingCount = projects.reduce((sum, p) => sum + (p.pending || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "12.5px", color: C.ink3 }}>
          {projects.length} projects · {pendingCount} timesheets pending review
        </div>
        <button className="primary" style={btnPrimary} onClick={onNew}>
          <Icon n="plus" size={14} color="#fff" /> New project
        </button>
      </div>

      {projects.length === 0 ? (
        <Empty msg="No projects assigned to you. Click New Project to create one." />
      ) : (
        projects.map(p => (
          <ProjectCard 
            key={p.id} 
            p={p} 
            nameOf={nameOf} 
            onEdit={onEdit} 
            onDelete={setDeleteTarget} 
            onRemoveResource={onRemoveResource}
          />
        ))
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal 
          title="Delete project" 
          onClose={() => setDeleteTarget(null)}
          footer={(
            <>
              <button className="demo" style={btnGhost} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button 
                className="primary" 
                style={{ ...btnPrimary, background: C.err }} 
                onClick={handleDeleteConfirm}
              >
                <Icon n="trash" size={13} color="#fff" /> Delete project
              </button>
            </>
          )}
        >
          <div style={{ fontSize: "13.5px", color: C.ink, marginBottom: 6 }}>
            Delete project <b>{deleteTarget.name}</b>?
          </div>
          <div style={{ fontSize: "12.5px", color: C.ink2, lineHeight: 1.5 }}>
            This removes the project and frees the capacity allocations for its {deleteTarget.resources.length} resource(s). This action cannot be undone.
          </div>
        </Modal>
      )}
    </div>
  );
}
