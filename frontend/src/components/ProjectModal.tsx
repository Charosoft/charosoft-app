import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { Project } from '../types';

interface Props { project: Project | null; onClose: () => void }

export const ProjectModal: React.FC<Props> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="bg-ink-800 border border-white/10 sm:rounded-lg max-w-3xl w-full max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start gap-4 p-6 border-b border-white/10">
              <div>
                <p className="label mb-2">Réalisation</p>
                <h2 className="text-2xl">{project.title}</h2>
              </div>
              <button onClick={onClose} aria-label="Fermer" className="p-2 text-white/50 hover:text-brand transition"><X /></button>
            </div>

            <div className="p-6 space-y-6">
              {project.video_demo_url ? (
                <video src={project.video_demo_url} controls className="w-full aspect-video rounded-lg bg-black object-contain" />
              ) : (
                project.thumbnail_url && <img src={project.thumbnail_url} alt={project.title} className="w-full rounded-lg" />
              )}
              <p className="text-white/70 whitespace-pre-wrap leading-relaxed">{project.full_content || project.description}</p>
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="px-3 py-1 text-xs border border-white/15 rounded-full text-white/70">{t}</span>
                  ))}
                </div>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-primary">
                  Voir le projet <ExternalLink size={16} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;