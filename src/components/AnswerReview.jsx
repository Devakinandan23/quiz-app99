import { useState } from "react";
import { S } from "../styles/styles";
import { QUESTIONS, DIFF_MAP } from "../data/questions";

export default function AnswerReview({ answers, setScreen }) {
  const [filter, setFilter] = useState("all"); // all, correct, wrong

  const enriched = answers.map(a => {
    const q = QUESTIONS.find(question => question.id === a.qId);
    return { ...a, question: q };
  }).filter(a => a.question);

  const filtered = filter === "all"
    ? enriched
    : filter === "correct"
      ? enriched.filter(a => a.isCorrect)
      : enriched.filter(a => !a.isCorrect);

  const correctCount = enriched.filter(a => a.isCorrect).length;
  const wrongCount = enriched.filter(a => !a.isCorrect).length;

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
        </div>

        {filtered.length === 0 && (
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", padding: 40 }}>
            No questions match this filter.
          </p>
        )}

        {filtered.map((a, idx) => {
          const q = a.question;
          return (
            <div key={q.id} style={{
              background: "#fff",
              border: `1.5px solid ${a.isCorrect ? "#d1fae5" : "#fecaca"}`,
              borderRadius: 12,
              padding: 18,
              marginBottom: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    background: a.isCorrect ? "#ecfdf5" : "#fef2f2",
                    color: a.isCorrect ? "#059669" : "#dc2626",
                  }}>
                    {a.isCorrect ? "\u2713" : "\u2717"}
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Q{q.id}</span>
                  <span style={{
                    ...S.badge,
                    background: q.diff === "easy" ? "#ecfdf5" : q.diff === "medium" ? "#fffbeb" : "#fef2f2",
                    color: q.diff === "easy" ? "#059669" : q.diff === "medium" ? "#d97706" : "#dc2626",
                  }}>
                    {DIFF_MAP[q.diff]}
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
                {q.opts.map((opt, i) => {
                  const isCorrectOpt = i === q.ans;
                  const isUserPick = i === a.selected;
                  let bg = "#f9fafb";
                  let border = "#e5e5e3";
                  let color = "#6b7280";
                  let fw = "400";

                  if (isCorrectOpt) {
                    bg = "#ecfdf5"; border = "#059669"; color = "#059669"; fw = "600";
                  } else if (isUserPick && !a.isCorrect) {
                    bg = "#fef2f2"; border = "#dc2626"; color = "#dc2626"; fw = "500";
                  }

                  return (
                    <div key={i} style={{
                      padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                      background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
                      color, fontWeight: fw, display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontWeight: 600, opacity: 0.4, minWidth: 18 }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {isCorrectOpt && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>CORRECT</span>
                      )}
                      {isUserPick && !a.isCorrect && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626" }}>YOUR ANSWER</span>
                      )}
                      {isUserPick && a.isCorrect && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>YOUR ANSWER</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{
                background: a.isCorrect ? "#f0fdf4" : "#fefce8",
                borderRadius: 8, padding: 12,
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Explanation</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{q.exp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
