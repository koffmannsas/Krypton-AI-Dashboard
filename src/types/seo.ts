export interface Article {
  id?: string;
  title: string;
  content: string;
  slug: string;
  category: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  seoScore?: number;
  mainKeyword: string;
  metaDescription?: string;
  tags?: string[];
  internalLinks?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
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

export interface BacklinkTarget {
  id?: string;
  domain: string;
  da: number;
  type: 'blog' | 'media' | 'directory' | 'forum' | 'business' | 'tech';
  tier: 'tier1' | 'tier2' | 'tier3';
  contactEmail?: string;
  status: 'pending' | 'contacted' | 'negotiating' | 'signed' | 'rejected' | 'seeded';
  outreachAngle?: string;
  category?: 'africa_media' | 'local_iv' | 'business' | 'international' | 'seo_marketing';
  priority?: number;
}

export interface Backlink {
  id?: string;
  url: string;
  targetDomain: string;
  anchorText: string;
  anchorType: 'brand' | 'keyword' | 'generic' | 'url';
  status: 'active' | 'lost' | 'pending';
  tier: 'tier1' | 'tier2' | 'tier3';
  placedAt?: any;
}
