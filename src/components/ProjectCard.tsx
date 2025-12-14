import { useState } from 'react';
import { Layers } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const difficultyColors = {
  "Débutant": "bg-green-100 text-green-700",
  "Intermédiaire": "bg-yellow-100 text-yellow-700",
  "Avancé": "bg-red-100 text-red-700"
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group perspective-1000"
    >
      <div
        className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform ${
          isHovered ? 'scale-105 shadow-2xl -translate-y-2' : ''
        }`}
        style={{
          transform: isHovered ? 'rotateX(5deg) rotateY(5deg)' : 'rotateX(0) rotateY(0)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Gradient Header */}
        <div className={`h-32 bg-linear-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span className="text-6xl filter drop-shadow-lg">{project.icon}</span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[project.difficulty]}`}>
              {project.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.concepts.map((concept, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
              >
                {concept}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Layers size={14} />
              {project.concepts.length} concepts
            </span>
            <span className="text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
              Explorer →
            </span>
          </div>
        </div>

        {/* Shine effect */}
        <div
          className={`absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
            isHovered ? 'animate-shine' : ''
          }`}
          style={{ transform: 'translateX(-100%)' }}
        ></div>
      </div>

      <style>{`
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 0.7s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}