import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../hooks/useQuiz';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = val; }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('useQuiz Hook', () => {
  it('initializes with dashboard screen', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.screen).toBe('dashboard');
  });

  it('initializes with empty answers', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.answers).toEqual([]);
  });

  it('initializes with zero timers', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.totalTimer).toBe(0);
    expect(result.current.questionTimer).toBe(0);
  });

  it('starts quiz with all questions', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    expect(result.current.screen).toBe('quiz');
    expect(result.current.quizQuestions).toHaveLength(60);
    expect(result.current.currentIdx).toBe(0);
    expect(result.current.quizActive).toBe(true);
  });

  it('starts quiz with easy filter', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    expect(result.current.quizQuestions).toHaveLength(20);
    expect(result.current.quizQuestions.every(q => q.diff === 'easy')).toBe(true);
  });

  it('starts quiz with medium filter', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('medium'));
    expect(result.current.quizQuestions).toHaveLength(25);
  });

  it('starts quiz with hard filter', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('hard'));
    expect(result.current.quizQuestions).toHaveLength(15);
  });

  it('selects an answer', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(2));
    expect(result.current.userAnswers[0]).toBe(2);
  });

  it('changes selection on same question', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(1));
    act(() => result.current.handleSelect(3));
    expect(result.current.userAnswers[0]).toBe(3);
  });

  it('clears response', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(2));
    expect(result.current.userAnswers[0]).toBe(2);
    act(() => result.current.clearResponse());
    expect(result.current.userAnswers[0]).toBeUndefined();
  });

  it('navigates to next question', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.nextQuestion());
    expect(result.current.currentIdx).toBe(1);
  });

  it('navigates to previous question', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.nextQuestion());
    act(() => result.current.nextQuestion());
    expect(result.current.currentIdx).toBe(2);
    act(() => result.current.prevQuestion());
    expect(result.current.currentIdx).toBe(1);
  });

  it('does not go below index 0 on previous', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.prevQuestion());
    expect(result.current.currentIdx).toBe(0);
  });

  it('does not exceed last question on next', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    // go to last
    for (let i = 0; i < 25; i++) {
      act(() => result.current.nextQuestion());
    }
    expect(result.current.currentIdx).toBe(19); // 20 questions, max idx 19
  });

  it('jumps to any question via goToQuestion', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.goToQuestion(30));
    expect(result.current.currentIdx).toBe(30);
  });

  it('ignores out-of-range goToQuestion', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.goToQuestion(-1));
    expect(result.current.currentIdx).toBe(0);
    act(() => result.current.goToQuestion(999));
    expect(result.current.currentIdx).toBe(0);
  });

  it('marks question for review', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.toggleMarkForReview());
    expect(result.current.markedForReview.has(0)).toBe(true);
  });

  it('unmarks question for review', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.toggleMarkForReview());
    expect(result.current.markedForReview.has(0)).toBe(true);
    act(() => result.current.toggleMarkForReview());
    expect(result.current.markedForReview.has(0)).toBe(false);
  });

  it('finishes quiz and builds answers', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    // answer first 3 questions
    act(() => result.current.handleSelect(1));
    act(() => result.current.nextQuestion());
    act(() => result.current.handleSelect(0));
    act(() => result.current.nextQuestion());
    act(() => result.current.handleSelect(2));
    act(() => result.current.finishQuiz());

    expect(result.current.screen).toBe('analytics');
    expect(result.current.answers).toHaveLength(60);
    expect(result.current.quizActive).toBe(false);
  });

  it('marks unanswered questions correctly on finish', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    // answer only Q1
    act(() => result.current.handleSelect(1));
    act(() => result.current.finishQuiz());

    const answered = result.current.answers.filter(a => !a.isUnanswered);
    const unanswered = result.current.answers.filter(a => a.isUnanswered);
    expect(answered).toHaveLength(1);
    expect(unanswered).toHaveLength(59);
  });

  it('saves attempt to history on finish', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(1));
    act(() => result.current.finishQuiz());

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toHaveProperty('id');
    expect(result.current.history[0]).toHaveProperty('date');
    expect(result.current.history[0]).toHaveProperty('accuracy');
    expect(result.current.history[0]).toHaveProperty('answers');
  });

  it('persists history to localStorage', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chemprep_history',
      expect.any(String)
    );
  });

  it('clears history', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());
    expect(result.current.history).toHaveLength(1);

    act(() => result.current.clearHistory());
    expect(result.current.history).toHaveLength(0);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('chemprep_history');
  });

  it('exits quiz and resets state', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(1));
    act(() => result.current.nextQuestion());
    act(() => result.current.toggleMarkForReview());

    act(() => result.current.exitQuiz());
    expect(result.current.screen).toBe('dashboard');
    expect(result.current.quizActive).toBe(false);
    expect(result.current.currentIdx).toBe(0);
    expect(result.current.answers).toEqual([]);
    expect(Object.keys(result.current.userAnswers)).toHaveLength(0);
    expect(result.current.markedForReview.size).toBe(0);
  });

  it('computes overallAccuracy correctly', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    // Answer all 20 easy questions with correct answer
    for (let i = 0; i < 20; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans));
      if (i < 19) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());
    expect(result.current.overallAccuracy).toBe(100);
  });

  it('computes unansweredCount correctly', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    // answer 5 of 20
    for (let i = 0; i < 5; i++) {
      act(() => result.current.handleSelect(0));
      act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());
    expect(result.current.unansweredCount).toBe(15);
  });

  it('getConceptStats returns stats per concept', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    const stats = result.current.conceptStats;
    expect(stats.length).toBeGreaterThan(0);
    stats.forEach(s => {
      expect(s).toHaveProperty('concept');
      expect(s).toHaveProperty('accuracy');
      expect(s).toHaveProperty('total');
      expect(s).toHaveProperty('correct');
    });
  });

  it('getMistakePatterns returns guessing and confusion', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    const patterns = result.current.getMistakePatterns();
    expect(patterns).toHaveProperty('guessing');
    expect(patterns).toHaveProperty('confusion');
    expect(patterns).toHaveProperty('total');
  });

  it('getWrongQuestions excludes unanswered', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    // answer Q1 wrong (select wrong option)
    const q = result.current.quizQuestions[0];
    const wrongOpt = q.ans === 0 ? 1 : 0;
    act(() => result.current.handleSelect(wrongOpt));
    act(() => result.current.finishQuiz());

    const wrong = result.current.getWrongQuestions();
    expect(wrong.length).toBe(1);
    expect(wrong[0].id).toBe(q.id);
  });

  it('viewAttempt loads past attempt data', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(1));
    act(() => result.current.finishQuiz());

    const attempt = result.current.history[0];
    act(() => result.current.setScreen('dashboard'));

    act(() => result.current.viewAttempt(attempt));
    expect(result.current.screen).toBe('analytics');
    expect(result.current.answers).toEqual(attempt.answers);
    expect(result.current.totalTimer).toBe(attempt.totalTime);
  });

  it('formatTime formats seconds correctly', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.formatTime(0)).toBe('0:00');
    expect(result.current.formatTime(65)).toBe('1:05');
    expect(result.current.formatTime(3600)).toBe('60:00');
    expect(result.current.formatTime(125)).toBe('2:05');
  });

  it('retryWrong starts quiz with only wrong questions', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    // answer Q1 wrong
    const q = result.current.quizQuestions[0];
    const wrongOpt = q.ans === 0 ? 1 : 0;
    act(() => result.current.handleSelect(wrongOpt));
    act(() => result.current.finishQuiz());

    act(() => result.current.retryWrong());
    expect(result.current.screen).toBe('quiz');
    expect(result.current.quizQuestions).toHaveLength(1);
    expect(result.current.quizQuestions[0].id).toBe(q.id);
  });

  it('preserves answers across navigation', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(2));
    act(() => result.current.nextQuestion());
    act(() => result.current.handleSelect(1));
    act(() => result.current.prevQuestion());
    // Q1 answer should still be 2
    expect(result.current.userAnswers[0]).toBe(2);
    expect(result.current.userAnswers[1]).toBe(1);
  });
});
