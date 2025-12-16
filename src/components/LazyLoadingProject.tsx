import { useState, lazy, Suspense } from 'react';
import { ChevronLeft, Code2, Package, Zap, Clock } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== LAZY LOADING ====================
// Les composants sont chargés uniquement quand nécessaire
const HeavyDashboard = lazy(() => import('./HeavyDashboard'));
const HeavyChart = lazy(() => import('./HeavyChart'));
const HeavyTable = lazy(() => import('./HeavyTable'));

// ==================== COMPOSANT DE CHARGEMENT ====================
function CustomLoadingCard({ message }: { message: string }) {
  return (
    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="animate-spin">
          <Package className="text-blue-500" size={32} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Chargement en cours...</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4">
        <div className="flex gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-gray-500">Code splitting en action...</p>
      </div>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function LazyLoadingProject({ onBack }: ProjectComponentProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'dashboard' | 'chart' | 'table'>('none');
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  const handleTabClick = (tab: 'dashboard' | 'chart' | 'table') => {
    if (!loadTimes[tab]) {
      const startTime = performance.now();
      setActiveTab(tab);
      // Simuler l'enregistrement du temps de chargement
      setTimeout(() => {
        const endTime = performance.now();
        setLoadTimes(prev => ({
          ...prev,
          [tab]: endTime - startTime
        }));
      }, 100);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Lazy Loading</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["React.lazy", "Suspense", "Code Splitting"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Package className="text-blue-600" size={24} />
                <h3 className="font-bold text-blue-900">Code Splitting</h3>
              </div>
              <p className="text-sm text-blue-800">
                Les composants ne sont chargés que quand tu cliques sur leur onglet
              </p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-purple-600" size={24} />
                <h3 className="font-bold text-purple-900">Performance</h3>
              </div>
              <p className="text-sm text-purple-800">
                Bundle initial plus léger = Chargement plus rapide
              </p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-green-600" size={24} />
                <h3 className="font-bold text-green-900">On Demand</h3>
              </div>
              <p className="text-sm text-green-800">
                Téléchargement à la demande = Optimisation réseau
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Dashboard
                {loadTimes.dashboard && (
                  <span className="ml-2 text-xs opacity-75">
                    ({loadTimes.dashboard.toFixed(0)}ms)
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('chart')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'chart'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 Graphiques
                {loadTimes.chart && (
                  <span className="ml-2 text-xs opacity-75">
                    ({loadTimes.chart.toFixed(0)}ms)
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('table')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'table'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Table
                {loadTimes.table && (
                  <span className="ml-2 text-xs opacity-75">
                    ({loadTimes.table.toFixed(0)}ms)
                  </span>
                )}
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 Comment ça marche :</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Clique sur un onglet pour charger le composant dynamiquement</li>
                <li>Observe le temps de chargement affiché en millisecondes</li>
                <li>Une fois chargé, le composant reste en mémoire (pas de rechargement)</li>
              </ol>
            </div>
          </div>

          {/* Content avec Suspense */}
          <div className="min-h-100">
            {activeTab === 'none' && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Package className="text-gray-400 mx-auto mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Sélectionne un onglet
                  </h3>
                  <p className="text-gray-600">
                    Les composants seront chargés dynamiquement à la demande
                  </p>
                </div>
              </div>
            )}

            <Suspense fallback={<CustomLoadingCard message="Téléchargement du Dashboard..." />}>
              {activeTab === 'dashboard' && <HeavyDashboard />}
            </Suspense>

            <Suspense fallback={<CustomLoadingCard message="Téléchargement des Graphiques..." />}>
              {activeTab === 'chart' && <HeavyChart />}
            </Suspense>

            <Suspense fallback={<CustomLoadingCard message="Téléchargement de la Table..." />}>
              {activeTab === 'table' && <HeavyTable />}
            </Suspense>
          </div>

          {/* Statistiques */}
          {Object.keys(loadTimes).length > 0 && (
            <div className="mt-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-green-600" size={24} />
                Temps de Chargement
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(loadTimes).map(([key, time]) => (
                  <div key={key} className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 capitalize">{key}</div>
                    <div className="text-2xl font-bold text-green-600">{time.toFixed(0)}ms</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4">
                ⚡ Ces temps incluent le téléchargement et l'exécution du code
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>React.lazy()</strong>: Import dynamique de composants
              </li>
              <li>
                • <strong>Suspense</strong>: Wrapper pour gérer l'état de chargement
              </li>
              <li>
                • <strong>Code Splitting</strong>: Division du bundle en plusieurs chunks
              </li>
              <li>
                • <strong>Lazy Loading</strong>: Chargement à la demande (on-demand)
              </li>
              <li>
                • <strong>Fallback UI</strong>: Interface affichée pendant le chargement
              </li>
              <li>
                • <strong>Dynamic Import</strong>: import() au lieu de import statique
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const Component = lazy(() =&gt; import('./Component'));
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'<Suspense fallback={<Loading />}>'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'<Component />'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'</Suspense>'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 rounded p-4">
              <p className="text-sm text-yellow-800 font-semibold mb-2">
                ⚠️ Important:
              </p>
              <ul className="text-xs text-yellow-800 space-y-1 ml-4">
                <li>• Les imports lazy doivent être au top-level (pas dans des conditions)</li>
                <li>• Suspense ne capture que le chargement lazy, pas les erreurs de data fetching</li>
                <li>• Pour les erreurs, utiliser Error Boundary en combinaison avec Suspense</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}