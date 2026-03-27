import { QUESTIONS } from "../data/questions";

export function exportAsCSV(answers, overallAccuracy, totalTimer) {
  const header = "Q No,Question,Your Answer,Correct Answer,Result,Time (s),Concept,Difficulty,NCERT";
  const rows = answers.map(a => {
    const q = QUESTIONS.find(question => question.id === a.qId);
    if (!q) return "";
    const yourAns = q.opts[a.selected] || "";
    const correctAns = q.opts[q.ans] || "";
    const result = a.isCorrect ? "Correct" : "Wrong";
    const escapedQ = `"${q.q.replace(/"/g, '""')}"`;
    const escapedYour = `"${yourAns.replace(/"/g, '""')}"`;
    const escapedCorrect = `"${correctAns.replace(/"/g, '""')}"`;
    return `${q.id},${escapedQ},${escapedYour},${escapedCorrect},${result},${a.time},${q.concept},${q.diff},${q.ncert ? "Yes" : "No"}`;
  });

  const correct = answers.filter(a => a.isCorrect).length;
  const summary = [
    "",
    "Summary",
    `Score,${overallAccuracy}%`,
    `Correct,${correct}/${answers.length}`,
    `Total Time,${Math.floor(totalTimer / 60)}m ${totalTimer % 60}s`,
  ];

  const csv = [header, ...rows, ...summary].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `chemprep-results-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportAsPDF() {
  window.print();
}
