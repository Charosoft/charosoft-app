import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import BackButton from '../../components/BackButton';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Project, ClientMessage } from '../../types';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { LoginScreen, AdminTabs } from '../../components/AdminUI';
import type { Tab } from '../../components/AdminUI';

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://charosoft-api.onrender.com';

const inputCls =
  'w-full bg-ink-900 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand transition';
const fileCls =
  'w-full text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-ink-900 cursor-pointer';

export const Dashboard: React.FC = () => {
  // Authentification Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Gestion des onglets
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // États du formulaire projet
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'charosoft2026') {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Mot de passe incorrect.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, messagesRes] = await Promise.all([
        axios.get<Project[]>(`${API_BASE_URL}/api/projects`),
        axios.get<ClientMessage[]>(`${API_BASE_URL}/api/messages`),
      ]);
      setProjects(projectsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Erreur chargement Dashboard :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setFormStatus(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('full_content', fullContent);
    formData.append('live_url', liveUrl);
    formData.append('technologies', technologies);

    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    if (videoFile) formData.append('video', videoFile);

    try {
      await axios.post(`${API_BASE_URL}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormStatus('Projet publié avec succès !');
      setTitle('');
      setSlug('');
      setDescription('');
      setFullContent('');
      setTechnologies('');
      setLiveUrl('');
      setThumbnailFile(null);
      setVideoFile(null);
      fetchData();
    } catch (error) {
      console.error('Erreur création projet :', error);
      setFormStatus('Erreur lors de la publication.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProject = async (id?: string) => {
    if (!id || !window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${id}`);
      fetchData();
    } catch (error) {
      console.error('Erreur suppression projet :', error);
    }
  };

  // Suppression d'un message client
  const handleDeleteMessage = async (id?: string) => {
    if (!id || !window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression message :', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        password={passwordInput}
        setPassword={setPasswordInput}
        error={authError}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 pt-28 pb-10">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <BackButton label="Retour au site" fallbackUrl="/" />
              <p className="label mt-4 mb-2">Administration</p>
              <h1 className="text-2xl md:text-3xl">Espace d'administration</h1>
              <p className="text-white/50 text-sm mt-2">Supervision du trafic, des projets et des messages.</p>
            </div>

            <AdminTabs
              active={activeTab}
              onChange={setActiveTab}
              counts={{ projects: projects.length, messages: messages.length }}
            />
          </div>

          {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'analytics' ? (
                <AnalyticsDashboard />
              ) : loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand"></div>
                </div>
              ) : activeTab === 'projects' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulaire */}
                  <div className="lg:col-span-1 bg-ink-800/60 border border-white/10 rounded-lg p-6 h-fit">
                    <h2 className="font-display text-base mb-5">Ajouter un projet</h2>

                    {formStatus && (
                      <div className="mb-4 p-3 rounded-md text-sm bg-ink-900 border border-brand/40 text-brand">
                        {formStatus}
                      </div>
                    )}

                    <form onSubmit={handleCreateProject} className="space-y-4 text-sm">
                      <div>
                        <label className="block text-white/70 mb-1">Titre du projet</label>
                        <input type="text" required value={title} onChange={handleTitleChange} className={inputCls} />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Description courte</label>
                        <textarea
                          required
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Description complète</label>
                        <textarea
                          rows={4}
                          value={fullContent}
                          onChange={(e) => setFullContent(e.target.value)}
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Miniature (image de couverture)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                          className={fileCls}
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Vidéo démo</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          className={fileCls}
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Lien du site web</label>
                        <input
                          type="url"
                          value={liveUrl}
                          onChange={(e) => setLiveUrl(e.target.value)}
                          className={inputCls}
                          placeholder="https://charosoft.vercel.app"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Technologies (séparées par des virgules)</label>
                        <input
                          type="text"
                          value={technologies}
                          onChange={(e) => setTechnologies(e.target.value)}
                          className={inputCls}
                          placeholder="React, Node.js, PostgreSQL"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
                      >
                        {uploading ? 'Envoi...' : 'Publier le projet'}
                      </button>
                    </form>
                  </div>

                  {/* Liste des projets */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-display text-base mb-4">Projets enregistrés</h2>
                    {projects.length === 0 ? (
                      <p className="text-white/40">Aucun projet enregistré.</p>
                    ) : (
                      projects.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border border-white/10 bg-ink-800/60 rounded-lg p-4 flex justify-between items-center gap-4 hover:border-brand/40 transition"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {p.thumbnail_url && (
                              <img src={p.thumbnail_url} alt={p.title} className="w-16 h-12 object-cover rounded" />
                            )}
                            <div className="min-w-0">
                              <h3 className="font-semibold truncate">{p.title}</h3>
                              <p className="text-xs text-white/50 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="px-3 py-1 border border-rose-800 text-rose-300 hover:bg-rose-950 rounded text-xs transition shrink-0"
                          >
                            Supprimer
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Messages clients */
                <div className="space-y-4">
                  <h2 className="font-display text-base mb-4">Messages clients</h2>
                  {messages.length === 0 ? (
                    <p className="text-white/40">Aucun message pour le moment.</p>
                  ) : (
                    messages.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border border-white/10 bg-ink-800/60 rounded-lg p-5 space-y-2 hover:border-brand/40 transition"
                      >
                        <div className="flex justify-between items-start border-b border-white/10 pb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{m.client_name}</h3>
                            <p className="text-xs text-brand">{m.client_email}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="px-3 py-1 border border-rose-800 text-rose-300 hover:bg-rose-950 rounded text-xs transition"
                          >
                            Supprimer
                          </button>
                        </div>
                        {m.subject && <p className="text-sm font-semibold text-white/80">Sujet : {m.subject}</p>}
                        <p className="text-sm text-white/60 whitespace-pre-wrap">{m.message}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;