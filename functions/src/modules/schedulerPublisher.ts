import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

export const schedulerPublisher = onSchedule("every 5 minutes", async (event) => {
  const db = admin.firestore();
  const nowISO = new Date().toISOString();

  console.log("🕒 Vérification des planifications de publication...");

  try {
    // Récupère tous les articles avec le statuts "scheduled" dont la date est passée
    const scheduledQuery = await db.collectionGroup("articles")
      .where("status", "==", "scheduled")
      .where("scheduledDate", "<=", nowISO)
      .get();

    if (scheduledQuery.empty) {
      return;
    }

    const batch = db.batch();
    let publishedCount = 0;

    for (const doc of scheduledQuery.docs) {
      batch.update(doc.ref, { 
        status: "published",
        publishedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      publishedCount++;
    }

    await batch.commit();
    console.log(`🚀 ${publishedCount} articles assignés pour publication (Statut: published).`);
    // Le changement de statut vers 'published' déclenchera la fonction publishToWordPress

  } catch (error) {
    console.error("❌ Erreur schedulerPublisher:", error);
  }
});
