import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatData {
  totalViews: number;
  daily: { date: string; visits: number }[];
  byCountry: { country: string; code: string; total: number; uniqueIps: number }[];
  byCity: { city: string; country: string; total: number; uniqueIps: number }[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL =
          import.meta.env?.VITE_API_BASE_URL ||
          import.meta.env?.VITE_API_URL ||
          'https://charosoft-api.onrender.com';

        const res = await axios.get<StatData>(`${API_URL}/api/analytics/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Erreur chargement analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-center text-white">Chargement du trafic en cours...</div>;
  if (!stats) return <div className="p-6 text-center text-red-500">Impossible de charger les données analytiques.</div>;

  const maxCountryCount = stats.byCountry[0]?.total || 1;
  const maxCityCount = stats.byCity[0]?.total || 1;

  return (
    <div className="p-6 space-y-8 bg-slate-900 min-h-screen text-slate-100 font-sans rounded-2xl border border-slate-800">
      
      {/* HEADER & TOTAL */}
      <div className="flex justify-between items-center bg-slate-800/90 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📈</span> Trafic connexions
        </h2>
        <span className="bg-blue-600/20 text-blue-400 font-semibold px-4 py-1.5 rounded-full border border-blue-500/30">
          Total : {stats.totalViews} vues
        </span>
      </div>

      {/* 1. VISITES PAR JOUR */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          📊 Visites par jour
        </h3>
        <div style={{ width: '100%', height: 260 }}>
          {stats.daily.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Aucune visite enregistrée pour le moment.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="visits" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. REPARTITION PAR PAYS */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-xl space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            🌍 Par pays
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {stats.byCountry.length === 0 ? (
              <p className="text-slate-500 text-sm">Données non disponibles</p>
            ) : (
              stats.byCountry.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-200">
                      {item.country} <span className="text-xs text-slate-400">({item.code})</span>
                    </span>
                    <span className="font-bold text-slate-100">{item.total}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.total / maxCountryCount) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{item.uniqueIps} IP unique(s)</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. REPARTITION PAR VILLE */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-xl space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            🏢 Par ville
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {stats.byCity.length === 0 ? (
              <p className="text-slate-500 text-sm">Données non disponibles</p>
            ) : (
              stats.byCity.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-200">
                      {item.city} <span className="text-xs text-slate-400">· {item.country}</span>
                    </span>
                    <span className="font-bold text-slate-100">{item.total}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.total / maxCityCount) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{item.uniqueIps} IP unique(s)</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;