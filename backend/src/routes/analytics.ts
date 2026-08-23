// backend/src/routes/analytics.ts
import { Router } from 'express';
import axios from 'axios';
import { supabase } from '../db';

const router = Router();

// Route pour enregistrer une visite
router.post('/track', async (req, res) => {
  try {
    // 1. Récupération de l'adresse IP
    let ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';

    // En dev ou local, fallback sur une IP publique de Kinshasa
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      ip = '105.235.132.1';
    }

    const { page_path } = req.body;
    const user_agent = req.headers['user-agent'] || 'Inconnu';

    let country = 'Inconnu';
    let country_code = 'XX';
    let city = 'Inconnu';

    // 2. Géolocalisation sécurisée avec timeout (HTTPS)
    try {
      const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 2000 });
      if (geoRes.data) {
        country = geoRes.data.country_name || 'Inconnu';
        country_code = geoRes.data.country_code || 'XX';
        city = geoRes.data.city || 'Inconnu';
      }
    } catch (geoErr) {
      // Fallback vers ip-api HTTP si ipapi.co échoue
      try {
        const altGeo = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, { timeout: 2000 });
        if (altGeo.data && altGeo.data.status === 'success') {
          country = altGeo.data.country || 'Inconnu';
          country_code = altGeo.data.countryCode || 'XX';
          city = altGeo.data.city || 'Inconnu';
        }
      } catch (e) {
        console.warn('Géolocalisation indisponible, enregistrement avec valeurs par défaut.');
      }
    }

    // 3. Insertion garantie dans Supabase
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

    if (error) {
      console.error('Erreur insertion Supabase analytics:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Erreur Tracking Analytics:', err.message);
    return res.status(500).json({ error: 'Erreur serveur analytics' });
  }
});

// Route pour récupérer les statistiques (Admin)
router.get('/stats', async (req, res) => {
  try {
    const { data: views, error } = await supabase
      .from('page_views')
      .select('id, ip_address, country, country_code, city, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const countryMap: Record<string, { country: string; code: string; total: number; ips: Set<string> }> = {};
    const cityMap: Record<string, { city: string; country: string; total: number; ips: Set<string> }> = {};
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

      // Jours
      const dateKey = new Date(v.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    });

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