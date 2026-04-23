import { useState } from "react";
import { S } from "../styles/styles";

export default function History({ history, clearHistory, deleteAttempt, viewAttempt, setScreen }) {
  // confirmAction: null | { type: "delete" | "clearAll", id?: string, title: string, message: string }
  const [confirmAction, setConfirmAction] = useState(null);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDelete = (e, attemptId) => {
    e.stopPropagation();
    setConfirmAction({
      type: "delete",
      id: attemptId,
      title: "Delete this attempt?",
      message: "This quiz attempt will be permanently removed from your history. This action cannot be undone.",
    });
  };

  const handleClearAll = () => {
    setConfirmAction({
      type: "clearAll",
      title: "Clear all history?",
      message: `All ${history.length} attempt${history.length !== 1 ? "s" : ""} will be permanently deleted. This action cannot be undone.`,
    });
  };

  const confirmDelete = () => {
    if (confirmAction.type === "delete") deleteAttempt(confirmAction.id);
    else if (confirmAction.type === "clearAll") clearHistory();
    setConfirmAction(null);
  };

  const cancelDelete = () => setConfirmAction(null);

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Quiz History</h1>
            <p style={S.subtitle}>{history.length} past attempt{history.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.navBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
            {history.length > 0 && (
              <button
                style={{ ...S.navBtn, color: "#dc2626", borderColor: "#dc2626" }}
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {history.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 0", color: "#6b7280",
          }}>
            <p style={{ fontSize: 15, marginBottom: 4 }}>No quiz attempts yet.</p>
            <p style={{ fontSize: 13 }}>Complete a quiz to see your history here.</p>
          </div>
        )}

        {/* ── Confirmation Dialog ── */}
        {confirmAction !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: "fadeIn 0.15s ease",
            }}
            onClick={cancelDelete}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "32px 28px 24px",
                width: "min(380px, 90vw)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                display: "flex", flexDirection: "column", gap: 12,
                animation: "slideUp 0.18s ease",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Icon */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                <div style={{
                  background: "#fef2f2", borderRadius: "50%",
                  width: 52, height: 52, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
              </div>

              <h2 id="confirm-dialog-title" style={{
                margin: 0, fontSize: 18, fontWeight: 700,
                color: "#111827", textAlign: "center",
              }}>
                {confirmAction.title}
              </h2>
              <p style={{
                margin: 0, fontSize: 14, color: "#6b7280",
                textAlign: "center", lineHeight: 1.55,
              }}>
                {confirmAction.message}
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  id="confirm-cancel-btn"
                  onClick={cancelDelete}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8,
                    border: "1px solid #e5e7eb", background: "#fff",
                    fontSize: 14, fontWeight: 500, color: "#374151",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-btn"
                  onClick={confirmDelete}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8,
                    border: "none", background: "#dc2626",
                    fontSize: 14, fontWeight: 600, color: "#fff",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#b91c1c"}
                  onMouseLeave={e => e.currentTarget.style.background = "#dc2626"}
                >
                  {confirmAction.type === "clearAll" ? "Clear All" : "Delete"}
                </button>
              </div>
            </div>

            {/* Keyframe animations */}
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
          </div>
        )}

        {history.map((attempt, idx) => (
          <div
            key={attempt.id}
            style={{
              background: "#fff",
              border: "1px solid #e5e5e3",
              borderRadius: 12,
              padding: 18,
              marginBottom: 12,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onClick={() => viewAttempt(attempt)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{
                fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                Attempt #{history.length - idx}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {formatDate(attempt.date)}
                </span>
                <button
                  onClick={(e) => handleDelete(e, attempt.id)}
                  title="Delete this attempt"
                  aria-label="Delete attempt"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 4, borderRadius: 6, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  {/* Trash icon SVG */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{
                  fontSize: 24, fontWeight: 700,
                  color: attempt.accuracy >= 70 ? "#059669" : attempt.accuracy >= 40 ? "#d97706" : "#dc2626",
                }}>
                  {attempt.accuracy}%
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Score</span>
              </div>

              <div style={{ width: 1, height: 36, background: "#e5e5e3" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                  {attempt.correct}/{attempt.totalQuestions}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Correct</span>
              </div>

              <div style={{ width: 1, height: 36, background: "#e5e5e3" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                  {formatTime(attempt.totalTime)}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Time</span>
              </div>

              <div style={{ marginLeft: "auto" }}>
                <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>
                  View Details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
