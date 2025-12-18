import { useState } from 'react';
import { ChevronLeft, Code2, RefreshCw, Loader2, AlertCircle, CheckCircle, Trash2, User, Star } from 'lucide-react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  website: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// ==================== API FUNCTIONS ====================
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete post');
};

const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};

// ==================== COMPOSANTS ====================

// Users List Component
function UsersList() {
  const { data: users, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5000, // 5 secondes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={48} />
        <p className="text-red-700 font-semibold">Erreur: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <User size={20} />
          Users List ({users?.length})
        </h3>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {users?.slice(0, 5).map((user) => (
          <div key={user.id} className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single User Component
function UserDetail() {
  const [userId, setUserId] = useState(1);
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: userId > 0, // Conditional query
  });

  return (
    <div className="bg-purple-50 rounded-xl p-6">
      <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
        <User size={20} />
        User Detail
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          User ID:
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 py-8">
          Utilisateur introuvable
        </div>
      ) : user ? (
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h4>
          <p className="text-gray-600 mb-1">📧 {user.email}</p>
          <p className="text-gray-600 mb-1">👤 @{user.username}</p>
          <p className="text-gray-600">🌐 {user.website}</p>
        </div>
      ) : null}
    </div>
  );
}

// Posts with Mutation Component
function PostsList() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowForm(false);
      setNewPost({ title: '', body: '' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.body) {
      createMutation.mutate({
        userId: 1,
        title: newPost.title,
        body: newPost.body,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-green-900 flex items-center gap-2">
          <Star size={20} />
          Posts with Mutations
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {showForm ? 'Annuler' : 'Nouveau'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 bg-white rounded-lg p-4">
          <input
            type="text"
            placeholder="Titre"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2 mb-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
            required
          />
          <textarea
            placeholder="Contenu"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="w-full px-4 py-2 mb-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none h-20"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Création...' : 'Créer'}
          </button>
        </form>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{post.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending}
                className="p-1 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Todos Component
function TodosList() {
  const { data: todos, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    refetchInterval: 10000, // Auto-refetch every 10s
  });

  const lastUpdate = new Date(dataUpdatedAt).toLocaleTimeString();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-12">
        Erreur de chargement
      </div>
    );
  }

  const completed = todos?.filter((t) => t.completed).length || 0;

  return (
    <div className="bg-orange-50 rounded-xl p-6">
      <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
        <CheckCircle size={20} />
        Todos (Auto-refetch)
      </h3>
      <p className="text-xs text-gray-600 mb-4">
        Dernière mise à jour: {lastUpdate}
      </p>

      <div className="mb-4 bg-white rounded-lg p-3">
        <div className="text-sm text-gray-600">
          {completed} / {todos?.length} complétées
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${((completed / (todos?.length || 1)) * 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 bg-white rounded-lg p-3"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className="w-5 h-5"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
function ReactQueryContent({ onBack }: ProjectComponentProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">React Query</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["TanStack Query", "Data Fetching", "Caching"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Demos Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <UsersList />
            <UserDetail />
            <PostsList />
            <TodosList />
          </div>

          {/* Explanation */}   
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Concepts React Query utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useQuery</strong>: Fetch et cache des données
              </li>
              <li>
                • <strong>useMutation</strong>: POST/PUT/DELETE avec optimistic updates
              </li>
              <li>
                • <strong>queryKey</strong>: Identification unique des queries
              </li>
              <li>
                • <strong>invalidateQueries</strong>: Forcer un refetch
              </li>
              <li>
                • <strong>staleTime</strong>: Temps avant que data soit "stale"
              </li>
              <li>
                • <strong>refetchInterval</strong>: Polling automatique
              </li>
              <li>
                • <strong>enabled</strong>: Query conditionnelle
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const {'{'} data, isLoading, error {'}'} = useQuery({'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                queryKey: ['users'],
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                queryFn: fetchUsers,
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'});
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Avantages React Query:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Cache intelligent automatique</li>
                <li>Background refetching</li>
                <li>Window focus refetching</li>
                <li>Request deduplication</li>
                <li>Pagination & infinite scroll built-in</li>
                <li>Optimistic updates</li>
                <li>DevTools intégrés</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Features démontrées:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Users List</strong>: Query basique avec refresh manuel</li>
                <li><strong>User Detail</strong>: Query paramétrique (par ID)</li>
                <li><strong>Posts</strong>: Mutations (CREATE/DELETE) avec cache invalidation</li>
                <li><strong>Todos</strong>: Auto-refetch toutes les 10 secondes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper with QueryClientProvider
export default function ReactQueryProject(props: ProjectComponentProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryContent {...props} />
    </QueryClientProvider>
  );
}