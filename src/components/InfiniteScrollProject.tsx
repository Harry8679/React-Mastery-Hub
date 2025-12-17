import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Code2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

// ==================== FAKE API ====================
const generatePosts = (page: number, limit: number): Post[] => {
  const posts: Post[] = [];
  const start = (page - 1) * limit;
  
  for (let i = 0; i < limit; i++) {
    const id = start + i + 1;
    posts.push({
      id,
      title: `Post numéro ${id}`,
      body: `Ceci est le contenu du post ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      userId: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return posts;
};

const generateUsers = (page: number, limit: number): User[] => {
  const users: User[] = [];
  const start = (page - 1) * limit;
  
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson'];
  const companies = ['TechCorp', 'StartupInc', 'DevSolutions', 'CodeMasters', 'InnovateLabs'];
  
  for (let i = 0; i < limit; i++) {
    const id = start + i + 1;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    users.push({
      id,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      company: {
        name: companies[Math.floor(Math.random() * companies.length)]
      }
    });
  }
  
  return users;
};

// ==================== CUSTOM HOOK ====================
function useInfiniteScroll<T>(
  fetchFunction: (page: number) => Promise<T[]>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemsPerPage: number
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchFunction(page);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFunction]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, loading, hasMore, error, loadMore, reset };
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function InfiniteScrollProject({ onBack }: ProjectComponentProps) {
  const [activeDemo, setActiveDemo] = useState<'posts' | 'users'>('posts');
  
  // Observer ref
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch functions
  const fetchPosts = useCallback(async (page: number): Promise<Post[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    const posts = generatePosts(page, 10);
    
    // Simuler une fin de données après 50 posts
    if (page > 5) return [];
    
    return posts;
  }, []);

  const fetchUsers = useCallback(async (page: number): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = generateUsers(page, 8);
    
    // Simuler une fin de données après 40 users
    if (page > 5) return [];
    
    return users;
  }, []);

  // Hooks
  const postsScroll = useInfiniteScroll(fetchPosts, 10);
  const usersScroll = useInfiniteScroll(fetchUsers, 8);

  const currentScroll = activeDemo === 'posts' ? postsScroll : usersScroll;

  // Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !currentScroll.loading && currentScroll.hasMore) {
          currentScroll.loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [currentScroll]);

  // Load initial data
  useEffect(() => {
    if (currentScroll.items.length === 0 && !currentScroll.loading) {
      currentScroll.loadMore();
    }
  }, [activeDemo, currentScroll]);

  const handleDemoChange = (demo: 'posts' | 'users') => {
    setActiveDemo(demo);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Infinite Scroll</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Infinite Scroll", "IntersectionObserver", "Lazy Loading"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleDemoChange('posts')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeDemo === 'posts'
                  ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Posts ({postsScroll.items.length})
            </button>
            <button
              onClick={() => handleDemoChange('users')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeDemo === 'users'
                  ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👥 Users ({usersScroll.items.length})
            </button>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={currentScroll.reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RefreshCw size={16} />
              Réinitialiser
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="max-h-150 overflow-y-auto space-y-4 pr-2">
              {activeDemo === 'posts' ? (
                <>
                  {/* Posts List */}
                  {postsScroll.items.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                          {post.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{post.body}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <span>User #{post.userId}</span>
                            <span>•</span>
                            <span>Post #{post.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Users List */}
                  {usersScroll.items.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {user.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {user.company.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Loading Indicator */}
              {currentScroll.loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={32} />
                    <p className="text-gray-600 text-sm">Chargement...</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {currentScroll.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <div>
                    <p className="font-semibold text-red-800">Erreur</p>
                    <p className="text-sm text-red-700">{currentScroll.error}</p>
                  </div>
                </div>
              )}

              {/* End of List */}
              {!currentScroll.hasMore && currentScroll.items.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-block px-6 py-3 bg-linear-to-r from-purple-100 to-pink-100 rounded-full">
                    <p className="text-gray-700 font-semibold">
                      🎉 Vous avez tout vu !
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {currentScroll.items.length} éléments chargés
                    </p>
                  </div>
                </div>
              )}

              {/* Observer Target */}
              <div ref={observerTarget} className="h-4" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentScroll.items.length}
              </div>
              <div className="text-sm text-gray-600">Éléments chargés</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentScroll.hasMore ? '∞' : '✓'}
              </div>
              <div className="text-sm text-gray-600">
                {currentScroll.hasMore ? 'Plus à charger' : 'Terminé'}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentScroll.loading ? '⏳' : '✓'}
              </div>
              <div className="text-sm text-gray-600">
                {currentScroll.loading ? 'Chargement' : 'Prêt'}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-purple-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>IntersectionObserver</strong>: Détecte quand l'élément sentinel est visible
              </li>
              <li>
                • <strong>useCallback</strong>: Mémorise les fonctions de fetch
              </li>
              <li>
                • <strong>Custom Hook</strong>: useInfiniteScroll encapsule toute la logique
              </li>
              <li>
                • <strong>Lazy Loading</strong>: Charge les données à la demande
              </li>
              <li>
                • <strong>State Management</strong>: Gestion du loading, hasMore, error
              </li>
              <li>
                • <strong>Cleanup</strong>: Déconnexion de l'observer dans useEffect
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const observer = new IntersectionObserver((entries) =&gt; {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                if (entries[0].isIntersecting) loadMore();
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'});'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Optimisations:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Utiliser <code>threshold: 0.1</code> pour charger avant la fin</li>
                <li>Mémoriser les fonctions avec useCallback</li>
                <li>Cleanup de l'observer pour éviter les fuites mémoire</li>
                <li>Flag <code>hasMore</code> pour arrêter les appels inutiles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}