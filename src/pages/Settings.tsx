import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Settings as SettingsIcon, Globe, Lock, Bell, Database, Save, Zap, CheckCircle, AlertCircle, LayoutTemplate } from 'lucide-react';
import { useStore } from '../context/useStore';
import { subscribeWebsiteSettings, updateWebsiteSettings, WebsiteSettings } from '../services/api/settings';

export default function Settings() {
  const { companyId, wordpressConfig, setWordPressConfig } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [tempConfig, setTempConfig] = useState(wordpressConfig);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [landingSettings, setLandingSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    if (!companyId) return;
    const unsub = subscribeWebsiteSettings(companyId, setLandingSettings);
    return () => unsub();
  }, [companyId]);

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate WP save
    setWordPressConfig(tempConfig);

    // Save Landing Page Settings
    if (activeTab === 'landing' && landingSettings) {
      await updateWebsiteSettings(companyId, landingSettings);
    }
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={14} /> },
    { id: 'landing', label: 'Landing Page (Fiko)', icon: <LayoutTemplate size={14} /> },
    { id: 'seo', label: 'SEO Config', icon: <Globe size={14} /> },
    { id: 'api', label: 'API Keys', icon: <Database size={14} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={14} /> },
    { id: 'security', label: 'Security', icon: <Lock size={14} /> },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted text-sm">Manage your integration parameters and SEO governance.</p>
        </div>
        <Button onClick={handleSave} disabled={saveStatus === 'saving'} className="flex items-center gap-2">
           {saveStatus === 'saved' ? <CheckCircle size={16} /> : <Save size={16} />}
           {saveStatus === 'saving' ? 'Enregistrement...' : saveStatus === 'saved' ? 'Enregistré' : 'Sauvegarder les Paramètres'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink hover:bg-surface'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
           <Card className="min-h-[600px] p-10 space-y-12">
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display uppercase tracking-tight">WordPress Integration</h3>
                      <p className="text-xs text-muted">Connect your WordPress instance for automated publishing.</p>
                   </div>
                   
                   <div className="space-y-4 max-w-xl">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted">Site URL</label>
                        <input 
                          value={tempConfig.url}
                          onChange={(e) => setTempConfig({...tempConfig, url: e.target.value})}
                          className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm" 
                          placeholder="https://votre-site.com" 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted">User Name</label>
                          <input 
                            value={tempConfig.username}
                            onChange={(e) => setTempConfig({...tempConfig, username: e.target.value})}
                            className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm" 
                            placeholder="admin" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-muted">Application Password</label>
                          <input 
                            type="password" 
                            value={tempConfig.appPassword}
                            onChange={(e) => setTempConfig({...tempConfig, appPassword: e.target.value})}
                            className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm" 
                            placeholder="•••• •••• •••• ••••" 
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-center gap-3">
                        <AlertCircle size={14} className="text-blue-500" />
                        <p className="text-[10px] text-blue-500 leading-tight">Utilisez un "Application Password" généré dans le profil utilisateur WordPress pour une sécurité maximale.</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-fit">Test Connection</Button>
                   </div>
                </div>
              )}

              {activeTab === 'landing' && landingSettings && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display uppercase tracking-tight">Contenu Fiko AI (En direct)</h3>
                      <p className="text-xs text-muted leading-relaxed">Les changements effectués ici sont répercutés instantanément sur la Landing Page grâce à la synchronisation temps réel de Firestore.</p>
                   </div>
                   
                   <div className="space-y-6 max-w-2xl">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted">Titre Principal (Headline)</label>
                        <input 
                          value={landingSettings.headline}
                          onChange={(e) => setLandingSettings({...landingSettings, headline: e.target.value})}
                          className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm font-bold" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted">Sous-Titre</label>
                        <textarea 
                          value={landingSettings.subheadline}
                          onChange={(e) => setLandingSettings({...landingSettings, subheadline: e.target.value})}
                          className="w-full min-h-[100px] bg-surface-secondary border border-border p-3 rounded-lg text-sm resize-y" 
                        />
                      </div>
                      
                      <div className="pt-6 border-t border-border">
                        <h4 className="text-sm font-bold uppercase mb-4">Tarification Dynamique</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {landingSettings.pricing.map((tier, index) => (
                            <div key={tier.id} className="p-4 border border-border rounded-xl space-y-4">
                              <h5 className="font-bold text-sm">{tier.name}</h5>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-muted">Prix Mensuel (€)</label>
                                <input 
                                  type="number"
                                  value={tier.price}
                                  onChange={(e) => {
                                    const newPricing = [...landingSettings.pricing];
                                    newPricing[index].price = parseInt(e.target.value) || 0;
                                    setLandingSettings({...landingSettings, pricing: newPricing});
                                  }}
                                  className="w-full bg-surface border border-border p-2 rounded text-sm" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display uppercase tracking-tight">AI & Engine Keys</h3>
                      <p className="text-xs text-muted">Configure the neural keys powering the SEO automation.</p>
                   </div>
                   
                   <div className="space-y-6 max-w-xl">
                      <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <Zap size={18} className="text-primary" />
                            <div>
                               <p className="text-xs font-bold uppercase">Gemini 3 Flash</p>
                               <p className="text-[10px] text-muted line-clamp-1">Connected via Environment Variable</p>
                            </div>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted">Ahrefs / SEMRush API (Optional)</label>
                        <input className="w-full bg-surface-secondary border border-border p-3 rounded-lg text-sm" placeholder="sk-..." />
                      </div>
                   </div>
                </div>
              )}

              {activeTab !== 'general' && activeTab !== 'landing' && activeTab !== 'api' && (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-32 text-center opacity-40">
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
                     <SettingsIcon size={24} />
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">Section under development</p>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
