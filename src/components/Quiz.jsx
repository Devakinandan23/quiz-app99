import { S } from "../styles/styles";
import { DIFF_MAP } from "../data/questions";

export default function Quiz({
  quizQuestions, currentIdx, selected,
  questionTimer, handleSelect, submitAnswer, formatTime, exitQuiz
}) {
  const q = quizQuestions[currentIdx];
  const progress = (currentIdx / quizQuestions.length) * 100;
  const isLast = currentIdx + 1 >= quizQuestions.length;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button style={S.ghostBtn} onClick={exitQuiz}>✕ Exit</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              ...S.badge,
              background: q.diff === "easy" ? "#ecfdf5" : q.diff === "medium" ? "#fffbeb" : "#fef2f2",
              color: q.diff === "easy" ? "#059669" : q.diff === "medium" ? "#d97706" : "#dc2626"
            }}>
              {DIFF_MAP[q.diff]}
            </span>
            {q.ncert && <span style={{ ...S.badge, background: "#eff6ff", color: "#2563eb" }}>NCERT</span>}
            <span style={{ fontSize: 13, color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(questionTimer)}
            </span>
          </div>
        </div>

        <div style={S.progressTrack}>
          <div style={{ ...S.progressFill, width: `${progress}%` }} />
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24, textAlign: "right" }}>
          {currentIdx + 1} / {quizQuestions.length}
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={S.questionText}>{q.q}</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {q.opts.map((opt, i) => {
            const isSelected = i === selected;
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{
                padding: "14px 18px", textAlign: "left", fontSize: 15, lineHeight: 1.5,
                background: isSelected ? "#f0f0ee" : "#fff",
                border: `1.5px solid ${isSelected ? "#1a1a1a" : "#e5e5e3"}`,
                borderRadius: 10,
                cursor: "pointer",
                color: "#1a1a1a", fontWeight: isSelected ? "500" : "400",
                transition: "all 0.15s", fontFamily: "inherit",
              }}>
                <span style={{ fontWeight: 600, marginRight: 10, opacity: 0.4 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <button
          style={{
            ...S.primaryBtn,
            width: "100%",
            opacity: selected === null ? 0.4 : 1,
            cursor: selected === null ? "not-allowed" : "pointer",
          }}
          disabled={selected === null}
          onClick={submitAnswer}
        >
          {isLast ? "Submit & View Results" : "Submit & Next"}
        </button>
      </div>
    </div>
  );
}
