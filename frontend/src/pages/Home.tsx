import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';
import type { Project } from '../types';

// URL centralisée de l'API (bascule automatique sur Render si la variable n'est pas définie)
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://charosoft-api.onrender.com';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />

        {/* Section Projets */}
        <section id="projects" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Projets & Réalisations
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Découvrez mes réalisations récentes en développement d'applications, architectures réseau et systèmes.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id || project.slug}
                  project={project}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              Aucun projet disponible pour le moment.
            </p>
          )}
        </section>

        {/* Section Contact */}
        <section id="contact" className="bg-slate-900 border-t border-slate-800 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Me Contacter</h2>
              <p className="mt-2 text-slate-400">
                Un projet à concrétiser ou une question technique ? Envoyez-moi un message.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              {statusMessage && (
                <div
                  className={`p-4 rounded-lg text-sm font-medium ${
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                    placeholder="nom@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sujet</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Décrivez votre besoin..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
              >
                {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </section>
      </div>

      <Footer />

      {/* Modale de détails */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
  
    </div>
  );
};

export default Home;