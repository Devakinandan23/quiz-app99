import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import Quiz from '../components/Quiz';
import Analytics from '../components/Analytics';
import AnswerReview from '../components/AnswerReview';
import History from '../components/History';
import Flashcards from '../components/Flashcards';
import { QUESTIONS } from '../data/questions';

describe('Dashboard Component', () => {
  it('renders title and subtitle', () => {
    render(<Dashboard startQuiz={vi.fn()} />);
    expect(screen.getByText('ChemPrep')).toBeInTheDocument();
    expect(screen.getByText(/NCERT Chemistry/)).toBeInTheDocument();
  });

  it('renders test rules', () => {
    render(<Dashboard startQuiz={vi.fn()} />);
    expect(screen.getByText('Test Rules')).toBeInTheDocument();
    expect(screen.getByText(/Each question has only one correct answer/)).toBeInTheDocument();
    expect(screen.getByText(/No answers or explanations will be shown during the test/)).toBeInTheDocument();
  });

  it('renders Start Test button', () => {
    render(<Dashboard startQuiz={vi.fn()} />);
    expect(screen.getByText('Start Test')).toBeInTheDocument();
  });

  it('calls startQuiz with "all" on click', () => {
    const startQuiz = vi.fn();
    render(<Dashboard startQuiz={startQuiz} />);
    fireEvent.click(screen.getByText('Start Test'));
    expect(startQuiz).toHaveBeenCalledWith('all');
  });

  it('shows question count', () => {
    render(<Dashboard startQuiz={vi.fn()} />);
    expect(screen.getByText('60 questions · Timed')).toBeInTheDocument();
  });
});

