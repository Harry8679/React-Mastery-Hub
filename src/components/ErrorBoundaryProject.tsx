import { useState } from 'react';
import { ChevronLeft, Code2, Bomb, AlertTriangle, CheckCircle, Bug } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import type { ProjectComponentProps } from '../types';

// ==================== COMPOSANTS QUI PEUVENT CRASHER ====================

// Composant qui crash au render
function BuggyCounter({ shouldCrash }: { shouldCrash: boolean }) {
  const [count, setCount] = useState(0);

  if (shouldCrash && count === 5) {
    throw new Error('💥 Le compteur a atteint 5 ! Crash intentionnel.');
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-800 mb-2">{count}</div>
        <p className="text-sm text-gray-600">Le composant crashera à 5</p>
      </div>
      <button
        onClick={() => setCount(c => c + 1)}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
      >
        Incrémenter ({count}/5)
      </button>
    </div>
  );
}

// Composant avec erreur de props
interface UserProfileProps {
  user: {
    name: string;
    email: string;
    age: number;
  } | null;
}

function UserProfile({ user }: UserProfileProps) {
  // Erreur si user est null
  if (!user) {
    throw new Error('❌ User data is null! Cannot render profile.');
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-bold text-gray-800 mb-3">Profil Utilisateur</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Nom:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Âge:</strong> {user.age} ans</p>
      </div>
    </div>
  );
}

// Composant avec erreur async (pas capturée par Error Boundary)
function AsyncError() {
  const [error] = useState<string | null>(null);

  const throwAsyncError = () => {
    setTimeout(() => {
      throw new Error('💣 Erreur asynchrone - NON capturée par Error Boundary');
    }, 100);
  };

  const throwSyncError = () => {
    throw new Error('⚡ Erreur synchrone - CAPTURÉE par Error Boundary');
  };

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="bg-yellow-50 rounded p-4 text-sm text-yellow-800 mb-4">
        <p>⚠️ <strong>Important:</strong> Error Boundary ne capture que les erreurs de render, pas les erreurs async</p>
      </div>
      <button
        onClick={throwSyncError}
        className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
      >
        ⚡ Erreur Sync (capturée)
      </button>
      <button
        onClick={throwAsyncError}
        className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold"
      >
        💣 Erreur Async (non capturée)
      </button>
    </div>
  );
}

// Composant qui fonctionne
function WorkingComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 text-green-600 mb-3">
        <CheckCircle size={24} />
        <h3 className="font-bold">Composant Fonctionnel</h3>
      </div>
      <p className="text-gray-700">Ce composant fonctionne correctement: {count}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
      >
        Incrémenter
      </button>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function ErrorBoundaryProject({ onBack }: ProjectComponentProps) {
  const [crashCounter, setCrashCounter] = useState(true);
  const [userData, setUserData] = useState<{ name: string; email: string; age: number } | null>({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });
  const [errorLog, setErrorLog] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleError = (error: Error, _: React.ErrorInfo) => {
    const logEntry = `[${new Date().toLocaleTimeString()}] ${error.message}`;
    setErrorLog(prev => [logEntry, ...prev].slice(0, 10));
  };

  // Fallback UI personnalisé
  const customFallback = (error: Error, _: React.ErrorInfo, reset: () => void) => (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bomb className="text-red-500" size={32} />
        <h3 className="font-bold text-red-800 text-xl">Oups ! Composant cassé</h3>
      </div>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
      >
        🔄 Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Error Boundary</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Error Boundaries", "componentDidCatch", "Error Handling"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: COMPTEUR QUI CRASH */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bug className="text-blue-500" size={28} />
                1. Composant avec Erreur de Render
              </h2>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={crashCounter}
                    onChange={(e) => setCrashCounter(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">Activer le crash à 5</span>
                </label>
              </div>

              <ErrorBoundary onError={handleError}>
                <BuggyCounter shouldCrash={crashCounter} />
              </ErrorBoundary>

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Essaye d'incrémenter jusqu'à 5 avec le crash activé</p>
                <p className="mt-1">✅ L'Error Boundary capture l'erreur et affiche un fallback UI</p>
              </div>
            </div>

            {/* EXEMPLE 2: ERREUR DE PROPS */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-purple-500" size={28} />
                2. Composant avec Props Invalides
              </h2>

              <div className="mb-4 space-y-2">
                <button
                  onClick={() => setUserData({ name: 'Jane Doe', email: 'jane@example.com', age: 25 })}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  ✅ Props Valides
                </button>
                <button
                  onClick={() => setUserData(null)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  ❌ Props Null (crash)
                </button>
              </div>

              <ErrorBoundary fallback={customFallback} onError={handleError}>
                <UserProfile user={userData} />
              </ErrorBoundary>

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Clique sur "Props Null" pour déclencher une erreur</p>
                <p className="mt-1">🎨 Cet exemple utilise un fallback UI personnalisé</p>
              </div>
            </div>

            {/* EXEMPLE 3: ERREUR ASYNC */}
            <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bomb className="text-orange-500" size={28} />
                3. Erreurs Sync vs Async
              </h2>

              <ErrorBoundary onError={handleError}>
                <AsyncError />
              </ErrorBoundary>

              <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-gray-700">
                <p className="font-bold mb-2">⚠️ Limitations des Error Boundaries:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Erreurs async (setTimeout, promises) → ❌ NON capturées</li>
                  <li>• Event handlers → ❌ NON capturés (utiliser try/catch)</li>
                  <li>• Erreurs dans l'Error Boundary elle-même → ❌ NON capturées</li>
                  <li>• Server-side rendering → ❌ NON géré</li>
                </ul>
                <p className="mt-2 font-bold">✅ Ce qui EST capturé:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Erreurs de render</li>
                  <li>• Erreurs dans lifecycle methods</li>
                  <li>• Erreurs dans constructors des composants enfants</li>
                </ul>
              </div>
            </div>

            {/* EXEMPLE 4: BOUNDARIES MULTIPLES */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Boundaries Multiples (Isolation)
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <ErrorBoundary onError={handleError}>
                  <BuggyCounter shouldCrash={true} />
                </ErrorBoundary>

                <ErrorBoundary onError={handleError}>
                  <WorkingComponent />
                </ErrorBoundary>
              </div>

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Chaque composant est isolé dans son propre Error Boundary</p>
                <p className="mt-1">✅ Si un composant crash, l'autre continue de fonctionner</p>
              </div>
            </div>

            {/* LOG DES ERREURS */}
            <div className="bg-linear-to-r from-gray-50 to-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📋 Log des Erreurs Capturées
              </h2>

              <div className="bg-white rounded-lg p-6">
                {errorLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune erreur capturée pour le moment
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {errorLog.map((log, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-red-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-red-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Error Boundary</strong>: Composant class qui capture les erreurs
              </li>
              <li>
                • <strong>getDerivedStateFromError</strong>: Méthode statique pour mettre à jour l'état
              </li>
              <li>
                • <strong>componentDidCatch</strong>: Lifecycle pour logger les erreurs
              </li>
              <li>
                • <strong>Fallback UI</strong>: Interface de secours en cas d'erreur
              </li>
              <li>
                • <strong>Error Recovery</strong>: Possibilité de réinitialiser l'état
              </li>
              <li>
                • <strong>Granular Boundaries</strong>: Isolation des composants
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-3">
              <p className="text-sm text-gray-600 font-mono">
                {'class ErrorBoundary extends Component {'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'static getDerivedStateFromError(error) { ... }'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'componentDidCatch(error, errorInfo) { ... }'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}