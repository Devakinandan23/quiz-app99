import { useState } from "react";

const SECTION_MAP = {
  Physics:           { label: "Physics",           color: "#2563eb", bg: "#eff6ff" },
  Chemistry:         { label: "Chemistry",         color: "#059669", bg: "#ecfdf5" },
  Maths:             { label: "Maths",             color: "#7c3aed", bg: "#f5f3ff" },
  English:           { label: "English",           color: "#d97706", bg: "#fffbeb" },
  "Logical Reasoning": { label: "Logical Reasoning", color: "#dc2626", bg: "#fef2f2" },
};

export default function Quiz({
  quizQuestions, currentIdx, userAnswers, markedForReview,
  questionTimer, handleSelect, clearResponse, toggleMarkForReview,
  goToQuestion, prevQuestion, nextQuestion, finishQuiz,
  formatTime, exitQuiz, totalTimer,
  submitLoading, submitError,
}) {
  const q = quizQuestions[currentIdx];
  const selected = userAnswers[currentIdx] ?? null;
  const isMarked = markedForReview.has(currentIdx);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = quizQuestions.length - answeredCount;
  const markedCount = markedForReview.size;

  // Group questions by subject section
  const sections = [];
  let lastSubject = null;
  quizQuestions.forEach((qq, idx) => {
    if (qq.subject !== lastSubject) {
      sections.push({ subject: qq.subject, startIdx: idx, indices: [] });
      lastSubject = qq.subject;
    }
    sections[sections.length - 1].indices.push(idx);
  });

  const getQStatus = (idx) => {
    if (idx === currentIdx) return "current";
    if (markedForReview.has(idx) && userAnswers[idx] !== undefined) return "marked-answered";
    if (markedForReview.has(idx)) return "marked";
    if (userAnswers[idx] !== undefined) return "answered";
    return "not-visited";
  };

  const statusColors = {
    current: { bg: "#2563eb", color: "#fff", border: "#2563eb" },
    answered: { bg: "#059669", color: "#fff", border: "#059669" },
    marked: { bg: "#7c3aed", color: "#fff", border: "#7c3aed" },
    "marked-answered": { bg: "#7c3aed", color: "#fff", border: "#d97706" },
    "not-visited": { bg: "#fff", color: "#6b7280", border: "#d1d5db" },
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: "#1a1a1a", background: "#FAFAF8" }}>

      {/* LEFT SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 220 : 0, overflow: "hidden",
        transition: "width 0.2s", background: "#fff",
        borderRight: "1px solid #e5e5e3", display: "flex", flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "14px 12px 8px", borderBottom: "1px solid #e5e5e3" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Questions</div>
          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 10, color: "#6b7280" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#059669" }} /> Answered
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#7c3aed" }} /> Marked
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#fff", border: "1px solid #d1d5db" }} /> Unanswered
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
          {sections.map(sec => {
            const s = SECTION_MAP[sec.subject] || { label: sec.subject, color: "#6b7280", bg: "#f3f4f6" };
            return (
              <div key={sec.subject} style={{ marginBottom: 12 }}>
                <button
                  onClick={() => goToQuestion(sec.startIdx)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "5px 8px", fontSize: 11, fontWeight: 700,
                    color: s.color, background: s.bg, border: "none",
                    borderRadius: 5, cursor: "pointer", marginBottom: 6,
                    fontFamily: "inherit", letterSpacing: 0.5,
                  }}
                >
                  {s.label} ({sec.indices.length})
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                  {sec.indices.map(idx => {
                    const st = getQStatus(idx);
                    const c = statusColors[st];
                    return (
                      <button
                        key={idx}
                        onClick={() => goToQuestion(idx)}
                        style={{
                          width: 34, height: 34, borderRadius: 4,
                          fontSize: 12, fontWeight: st === "current" ? 700 : 500,
                          background: c.bg, color: c.color,
                          border: `2px solid ${c.border}`,
                          cursor: "pointer", fontFamily: "inherit",
                          outline: st === "marked-answered" ? "2px solid #d97706" : "none",
                          outlineOffset: -1,
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar footer stats */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid #e5e5e3", fontSize: 11, color: "#6b7280" }}>
          <div>Answered: <b style={{ color: "#059669" }}>{answeredCount}</b></div>
          <div>Unanswered: <b style={{ color: "#9ca3af" }}>{unansweredCount}</b></div>
          <div>Marked: <b style={{ color: "#7c3aed" }}>{markedCount}</b></div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOP BAR */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 20px", borderBottom: "1px solid #e5e5e3", background: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none", border: "1px solid #e5e5e3", borderRadius: 6,
                padding: "4px 8px", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
              }}
            >
              {sidebarOpen ? "<<" : ">>"}
            </button>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Q.{currentIdx + 1} <span style={{ fontWeight: 400, color: "#9ca3af" }}>/ {quizQuestions.length}</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums",
              color: "#374151", background: "#f3f4f6", padding: "4px 10px", borderRadius: 6,
            }}>
              {formatTime(totalTimer)}
            </span>
            <button
              onClick={exitQuiz}
              style={{
                background: "none", border: "1px solid #dc2626", color: "#dc2626",
                borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Exit
            </button>
          </div>
        </div>

        {/* QUESTION AREA */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 100px" }}>
          <div style={{ maxWidth: 700 }}>
            <h2 style={{
              fontSize: 18, fontWeight: 500, lineHeight: 1.7, margin: "0 0 28px",
              letterSpacing: "-0.01em",
            }}>
              {q.q}
            </h2>

            {/* OPTIONS - Radio button style */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.opts.map((opt) => {
                const isSelected = opt.id === selected;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", textAlign: "left", fontSize: 15, lineHeight: 1.5,
                      background: isSelected ? "#f0f5ff" : "#fff",
                      border: `1.5px solid ${isSelected ? "#2563eb" : "#e5e5e3"}`,
                      borderRadius: 10, cursor: "pointer",
                      color: "#1a1a1a", fontWeight: "400",
                      transition: "all 0.15s", fontFamily: "inherit",
                    }}
                  >
                    {/* Radio circle */}
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#2563eb" : "#d1d5db"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "border-color 0.15s",
                    }}>
                      {isSelected && (
                        <span style={{
                          width: 12, height: 12, borderRadius: "50%",
                          background: "#2563eb",
                        }} />
                      )}
                    </span>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Clear response */}
            {selected !== null && (
              <button
                onClick={clearResponse}
                style={{
                  marginTop: 12, background: "none", border: "none",
                  fontSize: 13, color: "#6b7280", cursor: "pointer",
                  textDecoration: "underline", fontFamily: "inherit",
                }}
              >
                Clear Response
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          borderTop: "1px solid #e5e5e3", background: "#fff",
          padding: "12px 20px", display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 8,
        }}>
          <button
            onClick={prevQuestion}
            disabled={currentIdx === 0}
            style={{
              padding: "10px 18px", fontSize: 13, fontWeight: 600,
              background: currentIdx === 0 ? "#f3f4f6" : "#fff",
              color: currentIdx === 0 ? "#d1d5db" : "#374151",
              border: "1.5px solid #e5e5e3", borderRadius: 8,
              cursor: currentIdx === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Previous
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={toggleMarkForReview}
              style={{
                padding: "10px 18px", fontSize: 13, fontWeight: 600,
                background: isMarked ? "#7c3aed" : "#fff",
                color: isMarked ? "#fff" : "#7c3aed",
                border: `1.5px solid ${isMarked ? "#7c3aed" : "#c4b5fd"}`,
                borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {isMarked ? "Unmark Review" : "Mark for Review"}
            </button>

            <button
              onClick={() => setConfirmFinish(true)}
              style={{
                padding: "10px 18px", fontSize: 13, fontWeight: 700,
                background: "#059669", color: "#fff",
                border: "1.5px solid #059669", borderRadius: 8,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              I have completed the test
            </button>
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentIdx >= quizQuestions.length - 1}
            style={{
              padding: "10px 18px", fontSize: 13, fontWeight: 600,
              background: currentIdx >= quizQuestions.length - 1 ? "#f3f4f6" : "#1a1a1a",
              color: currentIdx >= quizQuestions.length - 1 ? "#d1d5db" : "#fff",
              border: "1.5px solid transparent", borderRadius: 8,
              cursor: currentIdx >= quizQuestions.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* CONFIRM FINISH MODAL */}
      {confirmFinish && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: 28, maxWidth: 400, width: "90%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Submit Test?</h3>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "#4b5563", marginBottom: 20 }}>
              <div>Answered: <b style={{ color: "#059669" }}>{answeredCount}</b></div>
              <div>Unanswered: <b style={{ color: "#dc2626" }}>{unansweredCount}</b></div>
              <div>Marked for review: <b style={{ color: "#7c3aed" }}>{markedCount}</b></div>
              {unansweredCount > 0 && (
                <p style={{ color: "#dc2626", fontSize: 13, marginTop: 10 }}>
                  You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}!
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmFinish(false)}
                style={{
                  padding: "10px 20px", fontSize: 13, fontWeight: 600,
                  background: "#fff", color: "#374151", border: "1.5px solid #e5e5e3",
                  borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Go Back
              </button>
              <button
                onClick={finishQuiz}
                disabled={submitLoading}
                style={{
                  padding: "10px 20px", fontSize: 13, fontWeight: 700,
                  background: "#059669", color: "#fff", border: "1.5px solid #059669",
                  borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {submitLoading ? "Submitting..." : "Submit Test"}
              </button>
            </div>
            {submitError && (
              <p style={{ marginTop: 10, fontSize: 13, color: "#dc2626" }}>{submitError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
