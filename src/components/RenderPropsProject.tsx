import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, Code2, MousePointer, Eye, Server } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== COMPOSANTS AVEC RENDER PROPS ====================

// 1. Mouse Tracker - Suit la position de la souris
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (mouse: MousePosition) => ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{render(position)}</>;
}

// 2. Toggle Component - Gère un état on/off
interface ToggleState {
  isOn: boolean;
  toggle: () => void;
  turnOn: () => void;
  turnOff: () => void;
}

interface ToggleProps {
  children: (state: ToggleState) => ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn(prev => !prev);
  const turnOn = () => setIsOn(true);
  const turnOff = () => setIsOn(false);

  return <>{children({ isOn, toggle, turnOn, turnOff })}</>;
}

// 3. Data Fetcher - Récupère des données
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface DataFetcherState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface DataFetcherProps<T> {
  url: string;
  children: (state: DataFetcherState<T>) => ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, trigger]);

  const refetch = () => setTrigger(prev => prev + 1);

  return <>{children({ data, loading, error, refetch })}</>;
}

// 4. Visibility Tracker - Détecte si un élément est visible
interface VisibilityTrackerProps {
  children: (isVisible: boolean, ref: (node: HTMLElement | null) => void) => ReactNode;
}

function VisibilityTracker({ children }: VisibilityTrackerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element]);

  return <>{children(isVisible, setElement)}</>;
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function RenderPropsProject({ onBack }: ProjectComponentProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 to-pink-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Render Props</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Render Props", "Children as Function", "Composition"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: MOUSE TRACKER */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MousePointer className="text-blue-500" size={28} />
                1. Mouse Tracker
              </h2>

              <div className="bg-white rounded-lg p-6 min-h-75 relative border-2 border-blue-200">
                <MouseTracker
                  render={({ x, y }) => (
                    <>
                      {/* Affichage des coordonnées */}
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        <p className="font-mono text-sm">
                          X: {x}px | Y: {y}px
                        </p>
                      </div>

                      {/* Curseur visuel qui suit la souris */}
                      <div
                        className="absolute w-8 h-8 bg-blue-500 rounded-full opacity-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${x}px`, top: `${y}px` }}
                      />

                      {/* Info */}
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <p className="text-gray-600 text-sm">
                          Bouge ta souris dans cette zone !
                        </p>
                      </div>
                    </>
                  )}
                />
              </div>

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  {'<MouseTracker render={({ x, y }) => <div>X: {x}, Y: {y}</div>} />'}
                </p>
                <p>💡 Le composant MouseTracker fournit les coordonnées via render prop</p>
              </div>
            </div>

            {/* EXEMPLE 2: TOGGLE */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="text-purple-500" size={28} />
                2. Toggle Component
              </h2>

              <div className="space-y-4">
                {/* Toggle 1: Simple switch */}
                <Toggle>
                  {({ isOn, toggle }) => (
                    <div className="bg-white rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-800">Notifications</span>
                        <button
                          onClick={toggle}
                          className={`relative w-14 h-8 rounded-full transition-colors ${
                            isOn ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                              isOn ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Les notifications sont <strong>{isOn ? 'activées' : 'désactivées'}</strong>
                      </p>
                    </div>
                  )}
                </Toggle>

                {/* Toggle 2: Contenu conditionnel */}
                <Toggle>
                  {({ isOn, turnOn, turnOff }) => (
                    <div className="bg-white rounded-lg p-6">
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={turnOn}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Afficher
                        </button>
                        <button
                          onClick={turnOff}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Masquer
                        </button>
                      </div>
                      {isOn && (
                        <div className="bg-purple-50 rounded-lg p-4 animate-fadeIn">
                          <p className="text-purple-800">
                            🎉 Ce contenu est visible grâce au Toggle !
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Toggle>
              </div>

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  {'<Toggle>{({ isOn, toggle }) => <button onClick={toggle}>{isOn}</button>}</Toggle>'}
                </p>
                <p>💡 Toggle fournit l'état et les méthodes via children function</p>
              </div>
            </div>

            {/* EXEMPLE 3: DATA FETCHER */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Server className="text-green-500" size={28} />
                3. Data Fetcher
              </h2>

              <DataFetcher<User> url="https://jsonplaceholder.typicode.com/users/1">
                {({ data, loading, error, refetch }) => (
                  <div className="bg-white rounded-lg p-6">
                    {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-gray-600">Chargement...</p>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        ❌ Erreur: {error}
                      </div>
                    )}

                    {data && !loading && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded p-3">
                            <div className="text-xs text-gray-600">Nom</div>
                            <div className="font-bold">{data.name}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="text-xs text-gray-600">Email</div>
                            <div className="font-bold">{data.email}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="text-xs text-gray-600">Téléphone</div>
                            <div className="font-bold">{data.phone}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="text-xs text-gray-600">ID</div>
                            <div className="font-bold">#{data.id}</div>
                          </div>
                        </div>
                        <button
                          onClick={refetch}
                          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                          🔄 Recharger
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </DataFetcher>

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  {'<DataFetcher url="...">{({ data, loading, error }) => ...}</DataFetcher>'}
                </p>
                <p>💡 Pattern très utile pour la gestion de données asynchrones</p>
              </div>
            </div>

            {/* EXEMPLE 4: VISIBILITY TRACKER */}
            <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="text-orange-500" size={28} />
                4. Visibility Tracker
              </h2>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <p className="text-gray-700 text-sm">
                  Scrolle vers le bas pour voir l'élément apparaître...
                </p>

                <div className="h-75 overflow-y-auto bg-gray-50 rounded-lg p-4">
                  <div className="h-100 flex items-end justify-center">
                    <VisibilityTracker>
                      {(isVisible, ref) => (
                        <div
                          ref={ref}
                          className={`transition-all duration-500 ${
                            isVisible
                              ? 'opacity-100 transform translate-y-0'
                              : 'opacity-0 transform translate-y-10'
                          }`}
                        >
                          <div className={`rounded-xl p-6 text-center ${
                            isVisible ? 'bg-linear-to-r from-orange-500 to-yellow-500' : 'bg-gray-300'
                          }`}>
                            <div className="text-white text-2xl mb-2">
                              {isVisible ? '👀 Je suis visible !' : '😴 Caché'}
                            </div>
                            <div className="text-white text-sm">
                              {isVisible ? 'Détecté par IntersectionObserver' : 'Scrolle pour me voir'}
                            </div>
                          </div>
                        </div>
                      )}
                    </VisibilityTracker>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-orange-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  {'<VisibilityTracker>{(isVisible, ref) => <div ref={ref}>...</div>}</VisibilityTracker>'}
                </p>
                <p>💡 Utilise IntersectionObserver pour détecter la visibilité</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-rose-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-rose-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Render Props</strong>: Fonction passée comme prop qui retourne du JSX
              </li>
              <li>
                • <strong>Children as Function</strong>: Utiliser children comme fonction
              </li>
              <li>
                • <strong>Inversion of Control</strong>: Le parent contrôle le rendu
              </li>
              <li>
                • <strong>Composition</strong>: Combiner la logique et le rendu séparément
              </li>
              <li>
                • <strong>Separation of Concerns</strong>: Logique vs Présentation
              </li>
              <li>
                • <strong>TypeScript Generics</strong>: DataFetcher&lt;T&gt; pour typage flexible
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono mb-2">
                // Pattern Render Props
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'<Component render={(data) => <div>{data}</div>} />'}
              </p>
              <p className="text-sm text-gray-600 font-mono mt-4 mb-2">
                // Pattern Children as Function
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'<Component>{(data) => <div>{data}</div>}</Component>'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">⚖️ Render Props vs HOC vs Hooks:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Render Props</strong>: Plus flexible, composition explicite</li>
                <li>• <strong>HOC</strong>: Bon pour wrapper, mais peut causer "wrapper hell"</li>
                <li>• <strong>Hooks</strong>: Solution moderne, plus simple (recommandé aujourd'hui)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}