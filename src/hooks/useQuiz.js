import { useState, useEffect, useRef } from "react";
import { QUESTIONS } from "../data/questions";

const HISTORY_KEY = "chemprep_history";

function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function useQuiz() {
  const [screen, setScreen] = useState("dashboard");
  const [answers, setAnswers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(QUESTIONS);
  const [history, setHistory] = useState(loadHistory);
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

  const saveAttempt = (finalAnswers, finalTotalTimer) => {
    const correct = finalAnswers.filter(a => a.isCorrect).length;
    const attempt = {
      id: Date.now(),
      date: new Date().toISOString(),
      totalQuestions: finalAnswers.length,
      correct,
      accuracy: Math.round((correct / finalAnswers.length) * 100),
      totalTime: finalTotalTimer,
      answers: finalAnswers,
    };
    const updated = [attempt, ...history];
    setHistory(updated);
    saveHistory(updated);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const startQuiz = (filter) => {
    const filtered = filter === "all" ? [...QUESTIONS] : QUESTIONS.filter(q => q.diff === filter);
    setQuizQuestions(filtered);
    setAnswers([]);
    setCurrentIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setQuizDone(false);
    setQuestionTimer(0);
    setTotalTimer(0);
    setQuizActive(true);
    setScreen("quiz");
  };

  const handleSelect = (optIdx) => {
    setSelected(optIdx);
  };

  const submitAnswer = () => {
    if (selected === null) return;
    clearInterval(timerRef.current);
    const q = quizQuestions[currentIdx];
    const newAnswer = {
      qId: q.id, selected, correct: q.ans,
      isCorrect: selected === q.ans, time: questionTimer,
      concept: q.concept, diff: q.diff, ncert: q.ncert
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIdx + 1 >= quizQuestions.length) {
      setQuizDone(true);
      setQuizActive(false);
      saveAttempt(updatedAnswers, totalTimer + questionTimer);
      setScreen("analytics");
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setQuestionTimer(0);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= quizQuestions.length) {
      setQuizDone(true);
      setQuizActive(false);
      setScreen("analytics");
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowFeedback(false);
    setQuestionTimer(0);
  };

  const getConceptStats = () => {
    const stats = {};
    answers.forEach(a => {
      if (!stats[a.concept]) stats[a.concept] = { total: 0, correct: 0, totalTime: 0 };
      stats[a.concept].total++;
      if (a.isCorrect) stats[a.concept].correct++;
      stats[a.concept].totalTime += a.time;
    });
    return Object.entries(stats).map(([concept, s]) => ({
      concept, accuracy: Math.round((s.correct / s.total) * 100),
      total: s.total, correct: s.correct, avgTime: Math.round(s.totalTime / s.total)
    })).sort((a, b) => a.accuracy - b.accuracy);
  };

  const getMistakePatterns = () => {
    const wrong = answers.filter(a => !a.isCorrect);
    const avgTime = answers.length ? answers.reduce((s, a) => s + a.time, 0) / answers.length : 15;
    const guessing = wrong.filter(a => a.time < avgTime * 0.5).length;
    const confusion = wrong.filter(a => a.time >= avgTime * 0.5).length;
    return { guessing, confusion, total: wrong.length };
  };

  const getWrongQuestions = () => {
    return answers.filter(a => !a.isCorrect).map(a => QUESTIONS.find(q => q.id === a.qId)).filter(Boolean);
  };

  const overallAccuracy = answers.length ? Math.round(answers.filter(a => a.isCorrect).length / answers.length * 100) : 0;
  const avgTimePerQ = answers.length ? Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length) : 0;
  const ncertAnswers = answers.filter(a => a.ncert);
  const ncertAccuracy = ncertAnswers.length ? Math.round(ncertAnswers.filter(a => a.isCorrect).length / ncertAnswers.length * 100) : 0;

  const conceptStats = getConceptStats();
  const weakest = conceptStats.length ? conceptStats[0] : null;
  const strongest = conceptStats.length ? conceptStats[conceptStats.length - 1] : null;

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const retryWrong = () => {
    const wrongIds = getWrongQuestions().map(q => q.id);
    const wrongQs = QUESTIONS.filter(q => wrongIds.includes(q.id));
    setQuizQuestions(wrongQs);
    setAnswers([]);
    setCurrentIdx(0);
    setSelected(null);
    setShowFeedback(false);
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

  // Exit quiz = discard current attempt (no save)
  const exitQuiz = () => {
    clearInterval(timerRef.current);
    setQuizActive(false);
    setAnswers([]);
    setCurrentIdx(0);
    setSelected(null);
    setQuestionTimer(0);
    setTotalTimer(0);
    setScreen("dashboard");
  };

  // DEV SHORTCUT: call window.__devSkip() in browser console to jump to results
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__devSkip = () => {
        const fakeAnswers = QUESTIONS.map(q => ({
          qId: q.id, selected: Math.floor(Math.random() * 4), correct: q.ans,
          isCorrect: Math.random() > 0.4, time: Math.floor(Math.random() * 30) + 3,
          concept: q.concept, diff: q.diff, ncert: q.ncert,
        }));
        setAnswers(fakeAnswers);
        setTotalTimer(420);
        setScreen("analytics");
      };
    }
  }, []);

  // Load a past attempt to view its results
  const viewAttempt = (attempt) => {
    setAnswers(attempt.answers);
    setTotalTimer(attempt.totalTime);
    setScreen("analytics");
  };

  return {
    screen, setScreen,
    answers, currentIdx, selected, showFeedback,
    quizDone, questionTimer, totalTimer, quizActive,
    flashcardIdx, setFlashcardIdx,
    flashcardFlipped, setFlashcardFlipped,
    quizQuestions,
    history, clearHistory, viewAttempt,
    startQuiz, handleSelect, submitAnswer, nextQuestion,
    getConceptStats, getMistakePatterns, getWrongQuestions,
    overallAccuracy, avgTimePerQ, ncertAnswers, ncertAccuracy,
    conceptStats, weakest, strongest,
    formatTime, retryWrong, openFlashcards, exitQuiz,
  };
}
