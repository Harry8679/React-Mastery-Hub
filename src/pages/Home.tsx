import { useState } from 'react';
import { Sparkles, Code2, Zap } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

interface HomePageProps {
  onSelectProject: (id: number) => void;
}

export default function HomePage({ onSelectProject }: HomePageProps) {
  const [filter, setFilter] = useState<DifficultyLevel | "Tous">("Tous");
  const difficulties: (DifficultyLevel | "Tous")[] = ["Tous", "Débutant", "Intermédiaire", "Avancé"];

  const filteredProjects = filter === "Tous" 
    ? projects 
    : projects.filter(p => p.difficulty === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  React Mastery Hub
                </h1>
                <p className="text-gray-600">30 projets pour maîtriser React de A à Z</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Code2 size={20} />
                <span className="font-medium">{projects.length} projets</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={20} />
                <span className="font-medium">TypeScript + Tailwind</span>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === diff
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid des projets */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project.id)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Aucun projet trouvé pour ce filtre</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>🚀 Créé avec React, TypeScript et Tailwind CSS</p>
          <p className="mt-2 text-sm">Tous les concepts React de débutant à expert</p>
        </div>
      </div>
    </div>
  );
}