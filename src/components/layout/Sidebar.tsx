import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Megaphone, 
  BrainCircuit, 
  Search, 
  Calendar, 
  Map, 
  Settings,
  Zap,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Control Tower', path: '/admin', icon: LayoutDashboard },
  { name: 'SEO Engine', path: '/admin/seo', icon: Zap },
  { name: 'Programmatic Engine', path: '/admin/programmatic', icon: Map },
  { name: 'Content Engine', path: '/admin/blog', icon: Search },
  { name: 'Discover Engine', path: '/admin/discover', icon: Sparkles },
  { name: 'Backlink Engine', path: '/admin/backlinks', icon: LinkIcon },
  { name: 'CRM & Leads', path: '/admin/customers', icon: Users },
  { name: 'Scheduler', path: '/admin/scheduler', icon: Calendar },
  { name: 'Analytics Center', path: '/admin/finance', icon: CreditCard },
  { name: 'AI Lab', path: '/admin/ai-center', icon: BrainCircuit },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const { darkMode } = useStore();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border p-6 flex flex-col z-20">
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Zap size={18} fill="currentColor" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">Krypton</span>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            end={item.path === '/admin'}
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted hover:text-ink hover:bg-surface-secondary"
              )
            }
          >
            <item.icon 
              size={18} 
              className={cn(
                "transition-colors",
                "group-hover:text-primary"
              )} 
            />
            <span>{item.name}</span>
            {item.name === 'SEO Forge' && (
              <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">New</span>
            )}
            {item.name === 'Netlinking' && (
              <span className="ml-auto text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">AI</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="p-4 bg-surface-secondary rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Zap size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tight">Pro Plan</span>
              <span className="text-[10px] opacity-60">80% Usage</span>
            </div>
          </div>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div className="w-[80%] h-full bg-accent" />
          </div>
        </div>
      </div>
    </aside>
  );
}
