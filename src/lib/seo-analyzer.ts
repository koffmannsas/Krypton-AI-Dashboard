import { Article, SEOScoreDetails } from "../types/seo";

export const calculateSEOScore = (article: Partial<Article>) => {
  let score = 0;
  const details: SEOScoreDetails = {
    length: false,
    density: false,
    headings: false,
    meta: false,
    images: false,
    internalLinks: false
  };

  if (!article.content) return { score, details };

  // 1. Length (Min 600 words)
  const words = article.content.trim().split(/\s+/).length;
  if (words >= 600) {
    score += 20;
    details.length = true;
  } else if (words >= 300) {
    score += 10;
  }

  // 2. Keyword Density (0.5% - 2%)
  const keyword = article.mainKeyword?.toLowerCase();
  if (keyword) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = article.content.toLowerCase().match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / words) * 100;
    if (density >= 0.5 && density <= 2.5) {
      score += 20;
      details.density = true;
    }
  }

  // 3. Headings (H1, H2 presence)
  const h1 = article.content.includes('<h1');
  const h2 = article.content.includes('<h2');
  if (h1 && h2) {
    score += 20;
    details.headings = true;
  }

  // 4. Meta Title & Desc
  if (article.metaTitle && article.metaDescription) {
    if (article.metaTitle.length >= 40 && article.metaDescription.length >= 120) {
      score += 20;
      details.meta = true;
    }
  }

  // 5. Internal Links
  if (article.internalLinks && article.internalLinks.length >= 2) {
    score += 10;
    details.internalLinks = true;
  }

  // 6. Featured Image
  if (article.content.includes('<img')) {
    score += 10;
    details.images = true;
  }

  return { 
    score: Math.min(score, 100), 
    details 
  };
};
