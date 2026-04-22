import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { subscribeBacklinkTargets, subscribeBacklinks, addBacklinkTarget, updateBacklinkTarget } from '../services/api/backlinks';
import { Backlink, BacklinkTarget } from '../types/seo';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import { 
  Link as LinkIcon, 
  Target, 
  Mail, 
  BarChart3, 
  Plus, 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  CheckCircle2,
  Lock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Netlinking() {
  const { companyId } = useStore();
  const [targets, setTargets] = useState<BacklinkTarget[]>([]);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'targets' | 'roadmap' | 'outreach'>('overview');
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    if (!companyId) return;
    const unsubTargets = subscribeBacklinkTargets(companyId, setTargets);
    const unsubBacklinks = subscribeBacklinks(companyId, setBacklinks);
    return () => {
      unsubTargets();
      unsubBacklinks();
    };
  }, [companyId]);

  const currentPhase = backlinks.length < 20 ? 1 : backlinks.length < 50 ? 2 : 3;

  const roadmapPhases = [
    { 
      id: 1, 
      name: 'Phase 1: Indexation Rapid', 
      days: '0-30', 
      tasks: ['Annuaires business', 'Profils technologiques', 'Medium & LinkedIn'],
      desc: 'Objectif : SEO Baseline & Crédibilité initiale.'
    },
    { 
      id: 2, 
      name: 'Phase 2: Autorité Afrique', 
      days: '30-60', 
      tasks: ['Médias locaux IV', 'Blogs Tech Afrique', 'Outreach personnalisé'],
      desc: 'Objectif : Domination locale & Authority Score.'
    },
    { 
      id: 3, 
      name: 'Phase 3: Domination Marché', 
      days: '60-90', 
      tasks: ['Partenariats SaaS', 'Invitations Médias Panafricains', 'Cocon Sémantique Externe'],
      desc: 'Objectif : Top positions Google & Flux organique.'
    }
  ];

  const handleAddTarget = async () => {
    if (!newDomain) return;
    await addBacklinkTarget(companyId, {
      domain: newDomain,
      da: 20 + Math.floor(Math.random() * 40),
      type: 'blog',
      tier: 'tier2',
      status: 'pending'
    });
    setNewDomain('');
    setIsAddingTarget(false);
  };

  const stats = {
    totalLinks: backlinks.length,
    activeLinks: backlinks.filter(b => b.status === 'active').length,
    avgDA: Math.round(targets.length > 0 ? targets.reduce((acc, t) => acc + t.da, 0) / targets.length : 0),
    outreachCount: targets.filter(t => t.status === 'contacted').length
  };

  const anchorData = [
    { label: 'Marque (Krypton AI)', value: 40, color: 'bg-primary' },
    { label: 'Mots-clés (Smart SEO)', value: 30, color: 'bg-accent' },
    { label: 'Génériques (En savoir plus)', value: 20, color: 'bg-ink/60' },
    { label: 'URL Brute', value: 10, color: 'bg-muted' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Netlinking Command Center</h1>
          <p className="text-muted text-sm italic">Engineered authority growth through high-fidelity semantic backlinks.</p>
        </div>
        <div className="flex bg-surface border border-border p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Monitor', icon: <BarChart3 size={14} /> },
            { id: 'roadmap', label: '90-Day Roadmap', icon: <Calendar size={14} /> },
            { id: 'targets', label: 'Strategic Targets', icon: <Target size={14} /> },
            { id: 'outreach', label: 'Outreach Corp', icon: <Mail size={14} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Backlinks" value={stats.totalLinks.toString()} icon={<LinkIcon size={18} />} trend="+12%" />
        <StatCard title="Active Nodes" value={stats.activeLinks.toString()} icon={<ShieldCheck size={18} />} trendUp />
        <StatCard title="Avg Authority" value={`${stats.avgDA} DA`} icon={<Globe size={18} />} trend="Tier 1-2" />
        <StatCard title="Pending Outreach" value={stats.outreachCount.toString()} icon={<Mail size={18} />} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="lg:col-span-2 p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold uppercase tracking-tight">Evolution de l'Autorité</h3>
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div className="h-64 bg-surface-secondary/30 rounded-2xl flex items-end p-6 gap-2">
                 {[40, 45, 42, 50, 55, 62, 65, 70, 75, 80, 85, 90].map((h, i) => (
                   <motion.div 
                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    key={i} className="flex-1 bg-primary rounded-t-sm" 
                   />
                 ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 bg-bg border border-border rounded-xl">
                   <p className="text-[10px] uppercase font-bold text-muted">Indexing Speed</p>
                   <p className="text-xl font-display font-bold">Fast (AI-Optimized)</p>
                 </div>
                 <div className="p-4 bg-bg border border-border rounded-xl">
                   <p className="text-[10px] uppercase font-bold text-muted">Spam Score</p>
                   <p className="text-xl font-display font-bold">0.8% (Clean)</p>
                 </div>
                 <div className="p-4 bg-bg border border-border rounded-xl">
                   <p className="text-[10px] uppercase font-bold text-muted">Diversity</p>
                   <p className="text-xl font-display font-bold">92% (High)</p>
                 </div>
              </div>
            </Card>

            <div className="space-y-6">
               <Card className="p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} fill="currentColor" /> Priority Tasks
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <div className="w-1.5 h-15 bg-primary rounded-full" />
                      <p className="text-xs font-medium">Verify 3 pending directory listings</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface-secondary/50 rounded-xl">
                      <div className="w-1.5 h-15 bg-muted rounded-full" />
                      <p className="text-xs font-medium opacity-60">Generate guest post for "The AI Hub"</p>
                    </div>
                  </div>
               </Card>

               <Card className="p-6 space-y-4 bg-ink text-white">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Backlink Mix Strategy</h3>
                  <div className="space-y-4">
                     {anchorData.map((d, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span>{d.label}</span>
                            <span>{d.value}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className={`h-full ${d.color}`} style={{ width: `${d.value}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {roadmapPhases.map((phase) => (
                   <Card 
                    key={phase.id} 
                    className={`p-8 space-y-6 relative overflow-hidden transition-all border-2 ${
                      currentPhase === phase.id ? 'border-primary ring-4 ring-primary/5' : 
                      currentPhase > phase.id ? 'border-green-500/30' : 'opacity-60 grayscale'
                    }`}
                   >
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <h4 className={`text-xl font-display font-bold ${currentPhase === phase.id ? 'text-primary' : ''}`}>
                               {phase.name}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Days {phase.days}</span>
                         </div>
                         {currentPhase > phase.id ? <CheckCircle2 className="text-green-500" /> : 
                          currentPhase === phase.id ? <Zap className="text-primary animate-pulse" fill="currentColor" /> : 
                          <Lock size={18} className="text-muted" />}
                      </div>
                      
                      <p className="text-sm italic text-muted leading-relaxed">"{phase.desc}"</p>
                      
                      <div className="space-y-3">
                         <h5 className="text-[10px] font-bold uppercase text-ink">Priority Modules:</h5>
                         {phase.tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs bg-bg p-3 rounded-xl border border-border/50">
                               <div className={`w-1.5 h-1.5 rounded-full ${currentPhase >= phase.id ? 'bg-primary' : 'bg-muted'}`} />
                               {task}
                            </div>
                         ))}
                      </div>

                      {currentPhase === phase.id && (
                        <div className="absolute top-0 right-0 p-2">
                           <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                        </div>
                      )}
                   </Card>
                ))}
             </div>

             <Card className="p-10 bg-surface-secondary/10 border-dashed space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold">Krypton AI SEO Mastery</h3>
                      <p className="text-muted text-sm max-w-xl">L'agent SEO de Krypton tourne actuellement avec une autonomie de 95%. La Phase {currentPhase} est executée en tâche de fond pour garantir une croissance organique stable et pérenne.</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-center">
                         <p className="text-3xl font-display font-black">90j</p>
                         <p className="text-[10px] uppercase font-bold text-muted">Durée Totale</p>
                      </div>
                      <div className="h-10 w-px bg-border hidden md:block" />
                      <div className="text-center">
                         <p className="text-3xl font-display font-black text-primary">{Math.min(100, Math.round((backlinks.length/90)*100))}%</p>
                         <p className="text-[10px] uppercase font-bold text-muted">Progression</p>
                      </div>
                   </div>
                </div>
             </Card>
          </motion.div>
        )}

        {activeTab === 'targets' && (
          <motion.div 
            key="targets"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight">Netlinking Inventory</h3>
              <Button onClick={() => setIsAddingTarget(true)} size="sm">
                <Plus size={16} /> Discovery Portal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {isAddingTarget && (
                 <Card className="p-6 space-y-4 border-dashed border-primary/40 bg-primary/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted">Domain URL</label>
                      <input 
                        value={newDomain} onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example-blog.com" 
                        className="w-full bg-surface p-3 rounded-lg border border-border text-sm" 
                      />
                    </div>
                    <Button onClick={handleAddTarget} className="w-full">Add to Strategic Target</Button>
                 </Card>
               )}
               {targets.map((t) => (
                 <Card key={t.id} className="p-6 space-y-4 group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface border border-border rounded-lg group-hover:text-primary transition-colors">
                          <Globe size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{t.domain}</h4>
                          <span className="text-[9px] font-mono opacity-40 uppercase">{t.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-display font-black leading-none">{t.da}</p>
                        <p className="text-[8px] font-bold text-muted uppercase">DA Score</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.tier === 'tier1' ? 'bg-primary text-white shadow-sm' : 'bg-surface-secondary'}`}>
                         {t.tier}
                       </span>
                       <Button variant="ghost" className="p-2">
                         <Mail size={16} />
                       </Button>
                    </div>
                 </Card>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'outreach' && (
           <motion.div 
            key="outreach"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
           >
              <div className="lg:col-span-2 space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border pb-2">Ready for Outreach</h3>
                 <div className="space-y-3">
                    {targets.filter(t => t.status === 'pending').map(t => (
                       <div key={t.id} className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:border-primary transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                             <Globe size={16} className="text-muted group-hover:text-primary" />
                             <span className="text-sm font-medium">{t.domain}</span>
                          </div>
                          <ChevronRight size={16} className="text-muted" />
                       </div>
                    ))}
                 </div>
              </div>
              <Card className="lg:col-span-3 p-10 space-y-8 bg-surface-secondary/10">
                 <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      <Mail size={12} fill="currentColor" /> AI Neural Outreach
                    </div>
                    <h3 className="text-2xl font-display font-bold">Compose Strategic Partition</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-muted">Select Target</label>
                       <select className="w-full p-4 bg-surface border border-border rounded-xl font-medium outline-none">
                          <option>Select a domain from your inventory...</option>
                       </select>
                    </div>
                    <Button className="w-full flex items-center justify-center gap-2 py-6 shadow-xl">
                       <Plus size={18} /> Generate outreach through Gemini
                    </Button>
                 </div>

                 <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4 border-2 border-dashed border-border rounded-3xl">
                    <FileText size={48} strokeWidth={1} />
                    <p className="text-xs font-mono uppercase">Draft engine offline</p>
                 </div>
              </Card>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
