import React from 'react';
import Card from '../components/ui/Card';
import { Sparkles, TrendingUp, Image as ImageIcon, Send, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function DiscoverEngine() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Google Discover Engine</h1>
          <p className="text-muted text-sm">Target viral spikes with high-CTR headlines and optimized assets.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Sparkles size={16} /> Predict Trends
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="bg-surface p-6 border-b border-border">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Current Viral Opportunities
              </h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { title: "Comment l'IA de Krypton a sauvé 400 PME en 2024", ctr: "12.4%", trend: "Up" },
                { title: "Pourquoi le SEO traditionnel est mort (et ce qu'il faut faire)", ctr: "9.8%", trend: "Steady" },
                { title: "Le secret des entrepreneurs qui publient 50 articles par jour", ctr: "15.2%", trend: "Viral" },
              ].map((opt, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-secondary rounded-lg flex items-center justify-center text-muted group-hover:text-primary">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{opt.title}</h4>
                      <p className="text-[10px] text-muted">Ready to generate assets.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-primary">{opt.ctr} CTR</div>
                    <div className={`text-[9px] font-bold uppercase ${opt.trend === 'Viral' ? 'text-accent' : 'text-muted'}`}>{opt.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <ImageIcon size={18} className="text-accent" />
              Dynamic Image Generation
            </h3>
            <div className="grid grid-cols-3 gap-4">
               {[1,2,3].map(i => (
                 <div key={i} className="aspect-video bg-surface rounded-xl border border-border flex items-center justify-center relative overflow-hidden group">
                   <img src={`https://picsum.photos/seed/krypton${i}/400/225`} alt="Visual" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <ImageIcon size={24} className="text-white/50" />
                   </div>
                 </div>
               ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">Regenerate Media Set</Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Clock size={18} className="text-muted" />
              Peak Hour Strategy
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Prochaine fenêtre :</span>
                <span className="font-bold">06:45 AM</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full">
                <div className="w-[75%] h-full bg-accent rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
              <p className="text-[10px] text-muted italic">"L'audimat est maximal le lundi matin entre 6h et 8h pour les sujets Business."</p>
            </div>
          </Card>

          <Card className="p-6 bg-surface border-border">
            <h3 className="text-sm font-bold mb-4">A/B Headline Tester</h3>
            <div className="space-y-4">
               <div className="p-3 bg-surface-secondary rounded border border-border text-[11px] relative">
                 <span className="absolute -top-2 left-3 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-black">A</span>
                 Comment doubler son trafic SEO en 30 jours.
               </div>
               <div className="p-3 bg-surface-secondary rounded border border-primary/50 text-[11px] relative">
                 <span className="absolute -top-2 left-3 bg-accent text-white text-[8px] px-1.5 py-0.5 rounded font-black">B</span>
                 L'IA qui a généré 1 million de visites : Révélations.
               </div>
               <Button size="sm" className="w-full">Deploy Winning Variation</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
