import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Bot, Send, X } from 'lucide-react';

const API = import.meta.env?.VITE_API_BASE_URL || 'https://charosoft-api.onrender.com';
type Msg = { role: 'user' | 'assistant'; content: string };

const HELLO: Msg = {
  role: 'assistant',
  content: 'Bonjour, je suis l’assistant Charosoft. Un projet, un service, un devis ? Dites-moi comment je peux vous aider.',
};
const QUICK = ['Quels sont vos services ?', 'Je souhaite un devis', 'Voir vos réalisations'];

export const ChatAgent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([HELLO]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy, open]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: t }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const { data } = await axios.post(`${API}/api/chat`, { messages: next.slice(1) });
      setMsgs([...next, { role: 'assistant', content: data.reply }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Je suis momentanément indisponible. Utilisez le formulaire de contact, nous vous répondrons vite.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Assistant Charosoft"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand text-ink-900 flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-brand animate-ring" />}
        <span className="relative">{open ? <X /> : <Bot />}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[32rem] flex flex-col rounded-lg bg-ink-800 border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 bg-brand text-ink-900 flex items-center gap-2 font-semibold">
              <Bot size={18} /> Assistant Charosoft
              <span className="ml-auto text-xs font-normal">● en ligne</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] px-3 py-2 rounded-lg whitespace-pre-wrap ${
                    m.role === 'user' ? 'ml-auto bg-brand text-ink-900' : 'bg-white/10'
                  }`}
                >
                  {m.content}
                </motion.div>
              ))}
              {busy && (
                <div className="bg-white/10 w-16 px-3 py-3 rounded-lg flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="w-2 h-2 rounded-full bg-brand" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(q)} className="px-3 py-1.5 text-xs rounded-full border border-brand/50 text-brand hover:bg-brand hover:text-ink-900 transition">{q}</button>
                  ))}
                </div>
              )}
              <div ref={end} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                maxLength={500}
                className="flex-1 bg-ink-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
              />
              <button type="submit" disabled={busy} className="w-10 h-10 rounded-lg bg-brand text-ink-900 flex items-center justify-center disabled:opacity-50" aria-label="Envoyer">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAgent;