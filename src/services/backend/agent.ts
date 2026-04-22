import cron from "node-cron";
import { getNextKeyword, updateKeyword } from "../api/keywords";
import { generateSEOArticle, analyzeSEO } from "../ai/seoAgent";
import { createArticle, getArticlesByCategory } from "../api/articles";
import { publishToWordPress } from "../api/wordpress";
import { getBacklinkTargets, getBacklinks, subscribeBacklinkTargets, subscribeBacklinks, addBacklinkTarget, updateBacklinkTarget, createBacklink, getNextTarget } from "../api/backlinks";
import { generateOutreachEmail, generateBacklinkContent } from "../ai/netlinkingAgent";
import { seedHighQualityTargets } from "../api/seedTargets";

const COMPANY_ID = "krypton-demo"; 

const OUTREACH_ANGLES = [
  "Article invité exclusif",
  "Collaboration de contenu stratégique",
  "Étude de cas IA & Business",
  "Interview expert pour votre audience",
  "Contribution technologique",
  "Guide exclusif sur l'automatisation",
  "Co-création de contenu",
  "Analyse du marché numérique en Afrique",
  "Proposition d'outil gratuit",
  "Partenariat média long terme"
];

export async function runNetlinkingIteration() {
  console.log("🔗 [NETLINKING AGENT] Executing 90-Day Authority Strategy...");
  
  try {
    // 0. Auto-Seeding (Cold Start)
    const currentTargets = await getBacklinkTargets(COMPANY_ID);

    if (currentTargets.length < 5) {
      console.log("🌱 [NETLINKING AGENT] Initializing Strategic Seed List...");
      await seedHighQualityTargets(COMPANY_ID);
    }

    // 1. Determining Current Phase (Based on link count)
    const currentLinks = await getBacklinks(COMPANY_ID);

    const phase = currentLinks.length < 20 ? 1 : currentLinks.length < 50 ? 2 : 3;
    console.log(`🚀 [NETLINKING AGENT] Operating in Phase ${phase} (Domination Mode)`);

    // 2. Outreach Phase with Angle Rotation
    const nextTarget = await getNextTarget(COMPANY_ID);
    if (nextTarget) {
      // Rotation logic
      const angle = OUTREACH_ANGLES[Math.floor(Math.random() * OUTREACH_ANGLES.length)];
      console.log(`✉️ [NETLINKING AGENT] Drafting Outreach: ${nextTarget.domain} | Angle: ${angle}`);
      
      const outreach = await generateOutreachEmail({
        domain: nextTarget.domain,
        type: nextTarget.type,
        angle
      });
      
      await updateBacklinkTarget(COMPANY_ID, nextTarget.id!, {
        status: 'contacted',
        outreachAngle: angle
      });
      console.log(`✅ [NETLINKING AGENT] Outreach dispatched: "${outreach.subject}"`);
    }

    // 3. Link Drip Feed (Simulating Phase-Based Progression)
    const dripProbability = phase === 1 ? 0.4 : phase === 2 ? 0.6 : 0.8;
    if (Math.random() < dripProbability) {
       const anchors = ['Krypton AI', 'Sites web intelligents', 'Automatisation CRM', 'krypton-ai.com'];
       const anchor = anchors[Math.floor(Math.random() * anchors.length)];
       
       // In Phase 1 we use Directories/Forums, Phase 2 Blogs, Phase 3 Media
       const targetType = phase === 1 ? 'directory' : phase === 2 ? 'blog' : 'media';
       
       await createBacklink(COMPANY_ID, {
         url: `https://${targetType}-network.com/node/${Math.floor(Math.random() * 1000)}`,
         targetDomain: `${targetType}-network.com`,
         anchorText: anchor,
         anchorType: anchor.includes('.') ? 'url' : 'keyword',
         status: 'active',
         tier: phase === 1 ? 'tier3' : phase === 2 ? 'tier2' : 'tier1'
       });
       console.log(`🔗 [NETLINKING AGENT] Phase ${phase} Backlink verified.`);
    }

  } catch (error: any) {
    console.error("❌ [NETLINKING AGENT] Strategy Leak:", error.message);
  }
}

