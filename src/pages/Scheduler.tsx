import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function Scheduler() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date();
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Krypton Scheduler</h1>
          <p className="text-muted text-sm">Orchestrate your content pipeline with precision.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-surface border border-border p-3 rounded-2xl items-center gap-4 shadow-sm">
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase text-primary">Autopilot Forge</span>
               <span className="text-[9px] text-muted">2 Articles / Day</span>
             </div>
             <div className="relative w-10 h-5 bg-primary/20 rounded-full cursor-pointer overflow-hidden p-0.5 border border-primary/30">
               <div className="absolute right-0.5 w-4 h-4 bg-primary rounded-full shadow-lg" />
             </div>
          </div>
          <Button className="flex items-center gap-2">
             <Plus size={16} /> Schedule Article
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-secondary/30">
           <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold font-display uppercase tracking-tight">
               {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
             </h2>
             <div className="flex bg-surface border border-border rounded-lg p-0.5">
               <button className="p-1 hover:text-primary transition-colors"><ChevronLeft size={16} /></button>
               <button className="p-1 hover:text-primary transition-colors"><ChevronRight size={16} /></button>
             </div>
           </div>
           
           <div className="flex gap-2">
             <Button variant="outline" size="sm">Today</Button>
             <div className="flex bg-surface border border-border rounded-lg p-0.5 text-[10px] font-bold uppercase">
               <button className="px-3 py-1 bg-primary text-white rounded-md shadow-sm">Month</button>
               <button className="px-3 py-1 text-muted">Week</button>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-surface">
           {days.map(d => (
             <div key={d} className="p-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted border-r border-border last:border-0">
               {d}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 h-[600px] bg-surface/30">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="p-4 border-r border-b border-border group hover:bg-surface transition-colors cursor-pointer relative overflow-hidden">
               <span className={`text-xs font-mono ${(i + 1) === 18 ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center font-bold' : 'text-muted group-hover:text-ink'}`}>
                 {(i + 1) % 31 || 31}
               </span>
               
               {(i + 1) === 18 && (
                 <div className="mt-2 space-y-1">
                    <div className="p-1.5 bg-green-500/10 border border-green-500/20 rounded text-[9px] font-bold text-green-600 truncate">
                      ✓ Published: IA & CRM
                    </div>
                 </div>
               )}
               
               {(i + 1) === 20 && (
                 <div className="mt-2 space-y-1">
                    <div className="p-1.5 bg-primary/10 border border-primary/20 rounded text-[9px] font-bold text-primary truncate">
                      ◔ Plan: Futur SEO 2026
                    </div>
                 </div>
               )}

               <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-primary text-white rounded-md">
                 <Plus size={10} />
               </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
