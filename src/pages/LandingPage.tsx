import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeWebsiteSettings, WebsiteSettings } from '../services/api/settings';
import { ArrowRight, Bot, Zap, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import SalesAgentWidget from '../components/chat/SalesAgentWidget';

// Simulation company ID for the demo/project
const companyId = "krypton-demo";

export default function LandingPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const unsub = subscribeWebsiteSettings(companyId, setSettings);
    return () => unsub();
  }, []);

  if (!settings) return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-ink">
      <div className="text-xl font-display font-medium">Chargement de Krypton AI...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-primary/20">
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 border-b border-border bg-bg/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-primary" size={24} />
            <span className="font-display font-bold text-lg tracking-tight">Krypton AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a>
            <a href="/admin" className="px-4 py-2 bg-surface border border-border rounded-lg hover:border-primary transition-all">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

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

      {/* Le Widget est injecté ici via App.tsx ou localement (vu qu'il est déjà dans l'Admin, on le laisse s'afficher via le router principal) */}
    </div>
  );
}
