import { S } from "../styles/styles";

export default function Flashcards({
  getWrongQuestions, flashcardIdx, setFlashcardIdx,
  flashcardFlipped, setFlashcardFlipped, setScreen
}) {
  const wrongQs = getWrongQuestions();

  if (!wrongQs.length) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <h2 style={S.title}>No wrong answers to review!</h2>
          <button style={S.primaryBtn} onClick={() => setScreen("dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const fc = wrongQs[flashcardIdx];

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.ghostBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{flashcardIdx + 1} / {wrongQs.length}</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Review Flashcards</h2>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Tap card to flip · Focus on what you got wrong</p>
        </div>

        <div
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          style={{
            minHeight: 280,
            background: flashcardFlipped ? "#f0fdf4" : "#fff",
            border: flashcardFlipped ? "2px solid #059669" : "2px solid #e5e5e3",
            borderRadius: 16, padding: 28, cursor: "pointer",
            display: "flex", flexDirection: "column", justifyContent: "center",
            transition: "all 0.2s", marginBottom: 24
          }}
        >
          {!flashcardFlipped ? (
            <>
              <span style={{ ...S.badge, alignSelf: "flex-start", marginBottom: 12, background: "#f3f4f6", color: "#6b7280" }}>
                {fc.concept}
              </span>
              <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.6, color: "#1a1a1a", margin: 0 }}>{fc.q}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>Tap to see answer</p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#059669", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                  Answer
                </span>
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, color: "#059669", marginBottom: 12 }}>{fc.opts[fc.ans]}</p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#374151", margin: 0 }}>{fc.exp}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>{fc.ref}</p>
            </>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            style={{ ...S.secondaryBtn, opacity: flashcardIdx === 0 ? 0.3 : 1 }}
            disabled={flashcardIdx === 0}
            onClick={() => { setFlashcardIdx(i => i - 1); setFlashcardFlipped(false); }}
          >
            Previous
          </button>
          <button
            style={{ ...S.secondaryBtn, opacity: flashcardIdx >= wrongQs.length - 1 ? 0.3 : 1 }}
            disabled={flashcardIdx >= wrongQs.length - 1}
            onClick={() => { setFlashcardIdx(i => i + 1); setFlashcardFlipped(false); }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
