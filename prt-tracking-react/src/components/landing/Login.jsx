import React, { useState } from 'react';
import { useDatabase } from '../../state/db';
import Icon from '../common/Icon';
import { btnPrimary, inputStyle } from '../common/UI';

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1",
  line: "#E7E6E0",
  lineStrong: "#D8D7CF",
  accent: "#38618C",
  accentSoft: "#EDF1F6"
};

export default function Login() {
  const { loginAs, people } = useDatabase();
  const [email, setEmail] = useState('marcus.v@pulseorganizer.io');
  const [pw, setPw] = useState('password123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (selectedEmail) => {
    const targetEmail = selectedEmail || email;
    const user = loginAs(targetEmail);
    if (user) {
      setError('');
    } else {
      setError('Invalid email address. Please use one of the demo emails.');
    }
  };

  const demoUsers = [
    {
      id: "marcus",
      name: "Marcus Vance",
      role: "Resource",
      email: "marcus.v@pulseorganizer.io",
      desc: "Log weekly timesheets and manage skills.",
      icon: "user"
    },
    {
      id: "sarah",
      name: "Sarah Jenkins",
      role: "Project Manager",
      email: "sarah.j@pulseorganizer.io",
      desc: "Manage projects, approve logs, and allocate resources.",
      icon: "folder"
    },
    {
      id: "arjun",
      name: "Arjun Mehta",
      role: "Admin / Operations",
      email: "arjun.m@pulseorganizer.io",
      desc: "Business KPIs, P&L, ledger, and employee rosters.",
      icon: "shield"
    }
  ];

  const handleSelectDemo = (user) => {
    setEmail(user.email);
    handleLogin(user.email);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex" }} className="fade-in">
      {/* Left branding panel */}
      <div 
        style={{ 
          flex: 1, 
          background: C.ink, 
          color: "#fff", 
          padding: "56px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          minWidth: 320 
        }} 
        className="login-left"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center" }}>
            <Icon n="clock" size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>Pulse</span>
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0, maxWidth: 420 }}>
            Your week, in one quiet screen.
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", marginTop: 14, maxWidth: 380, lineHeight: 1.55 }}>
            Resource scheduling, capacity audits, timesheets, and operations. Real-time platform metrics.
          </p>
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.45)", display: "flex", gap: 12 }}>
          <span>Allocations</span>
          <span>·</span>
          <span>Approvals</span>
          <span>·</span>
          <span>Ledger & Operations</span>
        </div>
      </div>

      {/* Right form and profiles panel */}
      <div style={{ flex: 1.2, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.ink, margin: 0 }}>Log in to Pulse</h2>
            <p style={{ fontSize: 13.5, color: C.ink2, margin: "6px 0 0" }}>Select a pre-configured demo account to enter the platform instantly.</p>
          </div>

          {/* Quick-login cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {demoUsers.map(u => (
              <button
                key={u.id}
                onClick={() => handleSelectDemo(u)}
                style={{
                  textAlign: "left",
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  transition: "all 0.15s ease-in-out",
                  outline: "none"
                }}
                className="demo"
              >
                <div style={{ 
                  width: 38, 
                  height: 38, 
                  borderRadius: 8, 
                  background: C.accentSoft, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon n={u.icon} size={18} color={C.accent} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{u.name}</span>
                    <span style={{ fontSize: 11.5, color: C.ink3 }}>({u.role})</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.ink2, marginTop: 4, lineHeight: 1.4 }}>{u.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <span style={{ height: 1, background: C.line, flex: 1 }} />
            <span style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.05em" }}>Or sign in manually</span>
            <span style={{ height: 1, background: C.line, flex: 1 }} />
          </div>

          {/* Manual Credentials form */}
          <div>
            {error && (
              <div style={{ background: "#FBF1F0", border: "1px solid #A23B3B", borderRadius: 6, padding: "10px 12px", color: "#A23B3B", fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.ink2, display: "block", marginBottom: 6, fontWeight: 500 }}>Email Address</label>
              <input 
                className="txt" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={inputStyle} 
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: C.ink2, display: "block", marginBottom: 6, fontWeight: 500 }}>Password</label>
              <input 
                className="txt" 
                type="password" 
                value={pw} 
                onChange={e => setPw(e.target.value)} 
                style={inputStyle} 
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <label style={{ fontSize: 12.5, color: C.ink2, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={remember} 
                  onChange={e => setRemember(e.target.checked)} 
                  style={{ accentColor: C.ink }}
                /> 
                Remember me
              </label>
              <a className="lnk" style={{ fontSize: 12.5, color: C.ink3, textDecoration: "none", cursor: "pointer" }}>Forgot password?</a>
            </div>
            <button 
              className="primary" 
              onClick={() => handleLogin()} 
              style={{ ...btnPrimary, width: "100%", justifyContent: "center", padding: "11px" }}
            >
              Log in <Icon n="arrow" size={15} color="#fff" />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 760px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}
