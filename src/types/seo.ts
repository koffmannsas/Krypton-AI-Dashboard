export type ArticleStatus = 'draft' | 'pending' | 'published' | 'error' | 'scheduled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  companyId: string;
}

export interface Backlink {
  id: string;
  url: string;
  targetUrl: string;
  targetDomain?: string;
  anchor: string;
  anchorText?: string;
  anchorType?: string;
  status: 'active' | 'broken' | 'pending';
  lastChecked?: any;
  tier?: string;
  companyId: string;
}

export interface BacklinkTarget {
  id: string;
  url: string;
  domain?: string;
  type?: string;
  da?: number;
  status?: string;
  tier?: string;
  outreachAngle?: string;
  idealAnchors: string[];
  currentCount: number;
  companyId: string;
}

export interface SEOScore {
  score: number;
  suggestions: string[];
  details: {
    length: boolean;
    density: boolean;
    structure: boolean;
    readability: boolean;
    internalLinks: boolean;
    meta: boolean;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  mainKeyword: string;
  keywordVariants?: string[]; // 1. Query Coverage Domination
  intent?: 'informational' | 'comparative' | 'transactional' | 'decisional' | 'commercial'; // 2. Intent Stacking
  linkPriority?: 1 | 2 | 3; // 3. Link Weighting (1 = Pillar/High, 2 = Support/Medium, 3 = Long-tail/Low)
  entities?: string[]; // 5. Entity SEO
  nextRefreshAt?: any; // 4. Freshness Engine
  lastRefreshedAt?: any; // 4. Freshness Engine
  content: string;
  metaTitle: string;
  metaDescription: string;
  internalLinks: string[];
  status: ArticleStatus;
  cluster: string;
  type: 'pillar' | 'support';
  parentSlug?: string;
  depth?: number;
  priority?: number;
  seoScore: number;
  featuredImage?: string;
  category?: string;
  scheduledDate?: any;
  authorId: string;
  companyId: string;
  createdAt: any;
  updatedAt: any;
}

export interface SEOScoreDetails {
  length: boolean;
  density: boolean;
  headings: boolean;
  meta: boolean;
  images: boolean;
  internalLinks: boolean;
}
