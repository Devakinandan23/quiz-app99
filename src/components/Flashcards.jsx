import { useState } from "react";
import { S } from "../styles/styles";

export default function Flashcards({
  getWrongQuestions, getReviewQuestions, flashcardIdx, setFlashcardIdx,
  flashcardFlipped, setFlashcardFlipped, setScreen
}) {
  const [filter, setFilter] = useState("all");

  const reviewQs = getReviewQuestions ? getReviewQuestions(filter) : getWrongQuestions();
  const wrongCount = getReviewQuestions ? getReviewQuestions("wrong").length : reviewQs.length;
  const unansweredCount = getReviewQuestions ? getReviewQuestions("unanswered").length : 0;
  const allCount = wrongCount + unansweredCount;

  const handleFilterChange = (f) => {
    setFilter(f);
    setFlashcardIdx(0);
    setFlashcardFlipped(false);
  };

  if (!allCount) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <h2 style={S.title}>No wrong or unanswered questions to review!</h2>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
            You answered everything correctly. Great job!
          </p>
          <button style={S.primaryBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
        </div>
      </div>
    );
  }

  if (!reviewQs.length) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={S.header}>
            <button style={S.ghostBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
          </div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Review Flashcards</h2>
            {renderFilterTabs()}
          </div>
          <p style={{ textAlign: "center", color: "#6b7280", marginTop: 32 }}>
            No questions in this category.
          </p>
        </div>
      </div>
    );
  }

  const safeIdx = Math.min(flashcardIdx, reviewQs.length - 1);
  const fc = reviewQs[safeIdx];
  const isUnanswered = fc._isUnanswered;

  function renderFilterTabs() {
    const tabs = [
      { key: "all", label: `All (${allCount})` },
      { key: "wrong", label: `Wrong (${wrongCount})` },
      { key: "unanswered", label: `Not Answered (${unansweredCount})` },
    ];

    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => handleFilterChange(t.key)}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 20,
              border: filter === t.key ? "1.5px solid #2563eb" : "1px solid #e5e5e3",
              background: filter === t.key ? "#eff6ff" : "#fff",
              color: filter === t.key ? "#2563eb" : "#6b7280",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.ghostBtn} onClick={() => setScreen("analytics")}>Back to Results</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{safeIdx + 1} / {reviewQs.length}</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>Review Flashcards</h2>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Tap card to flip · Review what you missed</p>
          {renderFilterTabs()}
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
              <div style={{ display: "flex", gap: 8, alignSelf: "flex-start", marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ ...S.badge, background: "#f3f4f6", color: "#6b7280" }}>
                  {fc.concept}
                </span>
                {isUnanswered && (
                  <span style={{
                    ...S.badge,
                    background: "#fef3c7", color: "#d97706",
                  }}>
                    Not Answered
                  </span>
                )}
                {!isUnanswered && (
                  <span style={{
                    ...S.badge,
                    background: "#fee2e2", color: "#dc2626",
                  }}>
                    Wrong Answer
                  </span>
                )}
              </div>
              <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.6, color: "#1a1a1a", margin: 0 }}>{fc.q}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>Tap to see answer</p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#059669", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                  Correct Answer
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
            style={{ ...S.secondaryBtn, opacity: safeIdx === 0 ? 0.3 : 1 }}
            disabled={safeIdx === 0}
            onClick={() => { setFlashcardIdx(i => i - 1); setFlashcardFlipped(false); }}
          >
            Previous
          </button>
          <button
            style={{ ...S.secondaryBtn, opacity: safeIdx >= reviewQs.length - 1 ? 0.3 : 1 }}
            disabled={safeIdx >= reviewQs.length - 1}
            onClick={() => { setFlashcardIdx(i => i + 1); setFlashcardFlipped(false); }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
