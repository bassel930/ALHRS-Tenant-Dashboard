import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

const DEFAULT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiWFFYOFk4YVlEMHVBZldLYnZBNnFEMVhmbzF6Y0ZZblNoR3h3ekF5UFRNIn0.eyJleHAiOjE3NzMzMjMyMDIsImlhdCI6MTc3MzMxNjAwMiwiYXV0aF90aW1lIjoxNzczMzE2MDAwLCJqdGkiOiJvbnJ0YWM6OGU0NjkzN2UtMjM1Mi00OTY4LWE3ODMtMTA3YjBiZjIwNDhiIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay51YXQuanAuY29oZXJlbnQuZ2xvYmFsL2F1dGgvcmVhbG1zL2FsaHJzIiwiYXVkIjpbInByb2R1Y3QtZmFjdG9yeSIsInJlYWxtLW1hbmFnZW1lbnQiXSwic3ViIjoiNjk2NTMyNGQtOWE2NC00MDkxLWI5NzMtNzlmMTBiYzZkYTk5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJvZHVjdC1mYWN0b3J5Iiwic2lkIjoiODZlOTg4YWMtMjQ1Ni00Njk0LTllYWMtMjI2Y2RlOTE4OGFmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL21vZGVsaW5nLWNlbnRlci5kZXYuY29oZXJlbnQuZ2xvYmFsIiwiaHR0cHM6Ly9tb2RlbGluZy1jZW50ZXIudXMuY29oZXJlbnQuZ2xvYmFsIiwiaHR0cHM6Ly9hc3Npc3RhbnQuc3RhZ2luZy5jb2hlcmVudC5nbG9iYWwiLCJodHRwczovL2Fzc2lzdGFudC5leHQuY29oZXJlbnQuZ2xvYmFsIiwiaHR0cHM6Ly9zYS5zdGFnaW5nLmNvaGVyZW50Lmdsb2JhbCIsImh0dHBzOi8vc3BhcmsudWF0LmpwLmNvaGVyZW50Lmdsb2JhbCIsImh0dHBzOi8vc3BhcmstdXNlci1tYW5hZ2VyLnVhdC5qcC5jb2hlcmVudC5nbG9iYWwiLCJodHRwczovL21vZGVsaW5nLWNlbnRlci5zdGFnaW5nLmNvaGVyZW50Lmdsb2JhbCJdLCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhbG0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJxdWVyeS1jbGllbnRzIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwicHJvZHVjdC1mYWN0b3J5Ijp7InJvbGVzIjpbInRlbmFudC1hZG1pbiJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgc3BhcmsiLCJuYW1lIjoiQmFzc2VsIEppcmFiZSIsImdyb3VwcyI6WyJ0ZW5hbnQtYWRtaW4iLCJ1c2VyOnBmIl0sInJlYWxtIjoiYWxocnMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJiYXNzZWwuamlyYWJlQGNvaGVyZW50Lmdsb2JhbCIsImdpdmVuX25hbWUiOiJCYXNzZWwiLCJmYW1pbHlfbmFtZSI6IkppcmFiZSIsInVzZXJfY3JlYXRlZF90aW1lc3RhbXAiOjE3NzA3MDg2MDY5NzIsInJlbGF0aW9uIjoiY3VzdG9tZXIifQ.N9IZfF56LL-8_O4bcmY63ApgpQ_AZ6mciNIUh4_YwPuBghkzfas9owBkUWHxXmgvaSy3Lo58gRAVqRyeExsDSI5LtusXv21yWWTK8OV_NGirGkESjT4fu-P_Ueo1JKVuKa6tbKm4icPl8FI--X_Ufjh2wkox5JNtInlES8ejiwo53Su6KiffyUSRubk8vJztu9UHXrvB_0aVs7SqoAlw-yXmjq9WLqzQtcsvtRdyAop-rIbHTpzVKcwMW4931fWQ0cYPunL1XMCABsbXAWefYEqxGFfsoHZV3dAFBHdWPcW6G4MnEseqrWSDLrhxzJ3Lgdj6XtUGeQVVTaStOKpO0Q";
const BASE_URL       = "https://excel.uat.jp.coherent.global/api/v1/Product/ALHRS-Demo/engines/Rater%20(MYS)/logs/";
const TOTAL_COUNT_URL = "https://excel.uat.jp.coherent.global/alhrs/api/v3/folders/ALHRS-Demo/services/Rater%20(MYS)/log/gettotalcount/";
const AXA_LOGO = "/AXA_Logo.png";
const COHERENT_LOGO = "/coherent-logo.png";

// ─── Mock data ────────────────────────────────────────────────────────────────
function generateMockLogs(startDate, endDate) {
  const users = ["bassel.jirabe@coherent.global","gao.hong@axa.com","mike.leung@axa.com","charmagne.yip@axa.com"];
  const purposes = ["Quote","Quote","Quote","Referral","Referral"];
  const versions = ["0.5.0","0.5.0","0.4.1"];
  const logs = [];
  const start = new Date(startDate + "T00:00:00"), end = new Date(endDate + "T23:59:59");
  const count = Math.min(Math.floor((end - start) / 86400000) * 6 + 12, 150);
  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + Math.random() * (end - start));
    const hasErrors = Math.random() < 0.08;
    const hasWarnings = Math.random() < 0.12; // can coexist with errors
    const calcMs = Math.floor(Math.random() * 800) + 20;
    logs.push({
      id: Array.from({length:4},()=>Math.random().toString(36).slice(2,6)).join("-"),
      transactionDate: date.toISOString(),
      serviceName: "Spark - ALHRS Pricer (MYS)",
      serviceVersion: versions[Math.floor(Math.random() * versions.length)],
      callPurpose: purposes[Math.floor(Math.random() * purposes.length)],
      sourceSystem: "Spark",
      username: users[Math.floor(Math.random() * users.length)],
      hasErrors, hasWarnings,
      calcMs, totalMs: calcMs + Math.floor(Math.random() * 400) + 50,
    });
  }
  return logs.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toLocalDT(iso) {
  if (!iso) return "—";
  const normalized = iso.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "Z";
  const d = new Date(normalized);
  return d.toLocaleString(undefined, { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });
}
function fmtDate(d) { return d.toISOString().split("T")[0]; }
function daysBetween(a, b) {
  const diff = (new Date(b) - new Date(a)) / 86400000;
  return Math.round(diff);
}
function getDefaults() {
  const end = new Date(), start = new Date();
  start.setDate(start.getDate() - 7);
  return { start: fmtDate(start), end: fmtDate(end) };
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#F5F6FA", white:"#FFFFFF", border:"#E5E7EB", text:"#111827",
  muted:"#6B7280", subtle:"#9CA3AF", accent:"#5B5BD6", accentLight:"#EEF2FF",
  green:"#10B981", greenLight:"#D1FAE5",
  red:"#EF4444", redLight:"#FEE2E2",
  amber:"#F59E0B", amberLight:"#FEF3C7",
  blue:"#3B82F6",
};

const PIE_COLORS_PURPOSE = [C.accent, C.amber, C.green];
const PIE_COLORS_STATUS  = [C.green, C.amber, C.red];

