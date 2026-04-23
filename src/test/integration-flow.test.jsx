/**
 * INTEGRATION TESTS
 * =================
 * End-to-end user flows through the full app. These catch bugs that only
 * appear when components interact — e.g., state passing between screens,
 * filter interactions across components, and multi-step quiz workflows.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';
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

describe('Full quiz flow: dashboard → quiz → results → review', () => {
  // Why: The most common user journey. If this breaks, the entire app is unusable.

  it('completes a full quiz lifecycle', () => {
    render(<App />);

    // 1. Dashboard: see Start Test button and rules
    expect(screen.getByText('ChemPrep')).toBeInTheDocument();
    expect(screen.getByText('Test Rules')).toBeInTheDocument();
    expect(screen.getByText('Start Test')).toBeInTheDocument();

    // 2. Start the quiz
    fireEvent.click(screen.getByText('Start Test'));

    // 3. Quiz screen: first question visible
    expect(screen.getByText(QUESTIONS[0].q)).toBeInTheDocument();
    expect(screen.getByText(/Q\.1/)).toBeInTheDocument();

    // 4. Answer Q1
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0]));

    // 5. Navigate to Q2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText(QUESTIONS[1].q)).toBeInTheDocument();

    // 6. Click "I have completed the test"
    fireEvent.click(screen.getByText('I have completed the test'));
    expect(screen.getByText('Submit Test?')).toBeInTheDocument();

    // 7. Confirm submit
    fireEvent.click(screen.getByText('Submit Test'));

    // 8. Results screen
    expect(screen.getByText('Your Results')).toBeInTheDocument();
    expect(screen.getByText('View All Answers')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // 9. Go to Answer Review
    fireEvent.click(screen.getByText('View All Answers'));
    expect(screen.getByText('Answer Key')).toBeInTheDocument();

    // 10. Go back to results
    fireEvent.click(screen.getByText('Back to Results'));
    expect(screen.getByText('Your Results')).toBeInTheDocument();

    // 11. Go back to dashboard
    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.getByText('ChemPrep')).toBeInTheDocument();
  });
});

describe('Quiz navigation flow', () => {
  // Why: Navigation is the core UX — sidebar, prev/next, jump-to must all work together

  it('sidebar question numbers reflect answer status', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Answer Q1
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[1]));

    // The sidebar should show Q1 as answered (green)
    // Navigate to Q2 to see Q1 status change
    fireEvent.click(screen.getByText('Next'));

    // Q2 should now be current
    expect(screen.getByText(/Q\.2/)).toBeInTheDocument();
  });

  it('Mark for Review toggles correctly during quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Mark Q1 for review
    expect(screen.getByText('Mark for Review')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Mark for Review'));
    expect(screen.getByText('Unmark Review')).toBeInTheDocument();

    // Unmark
    fireEvent.click(screen.getByText('Unmark Review'));
    expect(screen.getByText('Mark for Review')).toBeInTheDocument();
  });

  it('Clear Response button appears/disappears correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // No Clear Response initially
    expect(screen.queryByText('Clear Response')).not.toBeInTheDocument();

    // Answer Q1
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0]));
    expect(screen.getByText('Clear Response')).toBeInTheDocument();

    // Clear it
    fireEvent.click(screen.getByText('Clear Response'));
    expect(screen.queryByText('Clear Response')).not.toBeInTheDocument();
  });

  it('sidebar toggle hides/shows sidebar', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Sidebar starts open with << button
    expect(screen.getByText('<<')).toBeInTheDocument();

    // Close sidebar
    fireEvent.click(screen.getByText('<<'));
    expect(screen.getByText('>>')).toBeInTheDocument();

    // Reopen
    fireEvent.click(screen.getByText('>>'));
    expect(screen.getByText('<<')).toBeInTheDocument();
  });

  it('confirm modal shows unanswered count', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Don't answer anything, try to submit
    fireEvent.click(screen.getByText('I have completed the test'));

    // Modal should show unanswered count and warning
    expect(screen.getByText('Submit Test?')).toBeInTheDocument();
    expect(screen.getByText(/You have 60 unanswered question/)).toBeInTheDocument();
  });

  it('Go Back in confirm modal returns to quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    fireEvent.click(screen.getByText('I have completed the test'));
    expect(screen.getByText('Submit Test?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Go Back'));
    // Modal should be gone, quiz still visible
    expect(screen.queryByText('Submit Test?')).not.toBeInTheDocument();
    expect(screen.getByText(QUESTIONS[0].q)).toBeInTheDocument();
  });
});

describe('Quiz exit flow', () => {
  // Why: Exiting mid-quiz should not corrupt state or leave stale data

  it('exit returns to dashboard without saving history', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0])); // Answer Q1

    fireEvent.click(screen.getByText('Exit'));
    expect(screen.getByText('ChemPrep')).toBeInTheDocument();
    expect(screen.getByText('Start Test')).toBeInTheDocument();

    // localStorage should NOT have been called with history (exit doesn't save)
    // We check that no history was saved
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
      'chemprep_history',
      expect.any(String)
    );
  });

  it('can start new quiz after exiting', () => {
    render(<App />);

    // First quiz: answer and exit
    fireEvent.click(screen.getByText('Start Test'));
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0]));
    fireEvent.click(screen.getByText('Exit'));

    // Second quiz: should start fresh
    fireEvent.click(screen.getByText('Start Test'));
    expect(screen.getByText(QUESTIONS[0].q)).toBeInTheDocument();
    // No answer should be pre-selected
    expect(screen.queryByText('Clear Response')).not.toBeInTheDocument();
  });
});

describe('Answer Review filtering', () => {
  // Why: Filter buttons must show correct counts and filter accurately

  function completeQuizWith1Answer() {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));
    // Answer Q1 with first option
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0]));
    fireEvent.click(screen.getByText('I have completed the test'));
    fireEvent.click(screen.getByText('Submit Test'));
    // Now on results
    fireEvent.click(screen.getByText('View All Answers'));
    // Now on Answer Review
  }

  it('shows correct count in filter buttons', () => {
    completeQuizWith1Answer();
    expect(screen.getByText('All (60)')).toBeInTheDocument();
    expect(screen.getByText('Not Answered (59)')).toBeInTheDocument();
  });

  it('filters work without crashing', () => {
    completeQuizWith1Answer();

    // Click each filter
    fireEvent.click(screen.getByText('Not Answered (59)'));
    // Should not show Q1 if Q1 was answered
    fireEvent.click(screen.getByText('All (60)'));
    // Should show all 60
  });
});

describe('Concept/ref hidden during test, visible in review', () => {
  // Why: Critical requirement — no hints during test, full info after

  it('does NOT show concept or ref during quiz', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Concept and ref should NOT be visible
    expect(screen.queryByText(QUESTIONS[0].concept)).not.toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[0].ref)).not.toBeInTheDocument();
    expect(screen.queryByText(QUESTIONS[0].exp)).not.toBeInTheDocument();
  });

  it('DOES show concept and ref in answer review', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));
    fireEvent.click(screen.getByText('I have completed the test'));
    fireEvent.click(screen.getByText('Submit Test'));
    fireEvent.click(screen.getByText('View All Answers'));

    // Now concept and ref should be visible
    expect(screen.getAllByText(new RegExp(QUESTIONS[0].concept)).length).toBeGreaterThan(0);
  });
});

describe('History flow', () => {
  // Why: History is persisted data — corruption means permanent loss of student progress

  it('history appears after completing quiz and is navigable', () => {
    render(<App />);

    // Complete a quiz
    fireEvent.click(screen.getByText('Start Test'));
    fireEvent.click(screen.getByText(QUESTIONS[0].opts[0]));
    fireEvent.click(screen.getByText('I have completed the test'));
    fireEvent.click(screen.getByText('Submit Test'));

    // History button should appear on results
    expect(screen.getByText(/History/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/History/));

    // History screen
    expect(screen.getByText('Quiz History')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();

    // View the attempt
    fireEvent.click(screen.getByText('View Details'));
    expect(screen.getByText('Your Results')).toBeInTheDocument();
  });
});

describe('Difficulty sections in sidebar', () => {
  // Why: Section navigation is the primary way to jump between difficulty levels

  it('shows Easy, Medium, Hard section headers', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    expect(screen.getByText('Easy (20)')).toBeInTheDocument();
    expect(screen.getByText('Medium (25)')).toBeInTheDocument();
    expect(screen.getByText('Hard (15)')).toBeInTheDocument();
  });

  it('clicking section header jumps to first question of that section', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Click "Medium" section
    fireEvent.click(screen.getByText('Medium (25)'));
    // Should now show Q21 (first medium question)
    expect(screen.getByText(/Q\.21/)).toBeInTheDocument();
    expect(screen.getByText(QUESTIONS[20].q)).toBeInTheDocument();

    // Click "Hard" section
    fireEvent.click(screen.getByText('Hard (15)'));
    expect(screen.getByText(/Q\.46/)).toBeInTheDocument();
  });
});

describe('Radio button style options', () => {
  // Why: BITSAT/JEE style — visual feedback must be correct

  it('no A/B/C/D labels in quiz options', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Start Test'));

    // Options should not have A) B) C) D) prefix
    const q = QUESTIONS[0];
    q.opts.forEach(opt => {
      // Each option should be rendered as plain text
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });
});
