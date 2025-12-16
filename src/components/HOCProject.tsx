import { useState } from 'react';
import { ChevronLeft, Code2, Shield, Loader, FileText, User, Crown, LogOut } from 'lucide-react';
import type { ProjectComponentProps } from '../types';
import { withLogger } from './hoc/withLogger';
import { withLoading } from './hoc/withLoading';
import { withAuth } from './hoc/withAuth';

// ==================== COMPOSANTS DE BASE ====================

// Page Dashboard simple
function DashboardPage() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Visiteurs</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">$45.2k</div>
          <div className="text-sm text-gray-600">Revenus</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">567</div>
          <div className="text-sm text-gray-600">Commandes</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">89%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
      </div>
      <div className="mt-4 bg-green-50 rounded p-4 text-sm text-green-800">
        ✅ Ce composant est accessible car vous êtes authentifié !
      </div>
    </div>
  );
}

// Page Admin
function AdminPage() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Crown className="text-yellow-500" size={28} />
        Admin Panel
      </h2>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-800 mb-2">⚠️ Zone Sensible</h3>
          <p className="text-sm text-red-700">
            Cette page nécessite des privilèges administrateur.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Gérer les utilisateurs
          </button>
          <button className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            Configuration système
          </button>
          <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Logs système
          </button>
        </div>
      </div>
      <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-yellow-800">
        👑 Ce composant nécessite le rôle <strong>admin</strong> !
      </div>
    </div>
  );
}

// Page Profile avec données
interface ProfilePageProps {
  username: string;
  email: string;
}

function ProfilePage({ username, email }: ProfilePageProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Mon Profil</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm text-gray-600">Nom d'utilisateur</label>
          <p className="font-bold text-gray-800">{username}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="text-sm text-gray-600">Email</label>
          <p className="font-bold text-gray-800">{email}</p>
        </div>
        <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Modifier le profil
        </button>
      </div>
      <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-blue-800">
        💡 Ce composant reçoit des props et est protégé par HOC !
      </div>
    </div>
  );
}

// ==================== COMPOSANTS AVEC HOC ====================

// Dashboard protégé par authentification
const AuthenticatedDashboard = withAuth(DashboardPage);

// Admin protégé par authentification + rôle admin
const AuthenticatedAdminPage = withAuth(AdminPage, 'admin');

// Profile avec loading
const ProfileWithLoading = withLoading(ProfilePage);

// Profile avec loading + auth
const AuthenticatedProfileWithLoading = withAuth(ProfileWithLoading);

// Profile avec logger (pour debug)
const ProfileWithLogger = withLogger(ProfilePage, 'ProfilePage');

// Profile avec auth + logger
const AuthenticatedProfileWithLogger = withAuth(ProfileWithLogger);

// ==================== COMPOSANT PRINCIPAL ====================
export default function HOCProject({ onBack }: ProjectComponentProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'guest'>('guest');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'none' | 'dashboard' | 'admin' | 'profile' | 'logger'>('none');

  const handleLogin = (role: 'user' | 'admin') => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('guest');
    setActiveDemo('none');
  };

  const handleLoadingDemo = () => {
    setActiveDemo('profile');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">HOC - Higher Order Components</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["HOC", "withAuth", "Composition"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Auth Status */}
          <div className="mb-8 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Connecté</h3>
                      <p className="text-sm text-gray-600">
                        Rôle: <span className="font-semibold text-indigo-600">{userRole}</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-400 w-12 h-12 rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Non connecté</h3>
                      <p className="text-sm text-gray-600">Rôle: guest</p>
                    </div>
                  </>
                )}
              </div>
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLogin('user')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Connexion User
                  </button>
                  <button
                    onClick={() => handleLogin('admin')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Connexion Admin
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Demos */}
          <div className="space-y-6">
            {/* DEMO 1: withAuth */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="text-blue-500" size={28} />
                1. HOC withAuth - Protection par authentification
              </h2>
              
              <button
                onClick={() => setActiveDemo('dashboard')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold mb-4"
              >
                Accéder au Dashboard (Auth requise)
              </button>

              {activeDemo === 'dashboard' && (
                <AuthenticatedDashboard
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                />
              )}

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  const AuthDashboard = withAuth(Dashboard);
                </p>
                <p>💡 Le composant vérifie automatiquement l'authentification</p>
              </div>
            </div>

            {/* DEMO 2: withAuth + Role */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Crown className="text-purple-500" size={28} />
                2. HOC withAuth + Rôle - Protection avancée
              </h2>

              <button
                onClick={() => setActiveDemo('admin')}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold mb-4"
              >
                Accéder à l'Admin Panel (Role admin requis)
              </button>

              {activeDemo === 'admin' && (
                <AuthenticatedAdminPage
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                />
              )}

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  const AuthAdmin = withAuth(AdminPage, 'admin');
                </p>
                <p>💡 Vérifie l'auth ET le rôle spécifique</p>
              </div>
            </div>

            {/* DEMO 3: Composition - withAuth + withLoading */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Loader className="text-green-500" size={28} />
                3. Composition - withAuth + withLoading
              </h2>

              <button
                onClick={handleLoadingDemo}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold mb-4"
              >
                Charger le Profil (Auth + Loading)
              </button>

              {activeDemo === 'profile' && (
                <AuthenticatedProfileWithLoading
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  isLoading={isLoading}
                  username="John Doe"
                  email="john@example.com"
                />
              )}

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  const ProfileWithLoading = withLoading(Profile);
                </p>
                <p className="font-mono text-xs mb-2">
                  const AuthProfile = withAuth(ProfileWithLoading);
                </p>
                <p>💡 Les HOC peuvent être combinés pour ajouter plusieurs comportements</p>
              </div>
            </div>

            {/* DEMO 4: withLogger */}
            <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-orange-500" size={28} />
                4. HOC withLogger - Debugging
              </h2>

              <button
                onClick={() => setActiveDemo('logger')}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold mb-4"
              >
                Profil avec Logger (voir console)
              </button>

              {activeDemo === 'logger' && (
                <AuthenticatedProfileWithLogger
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  username="Jane Smith"
                  email="jane@example.com"
                />
              )}

              <div className="mt-4 bg-orange-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  const ProfileLogged = withLogger(Profile, 'ProfilePage');
                </p>
                <p>💡 Ouvre la console pour voir les logs mount/unmount/update</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-indigo-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Higher Order Component (HOC)</strong>: Fonction qui prend un composant et retourne un nouveau composant
              </li>
              <li>
                • <strong>Composition</strong>: Combiner plusieurs HOC pour ajouter plusieurs comportements
              </li>
              <li>
                • <strong>Props Forwarding</strong>: Transmettre les props au composant wrappé
              </li>
              <li>
                • <strong>Conditional Rendering</strong>: Afficher différents UI selon les conditions
              </li>
              <li>
                • <strong>TypeScript Generics</strong>: Typage flexible pour les HOC
              </li>
              <li>
                • <strong>Cross-Cutting Concerns</strong>: Logique réutilisable (auth, loading, logging)
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                function withAuth(Component) {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                return (props) =&gt; {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-8">
                if (!props.isAuth) return &lt;Login /&gt;;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-8">
                return &lt;Component {'{...props}'} /&gt;;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'};'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">📝 Note:</p>
              <p>Les HOC étaient très populaires avant les Hooks. Aujourd'hui, beaucoup de cas d'usage peuvent être gérés avec des Custom Hooks. Cependant, les HOC restent utiles pour :</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Wrapper des composants externes/libraries</li>
                <li>Code splitting avec React.lazy</li>
                <li>Partager de la logique entre class et function components</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}