import { useState } from "react";
import { S } from "../styles/styles";
import { exportAsCSV, exportAsPDF } from "../utils/exportResults";

export default function Analytics({
  answers, overallAccuracy, avgTimePerQ, ncertAccuracy, ncertAnswers,
  totalTimer, conceptStats, formatTime, getMistakePatterns, getWrongQuestions,
  setScreen, openFlashcards, history
}) {
  const mistakes = getMistakePatterns();
  const wrongQs = getWrongQuestions();
  const [showExport, setShowExport] = useState(false);

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header} className="no-print">
          <h1 style={S.title}>Your Results</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={S.navBtn} onClick={() => setScreen("dashboard")}>Dashboard</button>
            <button
              style={{ ...S.navBtn, background: "#2563eb", color: "#fff", border: "1px solid #2563eb" }}
              onClick={() => setScreen("review")}
            >
              View All Answers
            </button>
            {history && history.length > 0 && (
              <button
                style={{ ...S.navBtn, background: "#7c3aed", color: "#fff", border: "1px solid #7c3aed" }}
                onClick={() => setScreen("history")}
              >
                History ({history.length})
              </button>
            )}
            {wrongQs.length > 0 && (
              <button
                style={{ ...S.navBtn, background: "#1a1a1a", color: "#fff" }}
                onClick={openFlashcards}
              >
                Review Flashcards
              </button>
            )}
            <div style={{ position: "relative" }}>
              <button
                style={{ ...S.navBtn, background: "#059669", color: "#fff", border: "1px solid #059669" }}
                onClick={() => setShowExport(!showExport)}
              >
                Export Results
              </button>
              {showExport && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 6,
                  background: "#fff", border: "1px solid #e5e5e3", borderRadius: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)", padding: 6, zIndex: 10,
                  minWidth: 160, display: "flex", flexDirection: "column", gap: 2,
                }}>
                  <button
                    style={{
                      padding: "10px 14px", fontSize: 13, fontWeight: 500,
                      background: "none", border: "none", borderRadius: 8,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      color: "#1a1a1a",
                    }}
                    onClick={() => { exportAsCSV(answers, overallAccuracy, totalTimer); setShowExport(false); }}
                    onMouseEnter={e => e.target.style.background = "#f3f4f6"}
                    onMouseLeave={e => e.target.style.background = "none"}
                  >
                    Download CSV
                  </button>
                  <button
                    style={{
                      padding: "10px 14px", fontSize: 13, fontWeight: 500,
                      background: "none", border: "none", borderRadius: 8,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      color: "#1a1a1a",
                    }}
                    onClick={() => { exportAsPDF(); setShowExport(false); }}
                    onMouseEnter={e => e.target.style.background = "#f3f4f6"}
                    onMouseLeave={e => e.target.style.background = "none"}
                  >
                    Save as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={S.statsRow}>
          <div style={S.statCard}>
            <span style={S.statLabel}>Score</span>
            <span style={{
              ...S.statValue, fontSize: 28,
              color: overallAccuracy >= 70 ? "#059669" : overallAccuracy >= 40 ? "#d97706" : "#dc2626"
            }}>
              {overallAccuracy}%
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {answers.filter(a => a.isCorrect).length}/{answers.length} correct
            </span>
          </div>
          <div style={S.statCard}>
            <span style={S.statLabel}>Total Time</span>
            <span style={S.statValue}>{formatTime(totalTimer)}</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{avgTimePerQ}s avg per Q</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statLabel}>NCERT Trap Accuracy</span>
            <span style={{ ...S.statValue, color: ncertAccuracy >= 70 ? "#059669" : "#dc2626" }}>
              {ncertAccuracy}%
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {ncertAnswers.filter(a => a.isCorrect).length}/{ncertAnswers.length} NCERT Qs
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={S.sectionTitle}>Concept Breakdown</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Where you're strong and where you need work</p>
          {conceptStats.map(cs => (
            <div key={cs.concept} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{cs.concept}</span>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: cs.accuracy >= 70 ? "#059669" : cs.accuracy >= 40 ? "#d97706" : "#dc2626"
                }}>
                  {cs.accuracy}% <span style={{ fontWeight: 400, color: "#9ca3af" }}>({cs.correct}/{cs.total})</span>
                </span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, transition: "width 0.5s",
                  width: `${cs.accuracy}%`,
                  background: cs.accuracy >= 70 ? "#059669" : cs.accuracy >= 40 ? "#d97706" : "#dc2626"
                }} />
              </div>
            </div>
          ))}
        </div>

        {mistakes.total > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={S.sectionTitle}>Mistake Patterns</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Understanding how you're getting it wrong</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ ...S.patternCard, borderLeft: mistakes.guessing > 0 ? "3px solid #d97706" : "3px solid #e5e5e3" }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: mistakes.guessing > 0 ? "#d97706" : "#d1d5db" }}>
                  {mistakes.guessing}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Fast + Wrong</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Likely guessing</span>
              </div>
              <div style={{ ...S.patternCard, borderLeft: mistakes.confusion > 0 ? "3px solid #dc2626" : "3px solid #e5e5e3" }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: mistakes.confusion > 0 ? "#dc2626" : "#d1d5db" }}>
                  {mistakes.confusion}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Slow + Wrong</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Conceptual confusion</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h2 style={S.sectionTitle}>Difficulty Performance</h2>
          {["easy", "medium", "hard"].map(d => {
            const dAnswers = answers.filter(a => a.diff === d);
            if (!dAnswers.length) return null;
            const dAcc = Math.round(dAnswers.filter(a => a.isCorrect).length / dAnswers.length * 100);
            return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ width: 64, fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>{d}</span>
                <div style={{ flex: 1, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${dAcc}%`,
                    background: d === "easy" ? "#059669" : d === "medium" ? "#d97706" : "#dc2626"
                  }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, width: 40, textAlign: "right" }}>{dAcc}%</span>
              </div>
            );
          })}
        </div>

        {wrongQs.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={S.sectionTitle}>Questions You Got Wrong</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{wrongQs.length} questions to review</p>
            {wrongQs.map((wq) => {
              const ans = answers.find(a => a.qId === wq.id);
              return (
                <div key={wq.id} style={{
                  background: "#fff", border: "1px solid #e5e5e3",
                  borderRadius: 10, padding: 14, marginBottom: 10
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Q{wq.id} · {wq.concept}</span>
                    <span style={{ fontSize: 12, color: "#dc2626" }}>{ans.time}s</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, lineHeight: 1.5 }}>{wq.q}</p>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                    <span style={{ color: "#dc2626", textDecoration: "line-through" }}>
                      Your answer: {wq.opts[ans.selected]}
                    </span>
                    <br />
                    <span style={{ color: "#059669" }}>Correct: {wq.opts[wq.ans]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
