import React from 'react';
import Card from '../components/ui/Card';
import { Map, Layers, FileText, Plus, Database } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ProgrammaticEngine() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Programmatic SEO Engine</h1>
        <p className="text-muted text-sm">Generate thousands of pages from datasets (Cities, Jobs, Intentions).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Database size={18} className="text-primary" />
              Datasets
            </h3>
            <Button size="sm" variant="outline">Import</Button>
          </div>
          <div className="space-y-2">
            {['Villes de France', 'Métiers SaaS', 'Intentions B2B'].map(set => (
              <div key={set} className="flex justify-between text-xs p-2 bg-surface rounded border border-border">
                <span>{set}</span>
                <span className="text-primary font-bold">Loaded</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Layers size={18} className="text-accent" />
              Dynamic Templates
            </h3>
            <Button size="sm">Create Template</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border p-4 rounded-xl bg-surface-secondary/50">
              <h4 className="text-sm font-bold mb-1">Meilleur [Métier] à [Ville]</h4>
              <p className="text-[10px] text-muted mb-3">Targeting local search intent.</p>
              <div className="flex gap-2">
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded">840 Pages</span>
                <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Active</span>
              </div>
            </div>
            <div className="border border-border p-4 rounded-xl border-dashed bg-transparent flex flex-col items-center justify-center text-muted cursor-pointer hover:border-primary transition-colors">
              <Plus size={20} />
              <span className="text-xs mt-2">New Template</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Generation Pipeline</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border animate-pulse">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest">Generating: AI Solution for Real Estate in Bordeaux</span>
                <span className="text-[10px] text-primary">45%</span>
              </div>
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
