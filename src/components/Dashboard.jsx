import { S } from "../styles/styles";

const RULES = [
  "Each question has only one correct answer.",
  "You can change your selection before clicking Submit.",
  "The timer runs per question and overall — manage your time.",
  "No answers or explanations will be shown during the test.",
  "After completing the test, you can review all answers with explanations.",
  "Questions are ordered: Easy → Medium → Hard.",
];

export default function Dashboard({ startQuiz }) {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ ...S.title, fontSize: 28 }}>ChemPrep</h1>
          <p style={S.subtitle}>NCERT Chemistry · Chapters 1, 2 & 4</p>
        </div>

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

        <div style={{ textAlign: "center" }}>
          <button
            style={{ ...S.primaryBtn, padding: "14px 48px", fontSize: 17 }}
            onClick={() => startQuiz("all")}
          >
            Start Test
          </button>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>60 questions · Timed</p>
        </div>
      </div>
    </div>
  );
}
