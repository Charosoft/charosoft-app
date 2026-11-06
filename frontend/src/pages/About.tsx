import React from 'react';
import BackButton from '../components/BackButton';
import Navbar from '../components/Navbar';
import { AgencyFooter } from '../components/Agency';
import { Reveal, Eyebrow, MaskText } from '../components/ui';

const pillars = [
  { t: 'Développement', d: 'Applications web, ERP et outils métier.', tech: 'Python · PHP · JavaScript · PostgreSQL' },
  { t: 'Réseaux', d: 'Conception, déploiement et administration d’infrastructures.', tech: 'Administration réseaux · Sécurité' },
  { t: 'Design', d: 'Identité visuelle, supports et interfaces soignées.', tech: 'Photoshop · Illustrator' },
];

const About: React.FC = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="max-w-6xl mx-auto px-6 pt-36">
      <BackButton label="Retour à l'accueil" />
      <Eyebrow n="—">À propos de Charosoft</Eyebrow>
      <h1 className="text-3xl md:text-5xl leading-tight max-w-4xl">
        <MaskText text="Nous accompagnons les entreprises dans leur transformation numérique." />
      </h1>

      <div className="grid lg:grid-cols-12 gap-12 mt-16">
        <Reveal className="lg:col-span-7 space-y-5 text-lg text-white/70 leading-relaxed">
          <p>Basée à Kinshasa, Charosoft conçoit des logiciels et des infrastructures réseau pour les organisations qui veulent des outils fiables et adaptés à leur réalité.</p>
          <p>Notre force : réunir sous un même toit le développement, l’infrastructure et le design, pour livrer des solutions cohérentes de bout en bout.</p>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-5 border-l border-brand pl-8">
          <p className="label mb-3">Fondateur</p>
          <p className="font-display text-xl">Jenovie Kola</p>
          <p className="text-white/60 text-sm mt-2">Ingénieur Réseaux & Logiciels</p>
        </Reveal>
      </div>

      <div className="mt-24 border-t border-white/10">
        {pillars.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.08}>
            <div className="grid md:grid-cols-12 gap-4 py-8 border-b border-white/10 group">
              <span className="font-display text-xs text-white/30 md:col-span-1">0{i + 1}</span>
              <h3 className="md:col-span-4 font-display text-lg group-hover:text-brand transition">{p.t}</h3>
              <p className="md:col-span-4 text-white/60">{p.d}</p>
              <p className="md:col-span-3 text-xs text-white/40">{p.tech}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
    <AgencyFooter />
  </div>
);

export default About;