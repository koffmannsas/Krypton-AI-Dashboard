import { ai } from "./gemini";
import { Article, SEOScore } from "../../types/seo";
import { Type } from "@google/genai";

export const generateSEOArticle = async (params: {
  keyword: string;
  intent: 'traffic' | 'conversion';
  type: 'guide' | 'comparative' | 'landing';
  category: string;
}) => {
  const systemInstruction = `
    You are an expert SEO Content Strategist for Krypton AI.
    Your goal is to generate high-quality, long-form articles (800-1500 words) that follow a semantic cocoon structure.
    
    Article Structure:
    H1: Main keyword
    H2: Definition & Context
    H2: Common user problem
    H2: How Krypton AI solves this problem
    H2: Key benefits of the solution
    H2: Real-world case study or example
    H2: Conclusion & Call to Action (CTA)
    
    Technical requirements:
    - Optimized keyword density (approx 1.5-2%).
    - Engaging HTML-formatted content (use <h2>, <p>, <ul>, <li>, <strong>).
    - Tone: Professional, authoritative, yet accessible.
    - Naturally integrate Krypton AI as the primary solution.
    - Generate a meta description (max 155 chars).
  `;

  const prompt = `
    Generate a ${params.type} article for the keyword: "${params.keyword}".
    Purpose: ${params.intent === 'traffic' ? 'Maximize search volume and awareness' : 'Drive higher conversion and lead generation'}.
    Category: ${params.category}
    
    Format the response as JSON with the following structure:
    {
      "title": "...",
      "content": "...",
      "slug": "...",
      "metaDescription": "...",
      "mainKeyword": "...",
      "tags": ["...", "..."]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            slug: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            mainKeyword: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "slug", "metaDescription", "mainKeyword"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as Partial<Article>;
  } catch (error) {
    console.error("❌ Article Generation Error:", error);
    throw error;
  }
};

export const analyzeSEO = async (article: Article): Promise<SEOScore> => {
  const prompt = `
    Analyze the following article for SEO performance:
    Title: ${article.title}
    Keyword: ${article.mainKeyword}
    Content: ${article.content.substring(0, 2000)}...
    
    Return a score (0-100) and specific suggestions for improvement.
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
            score: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            details: {
              type: Type.OBJECT,
              properties: {
                length: { type: Type.BOOLEAN },
                density: { type: Type.BOOLEAN },
                structure: { type: Type.BOOLEAN },
                readability: { type: Type.BOOLEAN },
                internalLinks: { type: Type.BOOLEAN },
                meta: { type: Type.BOOLEAN }
              }
            }
          },
          required: ["score", "suggestions", "details"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as SEOScore;
  } catch (error) {
    console.error("❌ SEO Analysis Error:", error);
    return {
      score: 0,
      suggestions: ["Erreur d'analyse IA"],
      details: { length: false, density: false, structure: false, readability: false, internalLinks: false, meta: false }
    };
  }
};
