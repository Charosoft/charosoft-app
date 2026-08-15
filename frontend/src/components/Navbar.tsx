import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wider text-blue-400">
          CHAROSOFT
        </Link>

        {/* Liens Desktop (Masqués sur écran mobile 'hidden', affichés à partir de 'md:') */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition">Accueil</Link>
    
          <a href="/#projects" className="hover:text-blue-400 transition">Projets</a>
          <a href="/#contact" className="hover:text-blue-400 transition">Contact</a>
          <Link to="/about" className="hover:text-blue-400 transition">À propos</Link>        
        </div>

        {/* Bouton Burger Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Déroulant Mobile */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-800 flex flex-col gap-4 pt-4 text-sm font-medium">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">
            Accueil
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">
            À propos
          </Link>
          <a href="/#projects" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">
            Projets
          </a>
          <a href="/#contact" onClick={() => setIsOpen(false)} className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;