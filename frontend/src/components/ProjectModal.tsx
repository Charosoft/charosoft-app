import React from 'react';
import type { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 text-slate-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Vidéo démonstrative */}
        {project.video_demo_url ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-slate-800">
            <video
              src={project.video_demo_url}
              controls
              className="w-full h-full object-contain"
            >
              Votre navigateur ne supporte pas la lecture de vidéo.
            </video>
          </div>
        ) : (
          project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )
        )}

        <div className="space-y-4">
          <p className="text-slate-300 whitespace-pre-wrap">
            {project.full_content || project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs bg-slate-800 text-blue-400 rounded-full border border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Visiter le site / lien du projet ↗
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;