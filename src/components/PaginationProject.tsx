import { useState, useMemo } from 'react';
import { ChevronLeft, Code2, ChevronRight, ChevronsLeft, ChevronsRight, User, Search } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

// ==================== MOCK DATA ====================
const ROLES = ['Developer', 'Designer', 'Manager', 'Admin', 'Analyst'];
const STATUSES: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('fr-FR'),
  }));
};

const USERS = generateUsers(247);

// ==================== HOOKS ====================
function usePagination(items: User[], itemsPerPage: number, currentPage: number) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return {
    currentItems,
    totalPages,
    startIndex,
    endIndex: Math.min(endIndex, items.length),
  };
}

// ==================== COMPOSANTS ====================

// User Table
interface UserTableProps {
  users: User[];
  startIndex: number;
}

function UserTable({ users, startIndex }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rôle</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date d'inscription</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-600">{startIndex + index + 1}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Classic Pagination
interface ClassicPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function ClassicPagination({ currentPage, totalPages, onPageChange }: ClassicPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Première page"
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Page précédente"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 rounded font-semibold transition-all ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Page suivante"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Dernière page"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}

// Simple Pagination
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function SimplePagination({ currentPage, totalPages, onPageChange }: SimplePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
      >
        <ChevronLeft size={20} />
        Précédent
      </button>

      <span className="text-gray-700 font-semibold">
        Page {currentPage} sur {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
      >
        Suivant
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function PaginationProject({ onBack }: ProjectComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationType, setPaginationType] = useState<'classic' | 'simple'>('classic');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return USERS;
    const query = searchQuery.toLowerCase();
    return USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Reset to page 1 when search changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const { currentItems, totalPages, startIndex, endIndex } = usePagination(
    filteredUsers,
    itemsPerPage,
    currentPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📄 Pagination</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Pagination", "Data Management", "UX"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nom, email, rôle..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Éléments par page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Pagination Type Selector */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setPaginationType('classic')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                paginationType === 'classic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pagination Classique
            </button>
            <button
              onClick={() => setPaginationType('simple')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                paginationType === 'simple'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pagination Simple
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  Affichage de {startIndex + 1} à {endIndex} sur {filteredUsers.length} utilisateurs
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} / {totalPages}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            {currentItems.length > 0 ? (
              <UserTable users={currentItems} startIndex={startIndex} />
            ) : (
              <div className="text-center py-12">
                <User size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mb-6">
              {paginationType === 'classic' ? (
                <ClassicPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}

          {/* Explanation */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-indigo-500" />
              Concepts Pagination :
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>usePagination Hook</strong>: Calcul des pages et indices
              </li>
              <li>
                • <strong>Slice Array</strong>: Extraction des items visibles
              </li>
              <li>
                • <strong>Page Numbers</strong>: Génération dynamique avec ellipsis
              </li>
              <li>
                • <strong>Items per Page</strong>: Contrôle de la densité
              </li>
              <li>
                • <strong>Search Integration</strong>: Reset page lors recherche
              </li>
              <li>
                • <strong>URL Sync</strong>: (Optionnel) Synchronisation avec l'URL
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const startIndex = (currentPage - 1) * itemsPerPage;
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const endIndex = startIndex + itemsPerPage;
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const currentItems = items.slice(startIndex, endIndex);
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Types de pagination:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>Classique</strong>: Numéros de pages avec ellipsis (1 ... 5 6 7 ... 25)</li>
                <li><strong>Simple</strong>: Précédent / Suivant seulement</li>
                <li><strong>Load More</strong>: Bouton "Charger plus" (non implémenté ici)</li>
                <li><strong>Infinite Scroll</strong>: Chargement automatique au scroll</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Bonnes pratiques:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Réinitialiser à la page 1 lors d'un changement de filtre</li>
                <li>Scroll to top lors changement de page</li>
                <li>Afficher le nombre total d'éléments</li>
                <li>Désactiver les boutons aux extrémités</li>
                <li>Permettre de choisir le nombre d'items par page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}