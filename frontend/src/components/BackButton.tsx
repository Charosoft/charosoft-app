import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  label = "Retour", 
  fallbackUrl = "/" 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Si l'historique du navigateur existe, on revient en arrière, sinon on redirige vers l'accueil
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all duration-200 cursor-pointer mb-6"
    >
      {/* Icône flèche retour */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-4 h-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;