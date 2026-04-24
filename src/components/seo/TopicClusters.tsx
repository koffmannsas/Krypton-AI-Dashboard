import React from 'react';
import { useStore } from '../../context/useStore';
import Card from '../ui/Card';
import { Network, Target, Plus, Database, ChevronRight, Activity } from 'lucide-react';
import Button from '../ui/Button';

export default function TopicClusters() {
  const clusters = [
    { name: 'IA pour PME', status: '80%', pillar: 'Guide Ultime Automatisation', pages: 12 },
    { name: 'Cybersecurity 2024', status: '45%', pillar: 'Sécuriser son infrastructure', pages: 6 },
    { name: 'Marketing Automation', status: '95%', pillar: 'Stratégies Growth 2024', pages: 18 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Network size={20} className="text-primary" />
          Semantic Cocoon & Topic Clusters
        </h3>
        <Button size="sm" className="flex items-center gap-2">
          <Plus size={16} /> New Cluster
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => (
          <Card key={cluster.name} className="p-5 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h4 className="font-bold text-ink">{cluster.name}</h4>
                 <p className="text-[10px] text-muted font-mono uppercase tracking-widest mt-1">Pillar: {cluster.pillar}</p>
               </div>
               <div className="text-right">
                 <div className="text-xs font-black text-primary">{cluster.status}</div>
                 <div className="text-[9px] text-muted">Coverage</div>
               </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: cluster.status }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-[10px] text-muted font-bold">{cluster.pages} Cluster Pages</span>
              <button className="text-primary group-hover:translate-x-1 transition-transform">
                <ChevronRight size={18} />
              </button>
            </div>
          </Card>
        ))}

        <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 text-muted hover:text-primary hover:border-primary/50 transition-all cursor-pointer group">
           <Plus size={32} className="group-hover:scale-110 transition-transform" />
           <p className="text-sm font-bold mt-2">Generate AI Cluster</p>
           <p className="text-[10px] opacity-60">Detect gaps in authority automatically</p>
        </div>
      </div>

      <div className="mt-12 bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-surface-secondary/30">
          <h4 className="font-bold flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            Authority Coverage Gap Analysis
          </h4>
        </div>
        <div className="p-8">
           <div className="flex items-center justify-center p-12 text-center text-muted italic text-xs">
              "System is scanning niches: Competitive landscape analysis at 65%... <br/>
              Detected 4 high-value low-competition clusters in 'Green Fintech' sector."
           </div>
        </div>
      </div>
    </div>
  );
}
