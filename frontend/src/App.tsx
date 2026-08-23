import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About'
import Dashboard from './pages/admin/Dashboard';
// frontend/src/hooks/useTracker.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route Vitrine Publique */}
        <Route path="/" element={<Home />} />

        {/* Route Administration */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        {/* Redirection vers l'accueil pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export const useTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.post(`${API_URL}/api/analytics/track`, {
      page_path: location.pathname
    }).catch(err => console.error('Analytics tracker status:', err.message));
  }, [location.pathname]);
};

export default App;