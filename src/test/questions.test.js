import { describe, it, expect } from 'vitest';
import { QUESTIONS, CONCEPTS, CONCEPT_COLORS, DIFF_MAP } from '../data/questions';

describe('Questions Data Integrity', () => {
  it('has exactly 60 questions', () => {
    expect(QUESTIONS).toHaveLength(60);
  });

  it('each question has all required fields', () => {
    const requiredKeys = ['id', 'q', 'opts', 'ans', 'exp', 'concept', 'diff', 'ref'];
    QUESTIONS.forEach((q, i) => {
      requiredKeys.forEach(key => {
        expect(q, `Q${i + 1} missing "${key}"`).toHaveProperty(key);
      });
    });
  });

  it('each question has exactly 4 options', () => {
    QUESTIONS.forEach((q) => {
      expect(q.opts, `Q${q.id} should have 4 options`).toHaveLength(4);
    });
  });

  it('answer index is valid (0-3) for every question', () => {
    QUESTIONS.forEach((q) => {
      expect(q.ans, `Q${q.id} ans=${q.ans} out of range`).toBeGreaterThanOrEqual(0);
      expect(q.ans, `Q${q.id} ans=${q.ans} out of range`).toBeLessThanOrEqual(3);
    });
  });

  it('has unique IDs', () => {
    const ids = QUESTIONS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('IDs are sequential from 1 to 60', () => {
    QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
    });
  });

  it('difficulty distribution: 20 easy, 25 medium, 15 hard', () => {
    const easy = QUESTIONS.filter(q => q.diff === 'easy');
    const medium = QUESTIONS.filter(q => q.diff === 'medium');
    const hard = QUESTIONS.filter(q => q.diff === 'hard');
    expect(easy).toHaveLength(20);
    expect(medium).toHaveLength(25);
    expect(hard).toHaveLength(15);
  });

  it('questions are ordered by difficulty (easy → medium → hard)', () => {
    const order = { easy: 0, medium: 1, hard: 2 };
    for (let i = 1; i < QUESTIONS.length; i++) {
      expect(
        order[QUESTIONS[i].diff],
        `Q${QUESTIONS[i].id} (${QUESTIONS[i].diff}) appears after Q${QUESTIONS[i - 1].id} (${QUESTIONS[i - 1].diff})`
      ).toBeGreaterThanOrEqual(order[QUESTIONS[i - 1].diff]);
    }
  });

  it('all difficulty values are valid', () => {
    QUESTIONS.forEach(q => {
      expect(['easy', 'medium', 'hard']).toContain(q.diff);
    });
  });

  it('no empty question text or options', () => {
    QUESTIONS.forEach(q => {
      expect(q.q.trim().length, `Q${q.id} has empty question`).toBeGreaterThan(0);
      q.opts.forEach((opt, i) => {
        expect(opt.trim().length, `Q${q.id} option ${i} is empty`).toBeGreaterThan(0);
      });
    });
  });

  it('no empty explanations', () => {
    QUESTIONS.forEach(q => {
      expect(q.exp.trim().length, `Q${q.id} has empty explanation`).toBeGreaterThan(0);
    });
  });

  it('every concept used in questions has a color', () => {
    CONCEPTS.forEach(c => {
      expect(CONCEPT_COLORS, `Missing color for concept "${c}"`).toHaveProperty(c);
    });
  });

  it('DIFF_MAP covers all difficulties', () => {
    expect(DIFF_MAP).toHaveProperty('easy');
    expect(DIFF_MAP).toHaveProperty('medium');
    expect(DIFF_MAP).toHaveProperty('hard');
  });

  it('has NCERT trap questions', () => {
    const ncertQs = QUESTIONS.filter(q => q.ncert === true);
    expect(ncertQs.length).toBeGreaterThan(0);
  });

  it('ncert field is boolean for all questions', () => {
    QUESTIONS.forEach(q => {
      expect(typeof q.ncert, `Q${q.id} ncert is not boolean`).toBe('boolean');
    });
  });
});
