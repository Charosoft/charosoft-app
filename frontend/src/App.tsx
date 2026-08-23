import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';

// Composant interne qui exécute le tracker à chaque changement de page
const TrackerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Récupère l'URL de l'API (Vercel ou local)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    axios.post(`${API_URL}/api/analytics/track`, {
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