import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold tracking-wider text-blue-400">
          CHAROSOFT
        </a>
        <div className="flex gap-6 items-center text-sm font-medium">
          <a href="#projects" className="hover:text-blue-400 transition">
            Projets
          </a>
          <a href="#contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;