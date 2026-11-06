import React from 'react';
import { motion } from 'framer-motion';
import { Activity, FolderKanban, MessageSquare } from 'lucide-react';

export type Tab = 'analytics' | 'projects' | 'messages';

export const LoginScreen: React.FC<{
  password: string; setPassword: (v: string) => void; error: string | null; onSubmit: (e: React.FormEvent) => void;
}> = ({ password, setPassword, error, onSubmit }) => (
  <div className="min-h-screen grid lg:grid-cols-2 bg-ink-900">
    <div className="hidden lg:flex relative items-center justify-center bg-ink-800 overflow-hidden">
      <div className="absolute inset-0 circuit-bg" />
      <motion.img src="/logo.png" alt="Charosoft" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }} className="relative w-80" />
    </div>
    <div className="flex items-center justify-center p-8">
      <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
        <div>
          <p className="label mb-3">Espace sécurisé</p>
          <h1 className="text-2xl">Administration</h1>
        </div>
        {error && (
          <motion.p initial={{ x: -8 }} animate={{ x: [0, -8, 8, -4, 0] }} className="text-sm text-rose-300 border border-rose-800 bg-rose-950/60 rounded-md p-3">
            {error}
          </motion.p>
        )}
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"
          className="w-full bg-ink-800 border border-white/10 rounded-md px-4 py-3 focus:outline-none focus:border-brand transition" />
        <button type="submit" className="btn-primary w-full justify-center">Se connecter</button>
      </motion.form>
    </div>
  </div>
);

export const AdminTabs: React.FC<{
  active: Tab; onChange: (t: Tab) => void; counts: { projects: number; messages: number };
}> = ({ active, onChange, counts }) => {
  const tabs = [
    { id: 'analytics' as Tab, label: 'Trafic', icon: Activity },
    { id: 'projects' as Tab, label: `Projets (${counts.projects})`, icon: FolderKanban },
    { id: 'messages' as Tab, label: `Messages (${counts.messages})`, icon: MessageSquare },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-lg border border-white/10 bg-ink-800 w-fit">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${active === t.id ? 'text-ink-900' : 'text-white/60 hover:text-white'}`}>
          {active === t.id && (
            <motion.span layoutId="admin-tab" className="absolute inset-0 bg-brand rounded-md" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
          )}
          <span className="relative flex items-center gap-2"><t.icon size={16} />{t.label}</span>
        </button>
      ))}
    </div>
  );
};