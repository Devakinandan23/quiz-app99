/**
 * INVARIANT TESTS
 * ===============
 * These tests verify properties that must ALWAYS hold true regardless of
 * user behavior. A failure here means a production scoring bug that would
 * give students wrong results.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../hooks/useQuiz';
import { QUESTIONS } from '../data/questions';

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

describe('INVARIANT: answers.length === quizQuestions.length after finishQuiz', () => {
  // Why: If this breaks, scoring denominator is wrong → misleading accuracy %

  it('holds when answering all questions', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    for (let i = 0; i < 60; i++) {
      act(() => result.current.handleSelect(i % 4));
      if (i < 59) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());
    expect(result.current.answers.length).toBe(result.current.quizQuestions.length);
  });

  it('holds when answering zero questions', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());
    expect(result.current.answers.length).toBe(60);
  });

  it('holds for easy-only quiz', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());
    expect(result.current.answers.length).toBe(20);
  });

  it('holds for medium-only quiz', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('medium'));
    act(() => result.current.finishQuiz());
    expect(result.current.answers.length).toBe(25);
  });

  it('holds for hard-only quiz', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('hard'));
    act(() => result.current.finishQuiz());
    expect(result.current.answers.length).toBe(15);
  });
});

describe('INVARIANT: correct + wrong + unanswered === totalQuestions', () => {
  // Why: If a question is double-counted or missing, the student sees phantom errors

  it('holds with mixed answer patterns', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    // Answer Q1-Q10 correctly, Q11-Q20 wrong, leave rest unanswered
    for (let i = 0; i < 10; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans));
      act(() => result.current.nextQuestion());
    }
    for (let i = 10; i < 20; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans === 0 ? 1 : 0));
      if (i < 19) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const correct = result.current.answers.filter(a => a.isCorrect).length;
    const wrong = result.current.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
    const unanswered = result.current.answers.filter(a => a.isUnanswered).length;
    expect(correct + wrong + unanswered).toBe(60);
  });

  it('holds when all questions are unanswered', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());

    const correct = result.current.answers.filter(a => a.isCorrect).length;
    const wrong = result.current.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
    const unanswered = result.current.answers.filter(a => a.isUnanswered).length;
    expect(correct).toBe(0);
    expect(wrong).toBe(0);
    expect(unanswered).toBe(60);
    expect(correct + wrong + unanswered).toBe(60);
  });

  it('holds when all questions are answered correctly', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    for (let i = 0; i < 20; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans));
      if (i < 19) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const correct = result.current.answers.filter(a => a.isCorrect).length;
    const wrong = result.current.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
    const unanswered = result.current.answers.filter(a => a.isUnanswered).length;
    expect(correct).toBe(20);
    expect(wrong).toBe(0);
    expect(unanswered).toBe(0);
  });

  it('no question can be both correct and unanswered', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    result.current.answers.forEach(a => {
      if (a.isCorrect) expect(a.isUnanswered).toBe(false);
      if (a.isUnanswered) expect(a.isCorrect).toBe(false);
    });
  });
});

describe('INVARIANT: overallAccuracy is 0-100 and never NaN', () => {
  // Why: NaN or out-of-range accuracy breaks the results display and misleads students

  it('is 0 when no answers exist', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.overallAccuracy).toBe(0);
    expect(Number.isNaN(result.current.overallAccuracy)).toBe(false);
  });

  it('is 0 when all answers are wrong', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    for (let i = 0; i < 20; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans === 0 ? 1 : 0));
      if (i < 19) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());
    expect(result.current.overallAccuracy).toBe(0);
  });

  it('is 100 when all answers are correct', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    for (let i = 0; i < 20; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans));
      if (i < 19) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());
    expect(result.current.overallAccuracy).toBe(100);
  });

  it('is 0 when all questions are unanswered (not NaN)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());
    expect(result.current.overallAccuracy).toBe(0);
    expect(Number.isNaN(result.current.overallAccuracy)).toBe(false);
  });

  it('is always a whole number (rounded)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    // Answer 1 of 60 correct → 1.67% should round to 2%
    const q = result.current.quizQuestions[0];
    act(() => result.current.handleSelect(q.ans));
    act(() => result.current.finishQuiz());
    expect(Number.isInteger(result.current.overallAccuracy)).toBe(true);
  });
});

describe('INVARIANT: userAnswers values are valid option indices (0-3) or undefined', () => {
  // Why: An invalid selection index would crash option rendering or corrupt scoring

  it('handleSelect only stores integer 0-3', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    [0, 1, 2, 3].forEach(val => {
      act(() => result.current.handleSelect(val));
      expect(result.current.userAnswers[0]).toBe(val);
      expect(Number.isInteger(result.current.userAnswers[0])).toBe(true);
    });
  });

  it('clearResponse makes value undefined, not null', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(2));
    act(() => result.current.clearResponse());
    expect(result.current.userAnswers[0]).toBeUndefined();
    expect(0 in result.current.userAnswers).toBe(false);
  });
});

describe('INVARIANT: history entries are immutable after creation', () => {
  // Why: Viewing a past attempt must never modify the stored record

  it('viewAttempt does not mutate the history entry', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(1));
    act(() => result.current.finishQuiz());

    const originalAttempt = result.current.history[0];
    const snapshotBefore = JSON.stringify(originalAttempt);

    act(() => result.current.viewAttempt(originalAttempt));

    const snapshotAfter = JSON.stringify(result.current.history[0]);
    expect(snapshotAfter).toBe(snapshotBefore);
  });

  it('multiple viewAttempt calls do not accumulate mutations', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    const attempt = result.current.history[0];
    const snap = JSON.stringify(attempt);

    // View 3 times
    act(() => result.current.viewAttempt(attempt));
    act(() => result.current.viewAttempt(attempt));
    act(() => result.current.viewAttempt(attempt));

    expect(JSON.stringify(result.current.history[0])).toBe(snap);
  });
});

describe('INVARIANT: markedForReview is independent of scoring', () => {
  // Why: Marking should never affect whether an answer is correct/wrong/unanswered

  it('marking does not change answer correctness', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));

    // Answer Q1 correctly and mark it
    const q = result.current.quizQuestions[0];
    act(() => result.current.handleSelect(q.ans));
    act(() => result.current.toggleMarkForReview());
    act(() => result.current.finishQuiz());

    const a = result.current.answers.find(a => a.qId === q.id);
    expect(a.isCorrect).toBe(true);
    expect(a.isUnanswered).toBe(false);
  });

  it('marking without answering keeps question as unanswered', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('easy'));

    // Just mark Q1 but don't answer
    act(() => result.current.toggleMarkForReview());
    act(() => result.current.finishQuiz());

    const a = result.current.answers[0];
    expect(a.isUnanswered).toBe(true);
    expect(a.isCorrect).toBe(false);
  });
});

describe('INVARIANT: navigation never loses answers', () => {
  // Why: Students lose trust if answers disappear when revisiting questions

  it('survives forward-back-forward navigation', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    act(() => result.current.handleSelect(2)); // Q1 = 2
    act(() => result.current.nextQuestion());
    act(() => result.current.handleSelect(0)); // Q2 = 0
    act(() => result.current.nextQuestion());
    act(() => result.current.handleSelect(3)); // Q3 = 3
    act(() => result.current.prevQuestion());   // back to Q2
    act(() => result.current.prevQuestion());   // back to Q1
    act(() => result.current.nextQuestion());   // forward to Q2
    act(() => result.current.nextQuestion());   // forward to Q3

    expect(result.current.userAnswers[0]).toBe(2);
    expect(result.current.userAnswers[1]).toBe(0);
    expect(result.current.userAnswers[2]).toBe(3);
  });

  it('survives random goToQuestion jumps', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    act(() => result.current.handleSelect(1)); // Q1 = 1
    act(() => result.current.goToQuestion(30));
    act(() => result.current.handleSelect(3)); // Q31 = 3
    act(() => result.current.goToQuestion(59));
    act(() => result.current.handleSelect(0)); // Q60 = 0
    act(() => result.current.goToQuestion(0)); // back to Q1

    expect(result.current.userAnswers[0]).toBe(1);
    expect(result.current.userAnswers[30]).toBe(3);
    expect(result.current.userAnswers[59]).toBe(0);
  });

  it('answer survives clear-reanswer cycle', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    act(() => result.current.handleSelect(2));
    act(() => result.current.clearResponse());
    act(() => result.current.handleSelect(3));

    expect(result.current.userAnswers[0]).toBe(3);
  });
});

describe('INVARIANT: question data ordering', () => {
  // Why: Sidebar sections and difficulty filters depend on correct ordering

  it('questions are ordered easy → medium → hard', () => {
    const order = { easy: 0, medium: 1, hard: 2 };
    for (let i = 1; i < QUESTIONS.length; i++) {
      expect(
        order[QUESTIONS[i].diff],
        `Q${QUESTIONS[i].id} (${QUESTIONS[i].diff}) should not appear before Q${QUESTIONS[i - 1].id} (${QUESTIONS[i - 1].diff})`
      ).toBeGreaterThanOrEqual(order[QUESTIONS[i - 1].diff]);
    }
  });

  it('IDs are sequential 1-60', () => {
    QUESTIONS.forEach((q, i) => expect(q.id).toBe(i + 1));
  });
});
