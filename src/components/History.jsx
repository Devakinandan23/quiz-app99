import { S } from "../styles/styles";

export default function History({ history, clearHistory, viewAttempt, setScreen }) {
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

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
                onClick={clearHistory}
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
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {formatDate(attempt.date)}
              </span>
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
