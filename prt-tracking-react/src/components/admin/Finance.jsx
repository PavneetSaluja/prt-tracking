import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { Panel, Tag, KPI, Empty, Modal, btnGhost, btnPrimary, inputStyle, Dot } from '../common/UI';

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

const INCOME_CATS = ["Project Billing", "Retainer", "Consulting", "Other Income"];
const EXPENSE_CATS = ["Salary Cost", "Vendor Cost", "Software Cost", "Marketing", "Infrastructure", "Other Expense"];

// Formatting helpers
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const inrC = n => {
  const a = Math.abs(n);
  const s = n < 0 ? "-" : "";
  if (a >= 10000000) return s + "₹" + (a / 10000000).toFixed(2) + " Cr";
  if (a >= 100000) return s + "₹" + (a / 100000).toFixed(1) + " L";
  return s + inr(a);
};

// ── Add Finance Entry Modal ────────────────────────────────────────────

function AddFinanceModal({ onClose, onAdd, projects }) {
  const [type, setType] = useState("Income");
  const [proj, setProj] = useState("ipo");
  const [cat, setCat] = useState("Project Billing");
  const [date, setDate] = useState("");
  const [amt, setAmt] = useState("");
  const [desc, setDesc] = useState("");

  const cats = type === "Income" ? INCOME_CATS : EXPENSE_CATS;

  const handleSubmit = () => {
    if (!amt || parseFloat(amt) <= 0) return;
    onAdd({
      type,
      proj: proj === "org" ? null : proj,
      cat,
      date: date.trim() || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      amt: parseFloat(amt),
      desc: desc.trim() || "—"
    });
  };

  return (
    <Modal
      title="Add Finance Entry"
      onClose={onClose}
      footer={(
        <>
          <button className="demo" style={btnGhost} onClick={onClose}>Cancel</button>
          <button className="primary" style={btnPrimary} onClick={handleSubmit} disabled={!amt}>
            Add Entry
          </button>
        </>
      )}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Type</div>
            <select 
              style={inputStyle} 
              value={type} 
              onChange={e => {
                const nextType = e.target.value;
                setType(nextType);
                setCat(nextType === "Income" ? INCOME_CATS[0] : EXPENSE_CATS[0]);
              }}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Category</div>
            <select style={inputStyle} value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Project Link</div>
          <select style={inputStyle} value={proj} onChange={e => setProj(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            <option value="org">Org-wide / General</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Date</div>
            <input style={inputStyle} value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. 15 Jun 2026" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Amount (₹) *</div>
            <input className="num" style={inputStyle} type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="e.g. 500000" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: C.ink2, marginBottom: 5 }}>Description</div>
          <input style={inputStyle} value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Milestone 2 design retainer" />
        </div>
      </div>
    </Modal>
  );
}

// ── Finance Overview Ledger ────────────────────────────────────────────

export default function Finance({ showToast }) {
  const { finance, projects, addFinanceEntry } = useDatabase();
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterProj, setFilterProj] = useState("All projects");
  const [addOpen, setAddOpen] = useState(false);

  // Reusable project name helper
  const getProjectName = (projId) => {
    if (!projId) return "Org-wide";
    return projects.find(p => p.id === projId)?.name || projId;
  };

  // Calculations
  const revenueTotal = finance.filter(f => f.type === "Income").reduce((sum, f) => sum + f.amt, 0);
  const expenseTotal = finance.filter(f => f.type === "Expense").reduce((sum, f) => sum + f.amt, 0);
  const netIncome = revenueTotal - expenseTotal;

  // Filter ledger list
  const filteredLedger = finance.filter(f => {
    const matchesType = filterType === "All" || f.type === filterType;
    const projNameStr = getProjectName(f.proj);
    const matchesProj = filterProj === "All projects" || projNameStr === filterProj;
    const searchStr = (f.cat + f.desc + projNameStr + f.type).toLowerCase();
    const matchesSearch = searchStr.includes(q.toLowerCase());
    return matchesType && matchesProj && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <KPI label="Total Revenue" value={inrC(revenueTotal)} />
        <KPI label="Total Expenses" value={inrC(expenseTotal)} />
        <KPI label="Net Income" value={inrC(netIncome)} tone={netIncome >= 0 ? C.ok : C.err} note={netIncome >= 0 ? "operating profit" : "deficit"} />
      </div>

      <div style={{ display: "flex", justifyCenter: "space-between", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        {/* Ledger actions toolbar */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", background: C.surface, minWidth: 200 }}>
            <Icon n="search" size={14} color={C.ink3} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ledger..." style={{ border: "none", outline: "none", fontSize: 12.5, color: C.ink, background: "transparent", width: "100%" }} />
          </div>
          <select 
            style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }}
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>
          <select 
            style={{ border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", fontSize: 12.5, background: C.surface, cursor: "pointer", outline: "none" }}
            value={filterProj} 
            onChange={e => setFilterProj(e.target.value)}
          >
            <option value="All projects">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            <option value="Org-wide">Org-wide / General</option>
          </select>
        </div>

        <button className="primary" style={{ ...btnPrimary, padding: "7px 12px" }} onClick={() => setAddOpen(true)}>
          <Icon n="plus" size={14} color="#fff" /> Add entry
        </button>
      </div>

      {filteredLedger.length === 0 ? (
        <Empty msg="No financial records match the current filters." />
      ) : (
        <Panel pad={false} title="Finance Ledger" sub="Audit history of income and expenses">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Date</th>
                  <th style={th}>Type</th>
                  <th style={th}>Project Link</th>
                  <th style={th}>Category</th>
                  <th style={th}>Description</th>
                  <th style={{ ...th, textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map(f => (
                  <tr key={f.id} className="row">
                    <td style={td}>{f.date}</td>
                    <td style={td}>
                      <span style={{ color: f.type === "Income" ? C.ok : C.err, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Dot c={f.type === "Income" ? C.ok : C.err} />
                        {f.type}
                      </span>
                    </td>
                    <td style={{ ...td, color: C.ink, fontWeight: 500 }}>{getProjectName(f.proj)}</td>
                    <td style={td}>{f.cat}</td>
                    <td style={td}>{f.desc}</td>
                    <td className="num" style={{ ...td, textAlign: "right", color: f.type === "Income" ? C.ok : C.ink, fontWeight: 600 }}>
                      {f.type === "Expense" ? "−" : ""}{inr(f.amt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Add entry modal */}
      {addOpen && (
        <AddFinanceModal 
          onClose={() => setAddOpen(false)}
          onAdd={data => {
            addFinanceEntry(data);
            setAddOpen(false);
          }}
          projects={projects}
        />
      )}
    </div>
  );
}
export { inr, inrC };
