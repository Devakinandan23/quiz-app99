import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportAsCSV, exportAsPDF } from '../utils/exportResults';
import { QUESTIONS } from '../data/questions';

describe('Export Results', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportAsCSV', () => {
    it('creates and triggers a CSV download', () => {
      const mockClick = vi.fn();
      const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        download: '',
        click: mockClick,
      });
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = vi.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const answers = [
        { qId: 1, selected: 1, correct: 1, isCorrect: true, time: 10, concept: 'Measurement & Units', diff: 'easy', ncert: false },
        { qId: 2, selected: 0, correct: 1, isCorrect: false, time: 15, concept: 'Measurement & Units', diff: 'easy', ncert: false },
      ];

      exportAsCSV(answers, 50, 25);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('handles unanswered questions in CSV', () => {
      const mockClick = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        href: '', download: '', click: mockClick,
      });
      global.URL.createObjectURL = vi.fn(() => 'blob:mock');
      global.URL.revokeObjectURL = vi.fn();

      const answers = [
        { qId: 1, selected: null, correct: 1, isCorrect: false, isUnanswered: true, time: 0, concept: 'Measurement & Units', diff: 'easy', ncert: false },
      ];

      // Should not throw
      expect(() => exportAsCSV(answers, 0, 0)).not.toThrow();
    });
  });

  describe('exportAsPDF', () => {
    it('calls window.print', () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      exportAsPDF();
      expect(printSpy).toHaveBeenCalled();
    });
  });
});
