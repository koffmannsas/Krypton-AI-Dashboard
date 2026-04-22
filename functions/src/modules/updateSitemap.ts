import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import axios from "axios";

export const updateSitemap = onDocumentUpdated("companies/{companyId}/articles/{articleId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  if (!before || !after) return;
  
  // Détecter quand le lien WordPress est ajouté à l'article, validant sa présence web
  if (!before.wpArticleUrl && after.wpArticleUrl) {
    // Remplacer par l'URL cible de votre sitemap configurée
    const targetSiteUrl = process.env.PUBLIC_SITEMAP_URL || "https://krypton-ai.com";
    const sitemapUrl = `${targetSiteUrl}/sitemap.xml`;
    
    console.log(`🌐 Nouvelle URL détectée: ${after.wpArticleUrl}`);
    console.log(`🔔 Ping Google avec l'URL du sitemap: ${sitemapUrl}`);

    try {
      // Ping officiel de Google permettant l'indexation rapide d'un sitemap mis à jour
      await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log(`✅ Google a été notifié de la mise à jour du sitemap.`);
    } catch (error: any) {
      console.error("❌ Echec du ping d'indexation Google:", error.message);
    }
  }
});
