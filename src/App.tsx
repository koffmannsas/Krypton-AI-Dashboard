import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Finance from './pages/Finance';
import Customers from './pages/Customers';
import Marketing from './pages/Marketing';
import AICenter from './pages/AICenter';
import SEO from './pages/SEO';
import BlogManager from './pages/BlogManager';
import Scheduler from './pages/Scheduler';
import SitemapManager from './pages/SitemapManager';
import Settings from './pages/Settings';
import Netlinking from './pages/Netlinking';
import SalesAgentWidget from './components/chat/SalesAgentWidget';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Fiko Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Krypton Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="finance" element={<Finance />} />
          <Route path="customers" element={<Customers />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="seo" element={<SEO />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="sitemap" element={<SitemapManager />} />
          <Route path="netlinking" element={<Netlinking />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-center" element={<AICenter />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Front-end autonomous commercial agent simulation (Fiko AI Agent on the Landing) */}
      <SalesAgentWidget />
    </BrowserRouter>
  );
}
