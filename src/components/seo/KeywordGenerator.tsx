import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import { generateSEOArticle, analyzeSEO } from '../../services/ai/seoAgent';
import { createArticle } from '../../services/api/articles';
import { Article, Category } from '../../types/seo';
import { Sparkles, Loader2, Check, Zap, Target, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface KeywordGeneratorProps {
  categories: Category[];
}

export default function KeywordGenerator({ categories }: KeywordGeneratorProps) {
  const { companyId } = useStore();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [intent, setIntent] = useState<'traffic' | 'conversion'>('traffic');
  const [type, setType] = useState<'guide' | 'comparative' | 'landing'>('guide');
  const [articleType, setArticleType] = useState<'pillar' | 'support'>('pillar');
  const [parentSlug, setParentSlug] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!keyword || !category) return;
    setIsGenerating(true);
    try {
      // 1. Fetch related cluster articles to inject them in the prompt for internal linking
      const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      const q = query(
        collection(db, 'articles'),
        where('companyId', '==', companyId),
        where('cluster', '==', category),
        where('status', '==', 'published'), // Link only to published ones
        limit(5)
      );
      const snap = await getDocs(q);
      const internalLinks = snap.docs.map(d => {
        const data = d.data() as Article;
        return { title: data.title, url: `/blog/${data.slug}`, type: data.type };
      });

      const articleData = await generateSEOArticle({ 
        keyword, 
        intent, 
        type, 
        category,
        cluster: category,
        articleType,
        parentSlug,
        internalLinks // pass links
      });
      const seoResult = await analyzeSEO(articleData as any);
      
      const fullArticle: Partial<Article> = {
        ...articleData,
        seoScore: seoResult.score,
        category,
        cluster: category,
        type: articleType,
        parentSlug,
        status: 'draft',
      };
      
      const id = await createArticle(companyId, fullArticle);
      setResult({ ...fullArticle, id });
    } catch (error) {
       console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> AI Neural Forge
            </div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Generate Power Nodes</h2>
            <p className="text-muted text-sm leading-relaxed max-w-md">Gemini will architect a complete semantic article optimized for depth, readability, and conversion.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                <Target size={14} /> Main Target Keyword
              </label>
              <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., intelligence artificielle CRM" 
                className="w-full p-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                  <Layers size={14} /> Topical Cluster
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
                >
                  <option value="">Sélectionner un cluster</option>
                  {(categories.length > 0 ? categories : [{ name: 'Site Web Intelligent', slug: 'site-web' }, { name: 'CRM & Gestion', slug: 'crm' }]).map(cat => (
                    <option key={cat.id || cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                   <Target size={14} /> Type (Topical Authority)
                 </label>
                 <select 
                    value={articleType}
                    onChange={(e: any) => setArticleType(e.target.value)}
                    className="w-full p-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
                 >
                   <option value="pillar">★ Article Pilier</option>
                   <option value="support">↳ Article Support</option>
                 </select>
              </div>
            </div>

            {articleType === 'support' && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                  <BookOpen size={14} /> Slug de la page pilier parente
                </label>
                <input 
                  value={parentSlug}
                  onChange={(e) => setParentSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="ex: crm-intelligent-afrique" 
                  className="w-full p-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium font-mono text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                   <BookOpen size={14} /> Format
                 </label>
                 <select 
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
                 >
                   <option value="guide">Guide</option>
                   <option value="comparative">Comparative</option>
                   <option value="landing">SEO Landing</option>
                 </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Strategic Intent</label>
                <div className="flex bg-surface border border-border rounded-xl p-1 gap-1">
                  <button 
                    onClick={() => setIntent('traffic')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase rounded-lg transition-all ${intent === 'traffic' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-ink'}`}
                  >
                    <Zap size={14} /> Traffic
                  </button>
                  <button 
                    onClick={() => setIntent('conversion')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase rounded-lg transition-all ${intent === 'conversion' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-ink'}`}
                  >
                    <Target size={14} /> Conversion
                  </button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !keyword || !category}
              className="w-full p-8 flex justify-center items-center gap-3 shadow-xl"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="text-lg font-bold tracking-tight">
                {isGenerating ? 'Weaving Neural Connections...' : 'Forge Semantic Node'}
              </span>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full min-h-[400px] flex flex-col justify-center items-center gap-6 bg-surface-secondary/30 relative overflow-hidden group">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-center z-10 p-8"
                >
                  <div className="relative">
                     <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
                     <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display font-bold text-xl">Architecting Content</p>
                    <p className="text-xs text-muted leading-relaxed">Analyzing semantic clusters and optimizing keyword distribution density...</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center z-10 p-8"
                >
                  <div className="w-20 h-20 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl rotate-3">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Article Forged Successfully</p>
                      <h4 className="font-display font-bold text-2xl leading-tight">{result.title}</h4>
                    </div>
                    <div className="flex justify-center gap-3">
                      <div className="px-3 py-1 bg-ink text-white rounded-lg text-[10px] font-bold uppercase shadow-md flex items-center gap-1">
                         <Sparkles size={10} /> {result.seoScore}% SEO
                      </div>
                      <div className="px-3 py-1 bg-surface border border-border rounded-lg text-[10px] font-bold uppercase shadow-sm">
                         Draft
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setResult(null)}
                    className="w-full"
                  >
                    Generate Another Entity
                  </Button>
                </motion.div>
              ) : (
                <div key="idle" className="space-y-6 text-center z-10 p-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center mx-auto">
                    <Sparkles size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-xl uppercase tracking-tight">Engine Idle</p>
                    <p className="text-xs max-w-[200px] mx-auto">Configure your parameters to start the semantic generation process.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </Card>
        </div>
      </div>
    </div>
  );
}
