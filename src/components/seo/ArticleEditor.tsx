import React, { useState, useEffect } from 'react';
import { Article } from '../../types/seo';
import { calculateSEOScore } from '../../lib/seo-analyzer';
import { updateArticle, deleteArticle } from '../../services/api/articles';
import { 
  X, 
  Save, 
  Trash2, 
  Globe, 
  Eye, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Layout,
  Search,
  ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface Props {
  article: Article;
  onClose: () => void;
}

export default function ArticleEditor({ article, onClose }: Props) {
  const [data, setData] = useState<Article>(article);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const score = calculateSEOScore(data);

  const handleSave = async () => {
    const finalData = {
      ...data,
      seoScore: score.score
    };
    await updateArticle(article.id, finalData);
    onClose();
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500 bg-green-500/10';
    if (s >= 50) return 'text-accent bg-accent/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[60] flex justify-end">
      <div className="w-full max-w-5xl bg-surface h-full border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors">
              <X size={20} />
            </button>
            <h2 className="font-display font-bold text-lg truncate max-w-sm">{data.title || "Nouvel Article"}</h2>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${getScoreColor(score.score)}`}>
               SEO: {score.score}/100
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" size="sm" onClick={() => deleteArticle(article.id).then(onClose)} className="text-red-500 hover:bg-red-500/5">
                <Trash2 size={16} />
             </Button>
             <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
                <Save size={16} /> Enregistrer
             </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-surface px-6 pt-2">
           {[
             { id: 'content', label: 'Contenu', icon: <Layout size={14} /> },
             { id: 'seo', label: 'Optimisation SEO', icon: <Search size={14} /> },
             { id: 'settings', label: 'Configuration', icon: <Settings size={14} /> }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                 activeTab === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted hover:text-ink'
               }`}
             >
               {tab.icon}
               {tab.label}
             </button>
           ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted">Titre de l'article</label>
                  <input
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full text-4xl font-display font-bold bg-transparent border-none outline-none placeholder:text-muted/30"
                    placeholder="Entrez votre titre..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted">Contenu (HTML)</label>
                  <textarea
                    value={data.content}
                    onChange={(e) => setData({ ...data, content: e.target.value })}
                    className="w-full min-h-[500px] bg-transparent border border-border/50 rounded-xl p-6 font-sans text-lg leading-relaxed outline-none focus:border-primary transition-all resize-none"
                    placeholder="Écrivez votre contenu ici..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-10">
                {/* Google Snippet Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Globe size={16} className="text-primary" /> Preview Google
                  </h3>
                  <div className="bg-white p-6 rounded-xl border border-border shadow-sm max-w-2xl font-sans">
                    <div className="text-[12px] text-gray-500 mb-1">https://krypton.ai/blog/{data.slug || "..."}</div>
                    <div className="text-[20px] text-[#1a0dab] font-medium leading-tight mb-1 hover:underline cursor-pointer">
                      {data.metaTitle || data.title}
                    </div>
                    <div className="text-[14px] text-gray-700 leading-normal">
                      <span className="text-gray-500">22 avr. 2024 — </span>
                      {data.metaDescription || "Saisissez une meta description pour voir l'aperçu du snippet Google..."}
                    </div>
                  </div>
                </div>

                {/* SEO Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 space-y-4">
                    <h4 className="text-xs font-black uppercase text-muted border-b border-border pb-2">Checklist SEO</h4>
                    <div className="space-y-3">
                       {[
                         { label: 'Longueur du contenu', ok: score.details.length },
                         { label: 'Densité du mot-clé', ok: score.details.density },
                         { label: 'Structure H1/H2', ok: score.details.headings },
                         { label: 'Meta données', ok: score.details.meta },
                         { label: 'Lien internes', ok: score.details.internalLinks },
                         { label: 'Optimisation images', ok: score.details.images },
                       ].map(item => (
                         <div key={item.label} className="flex items-center justify-between">
                            <span className="text-sm">{item.label}</span>
                            {item.ok ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-400" />}
                         </div>
                       ))}
                    </div>
                  </Card>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase text-muted">Mot-clé Principal</label>
                        {data.intent && (
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-accent/10 text-accent">Intent: {data.intent}</span>
                        )}
                      </div>
                      <input 
                        value={data.mainKeyword}
                        onChange={(e) => setData({ ...data, mainKeyword: e.target.value })}
                        className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm font-bold"
                        placeholder="Ex: SaaS automation tools"
                      />
                    </div>
                    
                    {data.keywordVariants && data.keywordVariants.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted">Variantes de mots-clés (Query Dominance)</label>
                        <div className="flex flex-wrap gap-2">
                           {data.keywordVariants.map((v, i) => (
                              <span key={i} className="text-[10px] bg-primary/5 text-primary px-2 py-1 rounded-full font-bold border border-primary/20">
                                {v}
                              </span>
                           ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                         <label className="text-[10px] font-black uppercase text-muted">Meta Title</label>
                         {data.linkPriority && (
                           <span className="text-[9px] uppercase tracking-widest text-muted">
                             Priorité de lien: <span className="text-ink font-bold">Lvl {data.linkPriority}</span>
                           </span>
                         )}
                      </div>
                      <input 
                        value={data.metaTitle}
                        onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                        className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm"
                        placeholder="Entrez le meta title (60 chars)"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   {/* Description at left */}
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted">Meta Description</label>
                     <textarea 
                       value={data.metaDescription}
                       onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                       className="w-full bg-surface border border-border rounded-lg p-3 text-sm h-32 resize-none"
                       placeholder="Entrez la meta description (160 chars)"
                     />
                   </div>
                   
                   {/* Advanced Tools at right */}
                   <div className="space-y-4">
                      {data.entities && data.entities.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted flex items-center gap-1">
                             Semantic Entities
                          </label>
                          <div className="flex flex-wrap gap-1">
                             {data.entities.map((e, i) => (
                                <span key={i} className="text-[9px] font-mono bg-border px-1.5 py-0.5 rounded text-muted">
                                  #{e}
                                </span>
                             ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-border">
                        <label className="text-[10px] font-black uppercase text-muted mb-2 block">Freshness Engine</label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-center flex items-center gap-2 group border-accent/30 text-accent hover:bg-accent/10"
                          onClick={async () => {
                             const { refreshSEOArticle } = await import('../../services/ai/seoAgent');
                             try {
                               const updates = await refreshSEOArticle(data);
                               setData({ ...data, ...updates });
                             } catch (e) {
                               alert('Error refreshing article');
                             }
                          }}
                        >
                          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Force AI Content Refresh
                        </Button>
                        <p className="text-[9px] text-muted italic mt-2">
                           L'IA va rajouter une FAQ Schema.org, des entités et rafraichir les dates (Simule le Freshness Engine).
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted">Slug URL</label>
                      <div className="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg">
                        <span className="text-xs text-muted">/blog/</span>
                        <input 
                          value={data.slug} 
                          onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          className="flex-1 bg-transparent border-none outline-none text-xs font-mono"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted flex justify-between items-center">
                         Statut de l'article
                         {data.status === 'published' && score.score < 70 && (
                           <span className="text-red-500 font-bold">SEO Score &lt; 70 requis</span>
                         )}
                      </label>
                      <select 
                        value={data.status}
                        onChange={(e) => {
                          if (e.target.value === 'published' && score.score < 70) {
                            alert('La publication est bloquée. Le score SEO doit être de 70 ou supérieur.');
                            return;
                          }
                          setData({ ...data, status: e.target.value as any })
                        }}
                        className={`w-full bg-surface border rounded-lg p-2.5 text-sm font-bold ${
                          data.status === 'published' && score.score < 70 ? 'border-red-500 text-red-500' : 'border-border'
                        }`}
                      >
                         <option value="draft">Brouillon</option>
                         <option value="pending">En attente (IA)</option>
                         <option value="published" disabled={score.score < 70}>Publié {score.score < 70 ? '(Min. 70 SEO)' : '✓'}</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted">Topic Cluster</label>
                      <input 
                        value={data.cluster}
                        onChange={(e) => setData({ ...data, cluster: e.target.value })}
                        className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm font-bold"
                        placeholder="Ex: Growth Marketing"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted">Type de contenu (Topical Authority)</label>
                      <select 
                        value={data.type || 'support'}
                        onChange={(e) => setData({ ...data, type: e.target.value as any })}
                        className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm font-bold"
                      >
                         <option value="pillar">Article Pilier (Guide complet)</option>
                         <option value="support">Article Support (Longue traîne)</option>
                      </select>
                   </div>
                   
                   {data.type === 'support' && (
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted">Slug de l'Article Pilier</label>
                        <input 
                          value={data.parentSlug || ''}
                          onChange={(e) => setData({ ...data, parentSlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm font-bold font-mono"
                          placeholder="ex: crm-intelligent-afrique"
                        />
                        <p className="text-[10px] text-muted italic">Lié à la page pilier pour renforcer le maillage interne en silo.</p>
                     </div>
                   )}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-border bg-surface-secondary/30 text-[10px] flex justify-between uppercase font-bold tracking-widest text-muted">
           <span>ID: {article.id}</span>
           <span>Mis à jour: {article.updatedAt?.toDate?.()?.toLocaleString() || "À l'instant"}</span>
        </div>
      </div>
    </div>
  );
}
