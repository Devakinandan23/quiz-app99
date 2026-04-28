import { useQuiz } from "./hooks/useQuiz";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Quiz from "./components/Quiz";
import Analytics from "./components/Analytics";
import Flashcards from "./components/Flashcards";
import AnswerReview from "./components/AnswerReview";
import History from "./components/History";

function App() {
  const quiz = useQuiz();

  if (quiz.screen === "home") {
    return (
      <Home
        selectQuiz={quiz.selectQuiz}
        quizzes={quiz.quizzes}
        loading={quiz.quizzesLoading}
        error={quiz.quizzesError}
      />
    );
  }

  if (quiz.screen === "dashboard") {
    return (
      <Dashboard
        startQuiz={quiz.startQuiz}
        activeQuizMeta={quiz.activeQuizMeta}
        goHome={quiz.goHome}
        questionsLoading={quiz.questionsLoading}
        questionsError={quiz.questionsError}
        questionCount={quiz.quizQuestions.length}
      />
    );
  }

  if (quiz.screen === "quiz") {
    return (
      <Quiz
        quizQuestions={quiz.quizQuestions}
        currentIdx={quiz.currentIdx}
        userAnswers={quiz.userAnswers}
        markedForReview={quiz.markedForReview}
        questionTimer={quiz.questionTimer}
        totalTimer={quiz.totalTimer}
        handleSelect={quiz.handleSelect}
        clearResponse={quiz.clearResponse}
        toggleMarkForReview={quiz.toggleMarkForReview}
        goToQuestion={quiz.goToQuestion}
        prevQuestion={quiz.prevQuestion}
        nextQuestion={quiz.nextQuestion}
        finishQuiz={quiz.finishQuiz}
        exitQuiz={quiz.exitQuiz}
        formatTime={quiz.formatTime}
        submitLoading={quiz.submitLoading}
        submitError={quiz.submitError}
      />
    );
  }

  if (quiz.screen === "analytics") {
    return (
      <Analytics
        answers={quiz.answers}
        overallAccuracy={quiz.overallAccuracy}
        avgTimePerQ={quiz.avgTimePerQ}
        ncertAccuracy={quiz.ncertAccuracy}
        ncertAnswers={quiz.ncertAnswers}
        unansweredCount={quiz.unansweredCount}
        totalTimer={quiz.totalTimer}
        conceptStats={quiz.conceptStats}
        formatTime={quiz.formatTime}
        getMistakePatterns={quiz.getMistakePatterns}
        getWrongQuestions={quiz.getWrongQuestions}
        setScreen={quiz.setScreen}
        openFlashcards={quiz.openFlashcards}
        history={quiz.history}
      />
    );
  }

  if (quiz.screen === "review") {
    return <AnswerReview answers={quiz.answers} setScreen={quiz.setScreen} />;
  }

  if (quiz.screen === "history") {
    return (
      <History
        history={quiz.history}
        clearHistory={quiz.clearHistory}
        deleteAttempt={quiz.deleteAttempt}
        viewAttempt={quiz.viewAttempt}
        setScreen={quiz.setScreen}
      />
    );
  }

  if (quiz.screen === "flashcards") {
    return (
      <Flashcards
        getWrongQuestions={quiz.getWrongQuestions}
        getReviewQuestions={quiz.getReviewQuestions}
        flashcardIdx={quiz.flashcardIdx}
        setFlashcardIdx={quiz.setFlashcardIdx}
        flashcardFlipped={quiz.flashcardFlipped}
        setFlashcardFlipped={quiz.setFlashcardFlipped}
        setScreen={quiz.setScreen}
      />
    );
  }

  return null;
}

export default App;
