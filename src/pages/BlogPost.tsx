import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Article } from '../types/seo';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Share2, Bookmark, ArrowRight, Layers } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Markdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [pillarArticle, setPillarArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const q = query(
        collection(db, 'articles'),
        where('slug', '==', slug),
        where('status', '==', 'published'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
        setArticle(docData);
        
        // Fetch related articles (Topical Authority silo)
        if (docData.cluster) {
          const relatedQ = query(
            collection(db, 'articles'),
            where('cluster', '==', docData.cluster),
            where('status', '==', 'published'),
            limit(10)
          );
          const relatedSnap = await getDocs(relatedQ);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Article))
            .filter(a => a.id !== docData.id); // Exclude current
            
          setRelatedArticles(related.filter(a => a.type === 'support'));
          
          if (docData.type === 'support' && docData.parentSlug) {
            const pillar = related.find(a => a.slug === docData.parentSlug || a.type === 'pillar');
            if (pillar) setPillarArticle(pillar);
          }
        }
      }
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  // SEO Update
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || article.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', article.metaDescription || "");
    }
  }, [article]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Article non trouvé</h1>
        <p className="text-muted mb-8">Désolé, cet article n'existe pas ou n'est plus disponible.</p>
        <Link to="/blog" className="flex items-center gap-2 text-primary font-bold">
          <ChevronLeft size={20} /> Retour au blog
        </Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <article className="max-w-4xl mx-auto px-6 py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-12">
          <ChevronLeft size={16} /> Retour au blog
        </Link>

        <header className="space-y-8 mb-16">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
            <span className="bg-primary/10 px-2 py-1 rounded">{article.cluster}</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {article.createdAt?.toDate?.()?.toLocaleDateString() || 'Récemment'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-tight text-ink">
            {article.title}
          </h1>
          <div className="flex items-center justify-between pt-8 border-t border-border">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">K</div>
                <div>
                   <p className="text-sm font-bold">Krypton Editorial Room</p>
                   <p className="text-xs text-muted">AI Analyst & SEO Expert</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="p-3 hover:bg-surface-secondary rounded-full border border-border transition-all"><Share2 size={18} /></button>
                <button className="p-3 hover:bg-surface-secondary rounded-full border border-border transition-all"><Bookmark size={18} /></button>
             </div>
          </div>
        </header>

        <div className="aspect-[21/9] bg-surface-secondary rounded-3xl border border-border mb-16 overflow-hidden">
           <img 
            src={article.featuredImage || `https://picsum.photos/seed/${article.id}/1200/600`} 
            alt={article.title}
            className="w-full h-full object-cover"
           />
        </div>

        <div className="prose prose-lg prose-krypton max-w-none mb-16">
           {/* Rendu dynamique du contenu HTML ou Markdown */}
           <div 
             className="markdown-body text-lg leading-relaxed text-ink/80 space-y-6"
             dangerouslySetInnerHTML={{ __html: article.content }} 
           />
        </div>

        {/* Topical Authority - Silo Structure */}
        {((article.type === 'pillar' && relatedArticles.length > 0) || (article.type === 'support' && pillarArticle)) && (
          <div className="bg-surface border border-border rounded-3xl p-8 mb-16 mt-8 shadow-sm">
            <h3 className="text-xl font-display font-bold flex items-center gap-2 mb-6">
              <Layers className="text-primary" size={24} /> 
              {article.type === 'pillar' ? 'Dans le même dossier thématique :' : 'Guide principal recommandé :'}
            </h3>
            
            {article.type === 'pillar' ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map(rel => (
                  <li key={rel.id}>
                    <Link to={`/blog/${rel.slug}`} className="group flex flex-col p-4 bg-surface-secondary border border-border hover:border-primary/50 hover:shadow-md rounded-xl transition-all">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Article Support</span>
                      <span className="font-bold text-sm group-hover:text-primary transition-colors flex justify-between items-center">
                        {rel.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              pillarArticle && (
                <Link to={`/blog/${pillarArticle.slug}`} className="group flex items-center justify-between p-6 bg-primary/5 border border-primary/20 hover:bg-primary/10 rounded-2xl transition-all shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                       ★ Page Pilier
                    </span>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{pillarArticle.title}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                     <ArrowRight size={18} />
                  </div>
                </Link>
              )
            )}
          </div>
        )}

        {/* Footer of article */}
        <footer className="mt-20 pt-10 border-t border-border">
           <div className="p-8 bg-surface-secondary rounded-3xl border border-border flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/20">K</div>
              <div className="flex-1 space-y-2">
                 <h3 className="text-xl font-display font-bold">Propulsé par Krypton AI</h3>
                 <p className="text-muted text-sm leading-relaxed">Cet article a été orchestré par notre IA Content Engine. Nous combinons l'analyse sémantique et la compréhension humaine pour créer les meilleurs contenus du web.</p>
              </div>
              <Link to="/admin" className="px-6 py-3 bg-ink text-white rounded-xl font-bold hover:scale-105 transition-all text-sm">Tester Krypton</Link>
           </div>
        </footer>
      </article>
      <Footer />
    </div>
  );
}
