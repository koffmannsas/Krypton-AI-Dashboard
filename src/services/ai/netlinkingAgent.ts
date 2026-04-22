import { ai } from "./gemini";
import { Type } from "@google/genai";

export const generateOutreachEmail = async (params: {
  domain: string;
  type: string;
  angle?: string;
}) => {
  const prompt = `
    Generate a professional guest post outreach email for the website: ${params.domain}.
    The website type is ${params.type}.
    Angle: ${params.angle || 'Collaboration de contenu'}.
    
    Product: Krypton AI (An autonomous SEO agent and smart CRM platform).
    Strategy: 95% automated + 5% strategic validation.
    
    Constraints:
    - Personalized subject line
    - Compliment about a specific niche point (mentalizing data)
    - Proposal of a specific article title adapted to their editorial line
    - Mention business impact and IA value proposition
    - Professional signature placeholder
    
    Return as JSON:
    {
      "subject": "...",
      "body": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("❌ Outreach Generation Error:", error);
    throw error;
  }
};

export const generateBacklinkContent = async (params: {
  targetDomain: string;
  anchorText: string;
  type: 'guest_post' | 'comment' | 'directory';
}) => {
  const prompt = `
    Generate unique content for a ${params.type} on ${params.targetDomain}.
    The output should naturally include the anchor text: "${params.anchorText}" pointing to Krypton AI.
    
    Context: Krypton AI is a premium SaaS for local businesses to automate SEO and lead management.
    
    Return as JSON:
    {
      "title": "...",
      "content": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("❌ Backlink Content Error:", error);
    throw error;
  }
};
