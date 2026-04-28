import { S } from "../styles/styles";
export default function Home({ selectQuiz, quizzes, loading, error }) {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ ...S.title, fontSize: 28 }}>BITSAT QUIZs</h1>
          <p style={S.subtitle}>Select a quiz to start</p>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>Loading quizzes...</p>
        )}

        {error && (
          <p style={{ textAlign: "center", color: "#dc2626" }}>{error}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400, margin: "0 auto" }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} style={{ border: "1px solid #e5e5e3", borderRadius: 8, padding: 16, background: "#fff", display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: "#1a1a1a" }}>{quiz.title}</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#6b7280" }}>{quiz.description}</p>
              </div>
              <button
                style={{ ...S.primaryBtn, width: "100%", padding: "10px 0" }}
                onClick={() => selectQuiz(quiz.id)}
                disabled={loading}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
