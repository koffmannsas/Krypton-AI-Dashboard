import React, { useState } from 'react';
import { Article, Category } from '../../types/seo';
import { generateSitemapXML } from '../../services/api/seo';
import { Download, Globe, Server, Layers, Network, ChevronRight, File, Folder } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface SitemapGeneratorProps {
  articles: Article[];
  categories: Category[];
}

export default function SitemapGenerator({ articles, categories }: SitemapGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState('https://kryptonai.com');

  const handleDownload = () => {
    const xml = generateSitemapXML(articles, categories, baseUrl);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 md:p-12 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h2 className="text-3xl font-display font-bold tracking-tight">Technical Infrastructure</h2>
          <p className="text-muted text-sm max-w-md italic">Manage your XML sitemap nodes and semantic arborescence layer.</p>
        </div>
        <Button 
          onClick={handleDownload}
          className="flex items-center gap-2 shadow-lg"
        >
          <Download size={16} /> Export XML
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6 bg-surface-secondary/20">
          <div className="flex items-center gap-2 text-primary">
            <Globe size={18} />
            <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">Global Root Configuration</h3>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted mb-1 block">Production Domain</label>
            <input 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:border-primary transition-all font-medium text-sm"
            />
          </div>
        </Card>

        <Card className="p-8 space-y-6 bg-surface-secondary/20">
          <div className="flex items-center gap-2 text-primary">
            <Server size={18} />
            <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">Node Distribution Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-bg border border-border rounded-2xl flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-all">
              <span className="text-3xl font-display font-bold text-primary">{categories.length || 4}</span>
              <span className="text-[10px] font-bold tracking-tighter opacity-40 uppercase">Clusters</span>
            </div>
            <div className="p-6 bg-bg border border-border rounded-2xl flex flex-col items-center justify-center gap-1 group hover:border-primary/30 transition-all">
              <span className="text-3xl font-display font-bold text-primary">{articles.length}</span>
              <span className="text-[10px] font-bold tracking-tighter opacity-40 uppercase">Indexed Page Nodes</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-3">
             <Layers size={20} className="text-primary" />
             <h3 className="text-xs font-black uppercase tracking-widest text-ink">Arborescence Visuelle</h3>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-muted">
            <div className="flex items-center gap-1.5"><Folder size={12} className="text-primary" /> Cluster</div>
            <div className="flex items-center gap-1.5"><File size={12} /> Page</div>
          </div>
        </div>

        <div className="space-y-6">
           {(categories.length > 0 ? categories : [
             { name: 'Site Web Intelligent', slug: 'site-web' }, 
             { name: 'IA Business', slug: 'ia-business' },
             { name: 'Marketing Automation', slug: 'marketing' }
           ]).map((cat, i) => (
             <div key={i} className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Folder size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-tight">{cat.name}</span>
                    <span className="text-[10px] font-mono text-muted opacity-60 italic">/{cat.slug}</span>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </div>
                
                <div className="ml-10 border-l-2 border-primary/10 pl-6 space-y-3">
                   {articles.filter(a => a.category === cat.slug).length > 0 ? (
                     articles.filter(a => a.category === cat.slug).map((art, j) => (
                        <div key={j} className="flex items-center gap-3 p-3 bg-white/30 hover:bg-white border-transparent hover:border-border border rounded-xl transition-all text-muted hover:text-ink cursor-pointer group/node">
                           <File size={14} className="group-hover/node:text-primary transition-colors" />
                           <span className="text-xs font-medium">{art.title}</span>
                           <span className="ml-auto text-[9px] font-mono opacity-40">/{art.slug}</span>
                        </div>
                     ))
                   ) : (
                     <div className="py-2 text-[10px] text-muted opacity-30 italic font-mono uppercase tracking-widest pl-2">Node collection empty</div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
