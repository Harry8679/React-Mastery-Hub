import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, Code2, CheckCircle, XCircle, AlertCircle, Info, X, Bell } from 'lucide-react';

// ==================== TYPES ====================
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

// ==================== CONTEXT ====================
const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// ==================== PROVIDER ====================
interface NotificationProviderProps {
  children: ReactNode;
  position?: NotificationPosition;
}

function NotificationProvider({ children, position = 'top-right' }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification = { id, ...notification };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} position={position} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

// ==================== COMPOSANTS ====================

// Toast Component
interface ToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function Toast({ notification, onRemove }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[notification.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg ${bgColor} ${borderColor} ${
        isLeaving ? 'animate-slideOut' : 'animate-slideIn'
      }`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      <Icon className={iconColor} size={24} />
      <div className="flex-1">
        {notification.title && (
          <h4 className={`font-bold mb-1 ${textColor}`}>{notification.title}</h4>
        )}
        <p className={`text-sm ${textColor}`}>{notification.message}</p>
      </div>
      <button
        onClick={handleRemove}
        className="p-1 hover:bg-black/10 rounded transition-colors"
      >
        <X size={18} className={textColor} />
      </button>
    </div>
  );
}

// Notification Container
interface NotificationContainerProps {
  notifications: Notification[];
  position: NotificationPosition;
  onRemove: (id: string) => void;
}

function NotificationContainer({ notifications, position, onRemove }: NotificationContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-3`}>
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ==================== DEMO COMPONENT ====================
function NotificationDemo() {
  const { addNotification } = useNotifications();
  const [customMessage, setCustomMessage] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType>('success');
  const [duration, setDuration] = useState(5000);

  const showNotification = (type: NotificationType, message: string, title?: string) => {
    addNotification({
      type,
      message,
      title,
      duration,
    });
  };

  const handleCustomNotification = () => {
    if (customMessage.trim()) {
      addNotification({
        type: selectedType,
        message: customMessage,
        title: customTitle || undefined,
        duration,
      });
      setCustomMessage('');
      setCustomTitle('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-purple-500" />
          Actions Rapides
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <button
            onClick={() => showNotification('success', 'Opération réussie avec succès !', 'Succès')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
          >
            <CheckCircle size={20} />
            Success Toast
          </button>
          <button
            onClick={() => showNotification('error', 'Une erreur est survenue lors de l\'opération.', 'Erreur')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
          >
            <XCircle size={20} />
            Error Toast
          </button>
          <button
            onClick={() => showNotification('warning', 'Attention : cette action est irréversible !', 'Avertissement')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-colors"
          >
            <AlertCircle size={20} />
            Warning Toast
          </button>
          <button
            onClick={() => showNotification('info', 'Nouvelle mise à jour disponible. Cliquez pour installer.', 'Information')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
          >
            <Info size={20} />
            Info Toast
          </button>
        </div>
      </div>

      {/* Custom Notification */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-gray-800 mb-4">Notification Personnalisée</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as NotificationType)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre (optionnel)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Titre de la notification"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Message de la notification"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Durée: {duration === 0 ? 'Permanent' : `${duration / 1000}s`}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="1000"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Permanent</span>
              <span>10s</span>
            </div>
          </div>

          <button
            onClick={handleCustomNotification}
            disabled={!customMessage.trim()}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Afficher la notification
          </button>
        </div>
      </div>

      {/* Stress Test */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-gray-800 mb-4">Test de Performance</h3>
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const types: NotificationType[] = ['success', 'error', 'warning', 'info'];
                const type = types[Math.floor(Math.random() * types.length)];
                addNotification({
                  type,
                  message: `Notification ${i + 1} de type ${type}`,
                  title: `Test #${i + 1}`,
                  duration: 3000,
                });
              }, i * 200);
            }
          }}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors"
        >
          Lancer 5 notifications
        </button>
      </div>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function NotificationsProject({ onBack }: ProjectComponentProps) {
  const [position, setPosition] = useState<NotificationPosition>('top-right');

  return (
    <NotificationProvider position={position}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🔔 Notifications / Toast</h1>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Toast", "Notifications", "Context API"].map((concept) => (
                  <span
                    key={concept}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Position Selector */}
            <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Position des Notifications</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as NotificationPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      position === pos
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo */}
            <NotificationDemo />

            {/* Explanation */}
            <div className="mt-8 bg-purple-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Code2 size={20} className="text-purple-500" />
                Concepts Notifications :
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>Context API</strong>: État global des notifications
                </li>
                <li>
                  • <strong>Custom Hook</strong>: useNotifications pour ajouter/retirer
                </li>
                <li>
                  • <strong>Auto-dismiss</strong>: Fermeture automatique après durée
                </li>
                <li>
                  • <strong>Animations</strong>: SlideIn/SlideOut avec CSS
                </li>
                <li>
                  • <strong>Position</strong>: 6 positions configurables
                </li>
                <li>
                  • <strong>Types</strong>: Success, Error, Warning, Info
                </li>
              </ul>

              <div className="mt-4 bg-white rounded p-4 space-y-2">
                <p className="text-sm text-gray-600 font-mono">
                  const {'{'} addNotification {'}'} = useNotifications();
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  addNotification({'{'}
                </p>
                <p className="text-sm text-gray-600 font-mono ml-4">
                  type: 'success',
                </p>
                <p className="text-sm text-gray-600 font-mono ml-4">
                  message: 'Opération réussie !',
                </p>
                <p className="text-sm text-gray-600 font-mono ml-4">
                  duration: 5000
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  {'}'});
                </p>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                <p className="font-bold mb-2">💡 Features:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>4 types de notifications avec icônes et couleurs</li>
                  <li>Position configurable (6 positions)</li>
                  <li>Auto-dismiss avec durée personnalisable</li>
                  <li>Fermeture manuelle avec bouton X</li>
                  <li>Animations d'entrée/sortie</li>
                  <li>Stack multiple de notifications</li>
                </ul>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
                <p className="font-bold mb-2">🎯 Use Cases:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Confirmation d'action (sauvegarde, suppression)</li>
                  <li>Messages d'erreur (échec API, validation)</li>
                  <li>Alertes système (mise à jour, maintenance)</li>
                  <li>Feedback utilisateur (upload terminé)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slideOut {
          animation: slideOut 0.3s ease-in;
        }
      `}</style>
    </NotificationProvider>
  );
}