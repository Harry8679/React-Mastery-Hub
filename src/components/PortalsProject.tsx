import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Code2, X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

// ==================== COMPOSANTS PORTAL ====================

// Modal de base
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    // Empêcher le scroll du body quand la modal est ouverte
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Fermer avec Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Modal de confirmation
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'warning' }: ConfirmModalProps) {
  const colors = {
    danger: { bg: 'bg-red-50', text: 'text-red-800', button: 'bg-red-500 hover:bg-red-600', icon: 'text-red-500' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-800', button: 'bg-yellow-500 hover:bg-yellow-600', icon: 'text-yellow-500' },
    info: { bg: 'bg-blue-50', text: 'text-blue-800', button: 'bg-blue-500 hover:bg-blue-600', icon: 'text-blue-500' }
  };

  const config = colors[type];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        <div className="p-6">
          <div className={`flex items-center gap-4 p-4 ${config.bg} rounded-lg mb-4`}>
            {type === 'danger' && <AlertTriangle size={32} className={config.icon} />}
            {type === 'warning' && <AlertTriangle size={32} className={config.icon} />}
            {type === 'info' && <Info size={32} className={config.icon} />}
            <div>
              <h3 className={`font-bold text-lg ${config.text}`}>{title}</h3>
              <p className={`text-sm ${config.text}`}>{message}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors font-semibold ${config.button}`}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Toast notification
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <X size={20} />,
    info: <Info size={20} />
  };

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3`}>
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}

// Sidebar Portal
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  children: React.ReactNode;
}

function Sidebar({ isOpen, onClose, side, children }: SidebarProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div
        className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto ${
          side === 'left' ? 'animate-slideInLeft' : 'animate-slideInRight'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function PortalsProject({ onBack }: ProjectComponentProps) {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>('right');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setActionLog(prev => [message, ...prev].slice(0, 10));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Portals - Modal & Overlays</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["ReactDOM.createPortal", "Modals", "Overlay"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: MODAL BASIQUE */}
            <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Modal Basique
              </h2>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <p className="text-gray-700">
                  Une modal simple avec backdrop, fermeture par clic extérieur et touche Escape.
                </p>

                <button
                  onClick={() => setBasicModalOpen(true)}
                  className="w-full px-6 py-3 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-all font-semibold"
                >
                  Ouvrir Modal
                </button>

                <div className="bg-fuchsia-50 rounded p-4 text-sm text-gray-700">
                  <p>💡 La modal est rendue dans <code>document.body</code> grâce à <code>createPortal</code></p>
                  <p className="mt-1">🔑 Appuyez sur <strong>Escape</strong> pour fermer</p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 2: MODALS DE CONFIRMATION */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Modals de Confirmation
              </h2>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setConfirmModalOpen(true)}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold"
                  >
                    ⚠️ Avertissement
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                  >
                    🗑️ Suppression
                  </button>
                </div>

                <div className="bg-yellow-50 rounded p-4 text-sm text-gray-700">
                  <p>💡 Différents types de modals pour différentes actions</p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 3: TOAST NOTIFICATIONS */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Toast Notifications
              </h2>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => showToast('Action réussie !', 'success')}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold"
                  >
                    ✅ Succès
                  </button>
                  <button
                    onClick={() => showToast('Une erreur est survenue', 'error')}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                  >
                    ❌ Erreur
                  </button>
                  <button
                    onClick={() => showToast('Nouvelle notification', 'info')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold"
                  >
                    ℹ️ Info
                  </button>
                </div>

                <div className="bg-green-50 rounded p-4 text-sm text-gray-700">
                  <p>💡 Les toasts se ferment automatiquement après 3 secondes</p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 4: SIDEBAR */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Sidebar Panel
              </h2>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSidebarSide('left');
                      setSidebarOpen(true);
                    }}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold"
                  >
                    ← Sidebar Gauche
                  </button>
                  <button
                    onClick={() => {
                      setSidebarSide('right');
                      setSidebarOpen(true);
                    }}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all font-semibold"
                  >
                    Sidebar Droite →
                  </button>
                </div>

                <div className="bg-purple-50 rounded p-4 text-sm text-gray-700">
                  <p>💡 Panel latéral avec animation slide</p>
                </div>
              </div>
            </div>

            {/* LOG DES ACTIONS */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📝 Log des Actions
              </h2>

              <div className="bg-white rounded-lg p-6">
                {actionLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune action enregistrée
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {actionLog.map((log, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-gray-50 rounded text-sm text-gray-700"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-fuchsia-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-fuchsia-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>createPortal</strong>: Rendre un composant en dehors de sa hiérarchie DOM
              </li>
              <li>
                • <strong>document.body</strong>: Point de montage pour les overlays
              </li>
              <li>
                • <strong>z-index</strong>: Gestion des couches d'affichage
              </li>
              <li>
                • <strong>Backdrop</strong>: Overlay semi-transparent derrière la modal
              </li>
              <li>
                • <strong>Event Listeners</strong>: Escape pour fermer, clic extérieur
              </li>
              <li>
                • <strong>Scroll Lock</strong>: Bloquer le scroll du body quand modal ouverte
              </li>
              <li>
                • <strong>Animations CSS</strong>: fadeIn, scaleIn, slideIn
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4">
              <p className="text-sm text-gray-600 font-mono mb-2">
                {`return createPortal(<Modal />, document.body);`}
              </p>
              <p className="text-xs text-gray-500">
                🚪 Le composant est rendu dans le body, pas dans le parent React
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PORTALS */}
      <Modal
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Modal Basique"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Cette modal est créée avec <code className="bg-gray-100 px-2 py-1 rounded">createPortal</code>.
          </p>
          <p className="text-gray-700">
            Elle est montée directement dans le <code className="bg-gray-100 px-2 py-1 rounded">document.body</code>,
            en dehors de la hiérarchie React normale.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✨ Avantages: Pas de problème de z-index, positionnement absolu garanti
            </p>
          </div>
          <button
            onClick={() => {
              addLog('✅ Modal basique fermée');
              setBasicModalOpen(false);
            }}
            className="w-full px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          addLog('⚠️ Action confirmée (warning)');
          showToast('Action confirmée', 'success');
        }}
        title="Êtes-vous sûr ?"
        message="Cette action nécessite une confirmation."
        type="warning"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          addLog('🗑️ Élément supprimé');
          showToast('Élément supprimé avec succès', 'success');
        }}
        title="Supprimer l'élément"
        message="Cette action est irréversible. Voulez-vous continuer ?"
        type="danger"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        side={sidebarSide}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">
          Sidebar {sidebarSide === 'left' ? 'Gauche' : 'Droite'}
        </h2>
        <p className="text-gray-700 mb-4">
          Ce panel latéral est également créé avec <code>createPortal</code>.
        </p>
        <div className="space-y-3">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-bold text-purple-800 mb-2">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Accueil</li>
              <li>• Projets</li>
              <li>• Paramètres</li>
              <li>• À propos</li>
            </ul>
          </div>
          <button
            onClick={() => {
              addLog(`📱 Sidebar ${sidebarSide} fermée`);
              setSidebarOpen(false);
            }}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </Sidebar>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}