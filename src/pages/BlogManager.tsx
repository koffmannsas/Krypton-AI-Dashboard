import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { subscribeArticles, createArticle, updateArticle } from '../services/api/articles';
import { Article } from '../types/seo';
import ArticleEditor from '../components/seo/ArticleEditor';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  LayoutGrid, 
  List, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import HumanizerEngine from '../components/seo/HumanizerEngine';

export default function BlogManager() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState<'inventory' | 'humanizer'>('inventory');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    return subscribeArticles(companyId, setArticles);
  }, [companyId]);

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    pending: articles.filter(a => a.status === 'pending').length,
    avgScore: articles.length > 0 ? Math.round(articles.reduce((acc, a) => acc + (a.seoScore || 0), 0) / articles.length) : 0
  };

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase()) || 
                          (a.mainKeyword || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGenerateAI = async () => {
    if (!companyId) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await createArticle(companyId, {
        title: "Nouvel article optimisé par IA",
        slug: "article-ia-" + Date.now(),
        mainKeyword: "SaaS SEO automation",
        content: "<h1>Titre H1</h1><p>Contenu généré par l'IA...</p><h2>Sous-titre H2</h2>",
        status: 'pending',
        seoScore: 40,
        cluster: "Général"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const statusTags = {
    published: { color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle size={10} /> },
    draft: { color: 'text-muted', bg: 'bg-surface-secondary', icon: <FileText size={10} /> },
    pending: { color: 'text-accent', bg: 'bg-accent/10', icon: <Sparkles size={10} /> },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', icon: <AlertCircle size={10} /> }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Krypton Content Engine</h1>
          <p className="text-muted text-sm">Génération IA, Humanisation et Inventaire de contenu.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface border border-border p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('humanizer')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'humanizer' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink'}`}
            >
              Humanizer
            </button>
          </div>
          <Button 
            variant="outline" 
            onClick={handleGenerateAI} 
            disabled={isGenerating}
            className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "Génération..." : "AI Content Forge"}
          </Button>
          <Button onClick={() => setEditingArticle({} as Article)} className="flex items-center gap-2">
            <Plus size={16} /> New Article
          </Button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Articles', value: stats.total, icon: <FileText size={20} />, color: 'text-ink' },
              { label: 'Publiés', value: stats.published, icon: <CheckCircle size={20} />, color: 'text-green-500' },
              { label: 'En attente IA', value: stats.pending, icon: <Sparkles size={20} />, color: 'text-accent' },
              { label: 'Score SEO Moyen', value: stats.avgScore + '%', icon: <TrendingUp size={20} />, color: 'text-primary' },
            ].map(stat => (
              <Card key={stat.label} className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted tracking-widest">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-2 rounded-xl bg-surface-secondary ${stat.color}`}>
                  {stat.icon}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-secondary/50">
            <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 w-full md:w-96 focus-within:border-primary/50 transition-all">
              <Search size={16} className="text-muted" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-surface border border-border rounded-lg p-1">
                 {(['all', 'published', 'draft', 'pending'] as const).map(f => (
                   <button
                     key={f}
                     onClick={() => setFilter(f as any)}
                     className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>

              <div className="flex bg-surface border border-border rounded-lg p-1">
                 <button onClick={() => setView('table')} className={`p-1.5 rounded-md ${view === 'table' ? 'bg-primary/10 text-primary' : 'text-muted'}`}>
                    <List size={16} />
                 </button>
                 <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted'}`}>
                    <LayoutGrid size={16} />
                 </button>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {view === 'table' ? (
              <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <Card className="p-0 overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">
                          <tr>
                            <th className="px-6 py-4">Article</th>
                            <th className="px-6 py-4">Cluster / Topic</th>
                            <th className="px-6 py-4">Mot-clé</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4">Score SEO</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredArticles.map(article => (
                            <tr key={article.id} className="hover:bg-surface-secondary/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                   <span className="font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => setEditingArticle(article)}>
                                     {article.title}
                                   </span>
                                   <span className="text-[10px] text-muted truncate max-w-[200px]">/blog/{article.slug}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="font-mono text-[11px] font-bold text-ink bg-surface border border-border px-2 py-0.5 rounded w-fit">{article.cluster || 'Général'}</span>
                                  {article.type === 'pillar' ? (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#FFB020]">★ Page Pilier</span>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted">↳ Support {article.parentSlug ? `(${article.parentSlug})` : ''}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-[11px] font-bold text-muted">{article.mainKeyword}</td>
                              <td className="px-6 py-4">
                                 <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusTags[article.status as keyof typeof statusTags]?.bg} ${statusTags[article.status as keyof typeof statusTags]?.color}`}>
                                    {statusTags[article.status as keyof typeof statusTags]?.icon}
                                    {article.status}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <span className="font-bold text-[11px] bg-primary/10 text-primary px-2 py-1 rounded-lg">
                                  {article.seoScore}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => setEditingArticle(article)} className="p-2 hover:bg-primary/10 text-muted hover:text-primary rounded-lg transition-all">
                                    <ChevronRight size={18} />
                                 </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                 </Card>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredArticles.map((article) => (
                   <Card 
                     key={article.id} 
                     className="flex flex-col gap-4 group hover:border-primary/50 cursor-pointer"
                     onClick={() => setEditingArticle(article)}
                   >
                      <div className="flex justify-between items-start">
                        <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${statusTags[article.status as keyof typeof statusTags]?.bg} ${statusTags[article.status as keyof typeof statusTags]?.color}`}>
                           {statusTags[article.status as keyof typeof statusTags]?.icon}
                           {article.status}
                        </div>
                        <div className="text-[11px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {article.seoScore}% SEO
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-2">{article.mainKeyword}</p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border flex justify-between items-center mt-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono font-bold text-ink uppercase">{article.cluster || 'Général'}</span>
                          {article.type === 'pillar' ? (
                            <span className="text-[9px] font-black uppercase text-[#FFB020]">★ Page Pilier</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-muted">↳ Support</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-muted">{article.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</span>
                      </div>
                   </Card>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <HumanizerEngine />
      )}

      {editingArticle && (
        <ArticleEditor 
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}
