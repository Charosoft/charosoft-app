import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const router = Router();

const secret = () => process.env.ADMIN_TOKEN_SECRET || '';
const sign = (p: string) => crypto.createHmac('sha256', secret()).update(p).digest('hex');
const sha = (s: string) => crypto.createHash('sha256').update(s).digest();

const makeToken = () => {
  const exp = String(Date.now() + 8 * 3600_000); // valable 8 h
  return `${exp}.${sign(exp)}`;
};

// Protège les routes réservées à l'admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [exp, sig] = token.split('.');
  if (!secret() || !exp || !sig) return res.status(401).json({ error: 'Non autorisé' });

  const good = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !crypto.timingSafeEqual(good, given) || Number(exp) < Date.now()) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
};

// Limite : 5 tentatives / 15 min / IP
const tries = new Map<string, { n: number; t: number }>();

router.post('/login', (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  const r = tries.get(ip);
  if (!r || now - r.t > 15 * 60_000) tries.set(ip, { n: 1, t: now });
  else if (++r.n > 5) return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' });

  const expected = process.env.ADMIN_PASSWORD;
  const given = String(req.body?.password || '');
  if (!expected || !secret()) return res.status(500).json({ error: 'Configuration serveur manquante.' });

  if (!crypto.timingSafeEqual(sha(given), sha(expected))) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }
  tries.delete(ip);
  return res.json({ token: makeToken() });
});

export default router;