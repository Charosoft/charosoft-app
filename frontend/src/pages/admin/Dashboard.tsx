import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import type { Project, ClientMessage } from '../../types';

// URL centralisée de l'API (bascule automatique sur Render si la variable n'est pas définie)
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://charosoft-api.onrender.com';

export const Dashboard: React.FC = () => {
  // Authentification Admin simple
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // États du formulaire
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

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormStatus('Projet et fichiers publiés avec succès !');
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
      setFormStatus('Erreur lors de la publication du projet.');
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
      console.error('Erreur suppression :', error);
    }
  };

  // Écran de Connexion Secrète
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full space-y-5 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-center text-blue-400">Accès Administrateur</h2>
          <p className="text-xs text-slate-400 text-center">Zone réservée uniquement aux administrateurs de la plateforme.</p>
          
          {authError && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg text-center">
              {authError}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-2">Mot de passe de sécurité</label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Se Connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
            <div>
              <BackButton label="Retour au site" fallbackUrl="/" />
              <h1 className="text-3xl font-bold text-white">Espace d'Administration</h1>
              <p className="text-slate-400 text-sm mt-1">Gérez vos projets et messages reçus.</p>
            </div>

            <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Projets ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Messages ({messages.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'projects' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire avec upload */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
                <h2 className="text-xl font-bold text-white mb-4">Ajouter un Projet</h2>

                {formStatus && (
                  <div className="mb-4 p-3 rounded text-sm bg-slate-800 border border-slate-700 text-blue-400">
                    {formStatus}
                  </div>
                )}

                <form onSubmit={handleCreateProject} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-slate-300 mb-1">Titre du projet</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={handleTitleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description courte</label>
                    <textarea
                      required
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Miniature (Image de couverture)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="w-full text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Vidéo Démo (depuis ton PC)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Lien du site web (Optionnel)</label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://mon-site.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Technologies (ex: React, Cisco, PHP)</label>
                    <input
                      type="text"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition mt-2 disabled:opacity-50"
                  >
                    {uploading ? 'Envoi des fichiers...' : 'Publier le projet'}
                  </button>
                </form>
              </div>

              {/* Liste des projets actuels */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Projets enregistrés</h2>
                {projects.length === 0 ? (
                  <p className="text-slate-500">Aucun projet enregistré.</p>
                ) : (
                  projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {p.thumbnail_url && (
                          <img src={p.thumbnail_url} alt={p.title} className="w-16 h-12 object-cover rounded" />
                        )}
                        <div>
                          <h3 className="font-bold text-white">{p.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-xs transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Liste des messages */
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Messages Clients</h2>
              {messages.length === 0 ? (
                <p className="text-slate-500">Aucun message pour le moment.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{m.client_name}</h3>
                        <p className="text-xs text-blue-400">{m.client_email}</p>
                      </div>
                    </div>
                    {m.subject && <p className="text-sm font-semibold text-slate-300">Sujet : {m.subject}</p>}
                    <p className="text-sm text-slate-400 whitespace-pre-wrap">{m.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;