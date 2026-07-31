import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';

export const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Route Vitrine Publique */}
          <Route path="/" element={<Home />} />

          {/* Route Administration */}
          <Route path="/admin" element={<Dashboard />} />

          {/* Redirection vers l'accueil pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Analytics />
    </>
  );
};

export default App;