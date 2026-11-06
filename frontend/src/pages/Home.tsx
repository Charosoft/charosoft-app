import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import type { Project } from '../types';
import { Services, Stats, TechMarquee } from '../components/Sections';
import ChatAgent from '../components/ChatAgent';
import { Eyebrow, Reveal } from '../components/ui';
import { WhyUs, Process, FAQ, CtaBand, AgencyFooter } from '../components/Agency';

// URL centralisée de l'API (bascule automatique sur Render si la variable n'est pas définie)
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://charosoft-api.onrender.com';

const fieldCls =
  'w-full bg-ink-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-brand transition';

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // État du formulaire de contact
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Chargement des projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>(`${API_BASE_URL}/api/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des projets :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Gestion de la soumission du formulaire de contact
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await axios.post(`${API_BASE_URL}/api/messages`, formData);
      setStatusMessage({
        type: 'success',
        text: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      });
      setFormData({ client_name: '', client_email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Erreur envoi message :', error);
      setStatusMessage({
        type: 'error',
        text: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <TechMarquee />
        <Services />
        <WhyUs />
        <Process />
        <Stats projects={projects.length} />

        {/* Section Projets */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-28">
          <Reveal className="mb-14 max-w-2xl">
            <Eyebrow n="04">Réalisations</Eyebrow>
            <h2 className="text-3xl md:text-4xl leading-tight">Des solutions livrées pour nos clients</h2>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id || project.slug}
                  index={i}
                  project={project}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          ) : (
            <p className="text-white/40 py-8">Aucun projet disponible pour le moment.</p>
          )}
        </section>

        <FAQ />
        <CtaBand />

        {/* Section Contact */}
        <section id="contact" className="bg-ink-800/50 border-t border-white/10 mt-28 py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <Reveal className="mb-12">
              <Eyebrow n="05">Contact</Eyebrow>
              <h2 className="text-3xl md:text-4xl leading-tight">Contactez-nous</h2>
              <p className="mt-4 text-white/60">
                Un projet à concrétiser ou une question technique ? Envoyez-nous un message.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {statusMessage && (
                  <div
                    className={`p-4 rounded-md text-sm font-medium ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className={fieldCls}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Adresse email</label>
                    <input
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className={fieldCls}
                      placeholder="nom@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={fieldCls}
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${fieldCls} resize-none`}
                    placeholder="Décrivez votre besoin..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </div>

      <AgencyFooter />
      <ChatAgent />

      {/* Modale de détails */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default Home;