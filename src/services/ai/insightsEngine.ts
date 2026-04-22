import { generateAI } from "./gemini";
import { businessInsightPrompt } from "./prompts";

export const getAIInsights = async (data: any) => {
  const prompt = businessInsightPrompt(data);

  const result = await generateAI(prompt);

  return result;
};