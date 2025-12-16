import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, Code2, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== HELPER FUNCTIONS ====================
// Fonction coûteuse pour simuler un calcul long
const expensiveCalculation = (num: number): number => {
  console.log('🔴 Calcul coûteux exécuté...');
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += num;
  }
  return result;
};

// Fonction pour filtrer et trier (coûteux)
const filterAndSort = (items: string[], filter: string): string[] => {
  console.log('🔴 Filtrage et tri exécutés...');
  return items
    .filter(item => item.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
};

// Fonction pour générer des données aléatoires
const generateItems = (count: number): string[] => {
  const categories = ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python', 'Java'];
  return Array.from({ length: count }, (_, i) => 
    `${categories[Math.floor(Math.random() * categories.length)]} - Item ${i + 1}`
  );
};

export default function UseMemoProject({ onBack }: ProjectComponentProps) {
  // ==================== EXEMPLE 1: CALCUL COÛTEUX ====================
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(5);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  // Sans useMemo (recalculé à chaque render)
  const expensiveResultWithout = useMemoEnabled ? 0 : expensiveCalculation(number);

  // Avec useMemo (recalculé uniquement si 'number' change)
  const expensiveResultWith = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]);

  const expensiveResult = useMemoEnabled ? expensiveResultWith : expensiveResultWithout;

  // ==================== EXEMPLE 2: LISTE FILTRÉE ====================
  const [items] = useState(() => generateItems(1000));
  const [filter, setFilter] = useState('');
  const [independentCounter, setIndependentCounter] = useState(0);
  const [listUseMemo, setListUseMemo] = useState(true);

  // Sans useMemo
  const filteredItemsWithout = listUseMemo ? [] : filterAndSort(items, filter);

  // Avec useMemo
  const filteredItemsWith = useMemo(() => {
    return filterAndSort(items, filter);
  }, [items, filter]);

  const filteredItems = listUseMemo ? filteredItemsWith : filteredItemsWithout;

  // ==================== EXEMPLE 3: OBJET COMPLEXE ====================
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [age, setAge] = useState(25);
  const [objectUseMemo, setObjectUseMemo] = useState(true);

  // Sans useMemo (nouvel objet à chaque render)
  const userWithout = objectUseMemo ? {} : {
    fullName: `${firstName} ${lastName}`,
    age: age,
    isAdult: age >= 18,
    category: age < 18 ? 'minor' : age < 65 ? 'adult' : 'senior'
  };

  // Avec useMemo (même référence si dépendances inchangées)
  const userWith = useMemo(() => ({
    fullName: `${firstName} ${lastName}`,
    age: age,
    isAdult: age >= 18,
    category: age < 18 ? 'minor' : age < 65 ? 'adult' : 'senior'
  }), [firstName, lastName, age]);

  const user = objectUseMemo ? userWith : userWithout;

  // ==================== RENDER TRACKING ====================
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">useMemo - Optimisation</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useMemo", "Performance", "Memoization"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Render Count */}
          <div className="mb-6 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              Renders: {renderCount.current}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Nombre total de re-renders du composant
            </p>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: CALCUL COÛTEUX */}
            <div className="bg-linear-to-r from-cyan-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Zap className="text-cyan-500" size={28} />
                  1. Calcul Coûteux
                </h2>
                <button
                  onClick={() => setUseMemoEnabled(!useMemoEnabled)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    useMemoEnabled
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {useMemoEnabled ? '✅ useMemo ON' : '❌ useMemo OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nombre pour le calcul (change le résultat):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(Number(e.target.value))}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <button
                        onClick={() => setNumber(n => n + 1)}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Compteur indépendant (ne devrait pas recalculer):
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {count}
                      </div>
                      <button
                        onClick={() => setCount(c => c + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-6 ${
                  useMemoEnabled ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {useMemoEnabled ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <AlertTriangle className="text-red-500" size={24} />
                    )}
                    <h3 className="font-bold text-gray-800">
                      {useMemoEnabled ? 'Avec useMemo (optimisé)' : 'Sans useMemo (non-optimisé)'}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    Résultat: {expensiveResult}
                  </div>
                  <p className="text-sm text-gray-600">
                    {useMemoEnabled 
                      ? '✅ Le calcul n\'est exécuté que si "number" change'
                      : '⚠️ Le calcul est exécuté à CHAQUE render (même si "count" change)'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    👉 Ouvre la console pour voir quand le calcul est exécuté
                  </p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 2: LISTE FILTRÉE */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-purple-500" size={28} />
                  2. Filtrage et Tri de Liste
                </h2>
                <button
                  onClick={() => setListUseMemo(!listUseMemo)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    listUseMemo
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {listUseMemo ? '✅ useMemo ON' : '❌ useMemo OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Filtre de recherche (déclenche le tri):
                    </label>
                    <input
                      type="text"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Rechercher... (ex: React)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Compteur indépendant:
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {independentCounter}
                      </div>
                      <button
                        onClick={() => setIndependentCounter(c => c + 1)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  listUseMemo ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Liste totale:</strong> {items.length} items
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Résultats filtrés:</strong> {filteredItems.length} items
                  </p>
                  <p className="text-xs text-gray-500">
                    {listUseMemo
                      ? '✅ Le filtrage/tri n\'est exécuté que si le filtre change'
                      : '⚠️ Le filtrage/tri est exécuté à CHAQUE render'
                    }
                  </p>
                </div>

                <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-4">
                  {filteredItems.slice(0, 20).map((item, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-white rounded mb-2 text-sm text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
                  {filteredItems.length > 20 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      ... et {filteredItems.length - 20} autres
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* EXEMPLE 3: OBJET COMPLEXE */}
            <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  3. Objet Complexe (Référence)
                </h2>
                <button
                  onClick={() => setObjectUseMemo(!objectUseMemo)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    objectUseMemo
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {objectUseMemo ? '✅ useMemo ON' : '❌ useMemo OFF'}
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Prénom:</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Nom:</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Âge:</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  objectUseMemo ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <h3 className="font-bold text-gray-800 mb-3">Objet utilisateur calculé:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom complet:</strong> {user.fullName}</p>
                    <p><strong>Âge:</strong> {user.age} ans</p>
                    <p><strong>Adulte:</strong> {user.isAdult ? 'Oui ✅' : 'Non ❌'}</p>
                    <p><strong>Catégorie:</strong> {user.category}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {objectUseMemo
                      ? '✅ Même référence d\'objet si les dépendances ne changent pas'
                      : '⚠️ Nouvel objet créé à chaque render (peut causer des re-renders inutiles)'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-cyan-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-cyan-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useMemo</strong>: Mémorise le résultat d\'un calcul coûteux
              </li>
              <li>
                • <strong>Dependencies Array</strong>: Recalcule uniquement si les dépendances changent
              </li>
              <li>
                • <strong>Performance Optimization</strong>: Évite les recalculs inutiles
              </li>
              <li>
                • <strong>Reference Equality</strong>: Garde la même référence d\'objet
              </li>
              <li>
                • <strong>Memoization</strong>: Cache les résultats pour réutilisation
              </li>
              <li>
                • <strong>Quand l\'utiliser</strong>: Calculs coûteux, tri/filtrage, objets complexes
              </li>
              <li>
                • <strong>Quand NE PAS l\'utiliser</strong>: Calculs simples (overhead inutile)
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4">
              <p className="text-sm text-gray-600 font-mono mb-2">
                const result = useMemo(() => expensiveCalculation(num), [num]);
              </p>
              <p className="text-xs text-gray-500">
                ⚡ Le calcul n'est exécuté que si 'num' change
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}