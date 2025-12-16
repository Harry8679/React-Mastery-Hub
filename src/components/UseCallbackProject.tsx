import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { ChevronLeft, Code2, Zap, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

// ==================== COMPOSANTS ENFANTS MÉMOÏSÉS ====================

// Composant enfant qui affiche combien de fois il a été rendu
interface ChildProps {
  name: string;
  onClick: () => void;
}

const ChildComponent = memo(({ name, onClick }: ChildProps) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  console.log(`🔵 ${name} rendu ${renderCount.current} fois`);

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">Renders: {renderCount.current}</p>
        </div>
        <button
          onClick={onClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Cliquer
        </button>
      </div>
    </div>
  );
});

ChildComponent.displayName = 'ChildComponent';

// ==================== COMPOSANT LISTE MÉMOÏSÉ ====================
interface ListItemProps {
  id: number;
  text: string;
  onRemove: (id: number) => void;
}

const ListItem = memo(({ id, text, onRemove }: ListItemProps) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
      <div className="flex-1">
        <span className="text-gray-800">{text}</span>
        <span className="text-xs text-gray-500 ml-2">(renders: {renderCount.current})</span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-all"
      >
        ✕
      </button>
    </div>
  );
});

ListItem.displayName = 'ListItem';

// ==================== COMPOSANT PRINCIPAL ====================
export default function UseCallbackProject({ onBack }: ProjectComponentProps) {
  // ==================== EXEMPLE 1: CALLBACK SIMPLE ====================
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  const [useCallbackEnabled1, setUseCallbackEnabled1] = useState(true);

  // Sans useCallback - nouvelle fonction à chaque render
  const handleClickWithout = () => {
    console.log('Clicked without useCallback');
  };

  // Avec useCallback - même fonction si dépendances inchangées
  const handleClickWith = useCallback(() => {
    console.log('Clicked with useCallback');
  }, []); // Pas de dépendances

  const handleClick = useCallbackEnabled1 ? handleClickWith : handleClickWithout;

  // ==================== EXEMPLE 2: CALLBACK AVEC DÉPENDANCES ====================
  const [multiplier, setMultiplier] = useState(2);
  const [number, setNumber] = useState(5);
  const [independentCounter, setIndependentCounter] = useState(0);
  const [useCallbackEnabled2, setUseCallbackEnabled2] = useState(true);

  // Sans useCallback
  const calculateWithout = () => {
    console.log('🔴 calculateWithout créée');
    return number * multiplier;
  };

  // Avec useCallback
  const calculateWith = useCallback(() => {
    console.log('🟢 calculateWith créée');
    return number * multiplier;
  }, [number, multiplier]); // Recréée seulement si number ou multiplier change

  const calculate = useCallbackEnabled2 ? calculateWith : calculateWithout;

  // ==================== EXEMPLE 3: LISTE AVEC CALLBACKS ====================
  interface TodoItem {
    id: number;
    text: string;
  }

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Apprendre useCallback' },
    { id: 2, text: 'Optimiser les performances' },
    { id: 3, text: 'Maîtriser React' },
  ]);
  const [todoInput, setTodoInput] = useState('');
  const [useCallbackEnabled3, setUseCallbackEnabled3] = useState(true);
  const [listCounter, setListCounter] = useState(0);

  // Sans useCallback - nouvelle fonction à chaque render
  const handleRemoveWithout = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Avec useCallback
  const handleRemoveWith = useCallback((id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // Pas besoin de 'todos' en dépendance grâce à la forme fonctionnelle

  const handleRemove = useCallbackEnabled3 ? handleRemoveWith : handleRemoveWithout;

  const handleAddTodo = () => {
    if (todoInput.trim()) {
      setTodos([...todos, { id: Date.now(), text: todoInput }]);
      setTodoInput('');
    }
  };

  // ==================== RENDER COUNT ====================
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">useCallback - Callbacks Optimisés</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useCallback", "Reference Equality", "Optimization"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Render Count */}
          <div className="mb-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">
              Renders du composant parent: {renderCount.current}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              👉 Ouvre la console pour voir quand les fonctions sont créées
            </p>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: CALLBACK SIMPLE */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Zap className="text-violet-500" size={28} />
                  1. Callback Simple (Composant Mémoïsé)
                </h2>
                <button
                  onClick={() => setUseCallbackEnabled1(!useCallbackEnabled1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    useCallbackEnabled1
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {useCallbackEnabled1 ? '✅ useCallback ON' : '❌ useCallback OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setCount(c => c + 1)}
                    className="flex-1 px-4 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all"
                  >
                    Compteur Parent: {count}
                  </button>
                  <button
                    onClick={() => setOtherState(s => s + 1)}
                    className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Autre State: {otherState}
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${
                  useCallbackEnabled1 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {useCallbackEnabled1 ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <AlertTriangle className="text-red-500" size={20} />
                    )}
                    <p className="text-sm font-semibold text-gray-700">
                      {useCallbackEnabled1
                        ? 'Avec useCallback: Le composant enfant ne re-render que si nécessaire'
                        : 'Sans useCallback: Le composant enfant re-render à chaque fois'
                      }
                    </p>
                  </div>

                  <ChildComponent
                    name="Composant Enfant"
                    onClick={handleClick}
                  />
                </div>

                <div className="bg-violet-50 rounded p-4 text-sm text-gray-700">
                  <p>
                    💡 Même si <code>ChildComponent</code> est mémoïsé avec <code>memo()</code>,
                    sans <code>useCallback</code>, la fonction <code>onClick</code> est recréée à chaque render,
                    ce qui force le re-render de l'enfant.
                  </p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 2: CALLBACK AVEC DÉPENDANCES */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <RefreshCw className="text-blue-500" size={28} />
                  2. Callback avec Dépendances
                </h2>
                <button
                  onClick={() => setUseCallbackEnabled2(!useCallbackEnabled2)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    useCallbackEnabled2
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {useCallbackEnabled2 ? '✅ useCallback ON' : '❌ useCallback OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nombre (dépendance):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(Number(e.target.value))}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setNumber(n => n + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Multiplicateur (dépendance):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={multiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setMultiplier(m => m + 1)}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Compteur indépendant (pas une dépendance):
                  </label>
                  <button
                    onClick={() => setIndependentCounter(c => c + 1)}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Compteur: {independentCounter}
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${
                  useCallbackEnabled2 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <ChildComponent
                    name="Calculateur"
                    onClick={calculate}
                  />
                  <div className="mt-3 text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      Résultat: {calculate()}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded p-4 text-sm text-gray-700">
                  <p>
                    💡 Avec <code>useCallback</code>, la fonction est recréée uniquement si
                    <code> number</code> ou <code>multiplier</code> change.
                    Changer le compteur indépendant ne recrée pas la fonction.
                  </p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 3: LISTE AVEC CALLBACKS */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  3. Liste avec Callbacks (Forme Fonctionnelle)
                </h2>
                <button
                  onClick={() => setUseCallbackEnabled3(!useCallbackEnabled3)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    useCallbackEnabled3
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {useCallbackEnabled3 ? '✅ useCallback ON' : '❌ useCallback OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="Nouvelle tâche..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddTodo}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    Ajouter
                  </button>
                </div>

                <button
                  onClick={() => setListCounter(c => c + 1)}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Compteur indépendant: {listCounter}
                </button>

                <div className={`space-y-2 p-4 rounded-lg ${
                  useCallbackEnabled3 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {todos.map(todo => (
                    <ListItem
                      key={todo.id}
                      id={todo.id}
                      text={todo.text}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                <div className="bg-green-50 rounded p-4 text-sm text-gray-700">
                  <p className="mb-2">
                    💡 En utilisant la <strong>forme fonctionnelle</strong> de <code>setState</code>,
                    on évite d'avoir <code>todos</code> dans le tableau de dépendances:
                  </p>
                  <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
{`const handleRemove = useCallback((id) => {
  setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
}, []); // Pas besoin de 'todos' !`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-violet-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-violet-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useCallback</strong>: Mémorise une fonction pour éviter de la recréer
              </li>
              <li>
                • <strong>memo()</strong>: Mémoïse un composant (évite re-render si props identiques)
              </li>
              <li>
                • <strong>Reference Equality</strong>: Fonctions comparées par référence, pas par contenu
              </li>
              <li>
                • <strong>Dependencies Array</strong>: Fonction recréée uniquement si dépendances changent
              </li>
              <li>
                • <strong>Forme Fonctionnelle</strong>: <code>setState(prev => ...)</code> évite dépendances
              </li>
              <li>
                • <strong>Performance</strong>: Évite re-renders inutiles de composants enfants
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                {/* const handleClick = useCallback(() => {'{'} ... {'}'}, [dep1, dep2]); */}
                {"const handleClick = useCallback(() => {'{'} ... {'}'}, [dep1, dep2]);"}
              </p>
              <p className="text-xs text-gray-500">
                ⚡ La fonction garde la même référence si dep1 et dep2 ne changent pas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}