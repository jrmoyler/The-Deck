import { GoogleGenAI } from "@google/genai";
import { WorkoutStats } from "../types";

// Initialize only if key exists to prevent crash on load
const getAI = () => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.warn("Gemini API Key missing.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateWorkoutSummary = async (stats: WorkoutStats): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Mission accomplished. Secure the API Key to receive a tactical debrief.";

  const prompt = `
    You are a hardcore military drill instructor for a fitness app called 'The Deck'.
    The user just finished a deck-of-cards workout.
    
    Stats:
    - Duration: ${Math.floor(stats.duration / 60)}m ${stats.duration % 60}s
    - Total Reps: ${stats.totalReps}
    - Pushups: ${stats.repsByExercise["Push-Ups"]}
    - Dips: ${stats.repsByExercise["Dips"]}
    - Crunches: ${stats.repsByExercise["Crunches"]}
    - Burpees: ${stats.repsByExercise["Burpees"]}
    
    Give a short, punchy, motivational debrief (max 3 sentences). 
    Use military jargon mixed with fitness encouragement. 
    If they did a lot of burpees, commend their soul.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Good work, soldier.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Communication link disrupted. Outstanding effort regardless.";
  }
};

export const getCoachResponse = async (userMessage: string): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Coach radio is offline. Check API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: userMessage,
            config: {
                systemInstruction: "You are 'The Deck' Coach. An elite physical trainer. You are tough but fair. You provide concise, actionable advice on bodyweight exercises (Pushups, Dips, Crunches, Burpees). Keep answers under 50 words unless asked for a detailed guide."
            }
        });
        return response.text || "Copy that.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Static on the line. Repeat last.";
    }
}
