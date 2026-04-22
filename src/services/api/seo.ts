import { Article, Category } from "../../types/seo";

export const generateSitemapXML = (articles: Article[], categories: Category[], baseUrl: string = "https://kryptonai.com") => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main Page
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;

  // Categories
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Articles
  articles.forEach(art => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${art.slug}</loc>\n    <lastmod>${art.updatedAt?.split('T')[0] || art.createdAt?.split('T')[0]}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

export const getInterlinkingSuggestions = (currentArticle: Article, allArticles: Article[]) => {
  // Simple logic: suggest articles from the same category
  return allArticles
    .filter(art => art.category === currentArticle.category && art.id !== currentArticle.id)
    .slice(0, 3)
    .map(art => art.slug);
};