describe('Quiz Component', () => {
  const defaultProps = {
    quizQuestions: QUESTIONS,
    currentIdx: 0,
    userAnswers: {},
    markedForReview: new Set(),
    questionTimer: 0,
    totalTimer: 42,
    handleSelect: vi.fn(),
    clearResponse: vi.fn(),
    toggleMarkForReview: vi.fn(),
    goToQuestion: vi.fn(),
    prevQuestion: vi.fn(),
    nextQuestion: vi.fn(),
    finishQuiz: vi.fn(),
    exitQuiz: vi.fn(),
    formatTime: (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
  };

  it('renders the first question', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.getByText(QUESTIONS[0].q)).toBeInTheDocument();
  });

  it('renders all 4 options', () => {
    render(<Quiz {...defaultProps} />);
    QUESTIONS[0].opts.forEach(opt => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('renders question number', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.getByText(/Q\.1/)).toBeInTheDocument();
  });

  it('renders sidebar with sections', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.getByText('Easy (20)')).toBeInTheDocument();
    expect(screen.getByText('Medium (25)')).toBeInTheDocument();
    expect(screen.getByText('Hard (15)')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Mark for Review')).toBeInTheDocument();
    expect(screen.getByText('I have completed the test')).toBeInTheDocument();
  });

  it('renders sidebar stats', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.getByText(/Answered:/)).toBeInTheDocument();
    expect(screen.getByText(/Unanswered:/)).toBeInTheDocument();
    expect(screen.getByText(/Marked:/)).toBeInTheDocument();
  });

  it('calls handleSelect when option clicked', () => {
    const handleSelect = vi.fn();
    render(<Quiz {...defaultProps} handleSelect={handleSelect} />);
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[1]));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('calls nextQuestion on Next click', () => {
    const nextQuestion = vi.fn();
    render(<Quiz {...defaultProps} nextQuestion={nextQuestion} />);
    fireEvent.click(screen.getByText('Next'));
    expect(nextQuestion).toHaveBeenCalled();
  });

  it('calls toggleMarkForReview', () => {
    const toggleMarkForReview = vi.fn();
    render(<Quiz {...defaultProps} toggleMarkForReview={toggleMarkForReview} />);
    fireEvent.click(screen.getByText('Mark for Review'));
    expect(toggleMarkForReview).toHaveBeenCalled();
  });

  it('shows "Unmark Review" when marked', () => {
    const marked = new Set([0]);
    render(<Quiz {...defaultProps} markedForReview={marked} />);
    expect(screen.getByText('Unmark Review')).toBeInTheDocument();
  });

  it('calls exitQuiz on Exit click', () => {
    const exitQuiz = vi.fn();
    render(<Quiz {...defaultProps} exitQuiz={exitQuiz} />);
    fireEvent.click(screen.getByText('Exit'));
    expect(exitQuiz).toHaveBeenCalled();
  });

  it('shows confirm modal on "I have completed the test"', () => {
    render(<Quiz {...defaultProps} />);
    fireEvent.click(screen.getByText('I have completed the test'));
    expect(screen.getByText('Submit Test?')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Submit Test')).toBeInTheDocument();
  });

  it('shows Clear Response when answer is selected', () => {
    render(<Quiz {...defaultProps} userAnswers={{ 0: 2 }} />);
    expect(screen.getByText('Clear Response')).toBeInTheDocument();
  });

  it('does not show Clear Response when no answer', () => {
    render(<Quiz {...defaultProps} userAnswers={{}} />);
    expect(screen.queryByText('Clear Response')).not.toBeInTheDocument();
  });

  it('does not show concept/ref during test', () => {
    render(<Quiz {...defaultProps} />);
    // concept and ref should not be visible during quiz
    expect(screen.queryByText(QUESTIONS[0].concept)).not.toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[0].ref)).not.toBeInTheDocument();
  });

  it('does not show explanation during test', () => {
    render(<Quiz {...defaultProps} />);
    expect(screen.queryByText(QUESTIONS[0].exp)).not.toBeInTheDocument();
  });

  it('renders sidebar question grid buttons', () => {
    render(<Quiz {...defaultProps} />);
    // Should have numbered buttons 1-60
    for (let i = 1; i <= 60; i++) {
      const btns = screen.getAllByText(String(i));
      expect(btns.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('clicking sidebar question navigates', () => {
    const goToQuestion = vi.fn();
    render(<Quiz {...defaultProps} goToQuestion={goToQuestion} />);
    // Click question 5 in sidebar
    const btns = screen.getAllByText('5');
    fireEvent.click(btns[0]);
    expect(goToQuestion).toHaveBeenCalledWith(4); // idx 4 = Q5
  });

  it('toggles sidebar visibility', () => {
    render(<Quiz {...defaultProps} />);
    const toggleBtn = screen.getByText('<<');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('>>')).toBeInTheDocument();
  });

  it('displays timer', () => {
    render(<Quiz {...defaultProps} totalTimer={125} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });
});

describe('Analytics Component', () => {
  const mockAnswers = QUESTIONS.map(q => ({
    qId: q.id, selected: q.ans === 0 ? 1 : 0, correct: q.ans,
    isCorrect: false, isUnanswered: false, time: 10,
    concept: q.concept, diff: q.diff, ncert: q.ncert,
  }));
  // Make first 30 correct
  mockAnswers.slice(0, 30).forEach(a => {
    const q = QUESTIONS.find(qq => qq.id === a.qId);
    a.selected = q.ans;
    a.isCorrect = true;
  });
  // Make last 5 unanswered
  mockAnswers.slice(55).forEach(a => {
    a.selected = null;
    a.isCorrect = false;
    a.isUnanswered = true;
  });

  const defaultProps = {
    answers: mockAnswers,
    overallAccuracy: 50,
    avgTimePerQ: 10,
    ncertAccuracy: 60,
    ncertAnswers: mockAnswers.filter(a => a.ncert),
    unansweredCount: 5,
    totalTimer: 600,
    conceptStats: [
      { concept: 'Atomic Structure', accuracy: 40, total: 5, correct: 2, unanswered: 0 },
      { concept: 'Quantum Mechanics', accuracy: 70, total: 10, correct: 7, unanswered: 1 },
    ],
    formatTime: (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
    getMistakePatterns: () => ({ guessing: 3, confusion: 5, total: 8 }),
    getWrongQuestions: () => QUESTIONS.slice(0, 5),
    setScreen: vi.fn(),
    openFlashcards: vi.fn(),
    history: [],
  };

  it('renders results title', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Your Results')).toBeInTheDocument();
  });

  it('shows score', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('shows Not Answered card', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Not Answered')).toBeInTheDocument();
    expect(screen.getByText('of 60 questions')).toBeInTheDocument();
  });

  it('shows total time', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows NCERT trap accuracy', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('NCERT Trap Accuracy')).toBeInTheDocument();
  });

  it('shows concept breakdown', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Concept Breakdown')).toBeInTheDocument();
  });

  it('shows mistake patterns', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Mistake Patterns')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // guessing
  });

  it('shows View All Answers button', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('View All Answers')).toBeInTheDocument();
  });

  it('shows Dashboard button', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('navigates to review on View All Answers click', () => {
    const setScreen = vi.fn();
    render(<Analytics {...defaultProps} setScreen={setScreen} />);
    fireEvent.click(screen.getByText('View All Answers'));
    expect(setScreen).toHaveBeenCalledWith('review');
  });

  it('shows history button when history exists', () => {
    render(<Analytics {...defaultProps} history={[{ id: 1 }]} />);
    expect(screen.getByText(/History/)).toBeInTheDocument();
  });

  it('shows Export Results button', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Export Results')).toBeInTheDocument();
  });

  it('shows difficulty performance section', () => {
    render(<Analytics {...defaultProps} />);
    expect(screen.getByText('Difficulty Performance')).toBeInTheDocument();
  });
});

