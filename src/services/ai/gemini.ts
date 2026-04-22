import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export { ai };

export const generateAI = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });

    return response.text || "No response";
  } catch (error) {
    console.error("❌ AI Error:", error);
    throw error;
  }
};
