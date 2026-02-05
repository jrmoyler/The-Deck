import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWorkoutSummary, getCoachResponse } from '../geminiService';
import { WorkoutStats, ExerciseType } from '../../types';

// Mock the GoogleGenAI library properly
const { mockGoogleGenAI, mockGenerateContent, constructorSpy } = vi.hoisted(() => {
    const mockGenerateContent = vi.fn();
    const constructorSpy = vi.fn();

    class MockGoogleGenAI {
        models = { generateContent: mockGenerateContent };
        constructor(args: any) {
            constructorSpy(args);
        }
    }

    return { mockGoogleGenAI: MockGoogleGenAI, mockGenerateContent, constructorSpy };
});

vi.mock('@google/genai', () => ({
    GoogleGenAI: mockGoogleGenAI,
}));

describe('geminiService', () => {
    const mockStats: WorkoutStats = {
        id: 'test',
        date: 123,
        totalReps: 100,
        duration: 300,
        repsByExercise: {
            [ExerciseType.PUSHUPS]: 25,
            [ExerciseType.DIPS]: 25,
            [ExerciseType.CRUNCHES]: 25,
            [ExerciseType.BURPEES]: 25,
        },
        cardsCompleted: 52,
        averageFormScore: 10
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    describe('generateWorkoutSummary', () => {
        it('should return warning if API key is missing', async () => {
            vi.stubEnv('API_KEY', '');
            const result = await generateWorkoutSummary(mockStats);
            expect(result).toBe("Mission accomplished. Secure the API Key to receive a tactical debrief.");
            expect(constructorSpy).not.toHaveBeenCalled();
        });

        it('should call API and return summary if key exists', async () => {
            vi.stubEnv('API_KEY', 'test-key');
            mockGenerateContent.mockResolvedValue({ text: 'Good job!' });

            const result = await generateWorkoutSummary(mockStats);

            expect(constructorSpy).toHaveBeenCalledWith({ apiKey: 'test-key' });
            expect(mockGenerateContent).toHaveBeenCalled();
            expect(result).toBe('Good job!');
        });

        it('should handle API errors gracefully', async () => {
            vi.stubEnv('API_KEY', 'test-key');
            mockGenerateContent.mockRejectedValue(new Error('API Error'));

            const result = await generateWorkoutSummary(mockStats);

            expect(result).toBe("Communication link disrupted. Outstanding effort regardless.");
        });
    });

    describe('getCoachResponse', () => {
        it('should return warning if API key is missing', async () => {
            vi.stubEnv('API_KEY', '');
            const result = await getCoachResponse("Hello");
            expect(result).toBe("Coach radio is offline. Check API Key.");
        });

        it('should return API response', async () => {
            vi.stubEnv('API_KEY', 'test-key');
            mockGenerateContent.mockResolvedValue({ text: 'Drop and give me 20!' });

            const result = await getCoachResponse("Hello");
            expect(result).toBe('Drop and give me 20!');
        });
    });
});
