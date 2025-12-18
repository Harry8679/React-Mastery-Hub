import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, Code2, Users, Mail, Zap, Layers } from 'lucide-react'
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  company: string;
  role: string;
}

interface VirtualScrollProps {
  items: User[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

// ==================== UTILS ====================
const generateUsers = (count: number): User[] => {
  const roles = ['Developer', 'Designer', 'Manager', 'CTO', 'CEO', 'Marketing', 'Sales'];
  const companies = ['TechCorp', 'StartupInc', 'BigCompany', 'SmallBiz', 'Enterprise'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://ui-avatars.com/api/?name=User+${i + 1}&background=random`,
    company: companies[Math.floor(Math.random() * companies.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
  }));
};

// ==================== VIRTUAL SCROLL HOOK ====================
function useVirtualScroll({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  const offsetY = startIndex * itemHeight;

  return {
    totalHeight,
    visibleItems,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  };
}

// ==================== COMPOSANTS ====================

// Virtual List Component
function VirtualList({ users }: { users: User[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 80;
  const containerHeight = 600;

  const {
    totalHeight,
    visibleItems,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  } = useVirtualScroll({
    items: users,
    itemHeight,
    containerHeight,
    overscan: 5,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <Layers size={20} />
          Virtual Scroll
        </h3>
        <div className="text-sm text-gray-600">
          Affichés: {visibleItems.length} / {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-200">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{ height: `${containerHeight}px` }}
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((user, index) => {
                const actualIndex = startIndex + index;
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    style={{ height: `${itemHeight}px` }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        #{actualIndex + 1} - {user.name}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-800">{user.role}</div>
                      <div className="text-xs text-gray-500">{user.company}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white rounded p-2">
          <div className="font-semibold text-gray-700">Première</div>
          <div className="text-lg font-bold text-blue-600">{startIndex + 1}</div>
        </div>
        <div className="bg-white rounded p-2">
          <div className="font-semibold text-gray-700">Dernière</div>
          <div className="text-lg font-bold text-blue-600">{endIndex + 1}</div>
        </div>
        <div className="bg-white rounded p-2">
          <div className="font-semibold text-gray-700">Rendus</div>
          <div className="text-lg font-bold text-green-600">{visibleItems.length}</div>
        </div>
      </div>
    </div>
  );
}

// Normal List (for comparison)
function NormalList({ users }: { users: User[] }) {
  const itemHeight = 80;

  return (
    <div className="bg-red-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-red-900 flex items-center gap-2">
          <Users size={20} />
          Normal Scroll
        </h3>
        <div className="text-sm text-gray-600">
          Rendus: {users.length} / {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-200">
        <div className="overflow-y-auto" style={{ height: '600px' }}>
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-red-50 transition-colors"
              style={{ height: `${itemHeight}px` }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  #{index + 1} - {user.name}
                </div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">{user.role}</div>
                <div className="text-xs text-gray-500">{user.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white rounded p-3 text-center">
        <div className="text-sm font-semibold text-gray-700 mb-1">⚠️ Attention</div>
        <div className="text-xs text-gray-600">
          Tous les {users.length} éléments sont rendus en même temps
        </div>
      </div>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function VirtualScrollProject({ onBack }: ProjectComponentProps) {
  const [itemCount, setItemCount] = useState(1000);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(generateUsers(itemCount));
  }, [itemCount]);

  const presets = [
    { label: '100', value: 100 },
    { label: '1K', value: 1000 },
    { label: '10K', value: 10000 },
    { label: '50K', value: 50000 },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Virtual Scroll</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Virtual Scrolling", "Performance", "Large Lists"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Nombre d'éléments :</h3>
              <div className="text-2xl font-bold text-purple-600">
                {itemCount.toLocaleString()}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {presets.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setItemCount(value)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    itemCount === value
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Performance Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-blue-600" size={24} />
                <h3 className="font-bold text-blue-900">Virtual Scroll</h3>
              </div>
              <div className="text-sm text-blue-700">
                Rend seulement ~15-20 éléments visibles
              </div>
            </div>

            <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-red-600" size={24} />
                <h3 className="font-bold text-red-900">Normal Scroll</h3>
              </div>
              <div className="text-sm text-red-700">
                Rend tous les {itemCount.toLocaleString()} éléments
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-green-600" size={24} />
                <h3 className="font-bold text-green-900">Gain</h3>
              </div>
              <div className="text-sm text-green-700">
                ~{Math.round((itemCount / 20) * 100) / 100}x plus performant
              </div>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <VirtualList users={users.slice(0, Math.min(itemCount, 10000))} />
            <NormalList users={users.slice(0, Math.min(100, itemCount))} />
          </div>

          {/* Warning */}
          {itemCount > 1000 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-semibold">
                ⚠️ Normal Scroll limité à 100 items pour éviter les problèmes de performance
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-purple-500" />
              Concepts Virtual Scroll :
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Windowing</strong>: Ne rendre que les éléments visibles
              </li>
              <li>
                • <strong>Overscan</strong>: Buffer d'éléments hors écran pour scroll fluide
              </li>
              <li>
                • <strong>Transform</strong>: Positionnement CSS avec translateY
              </li>
              <li>
                • <strong>Total Height</strong>: Container avec hauteur totale virtuelle
              </li>
              <li>
                • <strong>Performance</strong>: O(1) renders au lieu de O(n)
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const startIndex = Math.floor(scrollTop / itemHeight);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const endIndex = Math.ceil((scrollTop + height) / itemHeight);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                const visibleItems = items.slice(startIndex, endIndex);
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Pourquoi Virtual Scroll ?</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Réduit drastiquement le nombre de DOM nodes</li>
                <li>Améliore les performances de scroll</li>
                <li>Diminue l'utilisation mémoire</li>
                <li>Permet de gérer des listes infinies</li>
                <li>Améliore le temps de premier rendu</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Libraries populaires :</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>react-window</strong>: Léger et performant</li>
                <li><strong>react-virtualized</strong>: Feature-rich (plus lourd)</li>
                <li><strong>@tanstack/react-virtual</strong>: Moderne et flexible</li>
                <li><strong>Custom Hook</strong>: Solution maison (comme ici)</li>
              </ul>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
              <p className="font-bold mb-2">⚙️ Paramètres importants :</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>itemHeight</strong>: Hauteur fixe des items (80px ici)</li>
                <li><strong>containerHeight</strong>: Hauteur du viewport (600px)</li>
                <li><strong>overscan</strong>: Buffer items (5 = 5 avant + 5 après)</li>
                <li><strong>totalHeight</strong>: itemHeight × totalItems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}