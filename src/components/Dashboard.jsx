import { S } from "../styles/styles";

const RULES = [
  "Each question has only one correct answer.",
  "You can change your selection before clicking Submit.",
  "The timer runs per question and overall — manage your time.",
  "No answers or explanations will be shown during the test.",
  "After completing the test, you can review all answers with explanations.",
  "Questions are grouped by subject: Chemistry, Physics, Maths, English, Logical Reasoning.",
];

export default function Dashboard({ startQuiz, activeQuizMeta, goHome, questionsLoading, questionsError, questionCount }) {
  const quiz = activeQuizMeta;
  if (!quiz) return null;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ ...S.title, fontSize: 28 }}>{quiz.title}</h1>
          {quiz.description && quiz.description !== `${questionCount} questions` && (
            <p style={S.subtitle}>{quiz.description}</p>
          )}
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{questionCount} questions</p>
        </div>

        {questionsLoading && (
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>Loading questions...</p>
        )}
        {questionsError && (
          <p style={{ textAlign: "center", color: "#dc2626", marginBottom: 12 }}>{questionsError}</p>
        )}

        <div style={{
          background: "#fff", border: "1px solid #e5e5e3", borderRadius: 12,
          padding: 24, marginBottom: 32
        }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: 16 }}>Test Rules</h2>
          <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {RULES.map((rule, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#374151" }}>{rule}</li>
            ))}
          </ol>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button 
            style={{ ...S.primaryBtn, padding: "14px 48px", fontSize: 17, background: "#fff", color: "#1a1a1a", border: "1px solid #e5e5e3" }} 
            onClick={goHome}
          >
            Back
          </button>
          <button 
            style={{ ...S.primaryBtn, padding: "14px 48px", fontSize: 17 }}
            onClick={startQuiz}
            disabled={questionsLoading || questionCount === 0}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
