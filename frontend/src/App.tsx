import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';

const API_BASE_URL = 'https://charosoft-api.onrender.com';

// Composant interne qui exécute le tracker à chaque changement de page
const TrackerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Ne pas enregistrer les visites de l'espace administration
    if (location.pathname.startsWith('/admin')) return;

    axios.post(`${API_BASE_URL}/api/analytics/track`, {
      page_path: location.pathname
    }).catch(err => console.error('Analytics tracker status:', err.message));
  }, [location.pathname]);

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <TrackerWrapper>
        <Routes>
          {/* Route Vitrine Publique */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Route Administration */}
          <Route path="/admin" element={<Dashboard />} />

          {/* Redirection vers l'accueil pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TrackerWrapper>
    </Router>
  );
};

export default App;