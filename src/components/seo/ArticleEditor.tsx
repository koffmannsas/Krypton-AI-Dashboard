import React, { useState, useEffect } from 'react';
import { Article, SEOScore } from '../../types/seo';
import { analyzeSEO } from '../../services/ai/seoAgent';
import { Save, Sparkles, AlertCircle, CheckCircle, X, ChevronLeft, Layout, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface ArticleEditorProps {
  article: Article;
  onSave: (updates: Partial<Article>) => void;
  onClose: () => void;
}

export default function ArticleEditor({ article, onSave, onClose }: ArticleEditorProps) {
  const [content, setContent] = useState(article.content);
  const [score, setScore] = useState<SEOScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAnalyze();
    }, 2000);
    return () => clearTimeout(timer);
  }, [content]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSEO({ ...article, content });
      setScore(result);
    } catch (error) {
       console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-bg/80 backdrop-blur-sm flex justify-center items-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg w-full max-w-7xl h-full border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface transition-colors duration-300">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-surface-secondary rounded-lg text-muted hover:text-ink transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Content Forge</span>
              <span className="text-sm font-medium opacity-60 max-w-[300px] truncate">{article.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${score && score.score > 80 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
               {isAnalyzing ? <Sparkles size={12} className="animate-spin" /> : <CheckCircle size={12} />}
               {score ? `SEO Score: ${score.score}%` : 'Analyzing...'}
            </div>
            <Button 
              onClick={() => onSave({ content, seoScore: score?.score })}
              className="px-6 py-2 flex items-center gap-2 shadow-lg"
            >
              <Save size={14} /> Commit
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 p-12 overflow-y-auto bg-bg custom-scrollbar relative">
             <div className="max-w-3xl mx-auto space-y-8">
                <input 
                  defaultValue={article.title}
                  className="w-full bg-transparent border-none text-4xl font-display font-bold focus:outline-none placeholder:opacity-20 inline-block mb-4"
                  placeholder="Article Title..."
                />
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[500px] bg-transparent border-none focus:outline-none resize-none font-sans text-lg leading-relaxed text-ink/80 placeholder:text-muted/20"
                  placeholder="Start crafting your semantic power node..."
                />
             </div>
             
             {/* Micro-Interaction Bar */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex bg-surface border border-border rounded-full p-1.5 shadow-xl gap-1">
                <button className="p-2 hover:bg-surface-secondary rounded-full text-muted hover:text-ink transition-all"><Type size={16} /></button>
                <button className="p-2 hover:bg-surface-secondary rounded-full text-muted hover:text-ink transition-all"><Layout size={16} /></button>
                <div className="w-px h-4 bg-border self-center mx-1" />
                <button className="p-2 hover:bg-surface-secondary rounded-full text-muted hover:text-ink transition-all"><Sparkles size={16} /></button>
             </div>
          </div>

          {/* SEO Side Panel */}
          <div className="w-[380px] border-l border-border bg-surface overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted">Yoast GPT Analyzer</h3>
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
               </div>
               
               {score && (
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                         <span>Optimization Depth</span>
                         <span className={score.score > 80 ? 'text-green-500' : 'text-primary'}>{score.score}%</span>
                       </div>
                       <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${score.score}%` }}
                           transition={{ duration: 1, ease: 'easeOut' }}
                           className={`h-full ${score.score > 80 ? 'bg-green-500' : 'bg-primary'}`}
                         />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Actionable Improvements</p>
                       <ul className="space-y-4">
                         {score.suggestions.map((s, i) => (
                           <motion.li 
                             key={i} 
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="flex gap-3 text-xs leading-tight p-3 bg-surface-secondary rounded-xl border border-border hover:border-primary/30 transition-all cursor-default"
                           >
                              <div className="mt-0.5 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Sparkles size={8} />
                              </div>
                              <span className="opacity-80 font-medium">{s}</span>
                           </motion.li>
                         ))}
                       </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Length', ok: score.details.length },
                        { label: 'Density', ok: score.details.density },
                        { label: 'Structure', ok: score.details.structure },
                        { label: 'Readability', ok: score.details.readability },
                      ].map((d, i) => (
                        <div key={i} className={`flex items-center gap-2 p-3 rounded-xl border border-border text-[10px] font-bold uppercase tracking-tighter transition-all ${d.ok ? 'bg-green-500/5 text-green-500/80 border-green-500/20' : 'opacity-60'}`}>
                          {d.ok ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {d.label}
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
