import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateArticle = onSchedule("every 1 hours", async (event) => {
  const db = admin.firestore();
  
  try {
    // 1. Récupérer un mot-clé non utilisé
    const keywordQuery = await db.collectionGroup("keywords")
      .where("used", "==", false)
      .limit(1)
      .get();

    if (keywordQuery.empty) {
      console.log("📭 Aucun mot-clé en attente.");
      return;
    }

    const keywordDoc = keywordQuery.docs[0];
    const keywordData = keywordDoc.data();
    const keyword = keywordData.term;
    const companyRef = keywordDoc.ref.parent.parent;

    if (!companyRef) return;

    console.log(`🤖 Génération d'un article pour : ${keyword}`);

    // 2. IA Agent: Génération du contenu optimisé
    const prompt = `Crée un article long (1000-1500 mots) hautement optimisé SEO sur le mot clé : "${keyword}".
    Objectif: Positionnement Google, valeur ajoutée pour l'utilisateur.
    Structure obligatoire HTML: <h1>, <h2>, <h3>, paragraphes clairs, listes.
    
    Format JSON attendu: 
    {
      "title": "Titre accrocheur H1",
      "content": "Contenu HTML complet..."
    }`;

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

    const result = JSON.parse(response.text || "{}");

    // 3. Stocker l'article en draft
    const articleRef = await companyRef.collection("articles").add({
      title: result.title,
      content: result.content,
      keyword: keyword,
      status: "draft",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Marquer le keyword comme utilisé
    await keywordDoc.ref.update({ 
      used: true,
      articleId: articleRef.id,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Article généré et sauvegardé (ID: ${articleRef.id})`);

  } catch (error) {
    console.error("❌ Erreur generateArticle:", error);
  }
});
