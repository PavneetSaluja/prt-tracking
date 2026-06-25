import React, { useState } from 'react';
import Icon from '../common/Icon';
import { Empty, btnGhost, btnPrimary, inputStyle } from '../common/UI';

const C = {
  line: "#E7E6E0",
  surface: "#FFFFFF",
  ink: "#18181B",
  ink2: "#5C5C63",
  ink3: "#9A9AA1"
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function Profile({ user, onClose, onLogout, skillsList, onSaveSkills, showToast }) {
  const [draft, setDraft] = useState([...skillsList]);
  const [name, setName] = useState("");
  const [lvl, setLvl] = useState("Intermediate");

  const addSkill = () => {
    if (name.trim()) {
      // Check if skill already exists
      if (draft.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) {
        showToast("Skill already listed", "err");
        return;
      }
      setDraft([...draft, { name: name.trim(), level: lvl }]);
      setName("");
    }
  };

  const info = [
    ["Name", user.name],
    ["Employee ID", user.empId],
    ["Designation", user.designation],
    ["Department", user.dept],
    ["Email", user.email],
    ["Reporting manager", user.manager],
    ["Weekly capacity", `${user.capacity} hrs`]
  ];

  const handleSave = () => {
    onSaveSkills(user.id, draft);
    showToast("Skills updated");
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.18)", zIndex: 80 }} />
      <aside 
        style={{ 
          position: "fixed", 
          top: 0, 
          right: 0, 
          height: "100%", 
          width: 400, 
          maxWidth: "92%", 
          background: C.surface, 
          borderLeft: `1px solid ${C.line}`, 
          zIndex: 90, 
          display: "flex", 
          flexDirection: "column" 
        }}
        className="fade-in"
      >
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: C.ink }}>Profile</span>
          <button className="ghost" onClick={onClose} style={{ border: "none", background: "none", borderRadius: 6, padding: 5, cursor: "pointer", display: "flex" }}>
            <Icon n="x" size={16} color={C.ink2} />
          </button>
        </div>

        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          {/* Avatar and Info Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
            <div style={{ width: 46, height: 46, borderRadius: 99, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: C.ink }}>
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize: "15.5px", fontWeight: 600, color: C.ink }}>{user.name}</div>
              <div style={{ fontSize: "12.5px", color: C.ink3 }}>{user.designation}</div>
            </div>
          </div>

          {/* Details list */}
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
            Details
          </div>
          <dl style={{ margin: "0 0 24px" }}>
            {info.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
                <dt style={{ color: C.ink3, whiteSpace: "nowrap" }}>{k}</dt>
                <dd style={{ margin: 0, color: C.ink, textAlign: "right" }}>{v}</dd>
              </div>
            ))}
          </dl>

          {/* Skills Editor */}
          <div style={{ fontSize: 11, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>
            Skills
          </div>
          
          {draft.length === 0 ? (
            <Empty msg="Add your skills to keep your profile updated." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
              {draft.map((s, i) => (
                <div 
                  key={i} 
                  className="chip" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    gap: 10, 
                    border: `1px solid ${C.line}`, 
                    borderRadius: 6, 
                    padding: "6px 8px 6px 11px" 
                  }}
                >
                  <span style={{ fontSize: 13, color: C.ink }}>{s.name}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <select 
                      value={s.level} 
                      onChange={e => setDraft(draft.map((x, j) => j === i ? { ...x, level: e.target.value } : x))}
                      style={{ 
                        border: `1px solid ${C.line}`, 
                        borderRadius: 5, 
                        padding: "3px 6px", 
                        fontSize: "11.5px", 
                        color: C.ink2, 
                        background: C.surface, 
                        cursor: "pointer",
                        outline: "none" 
                      }}
                    >
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                    <button 
                      className="chip-x" 
                      onClick={() => setDraft(draft.filter((_, j) => j !== i))} 
                      style={{ 
                        border: "none", 
                        background: "none", 
                        cursor: "pointer", 
                        color: C.ink3, 
                        padding: 2, 
                        opacity: 0.3, 
                        transition: "opacity .15s", 
                        display: "flex" 
                      }}
                    >
                      <Icon n="x" size={13} color={C.ink3} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Add skill form */}
          <div style={{ display: "flex", gap: 8 }}>
            <input 
              className="txt" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && addSkill()} 
              placeholder="Add a skill" 
              style={{ ...inputStyle, flex: 1, padding: "8px 10px", fontSize: 13 }}
            />
            <select 
              value={lvl} 
              onChange={e => setLvl(e.target.value)} 
              style={{ 
                border: `1px solid ${C.line}`, 
                borderRadius: 6, 
                padding: "0 8px", 
                fontSize: 12, 
                color: C.ink2, 
                background: C.surface, 
                cursor: "pointer",
                outline: "none" 
              }}
            >
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <button className="demo" style={btnGhost} onClick={addSkill}>
              <Icon n="plus" size={14} color={C.ink2} />
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${C.line}`, display: "flex", gap: 8 }}>
          <button className="primary" style={{ ...btnPrimary, flex: 1, justifyContent: "center" }} onClick={handleSave}>
            Save changes
          </button>
          <button className="demo" style={btnGhost} onClick={onLogout}>
            <Icon n="logout" size={15} color={C.ink2} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