// ─── Custom Date Picker ───────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function DatePicker({ label, value, onChange, minDate, maxDate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const parsed = value ? new Date(value + "T00:00:00") : new Date();
  const [viewing, setViewing] = useState({ year: parsed.getFullYear(), month: parsed.getMonth() });

  useEffect(() => {
    if (!open) return;
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Sync viewing month when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setViewing({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [value]);

  function prevMonth() {
    setViewing(v => v.month === 0 ? { year: v.year-1, month:11 } : { ...v, month: v.month-1 });
  }
  function nextMonth() {
    setViewing(v => v.month === 11 ? { year: v.year+1, month:0 } : { ...v, month: v.month+1 });
  }

  // Build calendar grid
  const firstDay = new Date(viewing.year, viewing.month, 1);
  // Monday-first: 0=Mo..6=Su
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewing.year, viewing.month+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(day) {
    if (!day) return;
    const y = viewing.year, m = String(viewing.month+1).padStart(2,"0"), d = String(day).padStart(2,"0");
    const iso = `${y}-${m}-${d}`;
    if (minDate && iso < minDate) return;
    if (maxDate && iso > maxDate) return;
    onChange(iso);
    setOpen(false);
  }

  function isSelected(day) {
    if (!day || !value) return false;
    const y = viewing.year, m = String(viewing.month+1).padStart(2,"0"), d = String(day).padStart(2,"0");
    return `${y}-${m}-${d}` === value;
  }

  function isDisabled(day) {
    if (!day) return false;
    const y = viewing.year, m = String(viewing.month+1).padStart(2,"0"), d = String(day).padStart(2,"0");
    const iso = `${y}-${m}-${d}`;
    return (minDate && iso < minDate) || (maxDate && iso > maxDate);
  }

  function isToday(day) {
    if (!day) return false;
    const t = new Date();
    return day === t.getDate() && viewing.month === t.getMonth() && viewing.year === t.getFullYear();
  }

  // Format display
  const display = value
    ? new Date(value + "T00:00:00").toLocaleDateString(undefined, { day:"2-digit", month:"short", year:"numeric" })
    : "Select date";

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div style={{ fontSize:10, color:C.muted, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{label}</div>
      <button onClick={() => setOpen(o => !o)} style={{
        background:C.white, border:`1px solid ${open ? C.accent : C.border}`, borderRadius:6,
        padding:"7px 12px", fontSize:12, color: value ? C.text : C.muted, cursor:"pointer",
        display:"flex", alignItems:"center", gap:8, minWidth:148,
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="12" rx="2" stroke={open ? C.accent : C.subtle} strokeWidth="1.4"/>
          <path d="M5 1v4M11 1v4M1 7h14" stroke={open ? C.accent : C.subtle} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span>{display}</span>
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:300,
          background:C.white, border:`1px solid ${C.border}`, borderRadius:10,
          boxShadow:"0 8px 32px rgba(0,0,0,0.12)", padding:16, width:252,
        }}>
          {/* Month nav */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <button onClick={prevMonth} style={{ background:"transparent", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:5, color:C.muted, fontSize:14, lineHeight:1 }}>‹</button>
            <span style={{ fontWeight:600, fontSize:13, color:C.text }}>{MONTHS[viewing.month]} {viewing.year}</span>
            <button onClick={nextMonth} style={{ background:"transparent", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:5, color:C.muted, fontSize:14, lineHeight:1 }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:600, color:C.subtle, padding:"2px 0" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {cells.map((day, i) => {
              const sel = isSelected(day), dis = isDisabled(day), tod = isToday(day);
              return (
                <div key={i} onClick={() => !dis && selectDay(day)} style={{
                  width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
                  borderRadius:6, fontSize:12, cursor: !day || dis ? "default" : "pointer",
                  fontWeight: tod || sel ? 600 : 400,
                  background: sel ? C.accent : "transparent",
                  color: !day ? "transparent" : sel ? "#fff" : dis ? C.subtle : tod ? C.accent : C.text,
                  border: tod && !sel ? `1px solid ${C.accent}` : "1px solid transparent",
                  opacity: dis ? 0.4 : 1,
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => { if (day && !dis && !sel) e.currentTarget.style.background = C.accentLight; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                  {day || ""}
                </div>
              );
            })}
          </div>

          {/* Footer shortcuts */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
            <button onClick={() => { onChange(""); setOpen(false); }} style={{
              background:"transparent", border:"none", cursor:"pointer", fontSize:11, color:C.muted, padding:"2px 4px",
            }}>Clear</button>
            <button onClick={() => { onChange(fmtDate(new Date())); setOpen(false); }} style={{
              background:"transparent", border:"none", cursor:"pointer", fontSize:11, color:C.accent, fontWeight:600, padding:"2px 4px",
            }}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Multi-select dropdown ────────────────────────────────────────────────────
function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const allSelected = selected.length === 0 || selected.length === options.length;
  const displayLabel = allSelected ? "All" : selected.length === 1 ? selected[0] : `${selected.length} selected`;

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div style={{ fontSize:10, color:C.muted, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{label}</div>
      <button onClick={() => setOpen(o => !o)} style={{
        background:C.white, border:`1px solid ${open ? C.accent : C.border}`, borderRadius:6,
        padding:"7px 10px", fontSize:12, color:C.text, cursor:"pointer",
        display:"flex", alignItems:"center", gap:6, minWidth:130, justifyContent:"space-between",
      }}>
        <span style={{ color: allSelected ? C.muted : C.text }}>{displayLabel}</span>
        <span style={{ color:C.muted, fontSize:9 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"100%", left:0, marginTop:4, background:C.white,
          border:`1px solid ${C.border}`, borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
          zIndex:200, minWidth:170, overflow:"hidden",
        }}>
          <div
            onClick={() => { onChange([]); setOpen(false); }}
            style={{ padding:"9px 14px", fontSize:12, cursor:"pointer",
              background: allSelected ? C.accentLight : "transparent",
              color: allSelected ? C.accent : C.text, fontWeight: allSelected ? 600 : 400,
              borderBottom:`1px solid ${C.border}` }}>
            All
          </div>
          {options.map(opt => {
            const active = selected.includes(opt);
            return (
              <div key={opt} onClick={() => onChange(active ? selected.filter(x => x !== opt) : [...selected, opt])}
                style={{
                  padding:"9px 14px", fontSize:12, cursor:"pointer",
                  background: active ? C.accentLight : "transparent",
                  color: active ? C.accent : C.text, fontWeight: active ? 600 : 400,
                  display:"flex", alignItems:"center", gap:8,
                }}>
                <div style={{
                  width:14, height:14, borderRadius:3,
                  border:`1.5px solid ${active ? C.accent : C.border}`,
                  background: active ? C.accent : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  {active && <span style={{ color:"#fff", fontSize:9, fontWeight:800 }}>✓</span>}
                </div>
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Status dots ──────────────────────────────────────────────────────────────
function StatusDots({ hasErrors, hasWarnings }) {
  if (!hasErrors && !hasWarnings) {
    return <div style={{ width:10, height:10, borderRadius:"50%", background:C.green }} />;
  }
  if (hasErrors && hasWarnings) {
    return (
      <div style={{ position:"relative", width:16, height:10, display:"inline-flex", alignItems:"center" }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:C.red, position:"absolute", left:0, zIndex:2, border:"1.5px solid #fff" }}/>
        <div style={{ width:10, height:10, borderRadius:"50%", background:C.amber, position:"absolute", left:6, zIndex:1, border:"1.5px solid #fff" }}/>
      </div>
    );
  }
  if (hasErrors) return <div style={{ width:10, height:10, borderRadius:"50%", background:C.red }} />;
  return <div style={{ width:10, height:10, borderRadius:"50%", background:C.amber }} />;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }) {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10,
      padding:"18px 22px", borderTop:`3px solid ${color||C.accent}` }}>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color:C.text, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>{sub}</div>}
    </div>
  );
}

function Badge({ text }) {
  if (!text) return <span style={{ color:C.muted }}>—</span>;
  const lower = text.toLowerCase();
  const isQ = lower.includes("quote");
  const isR = lower.includes("referral");
  const isB = lower.includes("policy bound");
  const bg    = isB ? C.greenLight  : isQ ? C.accentLight : isR ? C.amberLight : "#F3F4F6";
  const color = isB ? C.green       : isQ ? C.accent      : isR ? C.amber      : C.muted;
  return (
    <span style={{
      background: bg, color, padding:"3px 10px", borderRadius:20,
      fontSize:11, fontWeight:600, whiteSpace:"nowrap",
    }}>{text}</span>
  );
}

// ─── Execution Detail Modal ───────────────────────────────────────────────────
const EXEC_URL = id => `https://excel.uat.jp.coherent.global/alhrs/api/v3/log/getexecutionhistorybyid/${id}`;

// ─── Rater-style read-only primitives ─────────────────────────────────────────
const MN = { // Modal Navy palette matching rater
  navy:"#1E1E5C", white:"#FFFFFF", light:"#F7F7FB", mid:"#E8E8F4",
  muted:"#6B6B8A", text:"#1A1A2E", border:"#E2E2F0",
  accent:"#5B5BD6", accentLight:"#EEEEF8",
  green:"#10B981", greenLight:"#D1FAE5",
  red:"#EF4444", redLight:"#FEF2F2",
  amber:"#F59E0B", amberLight:"#FFFBEB",
};

function MLabel({ children }) {
  return <div style={{ fontSize:10, fontWeight:600, color:MN.muted, letterSpacing:"0.07em",
    textTransform:"uppercase", marginBottom:5 }}>{children}</div>;
}
function MValue({ children, fullWidth }) {
  return (
    <div style={{ marginBottom:16, gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <div style={{ fontSize:13, color:MN.text, background:MN.light, border:`1px solid ${MN.border}`,
        borderRadius:7, padding:"8px 12px", minHeight:36, lineHeight:1.5 }}>
        {children ?? <span style={{ color:MN.muted }}>—</span>}
      </div>
    </div>
  );
}
function MField({ label, value, fullWidth, pct }) {
  let display = value ?? null;
  if (display !== null && pct) display = `${(Number(display)*100).toFixed(2)}%`;
  return (
    <div style={{ marginBottom:16, gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <MLabel>{label}</MLabel>
      <MValue>{display !== null && display !== "" ? String(display) : null}</MValue>
    </div>
  );
}
function MCard({ title, subtitle, children }) {
  return (
    <div style={{ background:MN.white, borderRadius:12, border:`1px solid ${MN.mid}`,
      padding:"22px 24px", boxShadow:"0 2px 12px rgba(0,0,91,0.05)", marginBottom:18 }}>
      {title && (
        <div style={{ marginBottom:18, paddingBottom:12, borderBottom:`2px solid ${MN.mid}` }}>
          <div style={{ fontSize:15, fontWeight:700, color:MN.navy }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:MN.muted, marginTop:3 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
function MGrid({ cols=2, children }) {
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:"0 20px" }}>{children}</div>;
}
function MGrid3({ children }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 16px" }}>{children}</div>;
}
function MEmpty() {
  return <div style={{ textAlign:"center", padding:"40px 0", color:MN.muted, fontSize:13 }}>No data available.</div>;
}

function fmtDateDisplay(iso) {
  if (!iso) return null;
  const d = new Date(iso + (iso.length===10?"T00:00:00":""));
  if (isNaN(d)) return iso;
  return `${String(d.getDate()).padStart(2,"0")} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getFullYear()}`;
}
function fmtNum(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toLocaleString("en-MY", { maximumFractionDigits:2 });
}

// ── Inputs sub-tab ─────────────────────────────────────────────────────────
function ModalInputsTab({ inp }) {
  if (!inp || !Object.keys(inp).length) return <MEmpty/>;
  return (
    <>
      <MCard title="Client Information" subtitle="Client and policy identification">
        <MGrid>
          <MField label="Name of Client"          value={inp.InputTab_Name_Of_Client}/>
          <MField label="Nature of Business"       value={inp.InputTab_Nature_Of_Business}/>
          <MField label="New / Renewal Business"   value={inp.Claims_New_Business}/>
          <MField label="Virgin / Non-Virgin Group" value={inp.InputTab_Virgin_Or_NonVirgin}/>
          <MField label="Date of Quote"            value={fmtDateDisplay(inp.Input_Date_of_Quote)}/>
        </MGrid>
      </MCard>
      <MCard title="Policy Dates" subtitle="Policy coverage period">
        <MGrid3>
          <MField label="Effective Date"      value={fmtDateDisplay(inp.InputTab_Effective_Date)}/>
          <MField label="Policy Period — From" value={fmtDateDisplay(inp.Claims_Beginning)}/>
          <MField label="Policy Period — To"   value={fmtDateDisplay(inp.Claims_End)}/>
        </MGrid3>
      </MCard>
      <MCard title="Underwriting" subtitle="Underwriting and enrolment settings">
        <MGrid3>
          <MField label="Medical UW Waived (by Client)"    value={inp.InputTab_MedicalUW_Waived}/>
          <MField label="Waiver of Medical UW (by Insurer)" value={inp.InputTab_Waiver_MedicalUW}/>
          <MField label="Enrolment Type"                   value={inp.InputTab_Enrolment_Type}/>
        </MGrid3>
      </MCard>
      <MCard title="Pricing Parameters" subtitle="Enter as % — e.g. 10 for 10%">
        <MGrid3>
          <MField label="Adjustment Loading"          value={inp.InputTab_Adjustment_Loading   != null ? `${(Number(inp.InputTab_Adjustment_Loading)*100).toFixed(2)}%` : null}/>
          <MField label="Claims Adjustment Factor"    value={inp.InputTab_Claims_Adjustment_Factor != null ? `${(Number(inp.InputTab_Claims_Adjustment_Factor)*100).toFixed(2)}%` : null}/>
          <MField label="Insurer Fee"                 value={inp.Claims_Insurer_Fee != null ? `${(Number(inp.Claims_Insurer_Fee)*100).toFixed(2)}%` : null}/>
          <MField label="Agent Commission"            value={inp.Claims_Agent_Commission != null ? `${(Number(inp.Claims_Agent_Commission)*100).toFixed(2)}%` : null}/>
          <MField label="Retro Commission / Wakalah Fee" value={inp.InputTab_Retro_commission_Wakalah_Fee != null ? `${(Number(inp.InputTab_Retro_commission_Wakalah_Fee)*100).toFixed(2)}%` : null}/>
          <MField label="Expected GWP (MYR)"          value={fmtNum(inp.expected_GWP)}/>
        </MGrid3>
      </MCard>
    </>
  );
}

// ── Claims Experience sub-tab ──────────────────────────────────────────────
function ModalClaimsTab({ inp }) {
  if (!inp || !Object.keys(inp).length) return <MEmpty/>;
  return (
    <>
      <MCard title="Current Year — Claims Data">
        <MGrid cols={2}>
          <MField label="Period — From"        value={fmtDateDisplay(inp.claims_cy_beginning)}/>
          <MField label="Period — To"          value={fmtDateDisplay(inp.claims_cy_end)}/>
        </MGrid>
        <MGrid3>
          <MField label="Claims Paid (MYR)"    value={fmtNum(inp.claims_cy_claims)}/>
          <MField label="Inception Headcount"  value={fmtNum(inp.claims_cy_headcount_inc)}/>
          <MField label="Closing Headcount"    value={fmtNum(inp.claims_cy_headcount_clo)}/>
        </MGrid3>
      </MCard>
      <MCard title="Prior Year 1 — Claims Data">
        <MGrid cols={2}>
          <MField label="Period — From"        value={fmtDateDisplay(inp.claims_py1_beginning)}/>
          <MField label="Period — To"          value={fmtDateDisplay(inp.claims_py1_end)}/>
        </MGrid>
        <MGrid3>
          <MField label="Claims Paid (MYR)"    value={fmtNum(inp.claims_py1_claims)}/>
          <MField label="Inception Headcount"  value={fmtNum(inp.claims_py1_headcount_inc)}/>
          <MField label="Closing Headcount"    value={fmtNum(inp.claims_py1_headcount_clo)}/>
        </MGrid3>
      </MCard>
      <MCard title="Prior Year 2 — Claims Data">
        <MGrid cols={2}>
          <MField label="Period — From"        value={fmtDateDisplay(inp.claims_py2_beginning)}/>
          <MField label="Period — To"          value={fmtDateDisplay(inp.claims_py2_end)}/>
        </MGrid>
        <MGrid3>
          <MField label="Claims Paid (MYR)"    value={fmtNum(inp.claims_py2_claims)}/>
          <MField label="Inception Headcount"  value={fmtNum(inp.claims_py2_headcount_inc)}/>
          <MField label="Closing Headcount"    value={fmtNum(inp.claims_py2_headcount_clo)}/>
        </MGrid3>
      </MCard>
      {inp.Claims_Free_text_for_user_to_provide_input && (
        <MCard title="Additional Notes">
          <MField label="Free Text / Notes" value={inp.Claims_Free_text_for_user_to_provide_input} fullWidth/>
        </MCard>
      )}
    </>
  );
}

// ── Census sub-tab ─────────────────────────────────────────────────────────
function ModalCensusTab({ rows }) {
  if (!rows || !rows.length) return <MEmpty/>;
  const th = { padding:"8px 10px", background:MN.navy, color:MN.white, fontSize:10,
    fontWeight:600, textAlign:"center", whiteSpace:"nowrap", borderRight:"1px solid rgba(255,255,255,0.12)" };
  const tdS = (i) => ({ padding:"6px 10px", borderBottom:`1px solid ${MN.mid}`,
    fontSize:11, color:MN.text, background:i%2===0?MN.white:"#FAFAFA", textAlign:"center" });
  const cols = Object.keys(rows[0]);
  return (
    <MCard title="Member Census" subtitle={`${rows.length} member${rows.length!==1?"s":""} loaded`}>
      <div style={{ overflowX:"auto", borderRadius:8, border:`1px solid ${MN.mid}`, maxHeight:400, overflowY:"auto" }}>
        <table style={{ borderCollapse:"collapse", fontSize:11, minWidth:"100%" }}>
          <thead style={{ position:"sticky", top:0, zIndex:2 }}>
            <tr>{cols.map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row,i) => (
              <tr key={i}>{cols.map(c => <td key={c} style={tdS(i)}>{row[c]??"-"}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </MCard>
  );
}

// ── TOB sub-tab ────────────────────────────────────────────────────────────
function ModalTOBTab({ rows }) {
  if (!rows || !rows.length) return <MEmpty/>;
  // Detect how many plan columns exist
  const allKeys   = Object.keys(rows[0]);
  const planCols  = allKeys.filter(k => /^Plan \d+$/.test(k));
  const benefitKey = allKeys[0]; // "Basic GHP Benefits (MYR)"

  const th = { padding:"8px 10px", background:MN.navy, color:MN.white, fontSize:10,
    fontWeight:600, textAlign:"center", whiteSpace:"nowrap", borderRight:"1px solid rgba(255,255,255,0.12)" };
  const thL = { ...th, textAlign:"left", minWidth:200 };
  const tdS = (i, bold) => ({ padding:"6px 10px", borderBottom:`1px solid ${MN.mid}`,
    fontSize:11, color: bold ? MN.navy : MN.text, background:i%2===0?MN.white:"#FAFAFA",
    textAlign:"center", fontWeight: bold ? 700 : 400 });

  return (
    <MCard title="Benefits Configuration" subtitle="Table of Benefits — plan limits in MYR">
      <div style={{ overflowX:"auto", borderRadius:8, border:`1px solid ${MN.mid}`, maxHeight:500, overflowY:"auto" }}>
        <table style={{ borderCollapse:"collapse", fontSize:11, minWidth:"100%" }}>
          <thead style={{ position:"sticky", top:0, zIndex:2 }}>
            <tr>
              <th style={thL}>Benefit</th>
              <th style={th}>Notes</th>
              <th style={th}>Max Limit Per</th>
              {planCols.map(p => <th key={p} style={th}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,i) => {
              const benefit = row[benefitKey];
              const isHeader = benefit?.startsWith("#Additional");
              return (
                <tr key={i} style={{ background: isHeader ? MN.navy : undefined }}>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${MN.mid}`,
                    fontSize:11, color: isHeader ? "#FFD700" : MN.text,
                    background: isHeader ? MN.navy : i%2===0?MN.white:"#FAFAFA",
                    fontWeight: isHeader ? 700 : 400 }}>
                    {benefit ?? "—"}
                  </td>
                  <td style={{ ...tdS(i), color:MN.muted, fontSize:10 }}>{row["Notes"]??"-"}</td>
                  <td style={{ ...tdS(i), color:MN.muted, fontSize:10 }}>{row["Max limit per"]??"-"}</td>
                  {planCols.map(p => (
                    <td key={p} style={tdS(i, row[p] && row[p]!==0 && row[p]!==null)}>
                      {row[p]??"-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MCard>
  );
}

// ── Output tab ─────────────────────────────────────────────────────────────
function MPlanTable({ title, data, numPlans }) {
  if (!data?.length) return null;
  const active = Array.from({ length: numPlans || 4 }, (_, i) => i + 1);
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11, fontWeight:700, color:MN.navy, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>{title}</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:MN.navy }}>
              <th style={{ padding:"8px 12px", textAlign:"left", color:MN.white, fontSize:11, fontWeight:600, minWidth:200 }}>Metric</th>
              {active.map(p => <th key={p} style={{ padding:"8px 12px", textAlign:"right", color:MN.white, fontSize:11, fontWeight:600, minWidth:90 }}>Plan {p}</th>)}
              <th style={{ padding:"8px 12px", textAlign:"right", color:"#FFD700", fontSize:11, fontWeight:700, minWidth:90 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ background:i%2===0?MN.white:MN.light, borderBottom:`1px solid ${MN.mid}` }}>
                <td style={{ padding:"7px 12px", fontWeight:500, color:MN.text }}>{row["Plan No."]}</td>
                {active.map(p => (
                  <td key={p} style={{ padding:"7px 12px", textAlign:"right", color:MN.navy, fontWeight:600 }}>
                    {(row[`Plan ${p}`] !== "" && row[`Plan ${p}`] != null) ? Number(row[`Plan ${p}`]).toLocaleString(undefined,{maximumFractionDigits:0}) : "—"}
                  </td>
                ))}
                <td style={{ padding:"7px 12px", textAlign:"right", color:MN.green, fontWeight:700 }}>
                  {row["Total"] != null ? Number(row["Total"]).toLocaleString(undefined,{maximumFractionDigits:0}) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModalOutputTab({ outputs }) {
  if (!outputs || !Object.keys(outputs).length) return <MEmpty/>;

  // Detect numPlans from rating tables
  const numPlans = outputs.InputTab_Total_Nb_Plans || 4;

  const kpis = [
    { label:"Total GWP (Claims)", value: outputs.Claims_Total_GWP,                              fmt:"currency" },
    { label:"Total Lives",        value: outputs.InputTab_Total_nb_Lives,                        fmt:"int"      },
    { label:"Total Employees",    value: outputs.InputTab_Total_Nb_Employees,                    fmt:"int"      },
    { label:"Total Plans",        value: outputs.InputTab_Total_Nb_Plans,                        fmt:"int"      },
    { label:"Retro Commission",   value: outputs.InputTab_Retro_commission_Wakalah_Fee,           fmt:"pct"      },
    { label:"Quote Validity",     value: outputs.InputTab_Quote_Validity,                        fmt:"str"      },
  ];

  const hasUWFlags = outputs.InputTab_NB_Sanctioned > 0
    || outputs.InputTab_Overage_C24 > 0
    || outputs.InputTab_Overage_ES74 > 0
    || outputs.InputTab_Percentage_population_outside_of_Malaysia > 0.5;

  return (
    <>
      {/* KPI Cards */}
      <MCard>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:14 }}>
          {kpis.map(({ label, value, fmt }) => (
            <div key={label} style={{ background:MN.light, border:`1px solid ${MN.mid}`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontSize:10, fontWeight:600, color:MN.muted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:MN.navy }}>
                {fmt==="currency" && `MYR ${Number(value||0).toLocaleString(undefined,{maximumFractionDigits:0})}`}
                {fmt==="int"      && Number(value||0).toLocaleString()}
                {fmt==="pct"      && `${(Number(value||0)*100).toFixed(1)}%`}
                {fmt==="str"      && (value||"—")}
              </div>
            </div>
          ))}
        </div>
      </MCard>

      {/* UW Flags */}
      {hasUWFlags && (
        <div style={{ background:"#FFFBEB", border:`1.5px solid ${MN.amber}`, borderRadius:10, padding:"16px 20px", marginBottom:18 }}>
          <div style={{ fontWeight:700, fontSize:12, color:"#92400E", marginBottom:12 }}>⚠ Underwriting Flags</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:10 }}>
            {outputs.InputTab_NB_Sanctioned > 0 && (
              <div style={{ background:MN.redLight, border:`1px solid ${MN.red}`, borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:MN.red }}>Sanctioned Countries</div>
                <div style={{ fontSize:18, fontWeight:800, color:MN.red }}>{outputs.InputTab_NB_Sanctioned}</div>
                <div style={{ fontSize:10, color:MN.red }}>Review member(s) in sanctioned country</div>
              </div>
            )}
            {outputs.InputTab_Overage_ES74 > 0 && (
              <div style={{ background:MN.redLight, border:`1px solid ${MN.red}`, borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:MN.red }}>Overage E/S &gt;74</div>
                <div style={{ fontSize:18, fontWeight:800, color:MN.red }}>{outputs.InputTab_Overage_ES74}</div>
                <div style={{ fontSize:10, color:MN.red }}>Remove the overage member(s)</div>
              </div>
            )}
            {outputs.InputTab_Overage_C24 > 0 && (
              <div style={{ background:MN.redLight, border:`1px solid ${MN.red}`, borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:MN.red }}>Overage Children &gt;24</div>
                <div style={{ fontSize:18, fontWeight:800, color:MN.red }}>{outputs.InputTab_Overage_C24}</div>
                <div style={{ fontSize:10, color:MN.red }}>Remove the overage child(ren)</div>
              </div>
            )}
            {outputs.InputTab_Percentage_population_outside_of_Malaysia > 0.5 && (
              <div style={{ background:MN.redLight, border:`1px solid ${MN.red}`, borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:MN.red }}>Population Outside MY</div>
                <div style={{ fontSize:18, fontWeight:800, color:MN.red }}>{(outputs.InputTab_Percentage_population_outside_of_Malaysia*100).toFixed(1)}%</div>
                <div style={{ fontSize:10, color:MN.red }}>More than 50% outside Malaysia — refer to reinsurer</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4-Tier Rating */}
      {outputs.InputTab_4Tier_Rating && (
        <MCard title="4-Tier Rating" subtitle="Headcount and premiums by plan">
          <MPlanTable title="Headcount"           data={outputs.InputTab_4Tier_Rating}              numPlans={numPlans}/>
          <MPlanTable title="Annual Premium (MYR)" data={outputs.InputTab_4Tier_Rating_Annual_Premium} numPlans={numPlans}/>
        </MCard>
      )}

      {/* 3-Tier Rating */}
      {outputs.InputTab_3_Tier_Rating && (
        <MCard title="3-Tier Rating" subtitle="Headcount and premiums by plan">
          <MPlanTable title="Headcount"           data={outputs.InputTab_3_Tier_Rating}             numPlans={numPlans}/>
          <MPlanTable title="Annual Premium (MYR)" data={outputs.InputTab_3Tier_Rating_Annual_Premium} numPlans={numPlans}/>
        </MCard>
      )}

      {/* Plan Selection Summary */}
      {outputs.InputTab_Plan_Selection && (
        <MCard title="Plan Selection Summary">
          <MPlanTable title="Plan Benefits" data={outputs.InputTab_Plan_Selection} numPlans={numPlans}/>
        </MCard>
      )}
    </>
  );
}

// ─── Execution Modal ───────────────────────────────────────────────────────
function ExecutionModal({ logId, engineCallId, callPurpose, token, onClose }) {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [masterTab, setMasterTab] = useState("input");
  const [inputSub,  setInputSub]  = useState("inputs");

  useEffect(() => {
    async function load() {
      setLoading(true); setError(null); setData(null);
      try {
        const res = await fetch(EXEC_URL(logId), {
          headers: { Authorization:`Bearer ${token}`, "x-tenant-name":"alhrs", accept:"*/*", "content-type":"application/json" }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch(e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [logId, token]);

  // ── Parse ────────────────────────────────────────────────────────────────
  let record = {}, engineRecord = {};
  if (data) {
    try { record = typeof data.response_data === "string" ? JSON.parse(data.response_data) : (data.response_data || data); } catch(e) { record = data; }
    try { engineRecord = typeof record?.EngineDetails === "string" ? JSON.parse(record.EngineDetails) : (record?.EngineDetails || {}); } catch(e) { engineRecord = {}; }
  }

  // EngineCallId (cf...) comes from the execution detail response
  const resolvedEngineCallId = engineCallId
    || record?.EngineCallId
    || record?.engineCallId
    || null;

  const rawInputs   = (record?.request_data?.inputs && Object.keys(record.request_data.inputs).length > 0)
    ? record.request_data.inputs
    : (engineRecord?.request_data?.inputs || {});

  const engineResp  = engineRecord?.response_data || {};
  const rawOutputs  = engineResp?.outputs  || {};
  const rawErrors   = engineResp?.errors   || [];
  const rawWarnings = engineResp?.warnings || [];

  // Census & TOB from inputs
  const censusRows = rawInputs?.Census_Table || [];
  const tobRows    = rawInputs?.TOB_Basic_GHP_Benefits__MYR || [];

  // Inputs section = everything except Census_Table, TOB, and claims_* keys
  const CLAIMS_KEYS = new Set([
    "claims_cy_beginning","claims_cy_end","claims_cy_claims","claims_cy_headcount_inc","claims_cy_headcount_clo",
    "claims_py1_beginning","claims_py1_end","claims_py1_claims","claims_py1_headcount_inc","claims_py1_headcount_clo",
    "claims_py2_beginning","claims_py2_end","claims_py2_claims","claims_py2_headcount_inc","claims_py2_headcount_clo",
    "Claims_ForRenewalOnly_CY_GWP","Claims_ForRenewalOnly_PY1_GWP","Claims_ForRenewalOnly_PY2_GWP",
    "Claims_Free_text_for_user_to_provide_input","Claims_Name_Of_Client","Claims_Nature_of_Business",
  ]);
  // Pricing-related Claims_ fields that belong in the Inputs tab, not Claims Experience
  const INPUTS_CLAIMS_KEYS = new Set([
    "Claims_Insurer_Fee","Claims_Agent_Commission","Claims_Beginning","Claims_End","Claims_New_Business","InputTab_Retro_commission_Wakalah_Fee","expected_GWP",
  ]);
  const sectionInputs = {}, sectionClaims = {};
  Object.entries(rawInputs).forEach(([k,v]) => {
    const lk = k.toLowerCase();
    if (lk.includes("census") || lk.includes("tob") || lk.includes("plan_selection")) return;
    if (!INPUTS_CLAIMS_KEYS.has(k) && (CLAIMS_KEYS.has(k) || lk.startsWith("claims_"))) sectionClaims[k] = v;
    else sectionInputs[k] = v;
  });

  const inputSubTabs = [
    { id:"inputs",  label:"Inputs" },
    { id:"claims",  label:"Claims Experience" },
    { id:"census",  label:"Census" },
    { id:"tob",     label:"TOB" },
  ];

  const isPolicyBound = (callPurpose || "").toLowerCase().includes("policy bound");

  // ── Build full-document HTML (all tabs) for PDF popup ────────────────────
  function buildFullDocHTML({ clientName, dateStr, badge, badgeBg, badgeColor }) {

    function esc(v) {
      if (v === null || v === undefined) return "—";
      return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }

    function renderKV(label, obj) {
      if (!obj || !Object.keys(obj).length) return `<p style="color:#9CA3AF;font-size:12px;margin-bottom:20px">No data available.</p>`;
      const rows = Object.entries(obj)
        .filter(([,v]) => v !== null && v !== undefined && v !== "")
        .map(([k,v], i) =>
          `<tr style="background:${i%2===0?"#F7F7FB":"white"}">
            <td style="padding:7px 12px;font-size:10px;font-weight:600;color:#6B6B8A;text-transform:uppercase;white-space:nowrap;width:220px;border-bottom:1px solid #E8E8F4">${esc(k.replace(/_/g," "))}</td>
            <td style="padding:7px 12px;font-size:12px;color:#1A1A2E;border-bottom:1px solid #E8E8F4">${esc(v)}</td>
          </tr>`
        ).join("");
      return `
        <div style="margin-bottom:28px">
          <div style="font-size:13px;font-weight:700;color:#1E1E5C;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #E8E8F4;text-transform:uppercase;letter-spacing:0.05em">${label}</div>
          <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #E8E8F4">${rows}</table>
        </div>`;
    }

    function renderTable(label, rows) {
      if (!rows || !rows.length) return `<p style="color:#9CA3AF;font-size:12px;margin-bottom:20px">No data available.</p>`;
      const cols = Object.keys(rows[0]);
      const ths = cols.map(c => `<th style="padding:8px 10px;background:#1E1E5C;color:white;font-size:10px;font-weight:600;text-align:left;white-space:nowrap;border-right:1px solid rgba(255,255,255,0.1)">${esc(c)}</th>`).join("");
      const trs = rows.map((row,i) =>
        `<tr style="background:${i%2===0?"white":"#F7F7FB"}">${cols.map(c => `<td style="padding:6px 10px;font-size:11px;border-bottom:1px solid #E8E8F4;border-right:1px solid #E8E8F4">${esc(row[c])}</td>`).join("")}</tr>`
      ).join("");
      return `
        <div style="margin-bottom:28px">
          <div style="font-size:13px;font-weight:700;color:#1E1E5C;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #E8E8F4;text-transform:uppercase;letter-spacing:0.05em">${label}</div>
          <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;border:1px solid #E8E8F4">${ths}${trs}</table></div>
        </div>`;
    }

    const errHtml = rawErrors.length > 0
      ? `<div style="background:#FEF2F2;border:1.5px solid #EF4444;border-radius:8px;padding:14px 18px;margin-bottom:16px">
          <div style="font-weight:700;color:#991B1B;margin-bottom:8px;font-size:12px">⚠ Validation Errors (${rawErrors.length})</div>
          <ol style="margin:0;padding-left:20px;color:#B91C1C">${rawErrors.map(e=>`<li style="font-size:12px;margin-bottom:4px">${esc(e.message)}</li>`).join("")}</ol>
         </div>`
      : `<div style="background:#D1FAE5;border:1.5px solid #10B981;border-radius:8px;padding:10px 16px;margin-bottom:16px;color:#065F46;font-size:12px;font-weight:600">✓ No validation errors</div>`;

    const warnHtml = rawWarnings.length > 0
      ? `<div style="background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:8px;padding:14px 18px;margin-bottom:16px">
          <div style="font-weight:700;color:#92400E;margin-bottom:8px;font-size:12px">⚡ Warnings (${rawWarnings.length})</div>
          <ol style="margin:0;padding-left:20px;color:#B45309">${rawWarnings.map(w=>`<li style="font-size:12px;margin-bottom:4px">${esc(w.message)}</li>`).join("")}</ol>
         </div>` : "";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Quotation – ${esc(clientName)} – ${dateStr}</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:Arial,sans-serif;font-size:12px;color:#1A1A2E;background:white;padding:32px;margin:0}
    @media print{
      body{padding:16px}
      @page{margin:1.5cm}
      tr{page-break-inside:avoid}
    }
  </style>
</head>
<body>
  <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #1E1E5C;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <div>
      <div style="font-size:22px;font-weight:800;color:#1E1E5C">Quotation Details</div>
      <div style="font-size:10px;color:#9999CC;font-family:monospace;margin-top:4px">${esc(logId)}</div>
      <div style="font-size:11px;color:#6B6B8A;margin-top:2px">Generated: ${dateStr}</div>
    </div>
    ${badge ? `<div style="padding:6px 18px;border-radius:20px;font-size:13px;font-weight:700;background:${badgeBg};color:${badgeColor};align-self:center">${badge}</div>` : ""}
  </div>
  ${errHtml}${warnHtml}
  <div style="font-size:15px;font-weight:800;color:#1E1E5C;margin:24px 0 12px;padding-bottom:8px;border-bottom:3px solid #1E1E5C">📋 INPUTS</div>
  ${renderKV("General Inputs", sectionInputs)}
  <div style="font-size:15px;font-weight:800;color:#1E1E5C;margin:24px 0 12px;padding-bottom:8px;border-bottom:3px solid #1E1E5C">📊 CLAIMS EXPERIENCE</div>
  ${renderKV("Claims Data", sectionClaims)}
  <div style="font-size:15px;font-weight:800;color:#1E1E5C;margin:24px 0 12px;padding-bottom:8px;border-bottom:3px solid #1E1E5C">👥 CENSUS</div>
  ${renderTable("Member Census", censusRows)}
  <div style="font-size:15px;font-weight:800;color:#1E1E5C;margin:24px 0 12px;padding-bottom:8px;border-bottom:3px solid #1E1E5C">📄 TABLE OF BENEFITS</div>
  ${renderTable("Benefits", tobRows)}
  <div style="font-size:15px;font-weight:800;color:#1E1E5C;margin:24px 0 12px;padding-bottom:8px;border-bottom:3px solid #1E1E5C">📈 OUTPUTS</div>
  ${renderKV("Output Values", rawOutputs)}
  <script>
    // Wait for full render then print
    window.addEventListener('load', function() {
      setTimeout(function(){ window.print(); }, 400);
    });
  <\/script>
</body>
</html>`;
  }

  // ── Download Quotation PDF ────────────────────────────────────────────────
  function handleDownloadAll() {
    if (!data) return;
    const clientName = rawInputs?.InputTab_Name_Of_Client || "Unknown Client";
    const dateStr    = new Date().toLocaleDateString(undefined, { day:"2-digit", month:"short", year:"numeric" });
    const html = buildFullDocHTML({ clientName, dateStr, badge: null });
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, "_blank", "width=1100,height=900,scrollbars=yes");
    if (!win) alert("Popup blocked — please allow popups for this page.");
  }

  // ── Download Quotation Excel ──────────────────────────────────────────────
  async function handleDownloadExcel() {
    if (!data) return;
    const callId = resolvedEngineCallId || logId;
    const EXCEL_URL = `https://excel.uat.jp.coherent.global/api/v1/product/ALHRS-Demo/engines/Rater%20(MYS)/logs/Download/xml/${callId}`;
    try {
      const res = await fetch(EXCEL_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant-name": "alhrs",
          "accept": "*/*",
          "content-type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Quotation_${callId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      alert(`Excel download failed: ${e.message}`);
    }
  }

  // ── Trigger email on Accept/Decline ────────────────────────────────────
  function triggerEmailAndPDF(action) {
    if (!data) return;
    const clientName = rawInputs?.InputTab_Name_Of_Client || "Unknown Client";
    const nature     = rawInputs?.InputTab_Nature_Of_Business || "—";
    const dateStr    = new Date().toLocaleDateString(undefined, { day:"2-digit", month:"short", year:"numeric" });
    const errCount   = rawErrors.length;
    const warnCount  = rawWarnings.length;
    const errorLines = rawErrors.map((e, i) => `  ${i+1}. ${e.message}`).join("\n");
    const warnLines  = rawWarnings.map((w, i) => `  ${i+1}. ${w.message}`).join("\n");

    const subject = encodeURIComponent(`Quotation ${action} – ${clientName} – ${dateStr}`);
    const body = encodeURIComponent(
`Dear,

The quotation has been ${action.toLowerCase()}ed.

  Client:             ${clientName}
  Nature of Business: ${nature}
  Quotation ID:       ${logId}
  Decision:           ${action}
  Date:               ${dateStr}

─────────────────────────────────────────────
VALIDATION SUMMARY
─────────────────────────────────────────────
${errCount > 0  ? `⚠ Validation Errors (${errCount}):\n${errorLines}` : "✓ No validation errors."}
${warnCount > 0 ? `\n⚡ Warnings (${warnCount}):\n${warnLines}` : "\n✓ No warnings."}
─────────────────────────────────────────────

Best regards`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(10,10,40,0.55)", backdropFilter:"blur(3px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#F5F5FA", borderRadius:14, width:"min(960px,96vw)", maxHeight:"92vh",
        display:"flex", flexDirection:"column", boxShadow:"0 28px 80px rgba(0,0,91,0.25)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:MN.navy, padding:"16px 24px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ color:MN.white, fontWeight:700, fontSize:16, letterSpacing:"-0.02em" }}>Quotation Details</div>
            <div style={{ color:"#9999CC", fontSize:11, marginTop:3, fontFamily:"monospace" }}>{resolvedEngineCallId || logId}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0, marginTop:2 }}>
            {data && !loading && !error && (<>
              <button
                onClick={handleDownloadAll}
                style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
                  borderRadius:7, color:MN.white, fontSize:12, fontWeight:600,
                  cursor:"pointer", padding:"6px 14px", display:"flex", alignItems:"center", gap:7, transition:"background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.28)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
                title="Download full quotation as PDF"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v8M5 6l3 3 3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                PDF
              </button>
              <button
                onClick={handleDownloadExcel}
                style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
                  borderRadius:7, color:MN.white, fontSize:12, fontWeight:600,
                  cursor:"pointer", padding:"6px 14px", display:"flex", alignItems:"center", gap:7, transition:"background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.28)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
                title="Download full quotation as Excel"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="white" strokeWidth="1.4"/>
                  <path d="M5 6l2 2-2 2M9 10h2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 4h4M5 12h6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                </svg>
                Excel
              </button>
            </>)}
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:7,
              color:MN.white, fontSize:20, cursor:"pointer", width:32, height:32,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>×</button>
          </div>
        </div>

        {/* Master tabs */}
        <div style={{ display:"flex", borderBottom:`2px solid ${MN.mid}`, background:MN.white, flexShrink:0, padding:"0 24px" }}>
          {[["input","📋  Input"],["output","📊  Output"]].map(([id,label]) => (
            <button key={id} onClick={() => setMasterTab(id)} style={{
              padding:"13px 28px", fontSize:13, fontWeight:700, cursor:"pointer", border:"none",
              background:"transparent", borderBottom: masterTab===id ? `3px solid ${MN.navy}` : "3px solid transparent",
              color: masterTab===id ? MN.navy : MN.muted, marginBottom:"-2px", transition:"all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {/* Input sub-tabs */}
        {masterTab==="input" && (
          <div style={{ display:"flex", borderBottom:`1px solid ${MN.mid}`, background:MN.white, flexShrink:0, padding:"0 24px", gap:4 }}>
            {inputSubTabs.map(t => (
              <button key={t.id} onClick={() => setInputSub(t.id)} style={{
                padding:"9px 18px", fontSize:11, fontWeight:600, cursor:"pointer", border:"none",
                background:"transparent", borderBottom: inputSub===t.id ? `2px solid ${MN.accent}` : "2px solid transparent",
                color: inputSub===t.id ? MN.accent : "#9CA3AF", marginBottom:"-1px", transition:"all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ overflowY:"auto", padding:"24px 28px", flex:1 }}>
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220, gap:14, color:MN.muted, fontSize:13 }}>
              <div style={{ width:20, height:20, border:`2px solid ${MN.mid}`, borderTopColor:MN.navy, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
              Loading quotation data…
            </div>
          )}
          {error && !loading && (
            <div style={{ background:MN.redLight, border:`1.5px solid ${MN.red}`, borderRadius:10, padding:"14px 18px", fontSize:12, color:"#B91C1C" }}>
              Failed to load: {error}. Your token may have expired.
            </div>
          )}
          {!loading && !error && data && (
            <>
              {/* Validation errors */}
              {rawErrors.length > 0 && (
                <div style={{ background:MN.redLight, border:`1.5px solid ${MN.red}`, borderRadius:10, padding:"14px 20px", marginBottom:18 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:"#991B1B", marginBottom:10, textAlign:"left" }}>
                    ⚠ Validation Errors ({rawErrors.length})
                  </div>
                  <ol style={{ margin:0, paddingLeft:20, color:"#B91C1C", textAlign:"left" }}>
                    {rawErrors.map((e,i) => (
                      <li key={i} style={{ fontSize:12, marginBottom:5 }}>{e.message}</li>
                    ))}
                  </ol>
                </div>
              )}
              {/* Warnings */}
              {rawWarnings.length > 0 && (
                <div style={{ background:MN.amberLight, border:`1.5px solid ${MN.amber}`, borderRadius:10, padding:"14px 20px", marginBottom:18 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:"#92400E", marginBottom:8, textAlign:"left" }}>⚡ Warnings ({rawWarnings.length})</div>
                  <ol style={{ margin:0, paddingLeft:20, color:"#B45309", textAlign:"left" }}>
                    {rawWarnings.map((w,i) => (
                      <li key={i} style={{ fontSize:12, marginBottom:5 }}>{w.message}</li>
                    ))}
                  </ol>
                </div>
              )}
              {masterTab==="input" && inputSub==="inputs"  && <ModalInputsTab  inp={sectionInputs}/>}
              {masterTab==="input" && inputSub==="claims"  && <ModalClaimsTab  inp={sectionClaims}/>}
              {masterTab==="input" && inputSub==="census"  && <ModalCensusTab  rows={censusRows}/>}
              {masterTab==="input" && inputSub==="tob"     && <ModalTOBTab     rows={tobRows}/>}
              {masterTab==="output"                        && <ModalOutputTab  outputs={rawOutputs}/>}
            </>
          )}
        </div>

        {/* Footer — Accept / Decline (hidden for Policy Bound) */}
        {data && !loading && !error && (
          <div style={{ borderTop:`1px solid ${MN.mid}`, padding:"14px 24px", background:MN.white,
            display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0 }}>
            {!isPolicyBound && (<>
              <button
                onClick={() => triggerEmailAndPDF("Decline")}
                style={{ padding:"9px 22px", borderRadius:8, border:`1.5px solid ${MN.red}`,
                  background:"white", color:MN.red, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background=MN.redLight; }}
                onMouseLeave={e => { e.currentTarget.style.background="white"; }}
              >✗ Decline</button>
              <button
                onClick={() => triggerEmailAndPDF("Accept")}
                style={{ padding:"9px 22px", borderRadius:8, border:"none",
                  background:MN.green, color:"white", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.background=MN.green; }}
              >✓ Accept</button>
            </>)}
            {isPolicyBound && (
              <div style={{ fontSize:12, color:MN.muted, fontStyle:"italic", alignSelf:"center" }}>
                Policy Bound — no action required
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ALHRSDashboard() {
  const def = getDefaults();
  const [startDate, setStartDate] = useState(def.start);
  const [endDate, setEndDate]     = useState(def.end);
  const [token, setToken]         = useState(DEFAULT_TOKEN);
  const [tokenInput, setTokenInput] = useState(DEFAULT_TOKEN);
  const [tokenExpanded, setTokenExpanded] = useState(false);
  const tokenRef = useRef(null);
  const tokenValueRef = useRef(DEFAULT_TOKEN);
  const [logs, setLogs]           = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading]     = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [view, setView]           = useState("dashboard");

  // Table filters
  const [searchUser,    setSearchUser]    = useState("");
  const [fVersion,      setFVersion]      = useState([]);
  const [fPurpose,      setFPurpose]      = useState([]);
  const [fSource,       setFSource]       = useState([]);
  const [fStatus,       setFStatus]       = useState([]);
  const [page,          setPage]          = useState(1);
  const [pageSize,      setPageSize]      = useState(10);
  const [modalLog, setModalLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true); setFetchError(null);
    const cleanToken = tokenValueRef.current.replace(/^Bearer\s+/i, "").trim();
    const headers = { "Content-Type":"application/json", Authorization:`Bearer ${cleanToken}`, "x-tenant-name":"alhrs" };
    const searchPayload = {
      page:1, pageSize:100, sort:"-updated",
      search:[
        { field:"StartDate", value:`${startDate}T00:00:00.000Z`, id:"" },
        { field:"EndDate",   value:`${endDate}T23:59:59.999Z` },
      ],
    };
    try {
      // Fetch logs first
      const logsRes = await fetch(BASE_URL, { method:"POST", headers, body: JSON.stringify(searchPayload) });
      if (!logsRes.ok) throw new Error(`HTTP ${logsRes.status}`);
      const data = await logsRes.json();
      const items = data.data || data.items || data.logs || (Array.isArray(data) ? data : []);
      setLogs(items);

      // Fetch total count separately with minimal payload
      try {
        const countRes = await fetch(TOTAL_COUNT_URL, {
          method:"POST", headers,
          body: JSON.stringify({ request_data: { page:1, pageSize:10, sort:"-updated", search:[
            { field:"StartDate", value:`${startDate}T00:00:00.000Z`, id:"" },
            { field:"EndDate",   value:`${endDate}T23:59:59.999Z` },
          ]}}),
        });
        if (countRes.ok) {
          const countData = await countRes.json();
          const total = countData?.response_data?.total_count
            ?? countData?.total_count
            ?? countData?.total
            ?? data.total ?? data.totalCount ?? items.length;
          setTotalCount(total);
        } else {
          setTotalCount(data.total || data.totalCount || items.length);
        }
      } catch(e) {
        setTotalCount(data.total || data.totalCount || items.length);
      }
    } catch (err) {
      const isCors = err.message === "Failed to fetch" || err.message.includes("NetworkError");
      const is401  = err.message.includes("401");
      const msg = is401
        ? "Your Bearer Token may have expired — please get a fresh one from Coherent Spark and paste it via the Token button above."
        : isCors
        ? "Could not reach the Coherent API — CORS: this origin is not whitelisted."
        : "API error: " + err.message;
      setFetchError(msg);
      setLogs([]); setTotalCount(0);
    } finally { setLoading(false); }
  }, [startDate, endDate]);

  useEffect(() => { fetchLogs(); }, []);

  // Close token panel on outside click
  useEffect(() => {
    if (!tokenExpanded) return;
    function handler(e) {
      if (tokenRef.current && !tokenRef.current.contains(e.target)) setTokenExpanded(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tokenExpanded]);

  // Derived
  const quotes   = logs.filter(l => l.callPurpose?.toLowerCase().includes("quote"));
  const referrals= logs.filter(l => l.callPurpose?.toLowerCase().includes("referral"));
  const binds    = logs.filter(l => { const p = l.callPurpose?.toLowerCase(); return p?.includes("policy bound"); });
  const errors   = logs.filter(l => l.hasErrors);
  const warnings = logs.filter(l => l.hasWarnings);
  const clean    = logs.filter(l => !l.hasErrors && !l.hasWarnings);

  const purposeData = [
    { name:"Quote",    value: quotes.length },
    { name:"Referral", value: referrals.length },
    { name:"Policy Bound",     value: binds.length },
  ].filter(d => d.value > 0);

  const statusData = [
    { name:"Clean",    value: clean.length },
    { name:"Warnings", value: warnings.length },
    { name:"Errors",   value: errors.length },
  ].filter(d => d.value > 0);

  // Activity chart: always show at least 7 days, fill empty days with zeros
  const activityData = (() => {
    // Use UTC to avoid timezone shifts between bucket keys and log date slices
    const startMs = Date.UTC(
      parseInt(startDate.slice(0,4)), parseInt(startDate.slice(5,7))-1, parseInt(startDate.slice(8,10))
    );
    const endMs = Date.UTC(
      parseInt(endDate.slice(0,4)), parseInt(endDate.slice(5,7))-1, parseInt(endDate.slice(8,10))
    );
    const totalDays = Math.round((endMs - startMs) / 86400000) + 1;
    const buckets = {};
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startMs + i * 86400000);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
      buckets[key] = { date: key, Quote: 0, Referral: 0, "Policy Bound": 0 };
    }
    logs.forEach(l => {
      const key = (l.transactionDate || "").slice(0, 10);
      const lower = (l.callPurpose || "").toLowerCase();
      if (!buckets[key]) return;
      if (lower.includes("quote"))                                    buckets[key].Quote++;
      else if (lower.includes("policy bound")) buckets[key]["Policy Bound"]++;
      else if (lower.includes("referral"))                               buckets[key].Referral++;
    });
    return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
  })();

  // Filter option lists
  const allVersions = [...new Set(logs.map(l => l.serviceVersion).filter(Boolean))];
  const allPurposes = [...new Set(logs.map(l => l.callPurpose).filter(Boolean))];
  const allSources  = [...new Set(logs.map(l => l.sourceSystem).filter(Boolean))];
  const statusOpts  = ["No Issues", "Has Warnings", "Has Errors"];

  // Table filtering
  const filtered = logs.filter(l => {
    if (searchUser && !(l.username||"").toLowerCase().includes(searchUser.toLowerCase())) return false;
    if (fVersion.length  && !fVersion.includes(l.serviceVersion)) return false;
    if (fPurpose.length  && !fPurpose.some(p => (l.callPurpose||"").toLowerCase().includes(p.toLowerCase()))) return false;
    if (fSource.length   && !fSource.includes(l.sourceSystem))    return false;
    if (fStatus.length) {
      const match = fStatus.some(s => {
        if (s === "No Issues")    return !l.hasErrors && !l.hasWarnings;
        if (s === "Has Warnings") return l.hasWarnings;
        if (s === "Has Errors")   return l.hasErrors;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedRows  = filtered.slice((page-1)*pageSize, page*pageSize);

  const days = daysBetween(startDate, endDate);

  const inputStyle = {
    background:C.white, border:`1px solid ${C.border}`, borderRadius:6,
    padding:"7px 10px", fontSize:12, color:C.text, outline:"none",
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Inter',-apple-system,sans-serif", color:C.text, display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`* { box-sizing:border-box; } @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 40px",
        display:"flex", alignItems:"stretch", justifyContent:"space-between", position:"relative", minHeight:64 }}>

        {/* Left: Coherent logo + divider + AXA logo + title */}
        <div style={{ display:"flex", alignItems:"center", gap:18, paddingTop:14, paddingBottom:14, textAlign:"left" }}>
          {/* Coherent logo */}
          <img src={COHERENT_LOGO} alt="Coherent" style={{ height:28, objectFit:"contain" }}
            onError={e => { e.target.style.display = "none"; }}/>
          <div style={{ width:1, height:36, background:C.border }}/>
          {/* AXA logo */}
          <img src={AXA_LOGO} alt="AXA" style={{ height:46, objectFit:"contain", borderRadius:8 }}
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}/>
          <div style={{ display:"none", width:56, height:46, background:"#00008F", borderRadius:8,
            alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:17 }}>AXA</div>
          <div style={{ width:1, height:36, background:C.border }}/>
          <div>
            <div style={{ fontWeight:800, fontSize:18, letterSpacing:"-0.03em", color:C.text, lineHeight:1.2 }}>
              ALHRS Intelligence Dashboard
            </div>
            <div style={{ fontSize:12, color:C.muted, marginTop:3, letterSpacing:"0.01em" }}>
              alhrs · UAT · Rater (MYS)
            </div>
          </div>
        </div>

        {/* Right: view toggles + token */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {["dashboard","table"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view===v ? C.accentLight : "transparent",
              color: view===v ? C.accent : C.muted,
              border:`1px solid ${view===v ? C.accent : C.border}`,
              borderRadius:7, padding:"7px 18px", fontSize:12, fontWeight:600, cursor:"pointer",
              transition:"all 0.15s",
            }}>
              {v === "dashboard" ? "📊 Dashboard" : "📋 Table"}
            </button>
          ))}
          {/* Discreet token button */}
          <div ref={tokenRef} style={{ position:"relative" }}>
            <button
              onClick={() => setTokenExpanded(o => !o)}
              title="Update API token"
              style={{
                background:"transparent", border:`1px solid ${C.border}`, borderRadius:7,
                padding:"7px 12px", cursor:"pointer", color:C.subtle, fontSize:12,
                display:"flex", alignItems:"center", gap:5,
              }}>
              <span style={{ fontSize:13 }}>🔑</span>
              <span style={{ fontSize:11, color:C.subtle }}>Token</span>
            </button>
            {tokenExpanded && (
              <div style={{
                position:"absolute", top:"calc(100% + 8px)", right:0,
                background:C.white, border:`1px solid ${C.border}`, borderRadius:10,
                boxShadow:"0 8px 32px rgba(0,0,0,0.12)", padding:16, zIndex:300, width:420,
              }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
                  Bearer Token
                </div>
                <div style={{ fontSize:11, color:C.subtle, marginBottom:10, lineHeight:1.5 }}>
                  Paste your full token (with or without "Bearer " prefix). Tokens expire every 2 hours.
                </div>
                <textarea
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  rows={4}
                  placeholder="eyJhbGci..."
                  style={{
                    width:"100%", background:"#F9FAFB", border:`1px solid ${C.border}`,
                    borderRadius:6, padding:"8px 10px", fontSize:10, fontFamily:"monospace",
                    color:C.muted, resize:"none", outline:"none", lineBreak:"anywhere",
                  }}
                />
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button
                    onClick={() => {
                      const clean = tokenInput.replace(/^Bearer\s+/i,"").trim();
                      tokenValueRef.current = clean;
                      setToken(clean);
                      setTokenExpanded(false);
                      fetchLogs();
                    }}
                    style={{
                      flex:1, background:C.accent, color:"#fff", border:"none",
                      borderRadius:6, padding:"8px 0", fontSize:12, fontWeight:600, cursor:"pointer",
                    }}>Apply & Refresh</button>
                  <button
                    onClick={() => setTokenExpanded(false)}
                    style={{
                      background:"transparent", color:C.muted, border:`1px solid ${C.border}`,
                      borderRadius:6, padding:"8px 14px", fontSize:12, cursor:"pointer",
                    }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding:"28px 40px", flex:1 }}>

        {/* ── Date range + refresh ── */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:16, marginBottom:24, flexWrap:"wrap",
          background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:"16px 20px" }}>
          <DatePicker label="From" value={startDate} onChange={v => { setStartDate(v); setPage(1); }} maxDate={endDate < fmtDate(new Date()) ? endDate : fmtDate(new Date())}/>
          <DatePicker label="To"   value={endDate}   onChange={v => { setEndDate(v);   setPage(1); }} minDate={startDate} maxDate={fmtDate(new Date())}/>
          <div style={{ alignSelf:"flex-end" }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>
              {days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`}
            </div>
            <button onClick={() => { setPage(1); fetchLogs(); }} disabled={loading} style={{
              background:C.accent, color:"#fff", border:"none", borderRadius:6,
              padding:"8px 20px", fontSize:12, fontWeight:600, cursor:"pointer", opacity: loading ? 0.6 : 1,
            }}>
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
          <div style={{ marginLeft:"auto", alignSelf:"center", fontSize:12, color:C.muted }}>
            {loading
              ? <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:14, height:14, border:`2px solid ${C.border}`, borderTopColor:C.accent, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                  Fetching…
                </span>
              : <><strong style={{ color:C.text }}>{logs.length}</strong> records loaded</>
            }
          </div>
        </div>

        {fetchError && (
          <div style={{
            background:"#FEF2F2", border:`1.5px solid ${C.red}`, borderRadius:10,
            padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12,
            boxShadow:"0 2px 8px rgba(239,68,68,0.10)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
              <circle cx="8" cy="8" r="7.5" stroke="#EF4444" strokeWidth="1.2"/>
              <path d="M8 4.5v4M8 10.5v1" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontWeight:700, fontSize:13, color:"#991B1B", marginBottom:2 }}>API Error</div>
              <div style={{ fontSize:12, color:"#B91C1C", lineHeight:1.6 }}>{fetchError}</div>
            </div>
          </div>
        )}

        {/* ── KPI row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14, marginBottom:20 }}>
          <KpiCard label="Total Calls"   value={totalCount}       sub={`${logs.length} loaded`}                                       color={C.accent}/>
          <KpiCard label="Quotes"        value={quotes.length}    sub={`${logs.length?Math.round(quotes.length/logs.length*100):0}% of calls`}    color={C.accent}/>
          <KpiCard label="Referrals"     value={referrals.length} sub={`${logs.length?Math.round(referrals.length/logs.length*100):0}% of calls`} color={C.amber}/>
          <KpiCard label="Policy Bound"  value={binds.length}     sub={`${logs.length?Math.round(binds.length/logs.length*100):0}% of calls`}     color={C.green}/>
          <KpiCard label="Has Errors"    value={errors.length}    sub={errors.length>0?"Needs attention":"All clear"}              color={errors.length>0?C.red:C.green}/>
          <KpiCard label="Has Warnings"  value={warnings.length}  sub={`${clean.length} clean calls`}                              color={warnings.length>0?C.amber:C.green}/>
        </div>

        {/* ── DASHBOARD VIEW ── */}
        {view === "dashboard" && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:24 }}>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:2 }}>Activity Over Time</div>
              <div style={{ color:C.muted, fontSize:12, marginBottom:18 }}>Quote vs Referral vs Policy Bound by day</div>
              {logs.length === 0 ? (
                <div style={{ height:180, display:"flex", alignItems:"center", justifyContent:"center", color:C.subtle, fontSize:13 }}>No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={activityData} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                    <XAxis dataKey="date" tick={{ fill:C.muted, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:C.muted, fontSize:10 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                    <Tooltip contentStyle={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                    <Bar dataKey="Quote"    fill={C.accent} radius={[3,3,0,0]} style={{ cursor:"pointer" }}
                      onClick={() => { setFPurpose(["Quote"]); setFStatus([]); setView("table"); setPage(1); }}/>
                    <Bar dataKey="Referral" fill={C.amber}  radius={[3,3,0,0]} style={{ cursor:"pointer" }}
                      onClick={() => { setFPurpose(["Referral"]); setFStatus([]); setView("table"); setPage(1); }}/>
                    <Bar dataKey="Policy Bound"     fill={C.green}  radius={[3,3,0,0]} style={{ cursor:"pointer" }}
                      onClick={() => { setFPurpose(["Policy Bound"]); setFStatus([]); setView("table"); setPage(1); }}/>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div style={{ display:"flex", gap:14, marginTop:10 }}>
                {[["Quote",C.accent],["Referral",C.amber],["Policy Bound",C.green]].map(([l,c]) => (
                  <div key={l} onClick={() => { setFPurpose([l]); setFStatus([]); setView("table"); setPage(1); }}
                    style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:C.muted, cursor:"pointer",
                      borderRadius:5, padding:"3px 7px", transition:"background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width:10, height:10, borderRadius:2, background:c }}/>{l}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:24 }}>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:2 }}>Call Purpose</div>
              <div style={{ color:C.muted, fontSize:12, marginBottom:12 }}>Quote vs Referral vs Policy Bound</div>
              {purposeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={purposeData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" stroke="none"
                        onClick={(d) => { setFPurpose([d.name]); setFStatus([]); setView("table"); setPage(1); }}
                        style={{ cursor:"pointer" }}>
                        {purposeData.map((_, i) => <Cell key={i} fill={PIE_COLORS_PURPOSE[i]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                  {purposeData.map((d, i) => (
                    <div key={d.name} onClick={() => { setFPurpose([d.name]); setFStatus([]); setView("table"); setPage(1); }}
                      style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginTop:8, cursor:"pointer", borderRadius:6, padding:"4px 6px", transition:"background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:PIE_COLORS_PURPOSE[i] }}/>
                        <span style={{ color:C.muted }}>{d.name}</span>
                      </div>
                      <span style={{ fontWeight:600 }}>{d.value} <span style={{ color:C.muted, fontWeight:400 }}>
                        ({logs.length ? Math.round(d.value/logs.length*100) : 0}%)
                      </span></span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ height:180, display:"flex", alignItems:"center", justifyContent:"center", color:C.subtle, fontSize:13 }}>No data</div>
              )}
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:24 }}>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:2 }}>Call Status</div>
              <div style={{ color:C.muted, fontSize:12, marginBottom:12 }}>Health breakdown</div>
              {statusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" stroke="none"
                        onClick={(d) => {
                          const map = { "Clean":["No Issues"], "Warnings":["Has Warnings"], "Errors":["Has Errors"] };
                          setFStatus(map[d.name] || []); setFPurpose([]); setView("table"); setPage(1);
                        }}
                        style={{ cursor:"pointer" }}>
                        {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS_STATUS[i]}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                  {statusData.map((d, i) => {
                    const map = { "Clean":["No Issues"], "Warnings":["Has Warnings"], "Errors":["Has Errors"] };
                    return (
                      <div key={d.name} onClick={() => { setFStatus(map[d.name] || []); setFPurpose([]); setView("table"); setPage(1); }}
                        style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginTop:8, cursor:"pointer", borderRadius:6, padding:"4px 6px", transition:"background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:PIE_COLORS_STATUS[i] }}/>
                          <span style={{ color:C.muted }}>{d.name}</span>
                        </div>
                        <span style={{ fontWeight:600 }}>{d.value}</span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={{ height:180, display:"flex", alignItems:"center", justifyContent:"center", color:C.subtle, fontSize:13 }}>No data</div>
              )}
            </div>
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === "table" && (
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
            {/* Filters */}
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
              display:"flex", alignItems:"flex-end", gap:14, flexWrap:"wrap", background:"#FAFAFA" }}>
              <div>
                <div style={{ fontSize:10, color:C.muted, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>User</div>
                <input placeholder="Search user…" value={searchUser}
                  onChange={e => { setSearchUser(e.target.value); setPage(1); }}
                  style={{ ...inputStyle, width:180 }}/>
              </div>
              <MultiSelect label="Version"      options={allVersions} selected={fVersion} onChange={v => { setFVersion(v);  setPage(1); }}/>
              <MultiSelect label="Call Purpose" options={allPurposes} selected={fPurpose} onChange={v => { setFPurpose(v); setPage(1); }}/>
              <MultiSelect label="Source System" options={allSources} selected={fSource}  onChange={v => { setFSource(v);  setPage(1); }}/>
              <MultiSelect label="Status"       options={statusOpts}  selected={fStatus}  onChange={v => { setFStatus(v);  setPage(1); }}/>
              <div style={{ marginLeft:"auto", alignSelf:"flex-end", fontSize:12, color:C.muted, paddingBottom:2 }}>
                {filtered.length} records
              </div>
            </div>

            {/* Table */}
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#F9FAFB", borderBottom:`1px solid ${C.border}` }}>
                  {["","LOG TIME (LOCAL)","VERSION","USER","CALL PURPOSE","SOURCE SYSTEM","CALL ID"].map(h => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"center", color:C.accent,
                      fontWeight:600, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 && (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.muted }}>No records match your filters.</td></tr>
                )}
                {pagedRows.map((log, i) => (
                  <tr key={log.id || i} style={{ borderBottom:`1px solid ${C.border}`, background: i%2===0 ? C.white : "#FAFAFA" }}>
                    <td style={{ padding:"10px 14px", width:24, textAlign:"center" }}>
                      <StatusDots hasErrors={log.hasErrors} hasWarnings={log.hasWarnings}/>
                    </td>
                    <td style={{ padding:"10px 14px", whiteSpace:"nowrap", fontWeight:500, textAlign:"center" }}>{toLocalDT(log.transactionDate)}</td>
                    <td style={{ padding:"10px 14px", color:C.muted, textAlign:"center" }}>{log.serviceVersion || "—"}</td>
                    <td style={{ padding:"10px 14px", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"center" }}>{log.username || "—"}</td>
                    <td style={{ padding:"10px 14px", textAlign:"center" }}><Badge text={log.callPurpose}/></td>
                    <td style={{ padding:"10px 14px", color:C.muted, textTransform:"uppercase", fontSize:11, textAlign:"center" }}>{log.sourceSystem || "—"}</td>
                    <td style={{ padding:"10px 14px", fontSize:10, fontFamily:"monospace", textAlign:"center" }}>
                      <span
                        onClick={() => setModalLog(log)}
                        title={log.engineCallId || log.id}
                        style={{
                          color: C.accent, cursor:"pointer", textDecoration:"underline",
                          textDecorationStyle:"dotted", textUnderlineOffset:3,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#3730a3"}
                        onMouseLeave={e => e.currentTarget.style.color = C.accent}
                      >
                        {((log.engineCallId || log.id) || "—").slice(0, 18)}…
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, color:C.muted }}>Rows per page</span>
                {[10, 25, 50, 100].map(n => (
                  <button key={n} onClick={() => { setPageSize(n); setPage(1); }} style={{
                    background: pageSize===n ? C.accentLight : "transparent",
                    color: pageSize===n ? C.accent : C.muted,
                    border:`1px solid ${pageSize===n ? C.accent : C.border}`,
                    borderRadius:5, padding:"4px 10px", fontSize:11, cursor:"pointer",
                    fontWeight: pageSize===n ? 700 : 400,
                  }}>{n}</button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{
                  background:"transparent", border:`1px solid ${C.border}`, borderRadius:5,
                  padding:"5px 12px", cursor: page===1?"not-allowed":"pointer",
                  color: page===1 ? C.subtle : C.text, fontSize:12,
                }}>&lt;</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg = Math.max(1, Math.min(page-2, totalPages-4)) + i;
                  return (
                    <button key={pg} onClick={() => setPage(pg)} style={{
                      background: page===pg ? C.accent : "transparent",
                      color: page===pg ? "#fff" : C.text,
                      border:`1px solid ${page===pg ? C.accent : C.border}`,
                      borderRadius:5, padding:"5px 10px", cursor:"pointer",
                      fontSize:12, fontWeight: page===pg ? 700 : 400,
                    }}>{pg}</button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages} style={{
                  background:"transparent", border:`1px solid ${C.border}`, borderRadius:5,
                  padding:"5px 12px", cursor: page>=totalPages?"not-allowed":"pointer",
                  color: page>=totalPages ? C.subtle : C.text, fontSize:12,
                }}>&gt;</button>
                <span style={{ fontSize:12, color:C.muted, marginLeft:4 }}>Go to</span>
                <input type="number" min={1} max={totalPages} defaultValue={page}
                  onBlur={e => { const v=parseInt(e.target.value); if(v>=1&&v<=totalPages) setPage(v); }}
                  style={{ width:46, ...inputStyle, textAlign:"center", padding:"5px 6px" }}/>
                <span style={{ fontSize:12, color:C.muted }}>/ {totalPages}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"18px 40px", textAlign:"center", fontSize:12, color:C.subtle }}>
        © {new Date().getFullYear()} Coherent – All rights reserved.
      </div>

      {/* ── Execution Detail Modal ── */}
      {modalLog && (
        <ExecutionModal
          logId={modalLog.id}
          engineCallId={modalLog.engineCallId}
          callPurpose={modalLog.callPurpose}
          token={tokenValueRef.current.replace(/^Bearer\s+/i,"").trim()}
          onClose={() => setModalLog(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}