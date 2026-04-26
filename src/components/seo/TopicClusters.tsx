import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/useStore';
import Card from '../ui/Card';
import { Network, Plus, Activity, Layers, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { subscribeArticles } from '../../services/api/articles';
import { Article } from '../../types/seo';

export default function TopicClusters() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!companyId) return;
    const unsub = subscribeArticles(companyId, setArticles);
    return () => unsub();
  }, [companyId]);

  // Group by cluster
  const clusters = articles.reduce((acc, current) => {
    const clusterName = current.cluster || 'Général';
    if (!acc[clusterName]) acc[clusterName] = [];
    acc[clusterName].push(current);
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Network size={20} className="text-primary" />
          Semantic Cocoon & Topic Clusters (Live)
        </h3>
        <Button size="sm" className="flex items-center gap-2">
          <Plus size={16} /> Nouveau Cluster
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(clusters).map(([clusterName, clusterArticles]) => {
          const pillars = clusterArticles.filter(a => a.type === 'pillar');
          const supports = clusterArticles.filter(a => a.type === 'support');
          
          return (
            <Card key={clusterName} className="p-0 overflow-hidden hover:border-primary/50 transition-all group">
              <div className="p-5 border-b border-border bg-surface-secondary/20 flex justify-between items-start">
                 <div>
                   <h4 className="font-bold text-ink truncate max-w-[180px]">{clusterName}</h4>
                   <p className="text-[10px] text-muted font-mono uppercase tracking-widest mt-1">
                     {clusterArticles.length} pages
                   </p>
                 </div>
                 <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary">
                       Actif
                    </span>
                 </div>
              </div>

              <div className="p-5 p-4 space-y-4">
                 {pillars.length > 0 ? pillars.map(pillar => (
                   <div key={pillar.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFB020] text-xs">★</span>
                        <span className="text-sm font-bold truncate max-w-[200px]" title={pillar.title}>{pillar.title}</span>
                      </div>
                      
                      {/* Enfant support */}
                      <div className="pl-4 space-y-2 border-l-2 border-border/50 ml-1.5 mt-2">
                         {supports.filter(s => s.parentSlug === pillar.slug).map(support => (
                           <div key={support.id} className="flex items-center gap-2 text-xs">
                             <div className="w-4 h-[1px] bg-border/50" />
                             <span className="truncate text-muted hover:text-ink transition-colors cursor-pointer" title={support.title}>↳ {support.title}</span>
                           </div>
                         ))}
                         {supports.filter(s => s.parentSlug === pillar.slug).length === 0 && (
                           <span className="text-[10px] text-muted italic pl-6">Aucun article support</span>
                         )}
                      </div>
                   </div>
                 )) : (
                   <div className="text-xs text-muted italic">Aucun article pilier défini.</div>
                 )}
                 
                 {/* Support orphelins */}
                 {supports.filter(s => !pillars.some(p => p.slug === s.parentSlug)).length > 0 && (
                   <div className="pt-3 mt-3 border-t border-border border-dashed">
                      <div className="text-[10px] uppercase font-black tracking-widest text-muted mb-2">Orphelins (Sans parent)</div>
                      {supports.filter(s => !pillars.some(p => p.slug === s.parentSlug)).map(s => (
                        <div key={s.id} className="text-xs truncate text-muted ml-2 border-l-2 border-red-500/30 pl-2">
                          ⚠ {s.title}
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </Card>
          );
        })}

        <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 text-muted hover:text-primary hover:border-primary/50 transition-all cursor-pointer group min-h-[300px]">
           <Layers size={32} className="group-hover:scale-110 transition-transform mb-3 text-primary/50" />
           <p className="text-sm font-bold">Générer un Cluster (IA)</p>
           <p className="text-[10px] opacity-60 text-center mt-2 px-4">L'IA analysera votre niche pour proposer une map complète (1 Pilier + 10 Supports)</p>
        </div>
      </div>
    </div>
  );
}
