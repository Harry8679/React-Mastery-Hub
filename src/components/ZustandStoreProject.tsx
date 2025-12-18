import { useState } from 'react';
import { ChevronLeft, Code2, Plus, Trash2, Check, User, Moon, Sun, RefreshCw } from 'lucide-react';
import { useStore } from '../store/store';
import type { ProjectComponentProps } from '../types';

// ==================== COMPOSANTS ====================
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const reset = useStore((state) => state.reset);

  return (
    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6">
      <h3 className="font-bold text-blue-900 mb-4">🔢 Compteur Global</h3>
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={decrement}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-2xl font-bold"
        >
          -
        </button>
        <div className="text-5xl font-bold text-blue-600 w-24 text-center">
          {count}
        </div>
        <button
          onClick={increment}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-2xl font-bold"
        >
          +
        </button>
      </div>
      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 transition-colors"
      >
        <RefreshCw size={18} />
        Reset
      </button>
    </div>
  );
}

function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6">
      <h3 className="font-bold text-purple-900 mb-4">🎨 Thème</h3>
      <div className="flex items-center justify-between">
        <span className="text-purple-700 font-semibold">
          Mode actuel: {theme === 'light' ? '☀️ Clair' : '🌙 Sombre'}
        </span>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          Changer
        </button>
      </div>
    </div>
  );
}

function UserProfile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (name && email) {
      setUser({
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      });
      setShowForm(false);
      setName('');
      setEmail('');
    }
  };

  if (user) {
    return (
      <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6">
        <h3 className="font-bold text-green-900 mb-4">👤 Utilisateur</h3>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h4 className="font-bold text-gray-800">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6">
      <h3 className="font-bold text-green-900 mb-4">👤 Utilisateur</h3>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <User size={18} />
          Se connecter
        </button>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Valider
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TodoList() {
  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const toggleTask = useStore((state) => state.toggleTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const clearCompleted = useStore((state) => state.clearCompleted);

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask, priority);
      setNewTask('');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4 text-xl">✅ Todo List (Zustand)</h3>

      {/* Add Task */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Nouvelle tâche..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all ${
                priority === p
                  ? priorityColors[p]
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {p === 'low' && '🟢 Basse'}
              {p === 'medium' && '🟡 Moyenne'}
              {p === 'high' && '🔴 Haute'}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-blue-700">Total</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-green-700">Complétées</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 mb-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune tâche. Ajoutez-en une ! 🎯
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                task.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.completed && <Check className="text-white" size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    task.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <span
                className={`shrink-0 px-2 py-1 text-xs rounded ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="text-red-500" size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Clear Completed */}
      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
        >
          Supprimer les tâches complétées ({completedCount})
        </button>
      )}
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function ZustandStoreProject({ onBack }: ProjectComponentProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Zustand Store</h1>
            <p className="text-gray-600 mb-4">
              Gestion d'état globale simple et performante
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Zustand", "Global State", "Middleware"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Counter />
            <ThemeToggle />
            <UserProfile />
          </div>

          {/* Todo List */}
          <TodoList />

          {/* Explanation */}
          <div className="mt-8 bg-orange-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-orange-500" />
              Concepts Zustand:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>create()</strong>: Créer un store global
              </li>
              <li>
                • <strong>Hook personnalisé</strong>: useStore() pour accéder au state
              </li>
              <li>
                • <strong>Selectors</strong>: Sélectionner uniquement ce qui est nécessaire
              </li>
              <li>
                • <strong>Actions</strong>: Fonctions pour modifier le state
              </li>
              <li>
                • <strong>Middleware devtools</strong>: Redux DevTools support
              </li>
              <li>
                • <strong>Middleware persist</strong>: Persistance localStorage
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const useStore = create()(devtools(persist(...)))
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const count = useStore((state) =&gt; state.count);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const increment = useStore((state) =&gt; state.increment);
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Avantages de Zustand:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Très simple (moins de boilerplate que Redux)</li>
                <li>Performant (re-renders optimisés)</li>
                <li>Pas de Provider nécessaire</li>
                <li>TypeScript first-class support</li>
                <li>Middleware puissants (persist, devtools)</li>
                <li>Peut remplacer Context API pour state global</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Comparaison:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Context API</strong>: Simple mais re-renders non optimisés</li>
                <li><strong>Redux</strong>: Puissant mais beaucoup de boilerplate</li>
                <li><strong>Zustand</strong>: Équilibre parfait - simple ET performant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}