describe('AnswerReview Component', () => {
  const mockAnswers = [
    { qId: 1, selected: 1, correct: 1, isCorrect: true, isUnanswered: false, time: 5, concept: 'Measurement & Units', diff: 'easy', ncert: false },
    { qId: 2, selected: 0, correct: 1, isCorrect: false, isUnanswered: false, time: 12, concept: 'Measurement & Units', diff: 'easy', ncert: false },
    { qId: 3, selected: null, correct: 2, isCorrect: false, isUnanswered: true, time: 0, concept: 'Measurement & Units', diff: 'easy', ncert: false },
  ];

  it('renders Answer Key title', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    expect(screen.getByText('Answer Key')).toBeInTheDocument();
  });

  it('shows filter buttons with counts', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Correct (1)')).toBeInTheDocument();
    expect(screen.getByText('Wrong (1)')).toBeInTheDocument();
    expect(screen.getByText('Not Answered (1)')).toBeInTheDocument();
  });

  it('shows concept and ref for each question', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    expect(screen.getAllByText(/Measurement & Units/).length).toBeGreaterThan(0);
  });

  it('shows explanations for each question', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    // Q1 explanation
    expect(screen.getByText(/Femto = 10/)).toBeInTheDocument();
  });

  it('filters to correct only', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    fireEvent.click(screen.getByText('Correct (1)'));
    // Should show Q1 only (correct answer)
    expect(screen.getByText(QUESTIONS[0].q)).toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[1].q)).not.toBeInTheDocument();
  });

  it('filters to wrong only', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    fireEvent.click(screen.getByText('Wrong (1)'));
    expect(screen.getByText(QUESTIONS[1].q)).toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[0].q)).not.toBeInTheDocument();
  });

  it('filters to unanswered only', () => {
    render(<AnswerReview answers={mockAnswers} setScreen={vi.fn()} />);
    fireEvent.click(screen.getByText('Not Answered (1)'));
    expect(screen.getByText(QUESTIONS[2].q)).toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[0].q)).not.toBeInTheDocument();
  });

  it('navigates back to results', () => {
    const setScreen = vi.fn();
    render(<AnswerReview answers={mockAnswers} setScreen={setScreen} />);
    fireEvent.click(screen.getByText('Back to Results'));
    expect(setScreen).toHaveBeenCalledWith('analytics');
  });
});

