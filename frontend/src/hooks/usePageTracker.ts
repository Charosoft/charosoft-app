import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://charosoft-api.onrender.com';

export const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Ne pas enregistrer les visites de la page d'administration
    if (location.pathname.startsWith('/admin')) return;

    const recordVisit = async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/analytics/track`, {
          page_path: location.pathname,
        });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la visite :', error);
      }
    };

    recordVisit();
  }, [location.pathname]);
};