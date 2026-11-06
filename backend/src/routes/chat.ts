import { Router } from 'express';
import axios from 'axios';
import { supabase } from '../db';

const router = Router();

const SYSTEM = `Tu es l'assistant d'accueil de CHAROSOFT (slogan : « Vers l'horizon numérique »), entreprise basée à Kinshasa.
Services : développement logiciel et web, ERP et applications métier, réseaux et infrastructure, maintenance et support informatique, design et identité visuelle, IA et automatisation.
Règles : réponds en français, de façon chaleureuse, professionnelle et brève (3 phrases max).
N'invente jamais de prix, de délais ni de références. Pour un devis ou un besoin précis, demande le nom, l'email et une description du besoin.
Quand tu as le nom, l'email et le besoin, remercie le visiteur, dis que l'équipe le recontactera, puis ajoute à la toute fin, sur une ligne : ##LEAD{"name":"...","email":"...","need":"..."}
Si la question est hors sujet, ramène poliment la conversation vers les services Charosoft.`;

// Limite simple : 20 messages / heure / IP
const hits = new Map<string, { n: number; t: number }>();

router.post('/', async (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 3600_000) hits.set(ip, { n: 1, t: now });
  else if (++h.n > 20) {
    return res.status(429).json({ reply: 'Trop de messages, réessayez plus tard ou utilisez le formulaire de contact.' });
  }

  const raw = Array.isArray(req.body.messages) ? req.body.messages : [];
  const messages = raw.slice(-12).map((m: any) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 1000),
  }));
  if (!messages.length || messages[0].role !== 'user') {
    return res.status(400).json({ reply: 'Requête invalide.' });
  }

  // Consigne + historique dans un seul texte
  const history = messages
    .map((m: any) => `${m.role === 'assistant' ? 'Assistant' : 'Visiteur'} : ${m.content}`)
    .join('\n');
  const input = `${SYSTEM}\n\n--- Conversation ---\n${history}\nAssistant :`;

  try {
    const models = [
      process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite',
    ];

    let data: any = null;
    let lastErr: any = null;
    for (const model of models) {
      for (let attempt = 0; attempt < 2 && !data; attempt++) {
        try {
          const r = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/interactions',
            { model, input, store: false },
            { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }, timeout: 25000 }
          );
          data = r.data;
        } catch (e: any) {
          lastErr = e;
          const s = e.response?.status;
          if (s !== 503 && s !== 429) break; // autre erreur : modèle suivant
          await new Promise((r) => setTimeout(r, 1200));
        }
      }
      if (data) break;
    }
    if (!data) throw lastErr;

    let reply: string = (data.steps || [])
      .filter((s: any) => s.type === 'model_output')
      .flatMap((s: any) => s.content || [])
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('')
      .trim();

    if (!reply) throw new Error('Réponse vide : ' + JSON.stringify(data).slice(0, 300));

    const m = reply.match(/##LEAD(\{.*\})/s);
    if (m) {
      reply = reply.replace(m[0], '').trim();
      try {
        const l = JSON.parse(m[1]);
        await supabase.from('client_messages').insert([{
          client_name: String(l.name).slice(0, 100),
          client_email: String(l.email).slice(0, 150),
          subject: 'Contact via assistant IA',
          message: String(l.need).slice(0, 1000),
        }]);
      } catch (e) {
        console.error('Lead invalide', e);
      }
    }
    return res.json({ reply });
  } catch (e: any) {
    console.error('Chat error:', e.response?.data || e.message);
    return res.status(500).json({ reply: 'Je suis momentanément indisponible.' });
  }
});

export default router;