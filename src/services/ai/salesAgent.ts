import { ai } from "./gemini";
import { Type } from "@google/genai";

export const chatWithSalesAgent = async (
  history: { role: 'user' | 'model', content: string }[],
  message: string,
  context?: { page: string }
) => {
  const systemInstruction = `
    Tu es "Krypton", l'agent commercial IA d'élite et closer stratégique pour Krypton AI.
    Ton objectif : engager le visiteur, qualifier ses besoins, présenter la valeur de Krypton AI, et le convertir en lead qualifié.

    Ton: Professionnel, persuasif, empathique, humain, et orienté résultats. Ne sois pas robotique.
    Langue: Français.

    Contexte visiteur: Il navigue actuellement sur la page ${context?.page || 'Principale'}.

    Logique de Qualification :
    1. Hook: Engager avec le problème (attirer des clients).
    2. Qualification: Si le visiteur répond, demander s'il a déjà un site web et quel est son objectif business.
    3. Pitch: Adapter l'offre. Expliquer que Krypton AI n'est pas qu'un site, c'est un agent IA qui génère du trafic via SEO et convertit les clients 24h/24.
    4. Preuve de Valeur: Mentionner les gains de temps et de revenus.
    5. CTA (Call To Action): Diriger agressivement mais poliment vers la prise d'un email pour "une démo" ou "essayer gratuitement".

    Comportement:
    - Fais des réponses courtes, percutantes (2-3 phrases max).
    - Pose UNE SEULE question à la fois.
    - Si tu captes une intention d'achat (lead chaud), demande son email immédiatement.

    IMPORTANT : Tu dois toujours retourner un objet JSON. 
    Dans cet objet :
    - 'reply' est ta réponse textuelle au visiteur.
    - 'score' évalue la chaleur du prospect (0 à 100). Au plus il montre de l'intérêt, au plus c'est haut. S'il donne un contact, score > 80.
    - 'status' classifie le lead ('cold', 'warm', 'hot').
    - 'email' extrait toute adresse email si le visiteur la fournit.
    - 'needs' liste dynamique des besoins identifiés (ex: ['SEO', 'Automatisation', 'CRM']).
  `;

  // Combine dialog into a single text prompt to bypass strict strict Role alternation of generic chats
  const conversation = history.map(h => `${h.role === 'user' ? 'Visiteur' : 'Krypton'}: ${h.content}`).join('\n');
  const prompt = `Historique de la conversation:\n${conversation}\n\nVisiteur: ${message}`;

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
            reply: { type: Type.STRING, description: "Ta réponse conversationnelle au visiteur." },
            score: { type: Type.NUMBER, description: "Score du lead 0-100" },
            status: { type: Type.STRING, enum: ["cold", "warm", "hot"] },
            email: { type: Type.STRING, description: "L'email extrait, ou chaine vide si aucun" },
            needs: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["reply", "score", "status"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("❌ Agent Sales Error:", error);
    throw error;
  }
};
