import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronLeft, Code2, Sun, Moon } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

// Définir le type du contexte
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Créer le contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Provider du thème
interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Composant Card qui consomme le contexte
function ThemedCard({ title, content }: { title: string; content: string }) {
  const { theme } = useTheme();

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-all ${
        theme === 'light'
          ? 'bg-white text-gray-800'
          : 'bg-gray-800 text-white'
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
        {content}
      </p>
    </div>
  );
}

// Composant de contrôle du thème
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
        theme === 'light'
          ? 'bg-gray-800 text-white hover:bg-gray-900'
          : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
      }`}
    >
      {theme === 'light' ? (
        <>
          <Moon size={20} />
          Passer en mode sombre
        </>
      ) : (
        <>
          <Sun size={20} />
          Passer en mode clair
        </>
      )}
    </button>
  );
}

// Composant principal avec le contenu
function ThemeContent({ onBack }: ProjectComponentProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-8 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-indigo-50 to-purple-50'
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
      }`}
    >
      <button
        onClick={onBack}
        className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all ${
          theme === 'light'
            ? 'bg-white text-gray-800'
            : 'bg-gray-700 text-white'
        }`}
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-2xl shadow-2xl p-8 transition-colors ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}
        >
          <div className="text-center mb-8">
            <h1
              className={`text-4xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
            >
              useContext - Thème Global
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useContext", "Context API", "Provider/Consumer"].map((concept) => (
                <span
                  key={concept}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'light'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-indigo-900 text-indigo-300'
                  }`}
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mb-8">
            <ThemeToggle />
          </div>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ThemedCard
              title="Thème dynamique"
              content="Ces cartes changent automatiquement de style grâce au Context API, sans passer de props !"
            />
            <ThemedCard
              title="Context partagé"
              content="Tous les composants enfants peuvent accéder au thème sans prop drilling."
            />
            <ThemedCard
              title="Hook personnalisé"
              content="useTheme() simplifie l'accès au contexte dans tous les composants."
            />
            <ThemedCard
              title="État global"
              content="Le thème est géré globalement et synchronisé dans toute l'application."
            />
          </div>

          {/* Status */}
          <div
            className={`rounded-lg p-6 text-center ${
              theme === 'light'
                ? 'bg-indigo-50 text-indigo-800'
                : 'bg-indigo-900 text-indigo-200'
            }`}
          >
            <p className="text-lg font-semibold">
              Thème actuel: <span className="uppercase">{theme}</span>
            </p>
          </div>

          <div
            className={`mt-8 rounded-lg p-6 ${
              theme === 'light'
                ? 'bg-indigo-50'
                : 'bg-gray-700'
            }`}
          >
            <h3
              className={`font-bold mb-2 flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
            >
              <Code2 size={20} className={theme === 'light' ? 'text-indigo-500' : 'text-indigo-400'} />
              Concepts React utilisés:
            </h3>
            <ul
              className={`space-y-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              <li>• <strong>createContext</strong>: Création du contexte de thème</li>
              <li>• <strong>useContext</strong>: Consommation du contexte dans les composants</li>
              <li>• <strong>Provider Pattern</strong>: ThemeProvider enveloppe l'application</li>
              <li>• <strong>Custom Hook</strong>: useTheme() pour simplifier l'accès</li>
              <li>• <strong>Éviter Prop Drilling</strong>: Partage d'état sans passer de props</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant exporté avec le Provider
export default function ThemeContextProject({ onBack }: ProjectComponentProps) {
  return (
    <ThemeProvider>
      <ThemeContent onBack={onBack} />
    </ThemeProvider>
  );
}