import React, { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { getPublishedArticles } from '../services/api/articles';
import { Article } from '../types/seo';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Blog() {
  const { companyId } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    getPublishedArticles(companyId).then(setArticles).finally(() => setLoading(false));
  }, [companyId]);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-display font-bold mb-4">Le Mag Krypton AI</h1>
          <p className="text-xl text-muted">Intelligence Artificielle, SEO et Futur de l'Automation.</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col"
              >
                <Link to={`/blog/${article.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/10] bg-surface-secondary border border-border mb-6">
                  <img 
                    src={article.featuredImage || `https://picsum.photos/seed/${article.id}/800/500`} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                    <span>{article.cluster}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>{article.createdAt?.toDate?.()?.toLocaleDateString() || 'Récemment'}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold group-hover:text-primary transition-colors leading-tight">
                    <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="text-muted line-clamp-3 text-sm leading-relaxed">
                    {article.metaDescription}
                  </p>
                  <Link to={`/blog/${article.slug}`} className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-ink hover:text-primary transition-colors">
                    Lire l'article <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted">Aucun article publié pour le moment. Revenez bientôt !</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
