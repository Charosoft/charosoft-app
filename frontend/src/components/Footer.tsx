import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-800 border-t border-white/10 text-white/70 py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-white font-bold text-lg">CHAROSOFT</p>
          <p className="text-sm">Vers l'horizon numérique</p>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Charosoft. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;