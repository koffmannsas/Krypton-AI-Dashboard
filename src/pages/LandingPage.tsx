import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeWebsiteSettings, getWebsiteSettings, DEFAULT_CONFIG, WebsiteSettings } from '../services/api/settings';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ArrowRight, Bot, Zap, Globe, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SalesAgentWidget from '../components/chat/SalesAgentWidget';

// Simulation company ID for the demo/project
const companyId = "default-company";

export default function LandingPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const loadSettings = async () => {
      // Safe Startup pattern using Promise.race (Anti-Bug)
      const data = await Promise.race([
        getWebsiteSettings(companyId),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 1500))
      ]);
      
      if (!data) {
        setSettings(DEFAULT_CONFIG);
      } else {
        setSettings(data);
      }

      // Then subscribe for fresh values in background
      unsub = subscribeWebsiteSettings(companyId, setSettings);
    };

    loadSettings();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (!settings) return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-ink">
      <div className="text-xl font-display font-medium">Chargement de Krypton AI...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-primary/20">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} /> Agent Autonome
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight"
          >
            {settings.headline}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          >
            {settings.subheadline}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button className="h-12 px-8 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              Démarrer l'essai gratuit <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section id="pricing" className="py-24 bg-surface-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Tarification Simple & Transparente</h2>
            <p className="text-muted">Directement connecté à notre Dashboard en temps réel.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {settings.pricing.map((tier) => (
              <motion.div 
                key={tier.id}
                whileHover={{ y: -5 }}
                className="bg-bg border border-border p-8 rounded-3xl shadow-sm flex flex-col relative overflow-hidden"
              >
                {tier.id === 'pro' && (
                  <div className="absolute top-0 right-0 p-3">
                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      Recommandé
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-black">{tier.price}€</span>
                  <span className="text-muted font-medium">/mois</span>
                </div>
                <div className="mt-8 space-y-4 flex-1">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-primary" />
                      <span className="text-sm font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
                <button className={`mt-8 h-12 w-full rounded-xl font-bold transition-all ${
                  tier.id === 'pro' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-surface border border-border hover:border-primary'
                }`}>
                  Choisir ce forfait
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Showcase Section */}
      <section className="py-24 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Dernières Analyses IA</h2>
                <p className="text-muted text-lg">Comment nos moteurs SEO transforment le trafic organique.</p>
              </div>
              <Link to="/blog" className="flex items-center gap-2 font-bold text-primary hover:underline">
                Voir tout le mag <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               {[1, 2, 3].map(i => (
                 <div key={i} className="group bg-surface border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all shadow-sm">
                   <div className="aspect-[16/10] bg-surface-secondary overflow-hidden">
                      <img src={`https://picsum.photos/seed/seo${i}/800/500`} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="p-8 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary">Topic Cluster: IA & Business</div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">Stratégie SEO 2024 : Dominer sa niche avec le cocon sémantique Krypton.</h3>
                      <Link to="/blog" className="flex items-center gap-2 text-sm font-bold text-ink hover:text-primary transition-all">
                        Lire l'étude de cas <ArrowRight size={14} />
                      </Link>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
}
