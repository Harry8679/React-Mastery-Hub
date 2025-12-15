import { useState } from 'react';
import { ChevronLeft, Code2, RefreshCw, Users, BookOpen, Image, AlertCircle } from 'lucide-react';
import type { ProjectComponentProps } from '../types';
import { useFetch } from '../hooks/useFetch';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

type ApiEndpoint = 'users' | 'posts' | 'photos';

// ==================== COMPONENT ====================
export default function CustomHookProject({ onBack }: ProjectComponentProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>('users');
  const [manualUrl, setManualUrl] = useState<string>('');
  const [showManual, setShowManual] = useState<boolean>(false);

  // URLs des APIs
  const apiUrls: Record<ApiEndpoint, string> = {
    users: 'https://jsonplaceholder.typicode.com/users',
    posts: 'https://jsonplaceholder.typicode.com/posts?_limit=10',
    photos: 'https://jsonplaceholder.typicode.com/photos?_limit=12',
  };

  // Utilisation du custom hook useFetch
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useFetch<User[]>(apiUrls.users, { autoFetch: selectedEndpoint === 'users' });

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useFetch<Post[]>(apiUrls.posts, { autoFetch: selectedEndpoint === 'posts' });

  const {
    data: photos,
    loading: photosLoading,
    error: photosError,
    refetch: refetchPhotos,
  } = useFetch<Photo[]>(apiUrls.photos, { autoFetch: selectedEndpoint === 'photos' });

  // Fetch manuel - le hook gère les URLs vides
  const {
    data: manualData,
    loading: manualLoading,
    error: manualError,
    refetch: manualRefetch,
  } = useFetch<never>(manualUrl, { autoFetch: false });

  // Handlers
  const handleEndpointChange = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowManual(false);
  };

  const handleManualFetch = () => {
    const trimmedUrl = manualUrl.trim();
    if (!trimmedUrl) {
      alert('Veuillez entrer une URL valide');
      return;
    }
    
    // Vérification basique de l'URL
    try {
      new URL(trimmedUrl);
      setShowManual(true);
      manualRefetch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      alert('URL invalide. Assurez-vous qu\'elle commence par http:// ou https://');
    }
  };

  const getCurrentData = () => {
    switch (selectedEndpoint) {
      case 'users':
        return { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers };
      case 'posts':
        return { data: posts, loading: postsLoading, error: postsError, refetch: refetchPosts };
      case 'photos':
        return { data: photos, loading: photosLoading, error: photosError, refetch: refetchPhotos };
    }
  };

  const { data, loading, error, refetch } = showManual
    ? { data: manualData, loading: manualLoading, error: manualError, refetch: manualRefetch }
    : getCurrentData();

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-green-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Custom Hook - useFetch</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Custom Hooks", "API Calls", "Loading States"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* API Endpoint Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Choisir une API:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleEndpointChange('users')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedEndpoint === 'users' && !showManual
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <Users className="text-teal-500" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Users</div>
                  <div className="text-sm text-gray-500">10 utilisateurs</div>
                </div>
              </button>

              <button
                onClick={() => handleEndpointChange('posts')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedEndpoint === 'posts' && !showManual
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <BookOpen className="text-green-500" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Posts</div>
                  <div className="text-sm text-gray-500">10 articles</div>
                </div>
              </button>

              <button
                onClick={() => handleEndpointChange('photos')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedEndpoint === 'photos' && !showManual
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <Image className="text-blue-500" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Photos</div>
                  <div className="text-sm text-gray-500">12 images</div>
                </div>
              </button>
            </div>
          </div>

          {/* Manual URL Input */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Ou tester une URL personnalisée:</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualFetch()}
                placeholder="https://jsonplaceholder.typicode.com/users/1"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleManualFetch}
                className="px-6 py-2 bg-linear-to-r from-teal-500 to-green-500 text-white rounded-lg hover:from-teal-600 hover:to-green-600 transition-all"
              >
                Fetch
              </button>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {showManual ? (
                <span>URL personnalisée: {manualUrl}</span>
              ) : (
                <span>Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">{apiUrls[selectedEndpoint]}</code></span>
              )}
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Rafraîchir
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="animate-spin text-teal-500 mb-4" size={48} />
              <p className="text-gray-600 text-lg">Chargement des données...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Erreur lors du chargement</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Data Display */}
          {!loading && !error && data && (
            <div className="space-y-4">
              {/* Users */}
              {selectedEndpoint === 'users' && !showManual && Array.isArray(data) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data as User[]).map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-2">{user.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📧 {user.email}</p>
                        <p>📞 {user.phone}</p>
                        <p>🌐 {user.website}</p>
                        <p>🏢 {user.company.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {selectedEndpoint === 'posts' && !showManual && Array.isArray(data) && (
                <div className="space-y-4">
                  {(data as Post[]).map((post) => (
                    <div key={post.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                          {post.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">{post.title}</h3>
                          <p className="text-gray-600 text-sm">{post.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Photos */}
              {selectedEndpoint === 'photos' && !showManual && Array.isArray(data) && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(data as Photo[]).map((photo) => (
                    <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm text-gray-700 truncate" title={photo.title}>
                          {photo.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual Data */}
              {showManual && (
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-green-400 text-sm font-mono">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Explanation */}
          <div className="mt-8 bg-teal-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-teal-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Custom Hook (useFetch)</strong>: Hook réutilisable pour tous les appels API
              </li>
              <li>
                • <strong>Generic TypeScript</strong>: useFetch{"<T>"} pour typer les données retournées
              </li>
              <li>
                • <strong>Loading States</strong>: Gestion des états loading, error, data
              </li>
              <li>
                • <strong>AbortController</strong>: Annulation des requêtes lors du unmount
              </li>
              <li>
                • <strong>Refetch</strong>: Possibilité de re-déclencher manuellement
              </li>
              <li>
                • <strong>Options</strong>: autoFetch pour contrôler le fetch initial
              </li>
              <li>
                • <strong>Error Handling</strong>: Gestion complète des erreurs HTTP et réseau
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4">
              <p className="text-sm text-gray-600 font-mono">
                const {"{ data, loading, error, refetch }"} = useFetch{"<User[]>"}(url);
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}