describe('History Component', () => {
  const makeHistory = (overrides = {}) => [{
    id: 1, date: '2026-01-15T10:00:00Z', totalQuestions: 60,
    correct: 40, accuracy: 67, totalTime: 600, answers: [],
    ...overrides,
  }];

  const defaultProps = {
    history: makeHistory(),
    clearHistory: vi.fn(),
    deleteAttempt: vi.fn(),
    viewAttempt: vi.fn(),
    setScreen: vi.fn(),
  };

  it('shows empty state when no history', () => {
    render(<History {...defaultProps} history={[]} />);
    expect(screen.getByText('No quiz attempts yet.')).toBeInTheDocument();
  });

  it('shows attempts when history exists', () => {
    render(<History {...defaultProps} />);
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('40/60')).toBeInTheDocument();
  });

  it('calls viewAttempt on attempt click', () => {
    const viewAttempt = vi.fn();
    render(<History {...defaultProps} viewAttempt={viewAttempt} />);
    fireEvent.click(screen.getByText('View Details'));
    expect(viewAttempt).toHaveBeenCalledWith(defaultProps.history[0]);
  });

  it('shows Clear All button when history exists', () => {
    render(<History {...defaultProps} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('calls clearHistory on Clear All click', () => {
    const clearHistory = vi.fn();
    render(<History {...defaultProps} clearHistory={clearHistory} />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(clearHistory).toHaveBeenCalled();
  });

  it('renders delete button for each attempt', () => {
    render(<History {...defaultProps} />);
    expect(screen.getByLabelText('Delete attempt')).toBeInTheDocument();
  });

  it('calls deleteAttempt with correct ID on delete click', () => {
    const deleteAttempt = vi.fn();
    render(<History {...defaultProps} deleteAttempt={deleteAttempt} />);
    fireEvent.click(screen.getByLabelText('Delete attempt'));
    expect(deleteAttempt).toHaveBeenCalledWith(1);
  });

  it('delete click does not trigger viewAttempt', () => {
    const viewAttempt = vi.fn();
    const deleteAttempt = vi.fn();
    render(<History {...defaultProps} viewAttempt={viewAttempt} deleteAttempt={deleteAttempt} />);
    fireEvent.click(screen.getByLabelText('Delete attempt'));
    expect(deleteAttempt).toHaveBeenCalled();
    expect(viewAttempt).not.toHaveBeenCalled();
  });

  it('renders delete button for each of multiple attempts', () => {
    const multi = [
      { id: 1, date: '2026-01-15T10:00:00Z', totalQuestions: 60, correct: 40, accuracy: 67, totalTime: 600, answers: [] },
      { id: 2, date: '2026-01-16T10:00:00Z', totalQuestions: 60, correct: 50, accuracy: 83, totalTime: 500, answers: [] },
    ];
    render(<History {...defaultProps} history={multi} />);
    expect(screen.getAllByLabelText('Delete attempt')).toHaveLength(2);
  });
});

describe('Flashcards Component', () => {
  const wrongQs = QUESTIONS.slice(0, 2).map(q => ({ ...q, _isUnanswered: false }));
  const unansweredQs = [{ ...QUESTIONS[2], _isUnanswered: true }];
  const allReviewQs = [...wrongQs, ...unansweredQs];

  const getReviewQuestions = (filter) => {
    if (filter === "wrong") return wrongQs;
    if (filter === "unanswered") return unansweredQs;
    return allReviewQs;
  };

  const defaultProps = {
    getWrongQuestions: () => wrongQs,
    getReviewQuestions,
    flashcardIdx: 0,
    setFlashcardIdx: vi.fn(),
    flashcardFlipped: false,
    setFlashcardFlipped: vi.fn(),
    setScreen: vi.fn(),
  };

  it('renders flashcard question', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText(allReviewQs[0].q)).toBeInTheDocument();
  });

  it('shows concept badge', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText(allReviewQs[0].concept)).toBeInTheDocument();
  });

  it('shows "Tap to see answer" prompt', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText('Tap to see answer')).toBeInTheDocument();
  });

  it('shows answer when flipped', () => {
    render(<Flashcards {...defaultProps} flashcardFlipped={true} />);
    expect(screen.getByText(allReviewQs[0].opts[allReviewQs[0].ans])).toBeInTheDocument();
    expect(screen.getByText(allReviewQs[0].exp)).toBeInTheDocument();
  });

  it('shows progress counter', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText(`1 / ${allReviewQs.length}`)).toBeInTheDocument();
  });

  it('shows filter tabs with counts', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText(`All (${allReviewQs.length})`)).toBeInTheDocument();
    expect(screen.getByText(`Wrong (${wrongQs.length})`)).toBeInTheDocument();
    expect(screen.getByText(`Not Answered (${unansweredQs.length})`)).toBeInTheDocument();
  });

  it('shows "Wrong Answer" badge for wrong questions', () => {
    render(<Flashcards {...defaultProps} />);
    expect(screen.getByText('Wrong Answer')).toBeInTheDocument();
  });

  it('shows empty state when no questions to review', () => {
    const emptyReview = (filter) => [];
    render(<Flashcards {...defaultProps} getWrongQuestions={() => []} getReviewQuestions={emptyReview} />);
    expect(screen.getByText(/No wrong or unanswered questions to review/)).toBeInTheDocument();
  });
});
