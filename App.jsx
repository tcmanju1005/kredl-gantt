import { useState } from "react";

// CORRECTED LOGIC:
// - Steps 2 (Scrutiny) & 3 (Affidavit) run IN PARALLEL → same start slot
// - Sub-Registrar + Certificate merged into one step
// - DC verification = 1 slot (half day = 3-4 hrs)
// - Total = 8 working days

const STEPS = [
  {
    id: 1,
    phase: "EOI + Document Collection",
    actor: "Farmer + KREDL Field",
    start: 0, duration: 2,
    durationLabel: "1 Day",
    color: "#2E86AB",
    critical: false,
    parallel: null,
    docs: [
      "Signed EOI / Consent Letter",
      "Aadhaar Card (original + copy)",
      "RTC / Pahani (within 15 days)",
      "Mutation Register Extract",
      "e-Khata (mandatory Oct 2025)",
      "Survey Sketch Form 11E",
      "Encumbrance Certificate (13 yrs)",
      "PAN Card",
      "Bank Passbook copy",
      "Land tax paid receipt",
      "Legal Heir Certificate (if needed)"
    ],
    note: "All docs collected ONCE. Digital folder created per farmer. Same folder reused at every upload step — zero re-collection.",
    icon: "📁"
  },
  {
    id: 2,
    phase: "Internal Scrutiny",
    actor: "KREDL Internal Team",
    start: 2, duration: 1,
    durationLabel: "AM",
    color: "#2E86AB",
    critical: false,
    parallel: "Runs parallel with Step 3",
    docs: [
      "Fresh RTC from Bhoomi portal",
      "EC check on Kaveri portal",
      "Land Beat App — Govt. land flag check",
      "Survey boundary verification"
    ],
    note: "100% online. Bhoomi + Kaveri portals. Runs simultaneously while affidavit is being drafted.",
    icon: "🔍"
  },
  {
    id: 3,
    phase: "Affidavit + Stamp + Notary",
    actor: "KREDL / Advocate / Notary",
    start: 2, duration: 2,
    durationLabel: "1 Day",
    color: "#A23B72",
    critical: false,
    parallel: "Runs parallel with Step 2",
    docs: [
      "Affidavit (Annexure-II, KS Rules 1977)",
      "Rs.100 Non-Judicial Stamp Paper",
      "Form No.1",
      "Farmer Aadhaar (for Notary)",
      "Notary fee receipt"
    ],
    note: "Drafted, stamped, and notarised in one visit. Completes same day. Scrutiny runs in background simultaneously.",
    icon: "📜"
  },
  {
    id: 4,
    phase: "Land Conversion Portal Upload",
    actor: "KREDL",
    start: 4, duration: 1,
    durationLabel: "3–4 Hrs",
    color: "#F18F01",
    critical: false,
    parallel: null,
    docs: [
      "Notarised Affidavit",
      "RTC (from farmer folder)",
      "Survey Sketch Form 11E (from folder)",
      "EC (from folder)",
      "Site layout plan",
      "KREDL project reference letter"
    ],
    note: "⚡ 2025: Solar projects exempt from DC approval — fee still payable. All docs from pre-built folder. Upload takes 3–4 hours.",
    icon: "⬆️"
  },
  {
    id: 5,
    phase: "Conversion Challan → HO Payment",
    actor: "KREDL Field + HO",
    start: 5, duration: 2,
    durationLabel: "1 Day",
    color: "#F18F01",
    critical: false,
    parallel: null,
    docs: [
      "System-generated Conversion Challan",
      "Covering email with survey details",
      "Finance authorisation (HO)",
      "UTR / online payment confirmation"
    ],
    note: "Challan emailed to HO on Day 3 PM. HO processes by Day 4 EOD.",
    icon: "💳"
  },
  {
    id: 6,
    phase: "DC Online Verification + NA Certificate",
    actor: "Deputy Commissioner (Online)",
    start: 7, duration: 1,
    durationLabel: "3 Hrs",
    color: "#C73E1D",
    critical: false,
    parallel: null,
    docs: [
      "All portal-uploaded documents (auto-available to DC)",
      "DC digital Order / NA Certificate",
      "Updated RTC reflecting NA status (Bhoomi auto-update)"
    ],
    note: "⚡ FULLY ONLINE. ~3 hours. 2025: Solar = automatic conversion, no physical DC order needed. Deemed approval after 30 days as safety net.",
    icon: "🏛️"
  },
  {
    id: 7,
    phase: "Kaveri 2.0 — Deed Upload",
    actor: "KREDL",
    start: 8, duration: 1,
    durationLabel: "3–4 Hrs",
    color: "#5C6BC0",
    critical: false,
    parallel: null,
    docs: [
      "NA Certificate (DC digital order)",
      "Fresh RTC — re-verify within 15 days",
      "e-Khata (from folder)",
      "Form 11E (from folder)",
      "Aadhaar + PAN all parties (from folder)",
      "Affidavit Annexure-II (from folder)",
      "Form No.1 (from folder)",
      "Declaration u/s 81A KLR Act 1961",
      "Draft Sale / Lease Deed",
      "KREDL Board Resolution / POA"
    ],
    note: "Farmer folder docs pulled directly. Only new inputs: NA Certificate + Deed draft. Upload: 3–4 hours.",
    icon: "🖥️"
  },
  {
    id: 8,
    phase: "Stamp Duty + Reg Fee → HO Payment",
    actor: "KREDL Field + HO",
    start: 9, duration: 2,
    durationLabel: "1 Day",
    color: "#5C6BC0",
    critical: false,
    parallel: null,
    docs: [
      "Stamp Duty Challan (system generated)",
      "Registration Fee Challan (system generated)",
      "Guidance Value printout from Kaveri",
      "Finance authorisation (HO)",
      "UTR numbers for both challans"
    ],
    note: "Both challans generated together. Emailed to HO same day. Paid next working day.",
    icon: "💳"
  },
  {
    id: 9,
    phase: "Sub-Registrar + Registration Certificate",
    actor: "Sub-Registrar + Farmer + KREDL",
    start: 11, duration: 4,
    durationLabel: "2 Days",
    color: "#1B6B3A",
    critical: true,
    parallel: null,
    docs: [
      "Original Sale / Lease Deed",
      "Kaveri 2.0 application printout",
      "Stamp Duty + Reg Fee payment receipts",
      "Aadhaar of all parties (biometric capture)",
      "Two witnesses with Aadhaar",
      "KREDL authorisation letter",
      "NA Certificate",
      "RTC, EC, e-Khata (from folder)",
      "Registration Certificate — downloaded from Kaveri 2.0 on same day",
      "Post-registration EC (confirms title transfer)"
    ],
    note: "⚡ 2025: Virtual presentation enabled — farmer physical presence may not be required. 2-day buffer for farmer availability + Sub-Registrar server issues. Certificate issued same day as registration on Kaveri 2.0.",
    icon: "🏆"
  }
];

