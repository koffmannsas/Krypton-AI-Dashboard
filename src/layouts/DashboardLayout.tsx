import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Outlet } from 'react-router-dom';
import { useStore } from '../context/useStore';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { darkMode } = useStore();

  return (
    <div className={cn("min-h-screen", darkMode && "dark")}>
      <div className="min-h-screen bg-bg text-ink selection:bg-primary/20 transition-colors duration-300">
        <Sidebar />
        <Header />
        <main className="pl-64 pt-20 p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
