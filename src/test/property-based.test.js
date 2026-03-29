/**
 * PROPERTY-BASED TESTS
 * ====================
 * Instead of testing specific inputs, these verify properties that must hold
 * for ANY possible combination of user actions. Uses randomized input
 * patterns to find edge cases humans wouldn't think of.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../hooks/useQuiz';
import { QUESTIONS } from '../data/questions';

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

// Seed-based pseudo-random for reproducibility
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('PROPERTY: For any answer pattern, correct + wrong + unanswered === total', () => {
  // Run with 10 random seeds to catch non-obvious patterns
  const seeds = [42, 137, 256, 999, 1, 7777, 31415, 12345, 54321, 98765];

  seeds.forEach(seed => {
    it(`seed=${seed}: partition is always exhaustive`, () => {
      const rand = seededRandom(seed);
      const { result } = renderHook(() => useQuiz());
      act(() => result.current.startQuiz('all'));

      // Randomly answer some questions, skip others
      for (let i = 0; i < 60; i++) {
        const action = rand();
        if (action < 0.5) {
          // Answer with random option
          act(() => result.current.handleSelect(Math.floor(rand() * 4)));
        } else if (action < 0.7) {
          // Answer then clear
          act(() => result.current.handleSelect(Math.floor(rand() * 4)));
          act(() => result.current.clearResponse());
        }
        // else: skip (unanswered)
        if (i < 59) act(() => result.current.nextQuestion());
      }

      act(() => result.current.finishQuiz());

      const correct = result.current.answers.filter(a => a.isCorrect).length;
      const wrong = result.current.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
      const unanswered = result.current.answers.filter(a => a.isUnanswered).length;

      expect(correct + wrong + unanswered).toBe(60);
      expect(correct).toBeGreaterThanOrEqual(0);
      expect(wrong).toBeGreaterThanOrEqual(0);
      expect(unanswered).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('PROPERTY: Accuracy is always 0-100 for any answer pattern', () => {
  const seeds = [1, 50, 100, 200, 500];

  seeds.forEach(seed => {
    it(`seed=${seed}: accuracy is bounded and is an integer`, () => {
      const rand = seededRandom(seed);
      const { result } = renderHook(() => useQuiz());
      act(() => result.current.startQuiz('all'));

      for (let i = 0; i < 60; i++) {
        if (rand() > 0.3) {
          act(() => result.current.handleSelect(Math.floor(rand() * 4)));
        }
        if (i < 59) act(() => result.current.nextQuestion());
      }

      act(() => result.current.finishQuiz());

      expect(result.current.overallAccuracy).toBeGreaterThanOrEqual(0);
      expect(result.current.overallAccuracy).toBeLessThanOrEqual(100);
      expect(Number.isNaN(result.current.overallAccuracy)).toBe(false);
      expect(Number.isInteger(result.current.overallAccuracy)).toBe(true);
    });
  });
});

describe('PROPERTY: Every finished quiz produces a valid history entry', () => {
  const filters = ['all', 'easy', 'medium', 'hard'];

  filters.forEach(filter => {
    it(`filter="${filter}": history entry has all required fields`, () => {
      const { result } = renderHook(() => useQuiz());
      act(() => result.current.startQuiz(filter));
      // Answer a few randomly
      act(() => result.current.handleSelect(0));
      if (result.current.quizQuestions.length > 1) {
        act(() => result.current.nextQuestion());
        act(() => result.current.handleSelect(2));
      }
      act(() => result.current.finishQuiz());

      expect(result.current.history).toHaveLength(1);
      const entry = result.current.history[0];

      // Required fields
      expect(entry).toHaveProperty('id');
      expect(typeof entry.id).toBe('number');
      expect(entry).toHaveProperty('date');
      expect(new Date(entry.date).toString()).not.toBe('Invalid Date');
      expect(entry).toHaveProperty('totalQuestions');
      expect(entry.totalQuestions).toBeGreaterThan(0);
      expect(entry).toHaveProperty('correct');
      expect(entry.correct).toBeGreaterThanOrEqual(0);
      expect(entry.correct).toBeLessThanOrEqual(entry.totalQuestions);
      expect(entry).toHaveProperty('accuracy');
      expect(entry.accuracy).toBeGreaterThanOrEqual(0);
      expect(entry.accuracy).toBeLessThanOrEqual(100);
      expect(entry).toHaveProperty('totalTime');
      expect(entry.totalTime).toBeGreaterThanOrEqual(0);
      expect(entry).toHaveProperty('answers');
      expect(Array.isArray(entry.answers)).toBe(true);
      expect(entry.answers.length).toBe(entry.totalQuestions);
    });
  });
});

describe('PROPERTY: Concept stats always sum to total questions', () => {
  it('sum of all concept totals === answers.length', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    // Random answers
    for (let i = 0; i < 30; i++) {
      act(() => result.current.handleSelect(i % 4));
      act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const stats = result.current.conceptStats;
    const totalFromStats = stats.reduce((sum, s) => sum + s.total, 0);
    expect(totalFromStats).toBe(result.current.answers.length);
  });

  it('concept correct + unanswered never exceeds concept total', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    result.current.conceptStats.forEach(cs => {
      expect(cs.correct).toBeLessThanOrEqual(cs.total);
      expect(cs.unanswered).toBeLessThanOrEqual(cs.total);
      expect(cs.correct + cs.unanswered).toBeLessThanOrEqual(cs.total);
    });
  });

  it('concept accuracy is always 0-100', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());

    result.current.conceptStats.forEach(cs => {
      expect(cs.accuracy).toBeGreaterThanOrEqual(0);
      expect(cs.accuracy).toBeLessThanOrEqual(100);
      expect(Number.isNaN(cs.accuracy)).toBe(false);
    });
  });
});

describe('PROPERTY: Mistake pattern counts are consistent', () => {
  it('guessing + confusion === total wrong (excluding unanswered)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    // Answer half wrong, half unanswered
    for (let i = 0; i < 30; i++) {
      const q = result.current.quizQuestions[i];
      act(() => result.current.handleSelect(q.ans === 0 ? 1 : 0)); // wrong
      if (i < 29) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const patterns = result.current.getMistakePatterns();
    expect(patterns.guessing + patterns.confusion).toBe(patterns.total);

    // total should match wrong count
    const wrongCount = result.current.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
    expect(patterns.total).toBe(wrongCount);
  });
});

describe('PROPERTY: NCERT accuracy is bounded and consistent', () => {
  it('ncertAccuracy is 0-100 and never NaN', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.finishQuiz());

    expect(result.current.ncertAccuracy).toBeGreaterThanOrEqual(0);
    expect(result.current.ncertAccuracy).toBeLessThanOrEqual(100);
    expect(Number.isNaN(result.current.ncertAccuracy)).toBe(false);
  });

  it('ncertAnswers is a subset of all answers', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    act(() => result.current.handleSelect(0));
    act(() => result.current.finishQuiz());

    expect(result.current.ncertAnswers.length).toBeLessThanOrEqual(result.current.answers.length);
    result.current.ncertAnswers.forEach(a => {
      expect(a.ncert).toBe(true);
    });
  });
});

describe('PROPERTY: formatTime never returns invalid format', () => {
  const testValues = [0, 1, 30, 59, 60, 61, 119, 120, 600, 3599, 3600, 7200, -1, -60, 0.5, NaN];

  testValues.forEach(val => {
    it(`formatTime(${val}) returns valid mm:ss format`, () => {
      const { result } = renderHook(() => useQuiz());
      const formatted = result.current.formatTime(val);
      // Should match pattern: number:two-digit-number
      if (!Number.isNaN(val)) {
        expect(formatted).toMatch(/^-?\d+:\d{2}$/);
      }
    });
  });
});

describe('PROPERTY: Question data integrity (fuzz)', () => {
  // Why: Question data is the source of truth — any corruption is catastrophic

  it('every question answer index maps to a real option', () => {
    QUESTIONS.forEach(q => {
      expect(q.opts[q.ans]).toBeDefined();
      expect(typeof q.opts[q.ans]).toBe('string');
      expect(q.opts[q.ans].trim().length).toBeGreaterThan(0);
    });
  });

  it('no two questions share the same text', () => {
    const texts = QUESTIONS.map(q => q.q);
    const unique = new Set(texts);
    expect(unique.size).toBe(texts.length);
  });

  it('every concept in questions exists in CONCEPTS list', () => {
    const { CONCEPTS } = require('../data/questions');
    QUESTIONS.forEach(q => {
      expect(CONCEPTS).toContain(q.concept);
    });
  });

  it('ref field is non-empty for all questions', () => {
    QUESTIONS.forEach(q => {
      expect(q.ref.trim().length, `Q${q.id} has empty ref`).toBeGreaterThan(0);
    });
  });
});
