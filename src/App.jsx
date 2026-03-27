import { useQuiz } from "./hooks/useQuiz";
import Dashboard from "./components/Dashboard";
import Quiz from "./components/Quiz";
import Analytics from "./components/Analytics";
import Flashcards from "./components/Flashcards";
import AnswerReview from "./components/AnswerReview";
import History from "./components/History";

function App() {
  const quiz = useQuiz();

  if (quiz.screen === "dashboard") {
    return (
      <Dashboard startQuiz={quiz.startQuiz} />
    );
  }

  if (quiz.screen === "quiz") {
    return (
      <Quiz
        quizQuestions={quiz.quizQuestions}
        currentIdx={quiz.currentIdx}
        selected={quiz.selected}
        questionTimer={quiz.questionTimer}
        handleSelect={quiz.handleSelect}
        submitAnswer={quiz.submitAnswer}
        exitQuiz={quiz.exitQuiz}
        formatTime={quiz.formatTime}
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
    return (
      <AnswerReview
        answers={quiz.answers}
        setScreen={quiz.setScreen}
      />
    );
  }

  if (quiz.screen === "history") {
    return (
      <History
        history={quiz.history}
        clearHistory={quiz.clearHistory}
        viewAttempt={quiz.viewAttempt}
        setScreen={quiz.setScreen}
      />
    );
  }

  if (quiz.screen === "flashcards") {
    return (
      <Flashcards
        getWrongQuestions={quiz.getWrongQuestions}
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
