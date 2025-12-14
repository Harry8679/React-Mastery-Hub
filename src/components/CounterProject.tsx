import { useState } from 'react';
import { ChevronLeft, Code2 } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

export default function CounterProject({ onBack }: ProjectComponentProps) {
  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(1);

  const steps = [1, 2, 3, 5, 10];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Compteur useState</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useState", "Event Handlers", "State Management"].map((concept) => (
                <span key={concept} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl p-12 mb-8">
            <div className="text-center">
              <div className="text-white text-8xl font-bold mb-4 animate-pulse">
                {count}
              </div>
              <div className="text-white text-xl opacity-90">
                Pas actuel: {step}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setCount(count - step)}
                className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                - {step}
              </button>
              <button
                onClick={() => setCount(0)}
                className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                Reset
              </button>
              <button
                onClick={() => setCount(count + step)}
                className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                + {step}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-gray-700 font-medium mb-2">
                Choisir le pas d'incrémentation:
              </label>
              <div className="flex gap-2">
                {steps.map((value) => (
                  <button
                    key={value}
                    onClick={() => setStep(value)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      step === value
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>useState</strong>: Gestion de l'état local (count et step)</li>
              <li>• <strong>Event Handlers</strong>: onClick pour gérer les interactions</li>
              <li>• <strong>Conditional Styling</strong>: Classes dynamiques selon l'état</li>
              <li>• <strong>Component Composition</strong>: Organisation modulaire du code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}