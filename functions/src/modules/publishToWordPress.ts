import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import axios from "axios";

export const publishToWordPress = onDocumentUpdated("companies/{companyId}/articles/{articleId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  if (!before || !after) return;
  
  // S'assurer que le changement d'état déclenche la publication
  if (before.status !== "published" && after.status === "published") {
    console.log(`📡 Transfert de l'article "${after.title}" vers WordPress REST API...`);
    
    const wpUrl = process.env.WP_REST_URL; // e.g. "https://mon-site.com/wp-json/wp/v2/posts"
    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_APP_PASSWORD;

    if (!wpUrl || !wpUser || !wpPassword) {
      console.error("⚠️ WP Credentials manquants dans le .env.");
      return;
    }

    try {
      const auth = Buffer.from(`${wpUser}:${wpPassword}`).toString("base64");
      
      const payload = {
        title: after.title,
        content: after.content,
        status: "publish",
        format: "standard",
        meta: {
          _yoast_wpseo_title: after.metaTitle,
          _yoast_wpseo_metadesc: after.metaDescription
        }
      };

      const result = await axios.post(wpUrl, payload, {
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      });

      // Mettre à jour Firestore avec l'URL en direct
      await event.data?.after.ref.update({
        wpArticleId: result.data.id,
        wpArticleUrl: result.data.link
      });

      console.log(`✅ Publication réussie: ${result.data.link}`);
      
    } catch (error: any) {
      console.error("❌ Erreur de l'API WordPress:", error.response?.data || error.message);
    }
  }
});
