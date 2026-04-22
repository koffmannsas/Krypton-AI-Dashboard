import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { subscribeArticles, subscribeCategories } from '../services/api/articles';
import { Article, Category } from '../types/seo';
import ArticleTable from '../components/seo/ArticleTable';
import KeywordGenerator from '../components/seo/KeywordGenerator';
import SitemapGenerator from '../components/seo/SitemapGenerator';
import ArticleEditor from '../components/seo/ArticleEditor';
import KeywordManager from '../components/seo/KeywordManager';
import Button from '../components/ui/Button';
import { FileText, Sparkles, Map, Calendar, LayoutDashboard, Zap, Target } from 'lucide-react';
import { updateArticle } from '../services/api/articles';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';

export default function SEO() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'generator' | 'sitemap' | 'agent'>('articles');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!companyId) return;
    const unsubArticles = subscribeArticles(companyId, setArticles);
    const unsubCategories = subscribeCategories(companyId, setCategories);
    return () => {
      unsubArticles();
      unsubCategories();
    };
  }, [companyId]);

  const handleSaveArticle = async (updates: Partial<Article>) => {
    if (!companyId || !editingArticle?.id) return;
    await updateArticle(companyId, editingArticle.id, updates);
    setEditingArticle(null);
  };

  const seoStats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    avgScore: Math.round(articles.reduce((acc, a) => acc + (a.seoScore || 0), 0) / (articles.length || 1)),
    scheduled: articles.filter(a => a.status === 'scheduled').length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end pb-2">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">AI Content Forge</h1>
          <p className="text-muted text-sm">Automated Semantic Cocooning & Optimization Agent.</p>
        </div>
        <div className="flex bg-surface border border-border p-1 rounded-xl">
          {[
            { id: 'articles', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
            { id: 'agent', label: 'Agent Engine', icon: <Target size={14} /> },
            { id: 'generator', label: 'Forge Manual', icon: <Zap size={14} /> },
            { id: 'sitemap', label: 'Sitemap', icon: <Map size={14} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink hover:bg-surface-secondary'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Inventory', value: seoStats.total, icon: <FileText size={18} />, detail: 'Total Articles' },
          { label: 'Published', value: seoStats.published, icon: <Sparkles size={18} />, detail: 'Live on Web' },
          { label: 'Avg Quality', value: `${seoStats.avgScore}%`, icon: <Map size={18} />, detail: 'SEO Performance' },
          { label: 'Pipeline', value: seoStats.scheduled, icon: <Calendar size={18} />, detail: 'Scheduled Posts' },
        ].map((stat, i) => (
          <StatCard 
            key={i}
            title={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="p-0 overflow-hidden min-h-[500px]">
        {activeTab === 'articles' && (
          <ArticleTable 
            articles={articles} 
            onEdit={(art) => setEditingArticle(art)}
          />
        )}
        {activeTab === 'generator' && (
          <KeywordGenerator categories={categories} />
        )}
        {activeTab === 'agent' && (
          <div className="p-8">
            <KeywordManager />
          </div>
        )}
        {activeTab === 'sitemap' && (
          <SitemapGenerator articles={articles} categories={categories} />
        )}
      </Card>

      {editingArticle && (
        <ArticleEditor 
          article={editingArticle}
          onSave={handleSaveArticle}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}
