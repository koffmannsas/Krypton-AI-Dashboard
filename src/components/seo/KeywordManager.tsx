import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Filter, Loader2, Trash2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeKeywords, addKeywords, updateKeyword, Keyword } from '../../services/api/keywords';
import { useStore } from '../../context/useStore';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function KeywordManager() {
  const { companyId } = useStore();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [cluster, setCluster] = useState('');
  const [intent, setIntent] = useState<'informational' | 'comparative' | 'transactional' | 'decisional' | 'commercial'>('informational');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeKeywords(companyId, (kws) => {
      setKeywords(kws);
      setLoading(false);
    });
  }, [companyId]);

  const handleAdd = async () => {
    if (!newKeyword || !cluster) return;
    setIsAdding(true);
    try {
      await addKeywords(companyId, [{
        term: newKeyword,
        cluster,
        intent,
        priority: 1,
        status: 'pending'
      }]);
      setNewKeyword('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    processing: 'bg-primary/10 text-primary border-primary/20 animate-pulse',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20'
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="flex-1 space-y-6 w-full">
          <div className="flex items-center gap-2 text-primary">
            <Target size={20} />
            <h3 className="font-display font-bold uppercase tracking-tight">Injection de Mots-Clés</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted">Expression Cible</label>
              <input 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Ex: agent ia immobilier"
                className="w-full p-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted">Intent (Intent Stacking)</label>
              <select 
                value={intent}
                onChange={(e) => setIntent(e.target.value as any)}
                className="w-full p-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
              >
                <option value="informational">Informationnel</option>
                <option value="comparative">Comparatif</option>
                <option value="transactional">Transactionnel</option>
                <option value="decisional">Décisionnel</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted">Cluster Sémantique</label>
              <select 
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full p-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium"
              >
                <option value="">Sélectionner</option>
                <option value="ia-business">IA Business</option>
                <option value="site-web">Site Web Intelligent</option>
                <option value="marketing">Marketing Automation</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={handleAdd}
            disabled={isAdding || !newKeyword || !cluster}
            className="w-full flex items-center justify-center gap-2"
          >
            {isAdding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Alimenter le Keyword Engine
          </Button>
        </Card>

        <Card className="md:w-64 bg-surface-secondary/20 border-dashed space-y-4">
          <div className="flex items-center gap-2 opacity-60">
            <Loader2 size={16} className="animate-spin" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Agent Statut</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">En attente</span>
              <span className="font-mono font-bold">{keywords.filter(k => k.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Traités</span>
              <span className="font-mono font-bold">{keywords.filter(k => k.status === 'completed').length}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-[9px] text-muted leading-relaxed italic">L'agent vérifie la file d'attente toutes les 15 minutes.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-border pb-2">
          <Search size={18} className="text-muted" />
          <h3 className="text-xs font-black uppercase tracking-widest text-ink">File d'attente Strategique</h3>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-secondary/50 border-b border-border font-mono text-[10px] uppercase text-muted">
              <tr>
                <th className="px-6 py-4 font-bold">Expression</th>
                <th className="px-6 py-4 font-bold">Intent</th>
                <th className="px-6 py-4 font-bold">Cluster</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 font-bold">Priorité</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted italic text-sm">
                    Synchronisation avec la base de données...
                  </td>
                </tr>
              ) : keywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted italic text-sm">
                    Aucun mot-clé actif dans l'engine.
                  </td>
                </tr>
              ) : (
                keywords.map((kw) => (
                  <tr key={kw.id} className="group hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-ink">{kw.term}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-accent/5 text-accent border border-accent/20 rounded text-[9px] font-bold uppercase">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase opacity-60">
                        {kw.cluster}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColors[kw.status]}`}>
                        {kw.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">P{kw.priority}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        {kw.status === 'completed' && kw.articleId && (
                          <button className="p-1.5 text-primary">
                            <ArrowUpRight size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
