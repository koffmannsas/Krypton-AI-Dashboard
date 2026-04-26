import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-secondary border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">K</div>
          <span className="font-display font-bold text-xl">Krypton AI</span>
        </div>
        <div className="text-sm text-muted">
          &copy; 2024 Krypton AI. Tous droits réservés.
        </div>
        <div className="flex gap-6 text-sm font-bold text-muted uppercase tracking-widest">
           <a href="#" className="hover:text-primary transition-colors">Politique</a>
           <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
