import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { l: 'Accueil', h: '/#top' },
  { l: 'Services', h: '/#services' },
  { l: 'Réalisations', h: '/#projects' },
  { l: 'Contact', h: '/#contact' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 ${
        scrolled ? 'bg-ink-900/80 backdrop-blur-lg border-b border-white/10 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Charosoft" className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display tracking-widest text-sm">CHAROSOFT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-base">
          {links.map((x) => (
            <a key={x.l} href={x.h} className="relative text-white/80 hover:text-brand transition group">
              {x.l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Link to="/about" className="text-white/80 hover:text-brand transition">À propos</Link>
          <a href="/#contact" className="btn-primary !py-2 !px-4 text-sm">Demander un devis</a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4 pb-2 text-sm">
              {links.map((x) => (
                <a key={x.l} href={x.h} onClick={() => setOpen(false)} className="hover:text-brand">{x.l}</a>
              ))}
              <Link to="/about" onClick={() => setOpen(false)} className="hover:text-brand">À propos</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;