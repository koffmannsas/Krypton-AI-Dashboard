import { useEffect, useState } from "react";
import {
  subscribeCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
} from "../services/api/customers";
import { subscribeLeads, Lead } from "../services/api/leads";
import { useStore } from "../context/useStore";

import CustomersTable from "../components/customers/CustomersTable";
import CustomerModal from "../components/customers/CustomerModal";
import Card from "../components/ui/Card";
import { Zap, Target, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'customers'>('leads');

  const filteredCustomers = selectedTag 
    ? customers.filter(c => c.tags?.includes(selectedTag))
    : customers;

  // Extract all unique tags
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags || [])));

  const { companyId } = useStore();

  useEffect(() => {
    const unsubCustomers = subscribeCustomers(companyId, setCustomers);
    const unsubLeads = subscribeLeads(companyId, setLeads);
    return () => {
      unsubCustomers();
      unsubLeads();
    };
  }, [companyId]);

  // 🔥 CREATE / UPDATE
  const handleSave = async (data: Partial<Customer>) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(companyId, selectedCustomer.id!, data);
      } else {
        await createCustomer(companyId, data);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(companyId, id);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">CRM & Pipeline</h1>
          <p className="text-muted text-sm">Synchronisation en temps réel avec la Fiko Landing Page.</p>
        </div>
        
        <div className="flex bg-surface border border-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'leads' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink'}`}
          >
            <Zap size={14} /> Leads Live ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'customers' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-ink'}`}
          >
            <Users size={14} /> Clients
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'leads' && (
          <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['hot', 'warm', 'cold'].map((statusFilter) => {
                const columnLeads = leads.filter(l => l.status === statusFilter);
                return (
                  <div key={statusFilter} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border pb-2">
                       <Target size={16} className={statusFilter === 'hot' ? 'text-red-500' : statusFilter === 'warm' ? 'text-yellow-500' : 'text-blue-500'} />
                       <h3 className="text-sm font-bold uppercase tracking-widest">{statusFilter} Leads ({columnLeads.length})</h3>
                    </div>
                    <div className="space-y-4">
                      {columnLeads.length === 0 && <p className="text-xs text-muted italic">Aucun lead {statusFilter} détecté.</p>}
                      {columnLeads.map(lead => (
                        <Card key={lead.id} className="p-4 space-y-3 relative overflow-hidden group hover:border-primary transition-all cursor-pointer">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm">{lead.email || 'Visiteur Anonyme'}</h4>
                            <span className="text-xs font-black bg-surface-secondary px-2 py-0.5 rounded">{lead.score}/100</span>
                          </div>
                          
                          {lead.needs && lead.needs.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {lead.needs.map(need => (
                                <span key={need} className="text-[9px] font-mono uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                  {need}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="pt-2 border-t border-border mt-2 max-h-[80px] overflow-hidden">
                            <p className="text-[10px] text-muted italic line-clamp-3">
                              {lead.chatHistory?.[lead.chatHistory.length - 1] || 'Aucun message récent.'}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'customers' && (
          <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex justify-between items-center gap-4">
               <div className="flex gap-2">
                 <button onClick={() => setSelectedTag(null)} className={`px-3 py-1 rounded-full text-xs ${!selectedTag ? 'bg-primary text-white' : 'bg-surface'}`}>All</button>
                 {allTags.map(tag => (
                   <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1 rounded-full text-xs ${selectedTag === tag ? 'bg-primary text-white' : 'bg-surface'}`}>{tag}</button>
                 ))}
               </div>
              <button
                className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all"
                onClick={() => {
                  setSelectedCustomer(null);
                  setModalOpen(true);
                }}
              >
                + Convertir / Ajouter
              </button>
            </div>

            {/* TABLE */}
            <Card className="p-0 overflow-hidden">
               <CustomersTable
                 customers={filteredCustomers}
                 onEdit={(customer) => {
                   setSelectedCustomer(customer);
                   setModalOpen(true);
                 }}
                 onDelete={handleDelete}
               />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        customer={selectedCustomer}
      />
    </div>
  );
}
