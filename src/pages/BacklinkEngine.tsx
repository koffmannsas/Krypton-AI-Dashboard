import React from 'react';
import Card from '../components/ui/Card';
import { Link as LinkIcon, Share2, Globe, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

export default function BacklinkEngine() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Backlink Engine</h1>
          <p className="text-muted text-sm">Generate outreach campaigns and track domain authority growth.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Share2 size={16} /> Broadcast Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Globe size={18} className="text-primary" />
            Linkable Assets Status
          </h3>
          <div className="space-y-4">
             {[
               { title: "Statistiques IA PME 2024 (Original Dataset)", links: 12, quality: "High" },
               { title: "Le calculateur ROI Krypton AI", links: 8, quality: "High" },
               { title: "Guide: La fin des cookies tiers", links: 3, quality: "Medium" },
             ].map((asset, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border group hover:border-primary/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center text-primary">
                     <LinkIcon size={18} />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{asset.title}</h4>
                     <p className="text-[10px] text-muted">Quality: {asset.quality}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-lg font-black text-ink">{asset.links}</div>
                   <div className="text-[9px] text-muted uppercase font-bold">Backlinks</div>
                 </div>
               </div>
             ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h3 className="text-sm font-bold tracking-tight">Domain Authority Forge</h3>
            <div className="flex flex-col items-center py-4">
               <div className="text-5xl font-black text-primary">34</div>
               <div className="text-[10px] font-bold text-muted uppercase mt-2">Target: DA 50</div>
               <div className="w-full h-1 bg-border rounded-full mt-6 overflow-hidden">
                 <div className="w-[68%] h-full bg-primary" />
               </div>
            </div>
            <p className="text-[9px] text-muted text-center italic">"System estimates DA 40 by next month via Medium & LinkedIn syndication."</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-black uppercase text-muted mb-4">Outreach Pipeline</h3>
            <div className="space-y-2">
               {[
                 { platform: 'Medium', status: 'Sent' },
                 { platform: 'LinkedIn', status: 'Scheduled' },
                 { platform: 'Partnersites', status: 'Pitching' },
               ].map(p => (
                 <div key={p.platform} className="flex justify-between items-center text-xs p-2.5 bg-surface-secondary rounded-lg">
                   <span className="font-bold">{p.platform}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black ${p.status === 'Sent' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>{p.status}</span>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
           <h3 className="font-bold">Live Backlink Feed</h3>
           <Button variant="outline" size="sm">Refresh API</Button>
        </div>
        <div className="divide-y divide-border">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-muted">New link from</span>
                <span className="font-bold text-primary">tech-crunch-mirror.com</span>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span>Anchor: "IA Automatisation PME"</span>
                <ExternalLink size={14} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
