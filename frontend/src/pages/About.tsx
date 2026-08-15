import React from 'react';
import BackButton from '../components/BackButton';
const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-16 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <BackButton label="Retour à l'accueil" />
        {/* En-tête */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            À propos de moi
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded mx-auto"></div>
        </div>

        {/* Section Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Texte de présentation */}
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <p>
              Salut ! Je suis <span className="text-white font-semibold">Jenovie Kola</span> (alias <span className="text-blue-400 font-semibold">Charosoft</span>), développeur full-stack et administrateur systèmes.
            </p>
            <p>
              Naviguant au quotidien entre le développement logiciel et l'infrastructure réseau, je conçois des applications web modernes, des outils d'aide à la décision et des architectures informatiques performantes.
            </p>
            <p>
              Également graphiste, j'attache une grande importance au design, à l'ergonomie (UX/UI) et à la finition visuelle de chaque projet que je réalise.
            </p>
          </div>

          {/* Cartes des domaines d'expertise */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Carte Développeur */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500 transition-all duration-300 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>💻</span> Développement Software & Web
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Conception d'applications web modernes, d'APIs REST et d'outils décisionnels.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">TypeScript</span>
                <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">React</span>
                <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">Node.js</span>
                <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">Python</span>
              </div>
            </div>

            {/* Carte Réseaux */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 transition-all duration-300 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🌐</span> Administration Réseaux & System
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Virtualisation, routage, simulation d'infrastructures et gestion de parcs IT.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">Cisco</span>
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">GNS3</span>
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">VMware</span>
              </div>
            </div>

            {/* Carte Graphic Design */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-purple-500 transition-all duration-300 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🎨</span> Graphic Design & UX/UI
              </h3>
              <p className="text-sm text-slate-400">
                Création visuelle, identité de marque et maquettage d'interfaces intuitives.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default About;