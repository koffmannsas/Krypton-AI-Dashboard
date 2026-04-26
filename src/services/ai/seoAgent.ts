import { ai } from "./gemini";
import { Article, SEOScore } from "../../types/seo";
import { Type } from "@google/genai";

export const generateSEOArticle = async (params: {
  keyword: string;
  intent?: 'traffic' | 'conversion' | 'informational' | 'comparative' | 'transactional' | 'decisional' | 'commercial';
  type: 'guide' | 'comparative' | 'landing';
  category: string;
  cluster?: string;
  articleType?: 'pillar' | 'support';
  parentSlug?: string;
  internalLinks?: { title: string; url: string; type: string }[];
}) => {
  const systemInstruction = `
    You are an expert SEO Content Strategist for Krypton AI.
    Your goal is to generate high-quality, long-form articles (800-1500 words) that follow a semantic cocoon (Topical Authority) structure.
    
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
    - Generate a meta title optimized for CTR (Click-Through Rate) containing the year if appropriate (e.g., "[Keyword]: Le Guide Complet [Year]").
    - Generate a meta description (max 155 chars).
  `;

  const prompt = `
    Tu écris un article SEO dans le cluster "${params.cluster || params.category}".
    ${params.articleType === 'support' ? `Page pilier : ${params.parentSlug}` : 'Ceci est une PAGE PILIER.'}

    Contraintes :
    ${params.articleType === 'support' ? `- Lien OBLIGATOIRE vers la page pilier parente : <a href="/blog/${params.parentSlug}">Guide Principal</a>` : ''}
    - 3 liens internes pertinents. Intègre naturellement ces URLs dans le HTML si possible : 
    ${params.internalLinks && params.internalLinks.length > 0 ? params.internalLinks.map(l => `      * ${l.title} (${l.type}) -> <a href="${l.url}">${l.title}</a>`).join('\n') : '      (Ajoute des liens factices pertinents)'}
    - structure Yoast SEO (Mots de transition, longueur de phrase, etc.)
    - contenu expert sur le mot-clé "${params.keyword}"
    
    Extract and generate the following advanced SEO data:
    1. Keyword variants (long-tail variations of the main keyword)
    2. Sub-intent ('informational', 'comparative', 'transactional', 'decisional')
    3. Determine link priority (1 for Pillar, 2 for Support, 3 for Long-tail)
    4. Entities (key semantic entities found in the article)
    5. Optimized Meta Title (Click Domination)
    
    Format the response as JSON with the following structure:
    {
      "title": "...",
      "metaTitle": "...",
      "content": "...",
      "slug": "...",
      "metaDescription": "...",
      "mainKeyword": "...",
      "keywordVariants": ["...", "..."],
      "intent": "informational" | "comparative" | "transactional" | "decisional",
      "linkPriority": 1 | 2 | 3,
      "entities": ["...", "..."],
      "tags": ["...", "..."],
      "cluster": "...",
      "type": "pillar" | "support",
      "parentSlug": "..."
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
            metaTitle: { type: Type.STRING },
            content: { type: Type.STRING },
            slug: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            mainKeyword: { type: Type.STRING },
            keywordVariants: { type: Type.ARRAY, items: { type: Type.STRING } },
            intent: { type: Type.STRING },
            linkPriority: { type: Type.INTEGER },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            cluster: { type: Type.STRING },
            type: { type: Type.STRING },
            parentSlug: { type: Type.STRING }
          },
          required: ["title", "metaTitle", "content", "slug", "metaDescription", "mainKeyword", "type"]
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

export const refreshSEOArticle = async (article: Article): Promise<Partial<Article>> => {
  const prompt = `
    Tu dois mettre à jour cet article SEO pour Google (Freshness Engine).
    Titre existant : ${article.title}
    Mot-clé : ${article.mainKeyword}
    
    Tâches (Applique ces améliorations au HTML existant) :
    1. Ajoute une section FAQ pertinente avec Schema.org structuré.
    2. Mets à jour le contenu avec une statistique récente (ex: 2026).
    3. Améliore la densité des entités sémantiques.
    4. Propose un nouveau Meta Title encore plus optimisé pour le CTR.
    5. Conserve les liens internes existants.
    
    Contenu actuel :
    ${article.content.substring(0, 3000)}...

    Format the response as JSON with the following structure:
    {
      "title": "...",
      "metaTitle": "...",
      "content": "...",
      "metaDescription": "..."
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
            metaTitle: { type: Type.STRING },
            content: { type: Type.STRING },
            metaDescription: { type: Type.STRING }
          },
          required: ["title", "metaTitle", "content", "metaDescription"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as Partial<Article>;
  } catch (error) {
    console.error("❌ Article Refresh Error:", error);
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
