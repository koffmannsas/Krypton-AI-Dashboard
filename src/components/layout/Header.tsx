import { Search, Bell, Plus, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useStore } from '../../context/useStore';
import { cn } from '../../lib/utils';

export default function Header() {
  const { darkMode, toggleDarkMode } = useStore();
  const location = useLocation();
  const isPublic = !location.pathname.startsWith('/admin');

  return (
    <header className={cn(
      "fixed top-0 right-0 h-20 bg-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 z-50 transition-all duration-300",
      isPublic ? "left-0" : "left-64"
    )}>
      {isPublic ? (
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">K</div>
          <span className="font-display font-bold text-xl">Krypton AI</span>
        </Link>
      ) : (
        <div className="flex items-center gap-4 bg-surface border border-border rounded-xl px-4 py-2 w-96 group focus-within:border-primary/50 transition-all">
          <Search className="text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Command + K to search..."
            className="bg-transparent border-none outline-none text-ink w-full text-sm placeholder:text-muted/50"
          />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {isPublic && (
          <nav className="hidden md:flex items-center gap-8 mr-8">
            <Link to="/blog" className="text-sm font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest">Blog</Link>
            <Link to="/login" className="text-sm font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest">Dashboard</Link>
          </nav>
        )}

        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border transition-all"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {!isPublic && (
          <>
            <button className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border transition-all">
              <Bell size={18} />
            </button>
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent border border-border flex items-center justify-center text-white font-bold text-xs">
              JD
            </div>
          </>
        )}
        
        <Button size="sm" className="hidden lg:flex items-center gap-2 shadow-sm rounded-lg">
          <Plus size={14} />
          {isPublic ? "Démarrer" : "Create"}
        </Button>
      </div>
    </header>
  );
}
