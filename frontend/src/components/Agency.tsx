import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Reveal } from './ui';


const Title: React.FC<{ k: string; t: string }> = ({ k, t }) => (
  <Reveal className="mb-14 max-w-2xl">
    <p className="label mb-4">{k}</p>
    <h2 className="text-3xl md:text-4xl leading-tight">{t}</h2>
  </Reveal>
);

const why = [
  { t: 'Double expertise', d: 'Logiciel et réseaux sous un même toit : une solution cohérente de bout en bout.' },
  { t: 'Sur mesure', d: 'Chaque solution est conçue pour votre activité, pas adaptée à la va-vite.' },
  { t: 'Sécurité dès la conception', d: 'Accès par rôle, données protégées et bonnes pratiques dès le premier jour.' },
  { t: 'Accompagnement durable', d: 'Formation, maintenance et évolution après la livraison.' },
];

export const WhyUs: React.FC = () => (
  <section className="max-w-7xl mx-auto px-6 pb-28">
    <Title k="02 — Engagements" t="Un partenaire technique fiable" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      {why.map((x, i) => (
        <Reveal key={x.t} delay={i * 0.08}>
          <motion.div
            className="h-px bg-brand mb-6 origin-left"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.08 }}
          />
          <h3 className="text-base mb-3">{x.t}</h3>
          <p className="text-sm text-white/60 leading-relaxed">{x.d}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

const steps = [
  { t: 'Analyse', d: 'Nous étudions votre besoin et vos contraintes.' },
  { t: 'Conception', d: 'Maquettes, architecture et plan de réalisation validés avec vous.' },
  { t: 'Réalisation', d: 'Développement ou déploiement, avec des livraisons régulières.' },
  { t: 'Suivi', d: 'Mise en production, formation, maintenance et évolutions.' },
];

export const Process: React.FC = () => (
  <section className="bg-ink-800/50 border-y border-white/10 py-28 px-6">
    <div className="max-w-7xl mx-auto">
      <Title k="03 — Méthode" t="Du besoin à la mise en production" />
      <div className="grid md:grid-cols-4 gap-10">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.12}>
            <span className="font-display text-6xl text-transparent" style={{ WebkitTextStroke: '1px #FF9D10' }}>0{i + 1}</span>
            <motion.div
              className="h-px bg-brand/60 my-5 origin-left"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 + i * 0.12 }}
            />
            <h3 className="text-base mb-2">{s.t}</h3>
            <p className="text-sm text-white/60">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const faq = [
  { q: 'Comment démarrer un projet avec Charosoft ?', a: 'Contactez-nous via le formulaire ou l’assistant. Nous analysons votre besoin puis vous proposons une solution et un devis.' },
  { q: 'Intervenez-vous après la livraison ?', a: 'Oui. Maintenance, support et évolutions font partie de nos services.' },
  { q: 'Pouvez-vous gérer le logiciel et le réseau ensemble ?', a: 'Oui, c’est notre force : applications et infrastructure sont pensées ensemble.' },
  { q: 'Travaillez-vous avec des entreprises de toute taille ?', a: 'Oui, des indépendants aux organisations, avec des solutions adaptées à chaque échelle.' },
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <Title k="FAQ" t="Questions fréquentes" />
      <div className="space-y-3">
        {faq.map((f, i) => (
          <div key={f.q} className="glass overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left text-sm font-medium">
              {f.q}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-brand"><Plus size={18} /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5 text-sm text-white/60">
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export const CtaBand: React.FC = () => (
  <section className="px-6">
    <Reveal>
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-brand text-ink-900 p-10 md:p-14 text-center">
        <div className="absolute inset-0 opacity-10 circuit-bg" />
        <h2 className="relative text-2xl md:text-4xl mb-4">Un projet en tête ? Parlons-en.</h2>
        <p className="relative mb-8 max-w-xl mx-auto">Décrivez votre besoin, nous revenons vers vous avec une solution adaptée.</p>
        <a href="#contact" className="relative inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-ink-900 text-white font-semibold hover:-translate-y-0.5 transition">
          Démarrer un projet <ArrowRight size={18} />
        </a>
      </div>
    </Reveal>
  </section>
);

export const AgencyFooter: React.FC = () => (
  <footer className="mt-24 border-t border-white/10 bg-ink-800/60 px-6 pt-14 pb-8">
    <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-3">
          <img src="/logo.png" alt="Charosoft" className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display tracking-widest text-sm">CHAROSOFT</span>
        </div>
        <p className="text-sm text-white/60 max-w-sm">Vers l’horizon numérique. Logiciels, réseaux et design pour les entreprises.</p>
      </div>
      <div>
        <h4 className="font-display text-xs text-brand mb-4">Services</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li>Développement logiciel & web</li><li>ERP & applications métier</li><li>Réseaux & infrastructure</li><li>Maintenance & support</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-xs text-brand mb-4">Contact</h4>
        <ul className="space-y-2 text-sm text-white/60">
          <li className="flex items-center gap-2"><Mail size={14} className="text-brand" /> charosoft6@gmail.com</li>
          <li className="flex items-center gap-2"><MapPin size={14} className="text-brand" /> Kinshasa, RD Congo</li>
        </ul>
      </div>
    </div>
    <p className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/40">
      © {new Date().getFullYear()} Charosoft. Tous droits réservés.
    </p>
  </footer>
);