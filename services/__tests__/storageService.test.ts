import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { saveWorkout, getWorkoutHistory, clearHistory } from '../storageService';
import { WorkoutStats, ExerciseType } from '../../types';

const STORAGE_KEY = 'the_deck_workout_history';

describe('storageService', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockWorkout: WorkoutStats = {
    id: 'test-id',
    date: 1234567890,
    totalReps: 50,
    duration: 600,
    repsByExercise: {
        [ExerciseType.PUSHUPS]: 10,
        [ExerciseType.DIPS]: 10,
        [ExerciseType.CRUNCHES]: 15,
        [ExerciseType.BURPEES]: 15,
    },
    cardsCompleted: 10,
    averageFormScore: 8,
  };

  describe('saveWorkout', () => {
    it('should save workout to empty history', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      saveWorkout(mockWorkout);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify([mockWorkout])
      );
    });

    it('should append workout to existing history', () => {
        const existingHistory = [mockWorkout];
        vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingHistory));

        const newWorkout = { ...mockWorkout, id: 'test-id-2' };
        saveWorkout(newWorkout);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            JSON.stringify([newWorkout, mockWorkout])
        );
    });
  });

  describe('getWorkoutHistory', () => {
    it('should return empty array if no data', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      const history = getWorkoutHistory();
      expect(history).toEqual([]);
    });

    it('should return parsed history', () => {
      const history = [mockWorkout];
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(history));
      const result = getWorkoutHistory();
      expect(result).toEqual(history);
    });

    it('should return empty array on parse error', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-json');
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getWorkoutHistory();
      expect(result).toEqual([]);
      spy.mockRestore();
    });
  });

  describe('clearHistory', () => {
    it('should remove item from localStorage', () => {
      clearHistory();
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });
});
