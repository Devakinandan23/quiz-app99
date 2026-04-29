import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

const normalizeQuestion = (item) => ({
  id: item.id,
  q: item.question,
  opts: item.options.map((opt) => ({ id: opt.id, text: opt.text })),
  explanation: item.explanation,
  concept: item.concept,
  subject: item.subject,
  ncert: item.ncert,
  ref: item.ref,
});

export function useQuiz() {
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeQuizMeta, setActiveQuizMeta] = useState(null);
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
  const [attemptSummary, setAttemptSummary] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [quizzesError, setQuizzesError] = useState("");
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [questionTimes, setQuestionTimes] = useState({});

  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadQuizzes = async () => {
      setQuizzesLoading(true);
      setQuizzesError("");
      try {
        const data = await api.getQuizzes();
        if (!cancelled) {
          setQuizzes(data);
        }
      } catch (error) {
        if (!cancelled) {
          setQuizzesError(error.message || "Failed to load quizzes.");
        }
      } finally {
        if (!cancelled) {
          setQuizzesLoading(false);
        }
      }
    };

    loadQuizzes();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadAttempts = async () => {
    try {
      const result = await api.getAttempts({ limit: 50, offset: 0 });
      setHistory(result.items || []);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    if (screen === "analytics" || screen === "history") {
      loadAttempts();
    }
  }, [screen]);

  useEffect(() => {
    if (quizActive) {
      timerRef.current = setInterval(() => {
        setQuestionTimer((t) => t + 1);
        setTotalTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quizActive, currentIdx]);

  const saveCurrentQuestionTime = () => {
    setQuestionTimes((prev) => ({
      ...prev,
      [currentIdx]: (prev[currentIdx] || 0) + questionTimer,
    }));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteAttempt = (attemptId) => {
    setHistory((prev) => prev.filter((item) => item.id !== attemptId));
  };

  const selectQuiz = async (quizId) => {
    const selectedQuiz = quizzes.find((quiz) => quiz.id === quizId);
    if (!selectedQuiz) return;

    setQuestionsLoading(true);
    setQuestionsError("");

    try {
      const result = await api.getQuizQuestions(quizId, { limit: 200, offset: 0 });
      setActiveQuizId(quizId);
      setActiveQuizMeta(selectedQuiz);
      setQuizQuestions((result.items || []).map(normalizeQuestion));
      setScreen("dashboard");
    } catch (error) {
      setQuestionsError(error.message || "Failed to load questions.");
    } finally {
      setQuestionsLoading(false);
    }
  };

  const startQuiz = () => {
    if (!activeQuizId || quizQuestions.length === 0) return;
    setAnswers([]);
    setAttemptSummary(null);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuestionTimes({});
    setQuizDone(false);
    setQuestionTimer(0);
    setTotalTimer(0);
    setSubmitError("");
    setQuizActive(true);
    setScreen("quiz");
  };

  const handleSelect = (optionId) => {
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: optionId }));
  };

  const clearResponse = () => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
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

  const finishQuiz = async () => {
    clearInterval(timerRef.current);
    saveCurrentQuestionTime();

    const responses = quizQuestions.map((q, idx) => ({
      questionId: q.id,
      optionId: userAnswers[idx],
    })).filter(res => res.optionId !== undefined && res.optionId !== null);

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const result = await api.submitAttempt({
        quizId: activeQuizId,
        responses,
      });

      setAttemptSummary(result);
      setQuizDone(true);
      setQuizActive(false);
      
      // Build a map of questionId -> isCorrect from the backend evaluations
      const responseMap = {};
      if (Array.isArray(result.responses)) {
        result.responses.forEach(r => {
          responseMap[r.questionId] = r.isCorrect;
        });
      }

      setAnswers(
        quizQuestions.map((q, idx) => ({
          qId: q.id,
          selected: userAnswers[idx] ?? null,
          time: questionTimes[idx] || 0,
          concept: q.concept || "",
          subject: q.subject || "",
          ncert: q.ncert || false,
          isUnanswered: userAnswers[idx] === undefined,
          isCorrect: responseMap[q.id] === true,
          question: q,
        })),
      );
      await loadAttempts();
      setScreen("analytics");
    } catch (error) {
      setSubmitError(error.message || "Failed to submit attempt.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getConceptStats = () => {
    const conceptMap = {};
    answers.forEach((a) => {
      if (!a.concept) return;
      if (!conceptMap[a.concept]) {
        conceptMap[a.concept] = { concept: a.concept, correct: 0, total: 0 };
      }
      conceptMap[a.concept].total++;
      if (a.isCorrect) conceptMap[a.concept].correct++;
    });
    return Object.values(conceptMap)
      .map((c) => ({ ...c, accuracy: Math.round((c.correct / c.total) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy);
  };

  const getMistakePatterns = () => {
    const wrong = answers.filter((a) => !a.isCorrect && !a.isUnanswered);
    const avgTime = answers.length
      ? answers.reduce((sum, a) => sum + a.time, 0) / answers.length
      : 0;
    const guessing = wrong.filter((a) => a.time < avgTime * 0.5).length;
    const confusion = wrong.filter((a) => a.time > avgTime * 1.5).length;
    return { guessing, confusion, total: wrong.length };
  };

  const getWrongQuestions = () =>
    answers
      .filter((a) => !a.isCorrect && !a.isUnanswered)
      .map((a) => a.question)
      .filter(Boolean);

  const getUnansweredQuestions = () =>
    answers
      .filter((a) => a.isUnanswered)
      .map((a) => quizQuestions.find((q) => q.id === a.qId))
      .filter(Boolean);

  const getReviewQuestions = (filter) => {
    if (filter === "unanswered") return getUnansweredQuestions();
    return [];
  };

  const overallAccuracy = attemptSummary?.accuracy ?? 0;
  const avgTimePerQ = answers.length
    ? Math.round(answers.reduce((sum, a) => sum + a.time, 0) / answers.length)
    : 0;
  const ncertAnswers = answers.filter((a) => a.ncert);
  const ncertAccuracy = ncertAnswers.length
    ? Math.round(ncertAnswers.filter((a) => a.isCorrect).length / ncertAnswers.length * 100)
    : 0;
  const unansweredCount = answers.filter((a) => a.isUnanswered).length;

  const conceptStats = getConceptStats();
  const weakest = conceptStats.length ? conceptStats[0] : null;
  const strongest = conceptStats.length ? conceptStats[conceptStats.length - 1] : null;

  const formatTime = (s) => {
    const safe = Math.max(0, Math.floor(s)) || 0;
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
  };

  const retryWrong = () => {};

  const openFlashcards = () => {
    setFlashcardIdx(0);
    setFlashcardFlipped(false);
    setScreen("flashcards");
  };

  const exitQuiz = () => {
    clearInterval(timerRef.current);
    setQuizActive(false);
    setAnswers([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuestionTimes({});
    setQuestionTimer(0);
    setTotalTimer(0);
    setSubmitError("");
    setScreen("home");
  };

  const viewAttempt = async (attempt) => {
    try {
      const detail = await api.getAttemptById(attempt.id);
      const loadedAnswers = detail.responses.map((item) => {
        // Determine isCorrect by finding which option is marked correct and
        // comparing it to what the user selected.
        const correctOption = item.question?.options?.find((o) => o.isCorrect);
        const isCorrect = correctOption ? correctOption.id === item.optionId : false;
        return {
          qId: item.questionId,
          selected: item.optionId,
          isCorrect,
          isUnanswered: false,
          concept: item.question?.concept || "",
          subject: item.question?.subject || "",
          ncert: item.question?.ncert || false,
          time: 0,
          question: {
            id: item.questionId,
            q: item.question.question,
            explanation: item.question.explanation,
            opts: item.question.options,
            concept: item.question.concept || "",
            subject: item.question.subject || "",
            ncert: item.question.ncert || false,
            ref: "",
          },
        };
      });
      setAnswers(loadedAnswers);
      setAttemptSummary({
        score: detail.score,
        accuracy: detail.accuracy,
        totalQuestions: detail.totalQuestions,
      });
      setScreen("analytics");
    } catch {
      setSubmitError("Failed to load attempt details.");
    }
  };

  const goHome = () => {
    setActiveQuizId(null);
    setActiveQuizMeta(null);
    setQuizQuestions([]);
    setHistory([]);
    setScreen("home");
  };

  return {
    activeQuizId,
    activeQuizMeta,
    screen,
    setScreen,
    answers,
    currentIdx,
    quizDone,
    questionTimer,
    totalTimer,
    quizActive,
    flashcardIdx,
    setFlashcardIdx,
    flashcardFlipped,
    setFlashcardFlipped,
    quizQuestions,
    userAnswers,
    markedForReview,
    history,
    quizzes,
    quizzesLoading,
    quizzesError,
    questionsLoading,
    questionsError,
    submitLoading,
    submitError,
    attemptSummary,
    clearHistory,
    deleteAttempt,
    viewAttempt,
    selectQuiz,
    goHome,
    startQuiz,
    handleSelect,
    clearResponse,
    toggleMarkForReview,
    goToQuestion,
    prevQuestion,
    nextQuestion,
    finishQuiz,
    getConceptStats,
    getMistakePatterns,
    getWrongQuestions,
    getUnansweredQuestions,
    getReviewQuestions,
    overallAccuracy,
    avgTimePerQ,
    ncertAnswers,
    ncertAccuracy,
    unansweredCount,
    conceptStats,
    weakest,
    strongest,
    formatTime,
    retryWrong,
    openFlashcards,
    exitQuiz,
  };
}
