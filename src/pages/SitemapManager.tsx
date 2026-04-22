import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { subscribeArticles, subscribeCategories } from '../services/api/articles';
import { Article, Category } from '../types/seo';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Network, Download, Globe, Server, Layers, ChevronRight, File, Folder } from 'lucide-react';
import { generateSitemapXML } from '../services/api/seo';

export default function SitemapManager() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [baseUrl, setBaseUrl] = useState('https://kryptonai.com');

  useEffect(() => {
    if (!companyId) return;
    const unsubA = subscribeArticles(companyId, setArticles);
    const unsubC = subscribeCategories(companyId, setCategories);
    return () => { unsubA(); unsubC(); };
  }, [companyId]);

  const handleExport = () => {
    const xml = generateSitemapXML(articles, categories, baseUrl);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Sitemap Infrastructure</h1>
          <p className="text-muted text-sm">Review your semantic hierarchy and technical indexing nodes.</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download size={16} /> Export XML
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 space-y-4">
           <div className="flex items-center gap-2 text-primary">
             <Globe size={18} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Global Root</span>
           </div>
           <input 
             value={baseUrl}
             onChange={(e) => setBaseUrl(e.target.value)}
             className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm font-medium focus:outline-none focus:border-primary"
           />
           <p className="text-[10px] text-muted leading-tight">All relative paths will be prefixed with this domain for production indexing.</p>
         </Card>

         <Card className="md:col-span-2 p-6 flex justify-between items-center bg-primary/5 border-primary/20">
            <div className="flex gap-12">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Clusters</p>
                  <p className="text-3xl font-display font-bold text-primary">{categories.length || 4}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Indexed Nodes</p>
                  <p className="text-3xl font-display font-bold text-primary">{articles.length}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Last Update</p>
                  <p className="text-sm font-bold h-full flex items-center">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
            <Network size={48} className="opacity-10 text-primary" />
         </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
           <h3 className="font-bold text-sm uppercase tracking-tight">Arborescence Visuelle</h3>
           <div className="flex items-center gap-4 text-[10px] font-bold text-muted">
             <div className="flex items-center gap-1"><Folder size={12} /> Cluster</div>
             <div className="flex items-center gap-1"><File size={12} /> Page</div>
           </div>
        </div>

        <div className="p-8 space-y-4 bg-surface/30">
           {/* Static Mock Categories if none exist yet */}
           {(categories.length > 0 ? categories : [{ name: 'Site Web Intelligent', slug: 'site-web' }, { name: 'IA & Automatisation', slug: 'ia-auto' }]).map((cat, i) => (
             <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-lg group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <Folder size={14} className="text-primary" />
                  <span className="text-xs font-bold uppercase tracking-tight">{cat.name}</span>
                  <span className="ml-auto text-[10px] text-muted">/{cat.slug}</span>
                  <ChevronRight size={14} className="text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
                
                <div className="ml-8 border-l border-border pl-4 space-y-2">
                   {articles.filter(a => a.category === cat.slug).length > 0 ? articles.filter(a => a.category === cat.slug).map((art, j) => (
                     <div key={j} className="flex items-center gap-2 p-2 hover:bg-surface rounded-md transition-colors text-ink/70 hover:text-ink cursor-pointer">
                        <File size={12} />
                        <span className="text-xs font-medium">{art.title}</span>
                        <span className="ml-auto text-[9px] font-mono opacity-40">/{art.slug}</span>
                     </div>
                   )) : (
                     <div className="p-2 text-[10px] text-muted italic opacity-40">No nodes in this cluster yet.</div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
