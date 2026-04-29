import { useState } from "react";
import { S } from "../styles/styles";

const SUBJECT_COLORS = {
  Physics: "#2563eb",
  Chemistry: "#059669",
  Maths: "#7c3aed",
  English: "#d97706",
  "Logical Reasoning": "#dc2626",
};

export default function AnswerReview({ answers, setScreen }) {
  const [filter, setFilter] = useState("all");

  const enriched = answers.filter((a) => a.question);

  const filtered = filter === "all"
    ? enriched
    : filter === "correct"
      ? enriched.filter(a => a.isCorrect)
      : filter === "wrong"
        ? enriched.filter(a => !a.isCorrect && !a.isUnanswered)
        : enriched.filter(a => a.isUnanswered);

  const correctCount = enriched.filter(a => a.isCorrect).length;
  const wrongCount = enriched.filter(a => !a.isCorrect && !a.isUnanswered).length;
  const unansweredCount = enriched.filter(a => a.isUnanswered).length;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Answer Key</h1>
            <p style={S.subtitle}>Review all questions with correct answers & explanations</p>
          </div>
          <button style={S.navBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              ...S.secondaryBtn,
              background: filter === "all" ? "#1a1a1a" : "#fff",
              color: filter === "all" ? "#fff" : "#1a1a1a",
            }}
          >
            All ({enriched.length})
          </button>
          <button
            onClick={() => setFilter("correct")}
            style={{
              ...S.secondaryBtn,
              background: filter === "correct" ? "#059669" : "#fff",
              color: filter === "correct" ? "#fff" : "#059669",
              borderColor: "#059669",
            }}
          >
            Correct ({correctCount})
          </button>
          <button
            onClick={() => setFilter("wrong")}
            style={{
              ...S.secondaryBtn,
              background: filter === "wrong" ? "#dc2626" : "#fff",
              color: filter === "wrong" ? "#fff" : "#dc2626",
              borderColor: "#dc2626",
            }}
          >
            Wrong ({wrongCount})
          </button>
          <button
            onClick={() => setFilter("unanswered")}
            style={{
              ...S.secondaryBtn,
              background: filter === "unanswered" ? "#d97706" : "#fff",
              color: filter === "unanswered" ? "#fff" : "#d97706",
              borderColor: "#d97706",
            }}
          >
            Not Answered ({unansweredCount})
          </button>
        </div>

        {filtered.length === 0 && (
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", padding: 40 }}>
            No questions match this filter.
          </p>
        )}

        {filtered.map((a) => {
          const q = a.question;
          const borderColor = a.isUnanswered ? "#fef3c7" : a.isCorrect ? "#d1fae5" : "#fecaca";
          const iconBg = a.isUnanswered ? "#fffbeb" : a.isCorrect ? "#ecfdf5" : "#fef2f2";
          const iconColor = a.isUnanswered ? "#d97706" : a.isCorrect ? "#059669" : "#dc2626";
          const icon = a.isUnanswered ? "—" : a.isCorrect ? "\u2713" : "\u2717";

          return (
            <div key={q.id} style={{
              background: "#fff",
              border: `1.5px solid ${borderColor}`,
              borderRadius: 12, padding: 18, marginBottom: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, background: iconBg, color: iconColor,
                  }}>
                    {icon}
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Q{q.id}</span>
                  <span style={{
                    ...S.badge,
                    background: (SUBJECT_COLORS[q.subject] || "#6b7280") + "22",
                    color: SUBJECT_COLORS[q.subject] || "#6b7280",
                  }}>
                    {q.subject}
                  </span>
                  {q.ncert && <span style={{ ...S.badge, background: "#eff6ff", color: "#2563eb" }}>NCERT</span>}
                </div>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{a.time}s</span>
              </div>

              <p style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                {q.concept} · {q.ref}
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.6, marginBottom: 14 }}>{q.q}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {(q.opts || []).map((opt) => {
                  const isUserPick = opt.id === a.selected;
                  const isCorrectOpt = opt.id === a.correctOptionId;

                  // Start with neutral style
                  let bg = "#f9fafb";
                  let border = "#e5e5e3";
                  let color = "#374151";
                  let fw = "400";
                  let radioColor = "#d1d5db";
                  let radioDotColor = "transparent";

                  // Always highlight the correct option green
                  if (isCorrectOpt) {
                    bg = "#f0fdf4"; border = "#22c55e"; color = "#15803d"; fw = "500";
                    radioColor = "#22c55e"; radioDotColor = "#22c55e";
                  }

                  // User's wrong pick — red (overrides neutral, not correct)
                  if (isUserPick && !a.isCorrect && !a.isUnanswered) {
                    bg = "#fef2f2"; border = "#dc2626"; color = "#dc2626"; fw = "500";
                    radioColor = "#dc2626"; radioDotColor = "#dc2626";
                  }

                  return (
                    <div key={opt.id} style={{
                      padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                      background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
                      color, fontWeight: fw, display: "flex", alignItems: "center", gap: 8,
                    }}>
                      {/* Radio circle indicator */}
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${radioColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {(isUserPick || isCorrectOpt) && (
                          <span style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: radioDotColor,
                          }} />
                        )}
                      </span>
                      <span style={{ flex: 1 }}>{opt.text}</span>
                      {/* Labels */}
                      {isCorrectOpt && isUserPick && a.isCorrect && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d", letterSpacing: 0.4 }}>✓ YOUR ANSWER</span>
                      )}
                      {isCorrectOpt && !isUserPick && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d", letterSpacing: 0.4 }}>CORRECT ANSWER</span>
                      )}
                      {isUserPick && !a.isCorrect && !a.isUnanswered && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", letterSpacing: 0.4 }}>YOUR ANSWER</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{
                background: a.isUnanswered ? "#fffbeb" : a.isCorrect ? "#f0fdf4" : "#fefce8",
                borderRadius: 8, padding: 12,
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Explanation</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{q.explanation || "No explanation available."}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
