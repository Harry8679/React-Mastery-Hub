import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ChevronLeft, Code2, Sun, Moon, Monitor, Palette, Zap, Shield } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

// ==================== TYPES ====================
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

// ==================== CONTEXT ====================
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ==================== CUSTOM HOOK ====================
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ==================== THEME PROVIDER ====================
interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

function ThemeProvider({ children, storageKey = 'app-theme' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return (stored as Theme) || 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateEffectiveTheme = () => {
      if (theme === 'system') {
        setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    const listener = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Update document class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ==================== THEME TOGGLE BUTTON ====================
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' },
  ];

  return (
    <div className="flex gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            theme === value
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
          title={label}
        >
          <Icon size={18} />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ==================== DEMO CARD ====================
interface DemoCardProps {
  title: string;
  description: string;
  icon: typeof Palette;
  gradient: string;
}

function DemoCard({ title, description, icon: Icon, gradient }: DemoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function DarkModeProject({ onBack }: ProjectComponentProps) {
  return (
    <ThemeProvider storageKey="dark-mode-demo">
      <DarkModeContent onBack={onBack} />
    </ThemeProvider>
  );
}

function DarkModeContent({ onBack }: ProjectComponentProps) {
  const { effectiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {effectiveTheme === 'dark' ? (
                <Moon className="text-blue-500" size={48} />
              ) : (
                <Sun className="text-yellow-500" size={48} />
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Dark Mode Toggle
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thème actuel : <span className="font-bold">{effectiveTheme === 'dark' ? '🌙 Sombre' : '☀️ Clair'}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Context API", "localStorage", "System Detection"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center mb-8">
            <ThemeToggleButton />
          </div>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <DemoCard
              title="Personnalisation"
              description="Choisissez le thème qui vous convient le mieux"
              icon={Palette}
              gradient="from-purple-500 to-pink-500"
            />
            <DemoCard
              title="Performance"
              description="Changement instantané sans rechargement"
              icon={Zap}
              gradient="from-yellow-500 to-orange-500"
            />
            <DemoCard
              title="Persistance"
              description="Votre choix est sauvegardé localement"
              icon={Shield}
              gradient="from-green-500 to-teal-500"
            />
          </div>

          {/* Feature Showcase */}
          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                🎨 Éléments adaptés au thème
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tous les composants s'adaptent automatiquement au thème sélectionné.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                💾 Sauvegarde automatique
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Votre préférence de thème est enregistrée dans localStorage.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                🖥️ Détection système
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Le mode "Système" suit automatiquement les préférences de votre OS.
              </p>
            </div>
          </div>

          {/* Color Palette Demo */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 transition-colors">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
              🎨 Palette de couleurs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-600"></div>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600"></div>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">Card</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-blue-500 rounded-lg"></div>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-gray-800 dark:bg-gray-200 rounded-lg"></div>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">Text</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-blue-50 dark:bg-gray-700 rounded-lg p-6 transition-colors">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500 dark:text-blue-400" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                • <strong>Context API</strong>: Partage du thème dans toute l'app
              </li>
              <li>
                • <strong>localStorage</strong>: Persistance du choix utilisateur
              </li>
              <li>
                • <strong>matchMedia</strong>: Détection du thème système
              </li>
              <li>
                • <strong>useEffect</strong>: Mise à jour de la classe CSS du document
              </li>
              <li>
                • <strong>Custom Hook</strong>: useTheme pour accéder au contexte
              </li>
              <li>
                • <strong>Tailwind dark:</strong>: Classes CSS conditionnelles
              </li>
            </ul>

            <div className="mt-4 bg-white dark:bg-gray-800 rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                document.documentElement.classList.add(theme);
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {'<div className="bg-white dark:bg-gray-800" />'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-bold mb-2">💡 Configuration Tailwind:</p>
              <p className="font-mono text-xs mb-2">
                // tailwind.config.js
              </p>
              <p className="font-mono text-xs">
                darkMode: 'class' // Utilise la classe .dark
              </p>
            </div>

            <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded p-4 text-sm text-green-800 dark:text-green-200">
              <p className="font-bold mb-2">🎯 Bonnes pratiques:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Transition douce avec <code>transition-colors</code></li>
                <li>Éviter le flash avec mounted state</li>
                <li>Cleanup des event listeners</li>
                <li>Valeurs par défaut cohérentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}