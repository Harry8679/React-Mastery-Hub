import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, Code2, Focus, Video, Play, Pause, RotateCcw, Timer } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

export default function UseRefProject({ onBack }: ProjectComponentProps) {
  // ==================== EXEMPLE 1: FOCUS INPUT ====================
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleClearAndFocus = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  // ==================== EXEMPLE 2: VIDEO PLAYER ====================
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // ==================== EXEMPLE 3: TIMER AVEC REF ====================
  const [timerCount, setTimerCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timerIntervalRef.current !== null) return;
    
    setTimerRunning(true);
    timerIntervalRef.current = window.setInterval(() => {
      setTimerCount((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerCount(0);
  };

  // Cleanup du timer au unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // ==================== EXEMPLE 4: COMPTEUR DE RENDERS ====================
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
  });

  // ==================== EXEMPLE 5: PREVIOUS VALUE ====================
  const [name, setName] = useState('');
  const previousNameRef = useRef('');

  useEffect(() => {
    previousNameRef.current = name;
  }, [name]);

  // ==================== EXEMPLE 6: SCROLL TO ELEMENT ====================
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

//   const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
//     ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">useRef - DOM & Références</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useRef", "DOM Manipulation", "Uncontrolled Components"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => scrollToSection(section1Ref)}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-all"
            >
              Focus Input
            </button>
            <button
              onClick={() => scrollToSection(section2Ref)}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-all"
            >
              Video Player
            </button>
            <button
              onClick={() => scrollToSection(section3Ref)}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-all"
            >
              Timer
            </button>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: FOCUS INPUT */}
            <div ref={section1Ref} className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Focus className="text-pink-500" size={28} />
                1. Focus sur Input
              </h2>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Champ de texte avec ref:
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Cliquez sur les boutons ci-dessous..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleFocusInput}
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all"
                  >
                    Focus sur l'input
                  </button>
                  <button
                    onClick={handleClearAndFocus}
                    className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
                  >
                    Clear & Focus
                  </button>
                </div>

                <div className="bg-pink-50 rounded p-4 text-sm">
                  <p className="text-gray-700">
                    <strong>Valeur actuelle:</strong> {inputValue || '(vide)'}
                  </p>
                  <p className="text-gray-600 mt-2">
                    💡 useRef permet d'accéder directement au DOM sans re-render
                  </p>
                </div>
              </div>
            </div>

            {/* EXEMPLE 2: VIDEO PLAYER */}
            <div ref={section2Ref} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Video className="text-purple-500" size={28} />
                2. Contrôle de Vidéo
              </h2>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full"
                    poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=450&fit=crop"
                  >
                    <source
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      type="video/mp4"
                    />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                </div>

                {/* Contrôles personnalisés */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={20} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          Play
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Restart
                    </button>
                  </div>

                  <div className="bg-purple-50 rounded p-4">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>{Math.floor(currentTime)}s</span>
                      <span>{Math.floor(duration)}s</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded p-4 text-sm text-gray-700">
                  💡 useRef permet de contrôler directement l'élément video sans wrapper
                </div>
              </div>
            </div>

            {/* EXEMPLE 3: TIMER */}
            <div ref={section3Ref} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Timer className="text-blue-500" size={28} />
                3. Timer avec useRef
              </h2>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {timerCount}s
                  </div>
                  <div className="text-gray-600">
                    {timerRunning ? '⏱️ En cours...' : '⏸️ Arrêté'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startTimer}
                    disabled={timerRunning}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start
                  </button>
                  <button
                    onClick={stopTimer}
                    disabled={!timerRunning}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Stop
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Reset
                  </button>
                </div>

                <div className="bg-blue-50 rounded p-4 text-sm text-gray-700">
                  💡 useRef stocke l'ID de l'interval sans causer de re-render
                </div>
              </div>
            </div>

            {/* EXEMPLE 4: RENDER COUNT */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Compteur de Renders
              </h2>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {renderCount.current}
                  </div>
                  <p className="text-gray-600">Nombre de renders du composant</p>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tapez pour causer un re-render..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={() => {}}
                  />
                </div>

                <div className="bg-orange-50 rounded p-4 text-sm text-gray-700">
                  💡 useRef ne cause pas de re-render quand on modifie sa valeur
                </div>
              </div>
            </div>

            {/* EXEMPLE 5: PREVIOUS VALUE */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Valeur Précédente
              </h2>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="bg-green-50 rounded p-4">
                  <p className="text-gray-700">
                    <strong>Valeur actuelle:</strong> {name || '(vide)'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Valeur précédente:</strong> {previousNameRef.current || '(vide)'}
                  </p>
                </div>

                <div className="bg-green-50 rounded p-4 text-sm text-gray-700">
                  💡 useRef peut stocker la valeur précédente d'un state
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-pink-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-pink-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useRef pour le DOM</strong>: Accès direct aux éléments (input.focus(), video.play())
              </li>
              <li>
                • <strong>useRef pour les valeurs</strong>: Stocker des données sans re-render (interval ID)
              </li>
              <li>
                • <strong>useRef.current</strong>: La propriété mutable qui persiste entre les renders
              </li>
              <li>
                • <strong>Cleanup</strong>: Nettoyer les intervals/timeouts au unmount
              </li>
              <li>
                • <strong>Previous Value Pattern</strong>: Garder en mémoire la valeur précédente
              </li>
              <li>
                • <strong>Uncontrolled Components</strong>: Manipuler le DOM directement
              </li>
              <li>
                • <strong>scrollIntoView</strong>: Navigation smooth entre sections
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}