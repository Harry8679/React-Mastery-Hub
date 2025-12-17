import { useState } from 'react';
import { ChevronLeft, Code2, Play, RotateCw, Zap, Heart, Star, Bell } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== COMPOSANT PRINCIPAL ====================
export default function AnimationsProject({ onBack }: ProjectComponentProps) {
  const [showFadeIn, setShowFadeIn] = useState(false);
  const [showSlideIn, setShowSlideIn] = useState(false);
  const [showScaleIn, setShowScaleIn] = useState(false);
  const [showBounce, setShowBounce] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLike = () => {
    setIsLiked(true);
    setLikeCount(prev => prev + 1);
    setTimeout(() => setIsLiked(false), 600);
  };

  const handleNotification = () => {
    setNotificationCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Animations CSS & Transitions</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["CSS Animations", "Transitions", "Keyframes"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: TRANSITIONS DE BASE */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-blue-500" size={28} />
                1. Transitions de Base
              </h2>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                {/* Fade In */}
                <div className="bg-white rounded-lg p-4 text-center">
                  <button
                    onClick={() => {
                      setShowFadeIn(true);
                      setTimeout(() => setShowFadeIn(false), 1000);
                    }}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all mb-3"
                  >
                    Fade In
                  </button>
                  {showFadeIn && (
                    <div className="animate-fadeIn bg-blue-100 rounded p-3">
                      <p className="text-blue-800 text-sm">Apparition</p>
                    </div>
                  )}
                </div>

                {/* Slide In */}
                <div className="bg-white rounded-lg p-4 text-center">
                  <button
                    onClick={() => {
                      setShowSlideIn(true);
                      setTimeout(() => setShowSlideIn(false), 1000);
                    }}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all mb-3"
                  >
                    Slide In
                  </button>
                  {showSlideIn && (
                    <div className="animate-slideInRight bg-green-100 rounded p-3">
                      <p className="text-green-800 text-sm">Glissement</p>
                    </div>
                  )}
                </div>

                {/* Scale In */}
                <div className="bg-white rounded-lg p-4 text-center">
                  <button
                    onClick={() => {
                      setShowScaleIn(true);
                      setTimeout(() => setShowScaleIn(false), 1000);
                    }}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all mb-3"
                  >
                    Scale In
                  </button>
                  {showScaleIn && (
                    <div className="animate-scaleIn bg-purple-100 rounded p-3">
                      <p className="text-purple-800 text-sm">Zoom</p>
                    </div>
                  )}
                </div>

                {/* Bounce */}
                <div className="bg-white rounded-lg p-4 text-center">
                  <button
                    onClick={() => {
                      setShowBounce(true);
                      setTimeout(() => setShowBounce(false), 1000);
                    }}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all mb-3"
                  >
                    Bounce
                  </button>
                  {showBounce && (
                    <div className="animate-bounce bg-orange-100 rounded p-3">
                      <p className="text-orange-800 text-sm">Rebond</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  @keyframes fadeIn {'{'} from {'{'} opacity: 0 {'}'} to {'{'} opacity: 1 {'}'} {'}'}
                </p>
                <p>💡 Animations CSS avec @keyframes</p>
              </div>
            </div>

            {/* EXEMPLE 2: HOVER EFFECTS */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Play className="text-purple-500" size={28} />
                2. Effets au Survol
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Scale */}
                <div className="bg-white rounded-lg p-6 hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="font-semibold">Scale</p>
                  </div>
                </div>

                {/* Rotate */}
                <div className="bg-white rounded-lg p-6 hover:rotate-12 transition-transform cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔄</div>
                    <p className="font-semibold">Rotate</p>
                  </div>
                </div>

                {/* Shadow */}
                <div className="bg-white rounded-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <p className="font-semibold">Shadow</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Survole les cartes pour voir les effets de transition</p>
              </div>
            </div>

            {/* EXEMPLE 3: ANIMATIONS INFINIES */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <RotateCw className="text-green-500" size={28} />
                3. Animations en Boucle
              </h2>

              <div className="grid md:grid-cols-4 gap-4">
                {/* Spin */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="animate-spin text-6xl mb-2">⚙️</div>
                  <p className="font-semibold text-gray-700">Spin</p>
                </div>

                {/* Ping */}
                <div className="bg-white rounded-lg p-6 text-center relative">
                  <div className="relative inline-block">
                    <div className="text-6xl mb-2">📡</div>
                    <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></span>
                  </div>
                  <p className="font-semibold text-gray-700">Ping</p>
                </div>

                {/* Pulse */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="animate-pulse text-6xl mb-2">❤️</div>
                  <p className="font-semibold text-gray-700">Pulse</p>
                </div>

                {/* Bounce */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="animate-bounce text-6xl mb-2">⚽</div>
                  <p className="font-semibold text-gray-700">Bounce</p>
                </div>
              </div>

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Ces animations tournent en boucle infinie (infinite)</p>
              </div>
            </div>

            {/* EXEMPLE 4: INTERACTIONS COMPLEXES */}
            <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Animations d'Interactions
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Like Button */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <button
                    onClick={handleLike}
                    className="relative group"
                  >
                    <Heart
                      className={`transition-all duration-300 ${
                        isLiked
                          ? 'fill-red-500 text-red-500 scale-125'
                          : 'text-gray-400 group-hover:text-red-400'
                      }`}
                      size={48}
                    />
                    {isLiked && (
                      <div className="absolute inset-0 animate-ping">
                        <Heart className="text-red-500" size={48} />
                      </div>
                    )}
                  </button>
                  <p className="mt-3 text-gray-700 font-semibold">{likeCount} likes</p>
                </div>

                {/* Star Rating */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="text-yellow-400 fill-yellow-400 hover:scale-125 transition-transform cursor-pointer"
                        size={32}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 font-semibold">Note: 5/5</p>
                </div>

                {/* Notification Badge */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <button
                    onClick={handleNotification}
                    className="relative inline-block"
                  >
                    <Bell className="text-gray-700 hover:text-blue-500 transition-colors" size={48} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <p className="mt-3 text-gray-700 font-semibold">Notifications</p>
                </div>
              </div>

              <div className="mt-4 bg-orange-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Animations déclenchées par des interactions utilisateur</p>
              </div>
            </div>

            {/* EXEMPLE 5: LOADING STATES */}
            <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. États de Chargement
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Spinner */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-3 font-semibold text-gray-700">Spinner</p>
                </div>

                {/* Dots */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-700">Dots</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-linear-to-r from-green-500 to-blue-500 animate-progress"></div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-700">Progress</p>
                </div>
              </div>

              <div className="mt-4 bg-pink-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Différents indicateurs de chargement animés</p>
              </div>
            </div>

            {/* EXEMPLE 6: ENTRÉES/SORTIES */}
            <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Animations d'Entrée/Sortie
              </h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 animate-slideInLeft">
                  <p className="text-gray-800">⬅️ Slide In Left</p>
                </div>
                <div className="bg-white rounded-lg p-4 animate-slideInRight">
                  <p className="text-gray-800">➡️ Slide In Right</p>
                </div>
                <div className="bg-white rounded-lg p-4 animate-slideInUp">
                  <p className="text-gray-800">⬆️ Slide In Up</p>
                </div>
                <div className="bg-white rounded-lg p-4 animate-slideInDown">
                  <p className="text-gray-800">⬇️ Slide In Down</p>
                </div>
              </div>

              <div className="mt-4 bg-indigo-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Animations directionnelles pour les entrées de contenu</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-indigo-500" />
              Concepts CSS utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>@keyframes</strong>: Définir des animations personnalisées
              </li>
              <li>
                • <strong>animation</strong>: Appliquer une animation (nom, durée, timing, iteration)
              </li>
              <li>
                • <strong>transition</strong>: Animer les changements de propriétés CSS
              </li>
              <li>
                • <strong>transform</strong>: Scale, rotate, translate pour les animations
              </li>
              <li>
                • <strong>animation-delay</strong>: Délai avant le début de l'animation
              </li>
              <li>
                • <strong>animation-iteration-count</strong>: Nombre de répétitions (infinite)
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                {'@keyframes slideIn {'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'from { transform: translateX(-100%); }'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'to { transform: translateX(0); }'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Bonnes Pratiques:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Utiliser <code>transform</code> et <code>opacity</code> pour de meilleures performances</li>
                <li>Éviter d'animer <code>width</code>, <code>height</code>, <code>left</code>, <code>top</code></li>
                <li>Ajouter <code>will-change</code> pour les animations complexes</li>
                <li>Utiliser <code>transition</code> pour les changements d'état simples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}