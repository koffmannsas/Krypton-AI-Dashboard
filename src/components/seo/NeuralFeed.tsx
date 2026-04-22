import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, CheckCircle, Search, Mail, Link as LinkIcon, Globe, Sparkles } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface ActivityLog {
  id: string;
  type: 'seo' | 'netlinking' | 'system';
  message: string;
  timestamp: any;
}

export default function NeuralFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // This is a simulation component since we don't have a dedicated logs collection
    // but we can simulate based on recently completed keywords/backlinks
    const mockLogs: ActivityLog[] = [
      { id: '1', type: 'system', message: 'Neural Forge Engine Synchronized', timestamp: new Date() },
      { id: '2', type: 'seo', message: 'Article: "L\'IA dans l\'immobilier" généré', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: '3', type: 'netlinking', message: 'Opportunité détectée : ia-experts.net', timestamp: new Date(Date.now() - 1000 * 60 * 12) },
      { id: '4', type: 'seo', message: 'Score SEO de 94% atteint pour Keyword: "CRM Intelligent"', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    ];
    setLogs(mockLogs);
    
    // In a real scenario, subscribe to a 'logs' collection in Firebase
    // const q = query(collection(db, 'companies/krypton-demo/logs'), orderBy('timestamp', 'desc'), limit(10));
    // return onSnapshot(q, (snapshot) => { setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog))); });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'seo': return <Target size={14} className="text-primary" />;
      case 'netlinking': return <LinkIcon size={14} className="text-accent" />;
      default: return <Zap size={14} className="text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live Neural Activity
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-4 bg-surface-secondary/20 border border-border/50 rounded-2xl hover:bg-surface-secondary/40 hover:border-border transition-all flex items-start gap-4"
            >
              <div className="p-2.5 bg-bg border border-border rounded-xl shadow-sm">
                {log.type === 'seo' ? <Search size={14} className="text-primary" /> : 
                 log.type === 'netlinking' ? <Globe size={14} className="text-accent" /> :
                 <Sparkles size={14} className="text-orange-500" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium text-ink leading-relaxed">{log.message}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-mono text-muted uppercase tracking-wider">{log.type} iteration</span>
                   <span className="w-1 h-1 rounded-full bg-border" />
                   <span className="text-[9px] text-muted/60">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                 <CheckCircle size={14} className="text-green-500/50" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const Target = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
