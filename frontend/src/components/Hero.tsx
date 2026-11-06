import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MaskText } from './ui';

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.4, delay, ease: 'easeInOut' as const },
});

const nodes = [
  { x: 110, y: 168, d: 2.0 }, { x: 150, y: 128, d: 2.15 },
  { x: 290, y: 157, d: 2.3 }, { x: 255, y: 188, d: 2.45 },
];

export const Hero: React.FC = () => (
  <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28">
    <div className="absolute inset-0 circuit-bg" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(255,157,16,.13),transparent_60%)]" />

    <div className="relative max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="label mb-6">
          Charosoft — Vers l’horizon numérique
        </motion.p>
        <h1 className="text-4xl md:text-6xl leading-[1.12]">
          <MaskText text="Logiciels, réseaux et design pour les entreprises qui avancent." />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="mt-8 text-lg text-white/65 max-w-xl"
        >
          Nous concevons vos applications, déployons vos infrastructures et donnons une identité visuelle à votre activité.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#contact" className="btn-primary">Démarrer un projet <ArrowRight size={18} /></a>
          <a href="#services" className="btn-ghost">Nos services</a>
        </motion.div>
      </div>

      <div className="lg:col-span-5">
        <svg viewBox="0 0 400 420" className="w-full max-w-md mx-auto animate-float" fill="none" stroke="#FF9D10"
             strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path d="M60 310 A140 140 0 0 1 340 310" {...draw(0.2)} />
          <motion.path d="M200 310 V80 M170 112 L200 80 L230 112" {...draw(0.6)} />
          <motion.path d="M150 310 V215 L110 175" {...draw(0.9)} />
          <motion.path d="M175 310 V170 L150 135" {...draw(1.0)} />
          <motion.path d="M250 310 V205 L290 165" {...draw(1.1)} />
          <motion.path d="M225 310 V220 L255 195" {...draw(1.2)} />
          <motion.path d="M80 350 H220 L240 335 H320" {...draw(1.6)} />
          <motion.path d="M120 380 H300" {...draw(1.8)} />
          {nodes.map((n) => (
            <motion.circle key={n.d} cx={n.x} cy={n.y} fill="#141615"
              initial={{ r: 0 }} animate={{ r: 9 }} transition={{ delay: n.d, duration: 0.4 }} />
          ))}
        </svg>
      </div>
    </div>

    <div className="relative max-w-7xl mx-auto w-full px-6 mt-16 pb-10">
      <div className="grid sm:grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm text-white/60">
        <span>Kinshasa, RD Congo</span>
        <span>Logiciel · Réseaux · Design</span>
        <span>Assistant disponible 24/7</span>
      </div>
    </div>
  </section>
);

export default Hero;