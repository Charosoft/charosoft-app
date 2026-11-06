import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, Counter, Eyebrow, MaskText } from './ui';

const services = [
  { title: 'Développement logiciel & web', text: 'Applications web et mobiles sur mesure, du prototype à la mise en production.' },
  { title: 'ERP & applications métier', text: 'Systèmes de gestion modulaires, avec accès par rôle, adaptés à votre organisation.' },
  { title: 'Réseaux & infrastructure', text: 'Conception, déploiement et administration de réseaux fiables et sécurisés.' },
  { title: 'Maintenance & support', text: 'Dépannage, suivi et maintenance préventive de votre parc informatique.' },
  { title: 'Design & identité visuelle', text: 'Logos, chartes graphiques et supports multimédias cohérents avec votre image.' },
  { title: 'IA & automatisation', text: 'Assistants intelligents et automatisations pour gagner du temps au quotidien.' },
];

export const Services: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
        <Eyebrow n="01">Services</Eyebrow>
        <h2 className="text-3xl md:text-4xl leading-tight"><MaskText text="Ce que nous construisons pour vous" /></h2>
        <p className="mt-6 text-sm text-white/60 max-w-xs">Une seule équipe pour vos applications, votre réseau et votre image.</p>
      </div>

      <div className="lg:col-span-8 border-t border-white/10">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            className="border-b border-white/10"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}
          >
            <button
              onMouseEnter={() => setOpen(i)}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-6 py-6 text-left"
            >
              <span className="font-display text-xs text-white/30 w-8">0{i + 1}</span>
              <span className={`flex-1 font-display text-lg md:text-xl transition-colors duration-300 ${open === i ? 'text-brand' : ''}`}>
                {s.title}
              </span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className={open === i ? 'text-brand' : 'text-white/40'}>
                <ArrowUpRight size={22} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden"
                >
                  <p className="pl-14 pr-10 pb-7 text-white/60 max-w-xl">{s.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// À ajuster avec vos vrais chiffres
export const Stats: React.FC<{ projects: number }> = ({ projects }) => {
  const items = [
    { n: projects, s: '+', l: 'Projets réalisés' },
    { n: 6, s: '', l: 'Pôles de services' },
    { n: 24, s: '/7', l: 'Assistant disponible' },
  ];
  return (
    <section className="border-y border-white/10">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {items.map((x) => (
          <Reveal key={x.l} className="px-8 py-12">
            <p className="font-display text-5xl text-brand"><Counter to={x.n} suffix={x.s} /></p>
            <p className="label !text-white/50 mt-4">{x.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const techs = ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Python', 'PHP', 'Tailwind', 'Git', 'Réseaux', 'Photoshop', 'Illustrator'];

export const TechMarquee: React.FC = () => (
  <div className="overflow-hidden py-6 border-b border-white/10">
    <div className="flex w-max animate-marquee gap-12 text-white/35 font-display text-sm">
      {[...techs, ...techs].map((t, i) => <span key={i} className="whitespace-nowrap">{t}</span>)}
    </div>
  </div>
);