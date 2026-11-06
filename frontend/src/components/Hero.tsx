import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MaskText } from './ui';

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.4, delay, ease: 'easeInOut' as const },
});

// Points posés exactement sur l'arc (centre 200,300 – rayon 150)
const nodes = [
  { x: 85, y: 204, d: 2.0 },
  { x: 130, y: 168, d: 2.15 },
  { x: 270, y: 168, d: 2.3 },
  { x: 315, y: 204, d: 2.45 },
];

export const Hero: React.FC = () => (
  <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28">
    <div className="absolute inset-0 circuit-bg" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(255,157,16,.14),transparent_60%)]" />

    <div className="relative max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="label !text-xs sm:!text-sm mb-6"
        >
          Charosoft — Vers l’horizon numérique
        </motion.p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl leading-[1.12]">
          <MaskText text="Logiciels, réseaux et design pour les entreprises qui avancent." />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="mt-10 text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed"
        >
          Nous concevons vos applications, déployons vos infrastructures et donnons une identité visuelle à votre activité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <a href="#contact" className="btn-primary sm:!px-8 sm:!py-4 sm:text-lg">
            Démarrer un projet <ArrowRight size={20} />
          </a>
          <a href="#services" className="btn-ghost sm:!px-8 sm:!py-4 sm:text-lg">Nos services</a>
        </motion.div>
      </div>

      <div className="lg:col-span-5 flex justify-center lg:-mt-10">
        <svg
          viewBox="40 40 320 345"
          className="w-full max-w-[15rem] sm:max-w-sm lg:max-w-lg animate-float"
          fill="none" stroke="#FF9D10" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          {/* Dôme */}
          <motion.path d="M50 300 A150 150 0 0 1 350 300" {...draw(0.2)} />
          {/* Flèche centrale */}
          <motion.path d="M200 300 V60 M170 92 L200 60 L230 92" {...draw(0.6)} />
          {/* Circuits : de la base jusqu'aux points sur l'arc */}
          <motion.path d="M125 300 V250 L85 204" {...draw(0.9)} />
          <motion.path d="M162 300 V215 L130 168" {...draw(1.0)} />
          <motion.path d="M238 300 V215 L270 168" {...draw(1.1)} />
          <motion.path d="M275 300 V250 L315 204" {...draw(1.2)} />
          {/* Traits de données, centrés */}
          <motion.path d="M90 335 H190 L205 322 H310" {...draw(1.6)} />
          <motion.path d="M120 365 H280" {...draw(1.8)} />
          {/* Points */}
          {nodes.map((n) => (
            <motion.circle
              key={n.d} cx={n.x} cy={n.y} fill="#141615"
              initial={{ r: 0 }} animate={{ r: 10 }} transition={{ delay: n.d, duration: 0.4 }}
            />
          ))}
        </svg>
      </div>
    </div>

    <div className="relative max-w-7xl mx-auto w-full px-6 mt-16 pb-10 gap-8 lg:gap-12">
      <div className="grid sm:grid-cols-3 gap-4 border-t border-white/10 pt-6 text-base text-white/60">
        <span>Kinshasa, RD Congo</span>
        <span>Logiciel · Réseaux · Design</span>
        <span>Assistant disponible 24/7</span>
      </div>
    </div>
  </section>
);

export default Hero;