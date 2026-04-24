import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, Sparkles, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

export default function HumanizerEngine() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanized, setHumanized] = useState('');

  const handleHumanize = () => {
    setIsProcessing(true);
    // Simulation
    setTimeout(() => {
      setHumanized("Voici une version plus naturelle et engageante de votre contenu. J'ai ajouté du storytelling et supprimé les répétitions robotiques habituelles de l'IA...");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-muted" />
            <h3 className="font-bold">Raw Content Input</h3>
          </div>
          <textarea
            className="w-full h-64 bg-surface-secondary border border-border rounded-xl p-4 text-sm outline-none focus:border-primary transition-all resize-none"
            placeholder="Paste your AI-generated text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center">
             <div className="flex gap-2">
               {['Formal', 'Casual', 'Witty', 'Professional'].map(tone => (
                 <button key={tone} className="text-[10px] px-2 py-1 bg-surface border border-border rounded-lg hover:border-primary transition-colors">{tone}</button>
               ))}
             </div>
             <Button size="sm" onClick={handleHumanize} disabled={!text || isProcessing}>
               {isProcessing ? 'Humanizing...' : 'Refine & Naturalize'}
             </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4 relative overflow-hidden bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-primary animate-pulse" />
            <h3 className="font-bold">Humanized Output</h3>
          </div>
          
          <div className="min-h-64 p-4 text-sm leading-relaxed italic text-ink/70">
            {isProcessing ? (
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-primary/10 rounded w-full animate-pulse" />
                <div className="h-4 bg-primary/10 rounded w-[90%] animate-pulse" />
                <div className="h-4 bg-primary/10 rounded w-[95%] animate-pulse" />
              </div>
            ) : humanized || "Your refined output will appear here..."}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
               <CheckCircle2 size={16} className="text-green-500" />
               <span className="text-xs font-bold text-green-500">NLP Optimized</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(humanized)}>Copy Result</Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <MessageCircle size={16} className="text-accent" />
          NLP Readability Diagnostics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Perplexity Score', value: 'High (Good)' },
             { label: 'Burstiness', value: 'Varied (Natural)' },
             { label: 'Tone Consistency', value: '98%' },
             { label: 'AI Detection Risk', value: 'Low (< 5%)' }
           ].map(stat => (
             <div key={stat.label} className="p-3 bg-surface border border-border rounded-xl">
               <p className="text-[10px] text-muted uppercase font-bold tracking-tighter">{stat.label}</p>
               <p className="text-sm font-black mt-1">{stat.value}</p>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
