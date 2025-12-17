import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, Code2, Search, Loader2, X, TrendingUp, Clock, Zap } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

interface SearchStats {
  totalSearches: number;
  apiCallsSaved: number;
  averageDelay: number;
}

// ==================== CUSTOM HOOKS ====================
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useDebounceWithStats<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDebouncing(true);
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}

// ==================== MOCK DATA ====================
const products: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', price: 1199, description: 'Le dernier iPhone avec puce A17', inStock: true },
  { id: 2, name: 'Samsung Galaxy S24', category: 'Smartphones', price: 999, description: 'Smartphone Android haut de gamme', inStock: true },
  { id: 3, name: 'MacBook Pro M3', category: 'Ordinateurs', price: 2499, description: 'Ordinateur portable puissant', inStock: true },
  { id: 4, name: 'Dell XPS 15', category: 'Ordinateurs', price: 1799, description: 'PC portable Windows premium', inStock: false },
  { id: 5, name: 'iPad Air', category: 'Tablettes', price: 699, description: 'Tablette polyvalente', inStock: true },
  { id: 6, name: 'AirPods Pro', category: 'Audio', price: 249, description: 'Écouteurs sans fil avec ANC', inStock: true },
  { id: 7, name: 'Sony WH-1000XM5', category: 'Audio', price: 399, description: 'Casque avec réduction de bruit', inStock: true },
  { id: 8, name: 'Apple Watch Series 9', category: 'Montres', price: 449, description: 'Montre connectée avancée', inStock: true },
  { id: 9, name: 'Kindle Paperwhite', category: 'Liseuses', price: 139, description: 'Liseuse e-ink avec éclairage', inStock: true },
  { id: 10, name: 'Nintendo Switch', category: 'Gaming', price: 299, description: 'Console de jeu portable', inStock: false },
  { id: 11, name: 'PS5', category: 'Gaming', price: 499, description: 'Console de salon nouvelle génération', inStock: true },
  { id: 12, name: 'Xbox Series X', category: 'Gaming', price: 499, description: 'Console Microsoft puissante', inStock: true },
  { id: 13, name: 'GoPro Hero 12', category: 'Caméras', price: 399, description: 'Caméra action 4K', inStock: true },
  { id: 14, name: 'DJI Mini 3', category: 'Drones', price: 759, description: 'Drone compact avec caméra', inStock: false },
  { id: 15, name: 'Magic Keyboard', category: 'Accessoires', price: 149, description: 'Clavier sans fil Apple', inStock: true },
];

// ==================== COMPOSANT PRINCIPAL ====================
export default function DebounceSearchProject({ onBack }: ProjectComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDelay, setSearchDelay] = useState(500);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<SearchStats>({
    totalSearches: 0,
    apiCallsSaved: 0,
    averageDelay: 0
  });

  // Debounce hooks
  const debouncedSearch = useDebounce(searchTerm, searchDelay);
  const { isDebouncing } = useDebounceWithStats(searchTerm, searchDelay);

  // Track API calls
  const searchCountRef = useRef(0);
  const apiCallCountRef = useRef(0);

  // Simulate API search
  const performSearch = async (query: string): Promise<Product[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Effect for debounced search
  useEffect(() => {
    const search = async () => {
      if (debouncedSearch.trim()) {
        setIsSearching(true);
        apiCallCountRef.current += 1;

        const searchResults = await performSearch(debouncedSearch);
        setResults(searchResults);
        setIsSearching(false);

        // Update stats
        setStats({
          totalSearches: searchCountRef.current,
          apiCallsSaved: searchCountRef.current - apiCallCountRef.current,
          averageDelay: searchDelay
        });
      } else {
        setResults([]);
      }
    };

    search();
  }, [debouncedSearch, searchDelay]);

  // Track every keystroke
  useEffect(() => {
    if (searchTerm) {
      searchCountRef.current += 1;
      setStats(prev => ({
        ...prev,
        totalSearches: searchCountRef.current,
        apiCallsSaved: searchCountRef.current - apiCallCountRef.current
      }));
    }
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const popularSearches = useMemo(() => ['iPhone', 'MacBook', 'Gaming', 'Audio'], []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Debounce Search</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Debounce", "useEffect", "Performance"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                {isDebouncing && (
                  <Clock className="text-orange-500 animate-pulse" size={20} />
                )}
                {isSearching && (
                  <Loader2 className="text-blue-500 animate-spin" size={20} />
                )}
                {searchTerm && (
                  <button
                    onClick={handleClear}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="text-gray-400" size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Delay Selector */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">
                Délai de debounce:
              </label>
              <div className="flex gap-2">
                {[0, 300, 500, 1000].map((delay) => (
                  <button
                    key={delay}
                    onClick={() => setSearchDelay(delay)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchDelay === delay
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {delay}ms
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-blue-600" size={24} />
                <h3 className="font-bold text-blue-900">Frappes totales</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalSearches}</div>
              <p className="text-sm text-blue-700 mt-1">Nombre de touches tapées</p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-green-600" size={24} />
                <h3 className="font-bold text-green-900">Appels API évités</h3>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.apiCallsSaved}</div>
              <p className="text-sm text-green-700 mt-1">Grâce au debounce</p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-purple-600" size={24} />
                <h3 className="font-bold text-purple-900">Délai actuel</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600">{searchDelay}ms</div>
              <p className="text-sm text-purple-700 mt-1">Temps d'attente</p>
            </div>
          </div>

          {/* Popular Searches */}
          {!searchTerm && (
            <div className="mb-6 bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">🔥 Recherches populaires</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="min-h-100">
            {searchTerm && results.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun résultat</h3>
                <p className="text-gray-600">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">
                    {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                  </h3>
                  <span className="text-sm text-gray-600">
                    Recherche: "{debouncedSearch}"
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg mb-1">
                            {highlightText(product.name, searchTerm)}
                          </h4>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {highlightText(product.category, searchTerm)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800">
                            {product.price}€
                          </div>
                          <span
                            className={`text-xs ${
                              product.inStock
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {product.inStock ? '✓ En stock' : '✗ Rupture'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {highlightText(product.description, searchTerm)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Recherchez un produit
                </h3>
                <p className="text-gray-600">
                  Tapez dans la barre de recherche ci-dessus
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useDebounce Hook</strong>: Retarde la mise à jour de la valeur
              </li>
              <li>
                • <strong>setTimeout/clearTimeout</strong>: Gestion du délai
              </li>
              <li>
                • <strong>useEffect Cleanup</strong>: Annule le timeout précédent
              </li>
              <li>
                • <strong>Performance</strong>: Réduit drastiquement les appels API
              </li>
              <li>
                • <strong>Visual Feedback</strong>: Indicateurs de debouncing et searching
              </li>
              <li>
                • <strong>Highlight</strong>: Mise en évidence des termes recherchés
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                function useDebounce(value, delay) {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                const timeout = setTimeout(() =&gt; setValue(value), delay);
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                return () =&gt; clearTimeout(timeout); // Cleanup
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Pourquoi debouncer ?</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Réduit la charge serveur (moins d'appels API)</li>
                <li>Améliore les performances (moins de calculs)</li>
                <li>Meilleure UX (évite le flickering des résultats)</li>
                <li>Économise de l'argent (APIs payantes)</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Délais recommandés:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>300ms</strong>: Recherche très rapide (autocomplete)</li>
                <li><strong>500ms</strong>: Recherche standard (équilibre parfait)</li>
                <li><strong>1000ms</strong>: Recherche lourde (calculs complexes)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}