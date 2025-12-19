import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronLeft, Code2, Lock, User, Mail, Eye, EyeOff, LogIn, UserPlus, LogOut, Shield, CheckCircle, XCircle } from 'lucide-react';
import type { ProjectComponentProps } from '../../types';

// ==================== TYPES ====================
interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

type AuthView = 'login' | 'register' | 'dashboard';

// ==================== MOCK DATABASE ====================
const MOCK_USERS: Array<{ email: string; password: string; name: string; role: 'user' | 'admin' }> = [
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'user@example.com', password: 'user123', name: 'John Doe', role: 'user' },
];

// ==================== CONTEXT ====================
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ==================== PROVIDER ====================
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: UserData = {
        id: Math.random().toString(36).substring(7),
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      return { success: true };
    }

    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user exists
    const userExists = MOCK_USERS.some((u) => u.email === email);
    if (userExists) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    // Validation
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    // Add to mock database
    MOCK_USERS.push({ email, password, name, role: 'user' });

    // Auto-login
    const userData: UserData = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(userData);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==================== COMPOSANTS ====================

// Login Form
interface LoginFormProps {
  onSwitchToRegister: () => void;
}

function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Erreur de connexion');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Lock size={32} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
        <p className="text-gray-600">Accédez à votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
            <XCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Se connecter
            </>
          )}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Comptes de démonstration :</p>
        <div className="space-y-2 text-xs text-gray-600">
          <div>
            <strong>Admin:</strong> admin@example.com / admin123
          </div>
          <div>
            <strong>User:</strong> user@example.com / user123
          </div>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 font-semibold hover:underline"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}

// Register Form
interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.error || 'Erreur lors de l\'inscription');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <UserPlus size={32} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Inscription</h2>
        <p className="text-gray-600">Créez votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
            <XCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Inscription...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              S'inscrire
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Déjà un compte ?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-600 font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 text-white text-3xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue, {user.name} !</h2>
        <p className="text-gray-600">Vous êtes connecté avec succès</p>
      </div>

      {/* Success Message */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle size={24} className="text-green-600" />
        <div>
          <p className="font-semibold text-green-800">Authentification réussie !</p>
          <p className="text-sm text-green-700">Vous avez accès à votre espace personnel.</p>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User size={20} />
            Informations du compte
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom :</span>
              <span className="font-semibold text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email :</span>
              <span className="font-semibold text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rôle :</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID :</span>
              <span className="font-mono text-xs text-gray-800">{user.id}</span>
            </div>
          </div>
        </div>

        {/* Admin Panel */}
        {user.role === 'admin' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Shield size={20} />
              Panneau d'administration
            </h3>
            <p className="text-sm text-purple-700">
              Vous avez accès aux fonctionnalités d'administration.
            </p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Se déconnecter
      </button>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function AuthenticationFlowProject({ onBack }: ProjectComponentProps) {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <AuthProvider>
      <AuthContent onBack={onBack} currentView={currentView} setCurrentView={setCurrentView} />
    </AuthProvider>
  );
}

interface AuthContentProps {
  onBack: () => void;
  currentView: AuthView;
  setCurrentView: (view: AuthView) => void;
}

function AuthContent({ onBack, currentView, setCurrentView }: AuthContentProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔐 Authentication Flow</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Auth", "Login/Register", "Protected Routes"].map((concept) => (
              <span
                key={concept}
                className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {isAuthenticated ? (
            <Dashboard />
          ) : (
            <>
              {currentView === 'login' && (
                <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
              )}
              {currentView === 'register' && (
                <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
              )}
            </>
          )}
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Code2 size={20} className="text-blue-500" />
            Concepts Authentication Flow :
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>Context API</strong>: État global d'authentification
            </li>
            <li>
              • <strong>Login/Register Forms</strong>: Formulaires avec validation
            </li>
            <li>
              • <strong>Password Toggle</strong>: Afficher/masquer le mot de passe
            </li>
            <li>
              • <strong>Protected Routes</strong>: Accès conditionnel au dashboard
            </li>
            <li>
              • <strong>Role-Based Access</strong>: Différenciation admin/user
            </li>
            <li>
              • <strong>Loading States</strong>: Feedback visuel pendant les requêtes
            </li>
          </ul>

          <div className="mt-4 bg-gray-50 rounded p-4 space-y-2">
            <p className="text-sm text-gray-600 font-mono">
              const {'{'} user, login, logout {'}'} = useAuth();
            </p>
            <p className="text-sm text-gray-600 font-mono">
              await login(email, password);
            </p>
            <p className="text-sm text-gray-600 font-mono">
              {'{'}isAuthenticated ? &lt;Dashboard /&gt; : &lt;Login /&gt;{'}'}
            </p>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
            <p className="font-bold mb-2">💡 Features:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Formulaires Login et Register avec validation</li>
              <li>Gestion des erreurs (email invalide, mot de passe faible)</li>
              <li>Loading states avec spinner</li>
              <li>Toggle password visibility</li>
              <li>Comptes démo pour tester</li>
              <li>Dashboard avec infos utilisateur</li>
              <li>Role-based UI (admin vs user)</li>
            </ul>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
            <p className="font-bold mb-2">🎯 Extensions possibles:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Intégration avec API backend réelle</li>
              <li>JWT tokens avec refresh</li>
              <li>Forgot password / Reset password</li>
              <li>Email verification</li>
              <li>OAuth (Google, GitHub, Facebook)</li>
              <li>2FA (Two-Factor Authentication)</li>
              <li>Session persistence (localStorage)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}