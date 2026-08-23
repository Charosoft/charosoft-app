// backend/src/routes/analytics.ts
import { Router } from 'express';
import axios from 'axios';
import { supabase } from '../db';

const router = Router();

// Route pour enregistrer une visite
router.post('/track', async (req, res) => {
  try {
    // 1. Récupération de l'adresse IP réelle
    let ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';

    // Si test en local (localhost / 127.0.0.1 / ::1), utiliser une IP de test pour la géolocalisation
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
      ip = '105.235.132.1'; // Exemple d'IP de Kinshasa pour la phase de dev
    }

    const { page_path } = req.body;
    const user_agent = req.headers['user-agent'] || 'Inconnu';

    // 2. Appel à l'API gratuite ip-api pour géolocaliser l'IP
    let country = 'Inconnu';
    let country_code = 'XX';
    let city = 'Inconnu';

    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`);
      if (geoRes.data && geoRes.data.status === 'success') {
        country = geoRes.data.country || 'Inconnu';
        country_code = geoRes.data.countryCode || 'XX';
        city = geoRes.data.city || 'Inconnu';
      }
    } catch (geoErr) {
      console.error('Erreur géolocalisation IP:', geoErr);
    }

    // 3. Insertion dans Supabase
    const { error } = await supabase.from('page_views').insert([
      {
        ip_address: ip,
        country,
        country_code,
        city,
        page_path: page_path || '/',
        user_agent
      }
    ]);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Erreur Tracking Analytics:', err.message);
    return res.status(500).json({ error: 'Erreur serveur analytics' });
  }
});

// Route pour récupérer l'agrégation des statistiques (Admin)
router.get('/stats', async (req, res) => {
  try {
    // Récupérer les 30 derniers jours
    const { data: views, error } = await supabase
      .from('page_views')
      .select('id, ip_address, country, country_code, city, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // A. Agrégation par Pays
    const countryMap: Record<string, { country: string; code: string; total: number; ips: Set<string> }> = {};
    // B. Agrégation par Ville
    const cityMap: Record<string, { city: string; country: string; total: number; ips: Set<string> }> = {};
    // C. Visites par Jour (les 7 derniers jours)
    const dailyMap: Record<string, number> = {};

    views?.forEach((v) => {
      // Pays
      if (!countryMap[v.country]) {
        countryMap[v.country] = { country: v.country, code: v.country_code, total: 0, ips: new Set() };
      }
      countryMap[v.country].total += 1;
      countryMap[v.country].ips.add(v.ip_address);

      // Ville
      const cityKey = `${v.city}-${v.country}`;
      if (!cityMap[cityKey]) {
        cityMap[cityKey] = { city: v.city, country: v.country, total: 0, ips: new Set() };
      }
      cityMap[cityKey].total += 1;
      cityMap[cityKey].ips.add(v.ip_address);

      // Jours (Format DD/MM)
      const dateKey = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    });

    // Formater les données pour le frontend
    const byCountry = Object.values(countryMap)
      .map(c => ({ country: c.country, code: c.code, total: c.total, uniqueIps: c.ips.size }))
      .sort((a, b) => b.total - a.total);

    const byCity = Object.values(cityMap)
      .map(c => ({ city: c.city, country: c.country, total: c.total, uniqueIps: c.ips.size }))
      .sort((a, b) => b.total - a.total);

    const daily = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, visits: count }))
      .reverse();

    return res.status(200).json({
      totalViews: views?.length || 0,
      daily,
      byCountry,
      byCity
    });

  } catch (err: any) {
    console.error('Erreur récupération Analytics:', err.message);
    return res.status(500).json({ error: 'Erreur lors du chargement des statistiques' });
  }
});

export default router;