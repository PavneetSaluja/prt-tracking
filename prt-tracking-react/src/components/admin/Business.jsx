import React from 'react';
import { useDatabase } from '../../state/db';
import { Panel, KPI } from '../common/UI';

const C = {
  line: "#E7E6E0",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  accent: "#38618C",
  ok: "#3F7A52",
  warn: "#9A6B1E",
  err: "#A23B3B"
};

const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const inrC = n => {
  const a = Math.abs(n);
  const s = n < 0 ? "-" : "";
  if (a >= 10000000) return s + "₹" + (a / 10000000).toFixed(2) + " Cr";
  if (a >= 100000) return s + "₹" + (a / 100000).toFixed(1) + " L";
  return s + inr(a);
};

// ── Donut Chart ────────────────────────────────────────────────────────

function Donut({ data, size = 148, thick = 20 }) {
  const r = (size - thick) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${cx} ${cx})`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={C.line} strokeWidth={thick} />
        {data.map((d, i) => {
          const len = (d.value / total) * circ;
          const off = (acc / total) * circ;
          acc += d.value;
          return (
            <circle 
              key={i} 
              cx={cx} 
              cy={cx} 
              r={r} 
              fill="none" 
              stroke={d.color} 
              strokeWidth={thick} 
              strokeDasharray={`${len} ${circ - len}`} 
              strokeDashoffset={-off} 
            />
          );
        })}
      </g>
      <text x={cx} y={cx - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill={C.ink} className="num">{total}</text>
      <text x={cx} y={cx + 15} textAnchor="middle" fontSize="10" fill={C.ink3}>projects</text>
    </svg>
  );
}

// ── P&L Trend Line Chart ────────────────────────────────────────────────

function Trend({ data }) {
  const W = 560;
  const H = 210;
  const pl = 44;
  const pr = 14;
  const pt = 14;
  const pb = 26;

  const max = Math.max(...data.flatMap(d => [d.rev, d.exp])) * 1.18;
  const xs = i => pl + (i / (data.length - 1)) * (W - pl - pr);
  const ys = v => H - pb - (v / max) * (H - pt - pb);
  
  const path = k => data.map((d, i) => 
    `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(k === "profit" ? d.rev - d.exp : d[k]).toFixed(1)}`
  ).join(" ");
  
  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(max * f));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {grid.map((g, i) => {
          const y = ys(g);
          return (
            <g key={i}>
              <line x1={pl} x2={W - pr} y1={y} y2={y} stroke={C.line} />
              <text x={pl - 8} y={y + 3} textAnchor="end" fontSize="9.5" fill={C.ink3} className="num">{g}L</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={i} x={xs(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={C.ink3}>{d.m}</text>
        ))}
        {[
          { k: "exp", col: C.ink3 },
          { k: "profit", col: C.ok },
          { k: "rev", col: C.accent }
        ].map(({ k, col }) => (
          <path key={k} d={path(k)} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {data.map((d, i) => (
          <circle key={i} cx={xs(i)} cy={ys(d.rev)} r="2.6" fill={C.accent} />
        ))}
      </svg>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6 }}>
        {[
          ["Revenue", C.accent],
          ["Expenses", C.ink3],
          ["Profit", C.ok]
        ].map(([l, c]) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11.5px", color: C.ink2 }}>
            <span style={{ width: 14, height: 2.5, background: c, borderRadius: 2 }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Business Dashboard ──────────────────────────────────────────────────

const PNL_SEEDS = [
  { m: "Jan", rev: 62, exp: 45 },
  { m: "Feb", rev: 70, exp: 48 },
  { m: "Mar", rev: 75, exp: 52 },
  { m: "Apr", rev: 80, exp: 50 },
  { m: "May", rev: 88, exp: 58 },
  { m: "Jun", rev: 95, exp: 60 }
];

export default function Business() {
  const { finance, projects, people, sales } = useDatabase();

  // Dynamic operations metrics calculations
  const totalIncome = finance.filter(f => f.type === "Income").reduce((sum, f) => sum + f.amt, 0);
  const totalExpense = finance.filter(f => f.type === "Expense").reduce((sum, f) => sum + f.amt, 0);
  const netProfit = totalIncome - totalExpense;
  const marginPct = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const activeProjectsCount = projects.filter(p => p.status === "Active").length;
  const activeStaffCount = people.filter(p => p.status === "Active").length;
  const salesAchievedTotal = sales.reduce((sum, s) => sum + s.achieved, 0);

  // Status distributions for Donut
  const activeCount = projects.filter(p => p.status === "Active").length;
  const completedCount = projects.filter(p => p.status === "Completed").length;
  const onHoldCount = projects.filter(p => p.status === "On-Hold" || p.status === "On Hold").length;
  const delayedCount = projects.filter(p => p.status === "Delayed").length;
  const pipelineCount = projects.filter(p => p.status === "Pipeline").length;

  const statusDist = [
    { label: "Active", value: activeCount, color: C.accent },
    { label: "Completed", value: completedCount, color: C.ok },
    { label: "On Hold", value: onHoldCount, color: C.warn },
    { label: "Delayed", value: delayedCount, color: C.err },
    { label: "Pipeline", value: pipelineCount, color: C.ink3 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }} className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <KPI label="Revenue" value={inrC(totalIncome)} />
        <KPI label="Expenses" value={inrC(totalExpense)} />
        <KPI label="Net Income" value={inrC(netProfit)} note={`${marginPct}% margin`} tone={netProfit >= 0 ? C.ok : C.err} />
        <KPI label="Active Projects" value={activeProjectsCount} />
        <KPI label="Active Employees" value={activeStaffCount} />
        <KPI label="Sales Closed" value={inrC(salesAchievedTotal)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.1fr", gap: 16, alignItems: "start" }}>
        <Panel title="P&L Trend" sub="Revenue · Expenses · Profit (₹ lakhs / month)">
          <Trend data={PNL_SEEDS} />
        </Panel>
        <Panel title="Project Status" sub="Across the entire portfolio">
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "space-around" }}>
            <Donut data={statusDist} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 120 }}>
              {statusDist.map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.ink }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: s.color, display: "inline-block" }} />
                    {s.label}
                  </span>
                  <span className="num" style={{ color: C.ink2 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
      <style>{`
        @media (max-width: 800px) {
          div[style*="gridTemplateColumns: 1.6fr 1.1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
