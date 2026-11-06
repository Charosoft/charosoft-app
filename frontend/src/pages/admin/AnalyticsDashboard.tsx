import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Eye, Users, Globe, MapPin, RefreshCw } from 'lucide-react';
import { Counter } from '../../components/ui';

interface StatData {
  totalViews: number;
  daily: { date: string; visits: number }[];
  byCountry: { country: string; code: string; total: number; uniqueIps: number }[];
  byCity: { city: string; country: string; total: number; uniqueIps: number }[];
}

const API_URL = import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL || 'https://charosoft-api.onrender.com';
const COLORS = ['#FF9D10', '#FFB547', '#E07F00', '#9A9C9B', '#5A5D5B', '#3A3D3B'];

const Card: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay }}
    className={`border border-white/10 bg-ink-800/60 rounded-lg p-6 ${className}`}>
    {children}
  </motion.div>
);

const Kpi: React.FC<{ icon: React.ElementType; label: string; value: number; delay: number }> = ({ icon: Icon, label, value, delay }) => (
  <Card delay={delay} className="relative overflow-hidden">
    <motion.div className="absolute top-0 left-0 h-[2px] bg-brand" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.2, delay: delay + 0.3 }} />
    <div className="flex items-center justify-between text-white/50">
      <span className="label !text-white/50">{label}</span>
      <Icon size={18} className="text-brand" />
    </div>
    <p className="font-display text-4xl mt-5"><Counter to={value} /></p>
  </Card>
);

const Tip: React.FC<any> = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-ink-900 border border-brand/40 rounded-md px-3 py-2 text-sm">
      <p className="text-white/50 text-xs">{label}</p>
      <p className="font-semibold text-brand">{payload[0].value} visite(s)</p>
    </div>
  ) : null;

const BarRow: React.FC<{ label: string; sub: string; value: number; max: number; i: number }> = ({ label, sub, value, max, i }) => (
  <div>
    <div className="flex justify-between text-sm mb-1.5">
      <span>{label} <span className="text-xs text-white/40">{sub}</span></span>
      <span className="font-semibold">{value}</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div className="h-full bg-brand rounded-full" initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: 'easeOut' }} />
    </div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState<number>(14);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await axios.get<StatData>(`${API_URL}/api/analytics/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Erreur chargement analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // actualisation automatique
    return () => clearInterval(t);
  }, [load]);

  const derived = useMemo(() => {
    if (!stats) return null;
    const known = stats.byCountry.filter((c) => c.country !== 'Inconnu');
    const daily = range ? stats.daily.slice(-range) : stats.daily;
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const top = known.slice(0, 5).map((c) => ({ name: c.country, value: c.total }));
    const others = known.slice(5).reduce((s, c) => s + c.total, 0);
    return {
      daily,
      unique: stats.byCountry.reduce((s, c) => s + c.uniqueIps, 0),
      countries: known.length,
      todayVisits: stats.daily.find((d) => d.date === today)?.visits || 0,
      pie: others ? [...top, { name: 'Autres', value: others }] : top,
    };
  }, [stats, range]);

  if (loading) return <div className="py-20 text-center text-white/50">Chargement des statistiques…</div>;
  if (!stats || !derived) return <div className="py-20 text-center text-rose-300">Impossible de charger les données.</div>;

  const maxCity = stats.byCity[0]?.total || 1;
  const pieTotal = derived.pie.reduce((s, p) => s + p.value, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-white/60">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand" /></span>
          En direct, actualisé toutes les 30 s
        </p>
        <button onClick={load} className="p-2 text-white/50 hover:text-brand transition" aria-label="Actualiser">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Eye} label="Vues totales" value={stats.totalViews} delay={0} />
        <Kpi icon={Users} label="Visiteurs uniques" value={derived.unique} delay={0.08} />
        <Kpi icon={Globe} label="Pays" value={derived.countries} delay={0.16} />
        <Kpi icon={MapPin} label="Aujourd’hui" value={derived.todayVisits} delay={0.24} />
      </div>

      <Card delay={0.3}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-base">Visites par jour</h3>
          <div className="flex gap-1 p-1 border border-white/10 rounded-md text-xs">
            {[{ l: '7 j', v: 7 }, { l: '14 j', v: 14 }, { l: 'Tout', v: 0 }].map((o) => (
              <button key={o.l} onClick={() => setRange(o.v)}
                className={`px-3 py-1 rounded transition ${range === o.v ? 'bg-brand text-ink-900 font-semibold' : 'text-white/60 hover:text-white'}`}>{o.l}</button>
            ))}
          </div>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          {derived.daily.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/40 text-sm">Aucune visite enregistrée.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={derived.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9D10" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#FF9D10" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<Tip />} cursor={{ stroke: '#FF9D10', strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="visits" stroke="#FF9D10" strokeWidth={2.5} fill="url(#visitsFill)"
                  animationDuration={1500} activeDot={{ r: 5, fill: '#FF9D10', stroke: '#141615', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card delay={0.4}>
          <h3 className="font-display text-base mb-4">Répartition par pays</h3>
          {derived.pie.length === 0 ? (
            <p className="text-white/40 text-sm">Données non disponibles</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={derived.pie} dataKey="value" innerRadius={58} outerRadius={90} paddingAngle={3} stroke="none" animationDuration={1200}>
                      {derived.pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 w-full space-y-2.5 text-sm">
                {derived.pie.map((p, i) => (
                  <motion.li key={p.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.07 }}
                    className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="flex-1">{p.name}</span>
                    <span className="text-white/50">{Math.round((p.value / pieTotal) * 100)}%</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card delay={0.5}>
          <h3 className="font-display text-base mb-5">Villes les plus actives</h3>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {stats.byCity.length === 0 ? (
              <p className="text-white/40 text-sm">Données non disponibles</p>
            ) : (
              stats.byCity.slice(0, 8).map((c, i) => (
                <BarRow key={`${c.city}-${c.country}`} label={c.city} sub={`· ${c.country}`} value={c.total} max={maxCity} i={i} />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;