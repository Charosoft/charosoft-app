import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-slate-950 text-white min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Solutions Logicielles & Architectures Réseaux
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          Développement d'applications modernes, ingénierie système et intégration d'infrastructures sur mesure.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-lg transition duration-200"
          >
            Découvrir les réalisations
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-slate-700 hover:bg-slate-800 font-semibold rounded-lg transition duration-200"
          >
            Me contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;