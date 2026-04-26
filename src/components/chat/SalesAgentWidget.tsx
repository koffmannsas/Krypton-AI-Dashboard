import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/useStore';
import { chatWithSalesAgent } from '../../services/ai/salesAgent';
import { createLead, updateLead } from '../../services/api/leads';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function SalesAgentWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', role: 'model', content: "👋 Bonjour ! Vous cherchez à transformer votre site web en une machine qui génère des clients automatiquement ?" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const companyId = "default-company"; // Simulation identifier for lead tracking

  useEffect(() => {
    if (location.pathname !== '/') return;
    
    // Auto-Hook: declanchement automatique au bout de 5 secondes
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [hasOpened, location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Restrict to Landing Page only
  if (location.pathname !== '/') {
    return null;
  }

  const handleSend = async (forcedInteraction?: string) => {
    const textToSend = forcedInteraction || inputValue;
    if (!textToSend.trim()) return;
    
    if (!hasOpened) setHasOpened(true);

    setInputValue('');
    
    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: 'user', content: textToSend }
    ];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const result = await chatWithSalesAgent(
        messages.map(m => ({ role: m.role, content: m.content })),
        textToSend,
        { page: window.location.pathname }
      );

      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'model', content: result.reply || "Désolé, je rencontre une interférence réseau." }
      ]);

      // Lead qualification en tache de fond
      if (!leadId) {
        const newLeadId = await createLead(companyId, {
          score: result.score || 0,
          status: result.status || 'cold',
          email: result.email || null,
          needs: result.needs || [],
          chatHistory: newMessages.map(m => `${m.role}: ${m.content}`)
        });
        setLeadId(newLeadId);
      } else {
        await updateLead(companyId, leadId, {
          score: result.score,
          status: result.status,
          email: result.email || null,
          needs: result.needs || [],
          chatHistory: [...newMessages, { role: 'model', content: result.reply }].map(m => `${m.role}: ${m.content}`)
        });
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'model', content: "Mon système neuronal redémarre. Comment puis-je vous aider ?" }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(!isOpen); setHasOpened(true); }}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-all z-50",
          !hasOpened && "animate-pulse ring-4 ring-primary/20"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[360px] h-[550px] max-h-[80vh] flex flex-col bg-bg border border-border shadow-2xl rounded-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                  <Bot size={20} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-sm leading-tight">Agent IA Krypton</h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold font-mono">Expert Commercial</p>
                </div>
              </div>
            </div>

            {/* Corps de Conversation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-sm shadow-sm' 
                      : 'bg-surface text-ink border border-border rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface p-4 rounded-2xl rounded-tl-sm border border-border flex gap-1 items-center h-10 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Initiales (CTA Engine) */}
            {messages.length === 1 && !isTyping && (
              <div className="bg-surface/50 px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar shrink-0 border-t border-border/50">
                <button 
                  onClick={() => handleSend("Oui, je veux plus de clients")}
                  className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  Oui, je veux plus de clients
                </button>
                <button 
                  onClick={() => handleSend("J'ai déjà un site web")}
                  className="shrink-0 text-[11px] font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors"
                >
                  J'ai déjà un site web
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-bg border-t border-border shrink-0">
              <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-transparent p-2.5 text-sm outline-none placeholder:text-muted/60"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-1.5 text-white bg-primary rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:bg-muted"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            
            <div className="py-1.5 bg-surface text-center shrink-0">
              <p className="text-[9px] text-muted flex items-center justify-center gap-1 font-mono uppercase">
                <Zap size={8} className="text-accent" /> Powered by Krypton AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
