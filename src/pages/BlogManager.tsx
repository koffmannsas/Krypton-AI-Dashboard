import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { subscribeArticles, subscribeCategories, updateArticle, deleteArticle } from '../services/api/articles';
import { Article, Category } from '../types/seo';
import ArticleTable from '../components/seo/ArticleTable';
import ArticleEditor from '../components/seo/ArticleEditor';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Search, Filter, Plus, FileText, CheckCircle, Clock, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import HumanizerEngine from '../components/seo/HumanizerEngine';

export default function BlogManager() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState<'inventory' | 'humanizer'>('inventory');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!companyId) return;
    return subscribeArticles(companyId, setArticles);
  }, [companyId]);

  const filteredArticles = articles.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || 
                          a.mainKeyword?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSave = async (updates: Partial<Article>) => {
    if (!companyId || !editingArticle?.id) return;
    await updateArticle(companyId, editingArticle.id, updates);
    setEditingArticle(null);
  };

  const statusTags = {
     published: { icon: <CheckCircle size={12} />, class: 'bg-green-500/10 text-green-500' },
     draft: { icon: <FileText size={12} />, class: 'bg-muted/10 text-muted' },
     scheduled: { icon: <Clock size={12} />, class: 'bg-primary/10 text-primary' },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Krypton Content Engine</h1>
          <p className="text-muted text-sm">IA-Powered content generation, humanization and inventory.</p>
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
          <Button className="flex items-center gap-2">
            <Plus size={16} /> New Article
          </Button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
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
                 {(['all', 'published', 'draft', 'scheduled'] as const).map(f => (
                   <button
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>

              <div className="h-6 w-px bg-border hidden md:block" />

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
                   <ArticleTable 
                      articles={filteredArticles} 
                      onEdit={setEditingArticle} 
                   />
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
                        <div className={`px-2 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold uppercase ${statusTags[article.status as keyof typeof statusTags]?.class}`}>
                           {statusTags[article.status as keyof typeof statusTags]?.icon}
                           {article.status}
                        </div>
                        <div className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {article.seoScore}% SEO
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-xs text-muted mt-2 line-clamp-2">{article.content?.replace(/<[^>]*>/g, '')}</p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted uppercase">
                        <span>{article.mainKeyword}</span>
                        <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}</span>
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
          onSave={handleSave}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}
