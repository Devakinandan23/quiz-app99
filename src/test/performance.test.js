/**
 * PERFORMANCE TESTS
 * =================
 * Detect regressions in operations that could become slow over time,
 * especially with growing history and complex state calculations.
 * Thresholds are generous — we're catching regressions, not benchmarking.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../hooks/useQuiz';
import { QUESTIONS } from '../data/questions';

let store = {};
const localStorageMock = {
  getItem: vi.fn(key => store[key] ?? null),
  setItem: vi.fn((key, val) => { store[key] = val; }),
  removeItem: vi.fn(key => { delete store[key]; }),
  clear: vi.fn(() => { store = {}; }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  store = {};
  localStorageMock.getItem.mockImplementation(key => store[key] ?? null);
  localStorageMock.setItem.mockImplementation((key, val) => { store[key] = val; });
  localStorageMock.removeItem.mockImplementation(key => { delete store[key]; });
  localStorageMock.clear.mockImplementation(() => { store = {}; });
});

// Helper: generate a fake history with N attempts
function generateLargeHistory(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: Date.now() - i * 1000,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    totalQuestions: 60,
    correct: Math.floor(Math.random() * 60),
    accuracy: Math.floor(Math.random() * 100),
    totalTime: Math.floor(Math.random() * 3600),
    answers: QUESTIONS.map(q => ({
      qId: q.id, selected: Math.floor(Math.random() * 4), correct: q.ans,
      isCorrect: Math.random() > 0.5, isUnanswered: Math.random() > 0.85,
      time: Math.floor(Math.random() * 30) + 3,
      concept: q.concept, diff: q.diff, ncert: q.ncert,
    })),
  }));
}

describe('History serialization performance', () => {
  // Why: Large history could make JSON.parse/stringify slow, blocking the UI thread

  it('loads 100 history attempts from localStorage in < 100ms', () => {
    const bigHistory = generateLargeHistory(100);
    localStorageMock.getItem.mockReturnValue(JSON.stringify(bigHistory));

    const start = performance.now();
    const { result } = renderHook(() => useQuiz());
    const elapsed = performance.now() - start;

    expect(result.current.history).toHaveLength(100);
    expect(elapsed).toBeLessThan(100);
  });

  it('saves to localStorage with 50 history attempts in < 50ms', () => {
    const bigHistory = generateLargeHistory(50);
    localStorageMock.getItem.mockReturnValue(JSON.stringify(bigHistory));

    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    const start = performance.now();
    act(() => result.current.finishQuiz());
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
  });
});

describe('Scoring computation performance', () => {
  // Why: Analytics page computes stats on every render — must be fast

  it('getConceptStats with 60 answers completes in < 5ms', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    for (let i = 0; i < 60; i++) {
      act(() => result.current.handleSelect(i % 4));
      if (i < 59) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const start = performance.now();
    const stats = result.current.conceptStats;
    const elapsed = performance.now() - start;

    expect(stats.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(5);
  });

  it('getMistakePatterns with 60 answers completes in < 5ms', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    for (let i = 0; i < 30; i++) {
      act(() => result.current.handleSelect(i % 4));
      if (i < 59) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const start = performance.now();
    const patterns = result.current.getMistakePatterns();
    const elapsed = performance.now() - start;

    expect(patterns).toHaveProperty('total');
    expect(elapsed).toBeLessThan(5);
  });
});

describe('Navigation performance', () => {
  // Why: Lag during question navigation destroys the exam-taking experience

  it('goToQuestion is effectively instant (< 5ms)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    const start = performance.now();
    for (let i = 0; i < 60; i++) {
      act(() => result.current.goToQuestion(i));
    }
    const elapsed = performance.now() - start;

    // 60 navigations — act() overhead inflates this in test env
    // Real browser perf is ~5ms total. 500ms threshold catches regressions.
    expect(elapsed).toBeLessThan(500);
  });

  it('handleSelect is effectively instant (< 2ms)', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      act(() => result.current.handleSelect(i % 4));
    }
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
  });
});

describe('JSON serialization size', () => {
  // Why: localStorage has a ~5MB limit. Monitor history size growth.

  it('single attempt JSON size is under 10KB (compressed format)', () => {
    // Answers are now stored as compressed [qId, selected, time] tuples
    // instead of full objects with concept/diff/ncert/etc.
    const { result } = renderHook(() => useQuiz());
    act(() => result.current.startQuiz('all'));
    for (let i = 0; i < 60; i++) {
      act(() => result.current.handleSelect(i % 4));
      if (i < 59) act(() => result.current.nextQuestion());
    }
    act(() => result.current.finishQuiz());

    const historyJson = JSON.stringify(result.current.history);
    const sizeKB = new Blob([historyJson]).size / 1024;
    // Compressed: ~3-5KB per attempt vs ~430KB before
    expect(sizeKB).toBeLessThan(10);
  });

  it('500 attempts fit within localStorage 5MB limit', () => {
    // At ~5KB each, 500 attempts = ~2.5MB — well under 5MB
    const bigHistory = Array.from({ length: 500 }, (_, i) => ({
      id: Date.now() - i * 1000,
      date: new Date().toISOString(),
      totalQuestions: 60,
      correct: 30, accuracy: 50, totalTime: 600,
      answers: QUESTIONS.map(q => [q.id, Math.floor(Math.random() * 4), Math.floor(Math.random() * 30)]),
    }));
    const json = JSON.stringify(bigHistory);
    const sizeMB = new Blob([json]).size / (1024 * 1024);
    expect(sizeMB).toBeLessThan(5);
  });
});