export async function runAgentIteration() {
  console.log("🤖 [SEO AGENT] Deep Neural Synthesis Starting...");
  
  try {
    const keyword = await getNextKeyword(COMPANY_ID);
    if (!keyword) {
      console.log("📭 [SEO AGENT] No keyword injection detected. Monitoring feeds.");
      return;
    }

    console.log(`🎯 [SEO AGENT] Targeting: "${keyword.term}"`);
    await updateKeyword(COMPANY_ID, keyword.id, { status: 'processing' });

    console.log(`✍️ [SEO AGENT] Generating Authority Content (Internal Blog)...`);
    const articleData = await generateSEOArticle({
      keyword: keyword.term,
      intent: keyword.intent,
      type: 'guide', 
      category: keyword.cluster
    });

    console.log(`📈 [SEO AGENT] Running SEO Audit...`);
    const seoResult = await analyzeSEO(articleData as any);
    
    console.log(`🔗 [SEO AGENT] Enforcing Internal Semantic Links...`);
    const sameClusterArticles = await getArticlesByCategory(COMPANY_ID, keyword.cluster);
    
    // Internal Authority
    const internalLinks = sameClusterArticles.slice(0, 3).map(a => 
      `<li><a href="/blog/${a.slug}" style="color: #6366f1; font-weight: 500;">${a.title}</a></li>`
    );
    
    const enrichedContent = `
      ${articleData.content}
      <div style="margin-top: 50px; padding: 24px; background: rgba(99, 102, 241, 0.05); border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.1);">
        <h4 style="margin-bottom: 16px; font-weight: 800; font-family: sans-serif; letter-spacing: -0.02em;">💎 COCON SÉMANTIQUE : LECTURES RECOMMANDÉES</h4>
        <ul style="list-style: none; padding: 0; display: grid; gap: 12px;">
          ${internalLinks.length > 0 ? internalLinks.join('') : '<li style="color: #94a3b8; font-style: italic;">Expansion du graphe sémantique en cours...</li>'}
        </ul>
      </div>
    `;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60));

    const articleId = await createArticle(COMPANY_ID, {
      ...articleData,
      content: enrichedContent,
      category: keyword.cluster,
      status: 'scheduled',
      seoScore: seoResult.score,
      mainKeyword: keyword.term,
      scheduledDate: tomorrow.toISOString(),
      internalLinks: sameClusterArticles.slice(0, 3).map(a => a.id)
    });

    await updateKeyword(COMPANY_ID, keyword.id, { 
      status: 'completed', 
      articleId,
      processedAt: new Date().toISOString() 
    });

    console.log(`✅ [SEO AGENT] ECOSYSTEM SYNC: "${articleData.title}" locked.`);
    console.log(`📊 [SEO AGENT] Internal Quality: ${seoResult.score}%`);

    // Trigger Netlinking check on high quality content
    if (seoResult.score > 80) {
      console.log(`🧭 [SEO AGENT] High-Quality Content detected. Notifying Netlinking Engine...`);
      await runNetlinkingIteration(); 
    }

  } catch (error: any) {
    console.error("❌ [SEO AGENT] Neural Leak:", error.message);
  }
}

export function startAgentCron() {
  console.log("🔋 [SEO AGENT] Core Systems Online.");
  console.log("📅 [SEO AGENT] Automation schedule set: Hourly check.");
  
  // Every hour: '0 * * * *'
  // For demo/dev purposes, let's run every 15 minutes: '*/15 * * * *'
  cron.schedule('*/15 * * * *', runAgentIteration);
  
  // Netlinking sync: Every 30 minutes
  cron.schedule('*/30 * * * *', runNetlinkingIteration);
  
  // Cold start trigger
  setTimeout(() => {
    runAgentIteration();
    runNetlinkingIteration();
  }, 5000);
}