const TOTAL_SLOTS = 15; // 7.5 days → rounds to 8 working days
const SLOT_WIDTH = 52;
const LABEL_WIDTH = 240;

const PHASE_BANDS = [
  { label: "DOCUMENT PHASE", slots: [0, 4], color: "#2E86AB" },
  { label: "CONVERSION PHASE", slots: [4, 8], color: "#F18F01" },
  { label: "DC", slots: [8, 8], color: "#C73E1D" },
  { label: "KAVERI 2.0", slots: [8, 11], color: "#5C6BC0" },
  { label: "REGISTRATION", slots: [11, 15], color: "#1B6B3A" },
];

const VOTE_OPTIONS = ["✅ Agree", "⚠️ Too Short", "❌ Too Long"];

export default function KREDLGanttFinal() {
  const [active, setActive] = useState(null);
  const [votes, setVotes] = useState({});
  const [remarks, setRemarks] = useState({});
  const [reviewerName, setReviewerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const FORMSPREE_URL = "https://formspree.io/f/xeerkqpb";

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const data = { name: reviewerName };

      STEPS.forEach(s => {
        const hasVote = !!votes[s.id];
        const hasRemark = !!(remarks[s.id] && remarks[s.id].trim());
        if (hasVote || hasRemark) {
          data[`Step_${s.id}_${s.phase.replace(/\s+/g, "_")}_Vote`] = votes[s.id] || "Not voted";
          data[`Step_${s.id}_${s.phase.replace(/\s+/g, "_")}_Remarks`] = remarks[s.id] && remarks[s.id].trim() ? remarks[s.id].trim() : "None";
        }
      });

      // Always include a summary line
      const votedSteps = STEPS.filter(s => votes[s.id]).length;
      const remarkedSteps = STEPS.filter(s => remarks[s.id] && remarks[s.id].trim()).length;
      data["Summary"] = `${votedSteps} steps voted | ${remarkedSteps} steps with remarks`;

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError("Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmitError("Network error. Please check internet and try again.");
    }
    setSubmitting(false);
  };

  const totalDays = 8;

  const handleVote = (stepId, vote) => {
    setVotes(v => ({ ...v, [stepId]: vote }));
  };

  const handleRemark = (stepId, text) => {
    setRemarks(r => ({ ...r, [stepId]: text }));
  };

  const voteColors = {
    "✅ Agree": "#4CAF50",
    "⚠️ Too Short": "#F18F01",
    "❌ Too Long": "#C73E1D"
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#0B1520",
      minHeight: "100vh",
      padding: "20px 16px",
      color: "#E0EAF4"
    }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#4A7FA5", textTransform: "uppercase", marginBottom: 4 }}>
          KREDL · Pavagada Solar & BESS · Field Team Review
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: "#E0EAF4", lineHeight: 1.2 }}>
          Land Registration — Process Gantt
        </h1>
        <p style={{ margin: 0, fontSize: 11, color: "#4A7FA5" }}>
          Single survey number · Optimistic timeline · Click each step → review days → vote
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total", value: `${totalDays} Days`, color: "#4CAF50" },
          { label: "DC Verify", value: "3 Hrs", color: "#C73E1D" },
          { label: "HO Payment ×2", value: "1 Day each", color: "#F18F01" },
          { label: "Sub-Registrar", value: "2 Days ⚠️", color: "#1B6B3A" },
          { label: "Steps 2+3", value: "Parallel ⚡", color: "#A23B72" },
        ].map(c => (
          <div key={c.label} style={{
            background: "#131F2E",
            border: `1px solid ${c.color}44`,
            borderTop: `3px solid ${c.color}`,
            borderRadius: 8, padding: "8px 14px"
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "#7A9BB5", textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Chart — horizontally scrollable on mobile */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: LABEL_WIDTH + TOTAL_SLOTS * SLOT_WIDTH + 20 }}>

          <div style={{
            background: "#111D2B",
            borderRadius: 12,
            border: "1px solid #1E3048",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)"
          }}>

            {/* Phase bands */}
            <div style={{ display: "flex", borderBottom: "1px solid #1E3048" }}>
              <div style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH, borderRight: "1px solid #1E3048" }} />
              <div style={{ position: "relative", flex: 1, height: 24, minWidth: TOTAL_SLOTS * SLOT_WIDTH }}>
                {PHASE_BANDS.map(p => {
                  const w = (p.slots[1] - p.slots[0]) * SLOT_WIDTH;
                  if (w === 0) return null;
                  return (
                    <div key={p.label} style={{
                      position: "absolute",
                      left: p.slots[0] * SLOT_WIDTH,
                      width: w, height: "100%",
                      background: p.color + "18",
                      borderRight: `1px dashed ${p.color}55`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: p.color, letterSpacing: 1.5, whiteSpace: "nowrap" }}>{p.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: "flex", borderBottom: "2px solid #1E3048", background: "#0D1824" }}>
              <div style={{
                width: LABEL_WIDTH, minWidth: LABEL_WIDTH,
                padding: "0 14px", height: 38,
                display: "flex", alignItems: "center",
                borderRight: "1px solid #1E3048",
                fontSize: 10, fontWeight: 700, color: "#4A7FA5", letterSpacing: 1.5, textTransform: "uppercase"
              }}>
                Activity
              </div>
              <div style={{ display: "flex", minWidth: TOTAL_SLOTS * SLOT_WIDTH }}>
                {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
                  const isNewDay = i % 2 === 0;
                  const day = Math.floor(i / 2) + 1;
                  return (
                    <div key={i} style={{
                      width: SLOT_WIDTH, minWidth: SLOT_WIDTH, height: 38,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      borderRight: isNewDay ? "1px solid #2A3D52" : "1px dashed #1A2C3E",
                      background: isNewDay ? "#0D1824" : "#0B1520"
                    }}>
                      {isNewDay && <span style={{ fontSize: 11, fontWeight: 700, color: "#4A7FA5" }}>Day {day}</span>}
                      <span style={{ fontSize: 8, color: "#2A4060" }}>{isNewDay ? "AM" : "PM"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rows */}
            {STEPS.map((step, idx) => {
              const isActive = active === step.id;
              const voted = votes[step.id];
              const rowBg = isActive ? "#162236" : idx % 2 === 0 ? "#111D2B" : "#0E1826";

              return (
                <div key={step.id}>
                  {/* Clickable row — only the header row, NOT the expanded panel */}
                  <div
                    onClick={() => setActive(isActive ? null : step.id)}
                    style={{
                      display: "flex",
                      borderBottom: isActive ? "none" : "1px solid #1A2C3E",
                      background: rowBg,
                      cursor: "pointer",
                      minHeight: 56,
                      transition: "background 0.12s",
                      borderLeft: voted ? `3px solid ${voteColors[voted]}` : "3px solid transparent"
                    }}
                  >
                    {/* Label */}
                    <div style={{
                      width: LABEL_WIDTH - 3, minWidth: LABEL_WIDTH - 3,
                      padding: "8px 10px",
                      borderRight: "1px solid #1E3048",
                      display: "flex", alignItems: "center", gap: 8
                    }}>
                      <div style={{
                        background: step.color + "33",
                        border: `1px solid ${step.color}66`,
                        borderRadius: 6, width: 26, height: 26,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, flexShrink: 0
                      }}>{step.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#C8D8E8", lineHeight: 1.3 }}>{step.phase}</span>
                          {step.parallel && (
                            <span style={{
                              background: "#A23B7222", border: "1px solid #A23B7255",
                              borderRadius: 3, padding: "1px 5px", fontSize: 8, color: "#D4729A", whiteSpace: "nowrap"
                            }}>⚡ PARALLEL</span>
                          )}
                          {step.critical && (
                            <span style={{
                              background: "#FF6B6B18", border: "1px solid #FF6B6B44",
                              borderRadius: 3, padding: "1px 5px", fontSize: 8, color: "#FF8F8F", whiteSpace: "nowrap"
                            }}>⚠️ CRITICAL</span>
                          )}
                        </div>
                        <div style={{ fontSize: 9, color: "#3A5570", marginTop: 1 }}>{step.actor}</div>
                        {voted && (
                          <div style={{ fontSize: 10, color: voteColors[voted], marginTop: 2, fontWeight: 700 }}>
                            {voted}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bar area */}
                    <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", minWidth: TOTAL_SLOTS * SLOT_WIDTH }}>
                      {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
                        <div key={i} style={{
                          position: "absolute", left: i * SLOT_WIDTH,
                          width: SLOT_WIDTH, height: "100%",
                          borderRight: i % 2 === 0 ? "1px solid #1A2C3E" : "1px dashed #131F2E",
                          background: i % 2 === 0 ? "transparent" : "#0B152012"
                        }} />
                      ))}

                      <div style={{
                        position: "absolute",
                        left: step.start * SLOT_WIDTH + 3,
                        width: step.duration * SLOT_WIDTH - 6,
                        height: 32,
                        background: `linear-gradient(90deg, ${step.color}EE 0%, ${step.color}77 100%)`,
                        borderRadius: 6,
                        display: "flex", alignItems: "center", paddingLeft: 10,
                        boxShadow: `0 2px 10px ${step.color}33`,
                        border: `1px solid ${step.color}88`,
                        zIndex: 2
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                          {step.durationLabel}
                        </span>
                      </div>

                      {/* Arrow connector to next step */}
                      <div style={{
                        position: "absolute",
                        left: (step.start + step.duration) * SLOT_WIDTH - 4,
                        width: 8, height: 8,
                        background: step.color,
                        borderRadius: "50%",
                        zIndex: 3,
                        boxShadow: `0 0 6px ${step.color}88`
                      }} />
                    </div>
                  </div>

                  {/* Expanded panel with vote buttons */}
                  {isActive && (
                    <div style={{
                      background: "#0C1828",
                      borderBottom: "2px solid #1E3048",
                      borderLeft: `4px solid ${step.color}`,
                      padding: "14px 16px"
                    }}>
                      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                        <div style={{ minWidth: 200, flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#4A7FA5", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                            Step {step.id} · {step.durationLabel}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#E0EAF4", marginBottom: 4 }}>{step.phase}</div>
                          <div style={{ fontSize: 10, color: "#4A7FA5", marginBottom: 10 }}>{step.actor}</div>
                          <div style={{
                            background: "#F18F0110", border: "1px solid #F18F0130",
                            borderRadius: 6, padding: "7px 10px",
                            fontSize: 11, color: "#F4C261", lineHeight: 1.6
                          }}>
                            {step.note}
                          </div>
                        </div>
                        <div style={{ flex: 2, minWidth: 220 }}>
                          <div style={{ fontSize: 9, color: "#4A7FA5", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                            Documents Required ({step.docs.length})
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {step.docs.map((d, i) => (
                              <span key={i} style={{
                                background: step.color + "15",
                                border: `1px solid ${step.color}40`,
                                borderRadius: 4, padding: "3px 8px",
                                fontSize: 10, color: "#B0C8E0"
                              }}>{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Vote section */}
                      <div style={{
                        borderTop: "1px solid #1E3048", paddingTop: 12
                      }}>
                        {/* Vote buttons row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#7A9BB5" }}>
                            Is {step.durationLabel} realistic?
                          </span>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {VOTE_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                onClick={(e) => { e.stopPropagation(); handleVote(step.id, opt); }}
                                style={{
                                  background: votes[step.id] === opt ? voteColors[opt] + "33" : "#131F2E",
                                  border: `2px solid ${votes[step.id] === opt ? voteColors[opt] : "#2A3D52"}`,
                                  borderRadius: 6, padding: "6px 14px",
                                  fontSize: 12, fontWeight: 700,
                                  color: votes[step.id] === opt ? voteColors[opt] : "#7A9BB5",
                                  cursor: "pointer", transition: "all 0.15s"
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {votes[step.id] && (
                            <span style={{ fontSize: 11, color: voteColors[votes[step.id]], fontWeight: 700 }}>
                              Recorded ✓
                            </span>
                          )}
                        </div>

                        {/* Remarks / Comments box */}
                        <div>
                          <div style={{ fontSize: 10, color: "#4A7FA5", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>
                            💬 Remarks / Bottlenecks (Optional — describe actual time, issues faced, suggestions)
                          </div>
                          <textarea
                            placeholder={`e.g. "Notary availability is an issue in Pavagada — takes 2 days not 1" or "Farmer RTC is often expired, need 3 days to get fresh copy"`}
                            value={remarks[step.id] || ""}
                            onClick={e => e.stopPropagation()}
                            onChange={e => { e.stopPropagation(); handleRemark(step.id, e.target.value); }}
                            rows={2}
                            style={{
                              width: "100%",
                              background: "#0D1824",
                              border: `1px solid ${remarks[step.id] ? "#5C6BC0" : "#2A3D52"}`,
                              borderRadius: 6,
                              padding: "8px 12px",
                              fontSize: 11,
                              color: "#C8D8E8",
                              resize: "vertical",
                              outline: "none",
                              boxSizing: "border-box",
                              lineHeight: 1.6,
                              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                              transition: "border 0.15s"
                            }}
                          />
                          {remarks[step.id] && (
                            <div style={{ fontSize: 10, color: "#5C6BC0", marginTop: 3 }}>
                              ✏️ Remark saved
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Close button */}
                      <div style={{ marginTop: 14, textAlign: "center" }}>
                        <button
                          onClick={e => { e.stopPropagation(); setActive(null); }}
                          style={{
                            background: "#1E3048",
                            border: "1px solid #2A3D52",
                            borderRadius: 6,
                            padding: "7px 28px",
                            fontSize: 12, fontWeight: 700,
                            color: "#7A9BB5",
                            cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={e => { e.target.style.background = "#2A3D52"; e.target.style.color = "#E0EAF4"; }}
                          onMouseLeave={e => { e.target.style.background = "#1E3048"; e.target.style.color = "#7A9BB5"; }}
                        >
                          ✕ Close
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            {/* Footer */}
            <div style={{
              background: "#0A1220", borderTop: "2px solid #1E3048",
              padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"
            }}>
              <div style={{
                background: "#4CAF5020", border: "1px solid #4CAF5050",
                borderRadius: 6, padding: "5px 14px",
                fontSize: 13, fontWeight: 800, color: "#4CAF50"
              }}>
                ✅ Total: {totalDays} Working Days
              </div>
              <div style={{ fontSize: 10, color: "#4A7FA5" }}>
                {Object.keys(votes).length}/{STEPS.length} steps reviewed by field team
              </div>
              <div style={{ marginLeft: "auto", fontSize: 10, color: "#2A4060" }}>
                Tap any row → review → vote
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field team submit */}
      <div style={{
        marginTop: 20, background: "#111D2B",
        border: "1px solid #1E3048", borderRadius: 10,
        padding: "16px", position: "relative", zIndex: 10,
        touchAction: "manipulation"
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#B0C4D8", marginBottom: 12 }}>
          📋 Submit Your Review — Auto-saved to KREDL HO
        </div>
        {/* Vote summary — shown above submit so team can review before sending */}
        {Object.keys(votes).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div
              onClick={() => setShowSummary(!showSummary)}
              style={{ fontSize: 11, color: "#4A7FA5", cursor: "pointer", marginBottom: 8, userSelect: "none" }}
            >
              {showSummary ? "▼" : "▶"} Review your votes before submitting ({Object.keys(votes).length} / {STEPS.length} steps voted)
            </div>
            {showSummary && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STEPS.map(s => (
                  <div key={s.id} style={{
                    background: "#0D1824", borderRadius: 6,
                    border: `1px solid ${votes[s.id] ? voteColors[votes[s.id]] + "33" : "#1E3048"}`,
                    padding: "8px 12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: remarks[s.id] ? 6 : 0 }}>
                      <span style={{ fontSize: 11, color: "#7A9BB5", flex: 1, minWidth: 160 }}>
                        Step {s.id} · {s.phase}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: votes[s.id] ? voteColors[votes[s.id]] : "#3A5570",
                        background: votes[s.id] ? voteColors[votes[s.id]] + "18" : "#1E304830",
                        border: `1px solid ${votes[s.id] ? voteColors[votes[s.id]] + "44" : "#2A3D52"}`,
                        borderRadius: 4, padding: "1px 8px", whiteSpace: "nowrap"
                      }}>{votes[s.id] || "Not voted"}</span>
                      <span style={{ fontSize: 10, color: "#3A5570", whiteSpace: "nowrap" }}>{s.durationLabel}</span>
                    </div>
                    {remarks[s.id] && (
                      <div style={{
                        fontSize: 11, color: "#A0C4E0",
                        background: "#5C6BC015", border: "1px solid #5C6BC030",
                        borderRadius: 4, padding: "4px 8px", lineHeight: 1.5
                      }}>
                        💬 {remarks[s.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Your Full Name *"
            value={reviewerName}
            onChange={e => setReviewerName(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#0D1824", border: `1px solid ${reviewerName ? "#4CAF50" : "#2A3D52"}`,
              borderRadius: 6, padding: "10px 14px",
              fontSize: 12, color: "#E0EAF4", outline: "none"
            }}
          />
        </div>



        <button
          onMouseDown={e => { e.stopPropagation(); }}
          onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); if (reviewerName.trim() && !submitted && !submitting) handleSubmit(); }}
          onClick={e => { e.stopPropagation(); if (reviewerName.trim() && !submitted && !submitting) handleSubmit(); }}
          style={{
            width: "100%",
            background: submitted ? "#1B6B3A" : reviewerName.trim() ? "#4CAF50" : "#1E3048",
            border: submitted ? "none" : reviewerName.trim() ? "2px solid #4CAF50" : "2px solid #2A3D52",
            borderRadius: 8,
            padding: "14px", fontSize: 14, fontWeight: 800,
            color: submitted ? "#81C784" : reviewerName.trim() ? "#ffffff" : "#3A5570",
            cursor: reviewerName.trim() && !submitted && !submitting ? "pointer" : "default",
            transition: "background 0.2s, color 0.2s, border 0.2s",
            opacity: submitting ? 0.7 : 1,
            pointerEvents: "all",
            position: "relative",
            zIndex: 20,
            WebkitTapHighlightColor: "rgba(76,175,80,0.3)",
            touchAction: "manipulation"
          }}
        >
          {submitted ? "✅ Submitted Successfully!" : submitting ? "⏳ Submitting..." : "Submit Review to KREDL HO"}
        </button>

        {submitError && (
          <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 8 }}>{submitError}</div>
        )}

        {submitted && (
          <div style={{
            marginTop: 12, background: "#4CAF5012",
            border: "1px solid #4CAF5035", borderRadius: 8,
            padding: "12px 14px", fontSize: 12, color: "#81C784", lineHeight: 1.6
          }}>
            ✅ Thank you <strong>{reviewerName}</strong>! Your review is saved to KREDL HO automatically.
          </div>
        )}

      </div>

      {/* Bottleneck note */}
      <div style={{
        marginTop: 12, padding: "10px 14px",
        background: "#FF6B6B0D", border: "1px solid #FF6B6B2A",
        borderRadius: 8, fontSize: 11, color: "#FF9A9A"
      }}>
        ⚠️ <strong>Remaining bottleneck:</strong> Sub-Registrar (2 days) — farmer availability + server issues.
        Pre-book SR appointment right after Kaveri 2.0 upload to compress to <strong>~6 days</strong>.
      </div>
    </div>
  );
}
