import { useState, useEffect, useRef } from "react";
import { QUIZ_CATALOG, QUESTIONS } from "../data/questions";

const getHistoryKey = (quizId) => `chemprep_history_${quizId}`;

function loadHistory(quizId) {
  if (!quizId) return [];
  try {
    const data = localStorage.getItem(getHistoryKey(quizId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(quizId, history) {
  if (!quizId) return;
  try {
    localStorage.setItem(getHistoryKey(quizId), JSON.stringify(history));
  } catch {
    // localStorage quota exceeded or unavailable — fail silently
    // History won't persist but quiz results are still shown in-memory
  }
}

export function useQuiz() {
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [screen, setScreen] = useState("home");
  const [answers, setAnswers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [history, setHistory] = useState([]);

  // Exam-style state
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [questionTimes, setQuestionTimes] = useState({}); // { questionIndex: seconds }

  const timerRef = useRef(null);

  useEffect(() => {
    if (quizActive) {
      timerRef.current = setInterval(() => {
        setQuestionTimer(t => t + 1);
        setTotalTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quizActive, currentIdx]);

  // Save time when navigating away from a question
  const saveCurrentQuestionTime = () => {
    setQuestionTimes(prev => ({
      ...prev,
      [currentIdx]: (prev[currentIdx] || 0) + questionTimer,
    }));
  };

  // Compress answers for localStorage: only store qId, selected, time
  // Everything else (concept, diff, ncert, correct, isCorrect, isUnanswered)
  // can be rehydrated from QUESTIONS at read time
  const compressAnswers = (answers) =>
    answers.map(a => [a.qId, a.selected, a.time]); // [qId, selected|null, timeInSec]

  const rehydrateAnswers = (compressed, questions) =>
    compressed.map(([qId, selected, time]) => {
      const q = questions.find(qq => qq.id === qId);
      return {
        qId, selected, time,
        correct: q ? q.ans : 0,
        isCorrect: q ? selected === q.ans : false,
        isUnanswered: selected === null || selected === undefined,
        concept: q ? q.concept : "Unknown",
        subject: q ? q.subject : "Unknown",
        ncert: q ? q.ncert : false,
      };
    });

  const saveAttempt = (finalAnswers, finalTotalTimer) => {
    if (!finalAnswers.length) return; // guard against empty quiz
    const correct = finalAnswers.filter(a => a.isCorrect).length;
    const attempt = {
      id: Date.now(),
      date: new Date().toISOString(),
      totalQuestions: finalAnswers.length,
      correct,
      accuracy: Math.round((correct / finalAnswers.length) * 100),
      totalTime: finalTotalTimer,
      answers: compressAnswers(finalAnswers), // ~3KB instead of ~430KB
    };
    const updated = [attempt, ...history];
    setHistory(updated);
    saveHistory(activeQuizId, updated);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(getHistoryKey(activeQuizId));
  };

  const deleteAttempt = (attemptId) => {
    const updated = history.filter(a => a.id !== attemptId);
    setHistory(updated);
    if (updated.length === 0) {
      localStorage.removeItem(getHistoryKey(activeQuizId));
    } else {
      saveHistory(activeQuizId, updated);
    }
  };

  const selectQuiz = (quizId) => {
    const catalogEntry = QUIZ_CATALOG[quizId];
    if (!catalogEntry) return;

    setActiveQuizId(quizId);
    setQuizQuestions(catalogEntry.questions);
    setHistory(loadHistory(quizId));
    setScreen("dashboard");
  };

  const startQuiz = () => {
    if (!activeQuizId) return;
    setAnswers([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuestionTimes({});
    setQuizDone(false);
    setQuestionTimer(0);
    setTotalTimer(0);
    setQuizActive(true);
    setScreen("quiz");
  };

  const handleSelect = (optIdx) => {
    setUserAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const clearResponse = () => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx);
      else next.add(currentIdx);
      return next;
    });
  };

  const goToQuestion = (idx) => {
    if (!Number.isInteger(idx) || idx < 0 || idx >= quizQuestions.length) return;
    saveCurrentQuestionTime();
    setCurrentIdx(idx);
    setQuestionTimer(0);
  };

  const prevQuestion = () => {
    if (currentIdx > 0) goToQuestion(currentIdx - 1);
  };

  const nextQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) goToQuestion(currentIdx + 1);
  };

  const finishQuiz = () => {
    clearInterval(timerRef.current);
    saveCurrentQuestionTime();

    // Build final answers array from userAnswers
    const finalTimes = { ...questionTimes, [currentIdx]: (questionTimes[currentIdx] || 0) + questionTimer };
    const finalAnswers = quizQuestions.map((q, idx) => {
      const selected = userAnswers[idx] ?? null;
      return {
        qId: q.id,
        selected,
        correct: q.ans,
        isCorrect: selected === q.ans,
        isUnanswered: selected === null,
        time: finalTimes[idx] || 0,
        concept: q.concept,
        subject: q.subject,
        ncert: q.ncert,
      };
    });

    setAnswers(finalAnswers);
    setQuizDone(true);
    setQuizActive(false);
    saveAttempt(finalAnswers, totalTimer);
    setScreen("analytics");
  };

  const getConceptStats = () => {
    const stats = {};
    answers.forEach(a => {
      if (!stats[a.concept]) stats[a.concept] = { total: 0, correct: 0, totalTime: 0, unanswered: 0 };
      stats[a.concept].total++;
      if (a.isCorrect) stats[a.concept].correct++;
      if (a.isUnanswered) stats[a.concept].unanswered++;
      stats[a.concept].totalTime += a.time;
    });
    return Object.entries(stats).map(([concept, s]) => ({
      concept, accuracy: Math.round((s.correct / s.total) * 100),
      total: s.total, correct: s.correct, unanswered: s.unanswered,
      avgTime: Math.round(s.totalTime / s.total)
    })).sort((a, b) => a.accuracy - b.accuracy);
  };

  const getMistakePatterns = () => {
    const wrong = answers.filter(a => !a.isCorrect && !a.isUnanswered);
    const avgTime = answers.length ? answers.reduce((s, a) => s + a.time, 0) / answers.length : 15;
    const guessing = wrong.filter(a => a.time < avgTime * 0.5).length;
    const confusion = wrong.filter(a => a.time >= avgTime * 0.5).length;
    return { guessing, confusion, total: wrong.length };
  };

  const getWrongQuestions = () => {
    return answers.filter(a => !a.isCorrect && !a.isUnanswered).map(a => quizQuestions.find(q => q.id === a.qId)).filter(Boolean);
  };

  const getUnansweredQuestions = () => {
    return answers.filter(a => a.isUnanswered).map(a => quizQuestions.find(q => q.id === a.qId)).filter(Boolean);
  };

  const getReviewQuestions = (filter) => {
    if (filter === "wrong") return getWrongQuestions();
    if (filter === "unanswered") return getUnansweredQuestions();
    // "all" = wrong + unanswered
    return answers.filter(a => !a.isCorrect).map(a => {
      const q = quizQuestions.find(qq => qq.id === a.qId);
      return q ? { ...q, _isUnanswered: a.isUnanswered } : null;
    }).filter(Boolean);
  };

  const overallAccuracy = answers.length ? Math.round(answers.filter(a => a.isCorrect).length / answers.length * 100) : 0;
  const avgTimePerQ = answers.length ? Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length) : 0;
  const ncertAnswers = answers.filter(a => a.ncert);
  const ncertAccuracy = ncertAnswers.length ? Math.round(ncertAnswers.filter(a => a.isCorrect).length / ncertAnswers.length * 100) : 0;
  const unansweredCount = answers.filter(a => a.isUnanswered).length;

  const conceptStats = getConceptStats();
  const weakest = conceptStats.length ? conceptStats[0] : null;
  const strongest = conceptStats.length ? conceptStats[conceptStats.length - 1] : null;

  const formatTime = (s) => {
    const safe = Math.max(0, Math.floor(s)) || 0; // clamp negatives, NaN, floats
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
  };

  const retryWrong = () => {
    const wrongIds = getWrongQuestions().map(q => q.id);
    const wrongQs = quizQuestions.filter(q => wrongIds.includes(q.id));
    setQuizQuestions(wrongQs);
    setAnswers([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuestionTimes({});
    setQuizDone(false);
    setQuestionTimer(0);
    setTotalTimer(0);
    setQuizActive(true);
    setScreen("quiz");
  };

  const openFlashcards = () => {
    setFlashcardIdx(0);
    setFlashcardFlipped(false);
    setScreen("flashcards");
  };

  const exitQuiz = () => {
    clearInterval(timerRef.current);
    setQuizActive(false);
    setActiveQuizId(null);
    setHistory([]);
    setAnswers([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuestionTimes({});
    setQuestionTimer(0);
    setTotalTimer(0);
    setScreen("home");
  };

  // DEV SHORTCUT: call window.__devSkip() in browser console to jump to results
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__devSkip = () => {
        const fakeAnswers = quizQuestions.map(q => {
          const skip = Math.random() > 0.85;
          const sel = skip ? null : Math.floor(Math.random() * 4);
          return {
            qId: q.id, selected: sel, correct: q.ans,
            isCorrect: sel === q.ans, isUnanswered: skip,
            time: Math.floor(Math.random() * 30) + 3,
            concept: q.concept, subject: q.subject, ncert: q.ncert,
          };
        });
        setAnswers(fakeAnswers);
        setTotalTimer(420);
        setScreen("analytics");
      };
    }
  }, []);

  const viewAttempt = (attempt) => {
    // Handle both compressed [qId, selected, time] and legacy full-object formats
    const rawAnswers = attempt.answers || [];
    const isCompressed = rawAnswers.length > 0 && Array.isArray(rawAnswers[0]);
    const hydrated = isCompressed
      ? rehydrateAnswers(rawAnswers, quizQuestions)
      : rawAnswers;
    setAnswers(hydrated);
    setTotalTimer(attempt.totalTime);
    setScreen("analytics");
  };

  const goHome = () => {
    setActiveQuizId(null);
    setHistory([]);
    setScreen("home");
  };

  return {
    activeQuizId,
    screen, setScreen,
    answers, currentIdx, quizDone,
    questionTimer, totalTimer, quizActive,
    flashcardIdx, setFlashcardIdx,
    flashcardFlipped, setFlashcardFlipped,
    quizQuestions,
    userAnswers, markedForReview,
    history, clearHistory, deleteAttempt, viewAttempt,
    selectQuiz, goHome, startQuiz, handleSelect, clearResponse,
    toggleMarkForReview, goToQuestion,
    prevQuestion, nextQuestion, finishQuiz,
    getConceptStats, getMistakePatterns, getWrongQuestions, getUnansweredQuestions, getReviewQuestions,
    overallAccuracy, avgTimePerQ, ncertAnswers, ncertAccuracy,
    unansweredCount,
    conceptStats, weakest, strongest,
    formatTime, retryWrong, openFlashcards, exitQuiz,
  };
}
