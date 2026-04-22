import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const optimizeSEO = onDocumentCreated("companies/{companyId}/articles/{articleId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  // Ne traiter que les brouillons (draft) frais
  if (data.status !== "draft" || data.seoScore) return;

  console.log(`📈 Optimisation SEO pour l'article: ${data.title}`);

  const prompt = `Tu es un expert SEO. Analyse ce contenu et évalue-le sur 100.
  Titre: ${data.title}
  Mot clé cible: ${data.keyword}
  Contenu: ${data.content}
  
  Critères: Densité du mot clé, hiérarchie des balises Hn, lisibilité.
  Génère également une balise Meta Title (< 60 chars) et une Meta Description (150-160 chars).
  
  Format JSON attendu:
  {
    "score": 95,
    "metaTitle": "...",
    "metaDescription": "..."
  }`;

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
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING }
          },
          required: ["score", "metaTitle", "metaDescription"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");

    // Planification de l'article pour le lendemain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await snapshot.ref.update({
      seoScore: result.score,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      status: "scheduled", // Transfère au scheduler
      scheduledDate: tomorrow.toISOString()
    });

    console.log(`✅ SEO Optimisé. Score: ${result.score}/100. Planifié pour ${tomorrow.toISOString()}`);

  } catch (error) {
    console.error("❌ Erreur optimizeSEO:", error);
  }
});
