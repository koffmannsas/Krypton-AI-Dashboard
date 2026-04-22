import { addBacklinkTarget } from "./backlinks";

export const seedHighQualityTargets = async (companyId: string) => {
  const targets = [
    // AFRICA MEDIA
    { domain: 'TechCabal', da: 55, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'Techpoint Africa', da: 52, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'WeeTracker', da: 48, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'Disrupt Africa', da: 45, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'Africa Tech Summit', da: 40, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'Benin Digital', da: 35, type: 'tech', category: 'africa_media', tier: 'tier2' },
    { domain: 'CIO Mag Africa', da: 42, type: 'media', category: 'africa_media', tier: 'tier1' },
    { domain: 'IT News Africa', da: 50, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'Tech In Africa', da: 45, type: 'tech', category: 'africa_media', tier: 'tier1' },
    { domain: 'AfricArena', da: 38, type: 'tech', category: 'africa_media', tier: 'tier2' },
    
    // LOCAL IV
    { domain: 'Abidjan.net', da: 65, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'Fraternité Matin', da: 58, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'RTI', da: 60, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'Connectionivoirienne', da: 45, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'Koaci', da: 52, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'Linfodrome', da: 48, type: 'media', category: 'local_iv', tier: 'tier1' },
    { domain: 'Actu Côte d\'Ivoire', da: 40, type: 'media', category: 'local_iv', tier: 'tier2' },

    // BUSINESS
    { domain: 'Africa Business Pages', da: 40, type: 'business', category: 'business', tier: 'tier2' },
    { domain: 'Afribaba', da: 35, type: 'directory', category: 'business', tier: 'tier3' },
    { domain: 'Afrikta', da: 32, type: 'directory', category: 'business', tier: 'tier3' },
    { domain: 'Go Africa Online', da: 45, type: 'directory', category: 'business', tier: 'tier2' },
    { domain: 'Expat.com', da: 62, type: 'forum', category: 'business', tier: 'tier1' },

    // INTERNATIONAL
    { domain: 'Crunchbase', da: 91, type: 'tech', category: 'international', tier: 'tier1' },
    { domain: 'Product Hunt', da: 90, type: 'tech', category: 'international', tier: 'tier1' },
    { domain: 'BetaList', da: 70, type: 'tech', category: 'international', tier: 'tier1' },
    { domain: 'Indie Hackers', da: 75, type: 'tech', category: 'international', tier: 'tier1' },
    { domain: 'Hacker News', da: 91, type: 'tech', category: 'international', tier: 'tier1' },
    { domain: 'Dev.to', da: 85, type: 'tech', category: 'international', tier: 'tier1' },

    // CONTENT
    { domain: 'Medium', da: 95, type: 'blog', category: 'international', tier: 'tier1' },
    { domain: 'Substack', da: 92, type: 'blog', category: 'international', tier: 'tier1' },
    { domain: 'LinkedIn', da: 98, type: 'media', category: 'international', tier: 'tier1' },

    // SEO
    { domain: 'HubSpot', da: 92, type: 'blog', category: 'seo_marketing', tier: 'tier1' },
    { domain: 'Search Engine Journal', da: 90, type: 'blog', category: 'seo_marketing', tier: 'tier1' },
    { domain: 'Moz', da: 91, type: 'blog', category: 'seo_marketing', tier: 'tier1' },
    { domain: 'Ahrefs', da: 90, type: 'blog', category: 'seo_marketing', tier: 'tier1' },
  ];

  for (const t of targets) {
    await addBacklinkTarget(companyId, {
      ...t,
      status: 'pending',
      priority: Math.round(t.da / 10)
    } as any);
  }
};
