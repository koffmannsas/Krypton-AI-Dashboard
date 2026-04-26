import React from 'react';
import { Article } from '../../types/seo';
import { FileText, ExternalLink, Trash2, Edit, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
}

export default function ArticleTable({ articles, onEdit }: ArticleTableProps) {
  const statusTags = {
     published: { icon: <CheckCircle size={10} />, class: 'bg-green-500/10 text-green-500 border-green-500/20' },
     draft: { icon: <FileText size={10} />, class: 'bg-muted/10 text-muted border-border' },
     pending: { icon: <Sparkles size={10} />, class: 'bg-accent/10 text-accent border-accent/20' },
     error: { icon: <CheckCircle size={10} />, class: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-border bg-surface-secondary/30">
            <th className="p-4 text-[10px] uppercase font-bold text-muted tracking-widest pl-8">Article Node</th>
            <th className="p-4 text-[10px] uppercase font-bold text-muted tracking-widest">Main Keyword</th>
            <th className="p-4 text-[10px] uppercase font-bold text-muted tracking-widest">SEO Health</th>
            <th className="p-4 text-[10px] uppercase font-bold text-muted tracking-widest">Status</th>
            <th className="p-4 text-[10px] uppercase font-bold text-muted tracking-widest text-right pr-8">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-20 text-center text-muted italic">
                No article entities found in this cluster.
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr 
                key={article.id} 
                onClick={() => onEdit(article)}
                className="group border-b border-border/50 hover:bg-surface-secondary transition-all cursor-pointer"
              >
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-colors border border-border">
                        <FileText size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-ink group-hover:text-primary transition-colors line-clamp-1">{article.title}</span>
                      <span className="text-[10px] text-muted line-clamp-1 opacity-60">/{article.slug || 'no-slug'}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-medium text-muted">{article.mainKeyword}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          (article.seoScore || 0) > 80 ? 'bg-green-500' : 'bg-primary'
                        )} 
                        style={{ width: `${article.seoScore || 0}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-bold font-mono">{article.seoScore || 0}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase border",
                    statusTags[article.status as keyof typeof statusTags]?.class || statusTags.draft.class
                  )}>
                    {statusTags[article.status as keyof typeof statusTags]?.icon || statusTags.draft.icon}
                    {article.status}
                  </div>
                </td>
                <td className="p-4 text-right pr-8">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(article); }}
                      className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg text-muted transition-all"
                    >
                      <Edit size={14} />
                    </button>
                    <button className="p-2 hover:bg-accent/10 hover:text-accent rounded-lg text-muted transition-all">
                      <ExternalLink size={14} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-muted transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
