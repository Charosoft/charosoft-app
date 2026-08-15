import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
      {project.thumbnail_url && (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-3">{project.description}</p>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-slate-800 text-blue-300 rounded border border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>

          <button
            onClick={() => onSelect(project)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;