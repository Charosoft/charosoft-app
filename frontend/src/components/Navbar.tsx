import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo avec redirection vers l'accueil */}
        <Link to="/" className="text-xl font-bold tracking-wider text-blue-400">
          CHAROSOFT
        </Link>

        {/* Liens de navigation */}
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition">
            Accueil
          </Link>

          <Link to="/about" className="hover:text-blue-400 transition">
            À propos
          </Link>

          {/* Pour cibler l'ancre #projects ou #contact sur la page d'accueil */}
          <a href="/#projects" className="hover:text-blue-400 transition">
            Projets
          </a>

          <a href="/#contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;