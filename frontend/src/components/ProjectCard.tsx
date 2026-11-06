import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import { Reveal } from './ui';

interface Props { project: Project; onSelect: (p: Project) => void; index?: number }

export const ProjectCard: React.FC<Props> = ({ project, onSelect, index = 0 }) => (
  <Reveal delay={(index % 3) * 0.1}>
    <article className="group cursor-pointer" onClick={() => onSelect(project)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-800 border border-white/10">
        {project.thumbnail_url && (
          <motion.img
            src={project.thumbnail_url} alt={project.title}
            className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition duration-500"
            whileHover={{ scale: 1.06 }} transition={{ duration: 0.6 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand text-ink-900 flex items-center justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="pt-5">
        <p className="label !text-white/40">{project.technologies?.slice(0, 3).join(' · ')}</p>
        <h3 className="text-lg mt-2 group-hover:text-brand transition">{project.title}</h3>
        <p className="text-sm text-white/60 line-clamp-2 mt-2">{project.description}</p>
      </div>
    </article>
  </Reveal>
);

export default ProjectCard;