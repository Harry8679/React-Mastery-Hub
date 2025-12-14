import { useState, useEffect } from 'react';
import { ChevronLeft, Code2 } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

export default function ClockProject({ onBack }: ProjectComponentProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Horloge useEffect</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useEffect", "Cleanup", "setInterval"].map((concept) => (
                <span key={concept} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-12 mb-8">
            <div className="text-center">
              <div className="text-white text-6xl font-bold mb-4 font-mono">
                {formatTime(time)}
              </div>
              <div className="text-white text-xl opacity-90">
                {formatDate(time)}
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Reprendre'}
            </button>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-purple-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>useEffect</strong>: Effet de bord pour le setInterval</li>
              <li>• <strong>Cleanup Function</strong>: clearInterval dans le return</li>
              <li>• <strong>Dependencies Array</strong>: [isRunning] pour ré-exécuter l'effet</li>
              <li>• <strong>Date Object</strong>: Manipulation des dates JavaScript</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}