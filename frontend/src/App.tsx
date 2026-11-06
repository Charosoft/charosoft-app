import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';
import { ScrollProgress } from './components/ui';

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://charosoft-api.onrender.com';

// Enregistre chaque visite (hors espace admin)
const TrackerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    axios
      .post(`${API_BASE_URL}/api/analytics/track`, { page_path: location.pathname })
      .catch((err) => console.error('Analytics tracker status:', err.message));
  }, [location.pathname]);

  return <>{children}</>;
};

// Transition entre les pages
const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/admin" element={<Page><Dashboard /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <TrackerWrapper>
        <ScrollProgress />
        <AnimatedRoutes />
      </TrackerWrapper>
    </Router>
  );
};

export default App;