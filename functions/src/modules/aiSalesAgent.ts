import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const aiSalesAgent = onDocumentCreated("companies/{companyId}/conversations/{conversationId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  // Assume conversation documents have a 'messages' array and 'isClosed' boolean
  if (data.isClosed) return; // Ignore conversations déjà clôturées

  const db = admin.firestore();
  console.log(`🤖 AI Sales Agent traite une conversation. ID: ${snapshot.id}`);

  // Compilation de la conversation pour l'IA
  const historyText = Array.isArray(data.messages) ? data.messages.join("\n") : data.messages;

  const prompt = `Tu es une IA de qualification des ventes (Closer).
  Analyse cette conversation avec un visiteur :
  
  [CONVERSATION START]
  ${historyText}
  [CONVERSATION END]
  
  Tâche : 
  1. Score l'intention (0-100).
  2. Statut (cold, warm, hot).
  3. Détecte ses besoins.
  
  Format attendu JSON:
  {
    "score": 80,
    "status": "hot",
    "needs": ["seo", "lead gen"]
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
            status: { type: Type.STRING, enum: ["cold", "warm", "hot"] },
            needs: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "needs"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const companyRef = snapshot.ref.parent.parent;

    if (companyRef) {
      // Met à jour ou insère dans la collection 'leads'
      await companyRef.collection("leads").add({
        conversationId: snapshot.id,
        score: result.score,
        status: result.status,
        needs: result.needs,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Lead qualifié. Score: ${result.score} - Statut: ${result.status}`);
    }

  } catch (error) {
    console.error("❌ Erreur pendant la qualification Sales Agent :", error);
  }
});
