import { useRef, useState, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { ChevronLeft, Code2, Trash2, Download, Pencil, Eraser, Palette, Minus, Circle } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
type Tool = 'pencil' | 'eraser' | 'line' | 'circle' | 'rectangle';

interface DrawingState {
  isDrawing: boolean;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function CanvasDrawingProject({ onBack }: ProjectComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
  });

  // Sauvegarde temporaire pour shapes
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialiser le canvas avec fond blanc
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Créer canvas temporaire pour shapes
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCanvasRef.current = tempCanvas;
  }, []);

  const getCoordinates = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    
    setDrawingState({
      isDrawing: true,
      lastX: x,
      lastY: y,
      startX: x,
      startY: y,
    });

    // Pour les shapes, sauvegarder l'état actuel du canvas
    if (tool === 'line' || tool === 'circle' || tool === 'rectangle') {
      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      if (canvas && tempCanvas) {
        const ctx = canvas.getContext('2d');
        const tempCtx = tempCanvas.getContext('2d');
        if (ctx && tempCtx) {
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, 0);
        }
      }
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' || tool === 'eraser') {
      // Dessin libre
      ctx.beginPath();
      ctx.moveTo(drawingState.lastX, drawingState.lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      setDrawingState(prev => ({
        ...prev,
        lastX: x,
        lastY: y,
      }));
    } else {
      // Shapes avec preview
      const tempCanvas = tempCanvasRef.current;
      if (!tempCanvas) return;

      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Restaurer l'état sauvegardé
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(drawingState.startX, drawingState.startY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - drawingState.startX, 2) + 
          Math.pow(y - drawingState.startY, 2)
        );
        ctx.beginPath();
        ctx.arc(drawingState.startX, drawingState.startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'rectangle') {
        const width = x - drawingState.startX;
        const height = y - drawingState.startY;
        ctx.strokeRect(drawingState.startX, drawingState.startY, width, height);
      }
    }
  };

  const stopDrawing = () => {
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools: { value: Tool; icon: typeof Pencil; label: string }[] = [
    { value: 'pencil', icon: Pencil, label: 'Crayon' },
    { value: 'eraser', icon: Eraser, label: 'Gomme' },
    { value: 'line', icon: Minus, label: 'Ligne' },
    { value: 'circle', icon: Circle, label: 'Cercle' },
    { value: 'rectangle', icon: Circle, label: 'Rectangle' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Canvas Drawing</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Canvas API", "Mouse Events", "Drawing"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-6 space-y-4">
            {/* Tools */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {tools.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTool(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      tool === value
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={label}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="text-sm font-medium hidden sm:inline">Effacer</span>
                </button>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download size={18} />
                  <span className="text-sm font-medium hidden sm:inline">Télécharger</span>
                </button>
              </div>
            </div>

            {/* Colors and Width */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Color Palette */}
              <div className="flex items-center gap-3">
                <Palette size={20} className="text-gray-600" />
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        color === c
                          ? 'ring-4 ring-purple-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Line Width */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Épaisseur:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-semibold text-gray-700 w-8">{lineWidth}px</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white mx-auto block shadow-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">📝 Instructions:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Crayon</strong>: Dessinez librement sur le canvas</li>
              <li>• <strong>Gomme</strong>: Effacez une partie du dessin</li>
              <li>• <strong>Ligne</strong>: Tracez une ligne droite (cliquer-glisser)</li>
              <li>• <strong>Cercle</strong>: Dessinez un cercle (du centre vers l'extérieur)</li>
              <li>• <strong>Rectangle</strong>: Dessinez un rectangle (cliquer-glisser)</li>
              <li>• <strong>Couleurs</strong>: Sélectionnez une couleur dans la palette</li>
              <li>• <strong>Épaisseur</strong>: Ajustez l'épaisseur du trait (1-20px)</li>
            </ul>
          </div>

          {/* Explanation */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-purple-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Canvas API</strong>: API HTML5 pour dessiner (2D context)
              </li>
              <li>
                • <strong>useRef</strong>: Référence au canvas et canvas temporaire
              </li>
              <li>
                • <strong>Mouse Events</strong>: onMouseDown, onMouseMove, onMouseUp
              </li>
              <li>
                • <strong>Touch Events</strong>: Support mobile avec onTouch*
              </li>
              <li>
                • <strong>State Management</strong>: Gestion du drawing state
              </li>
              <li>
                • <strong>Shape Preview</strong>: Canvas temporaire pour preview
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const ctx = canvas.getContext('2d');
              </p>
              <p className="text-sm text-gray-600 font-mono">
                ctx.beginPath();
              </p>
              <p className="text-sm text-gray-600 font-mono">
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                ctx.stroke();
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Canvas API - Principales méthodes:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><code>beginPath()</code>: Commence un nouveau chemin</li>
                <li><code>moveTo(x, y)</code>: Déplace le curseur</li>
                <li><code>lineTo(x, y)</code>: Trace une ligne</li>
                <li><code>arc(x, y, r, start, end)</code>: Dessine un arc/cercle</li>
                <li><code>strokeRect(x, y, w, h)</code>: Rectangle vide</li>
                <li><code>fillRect(x, y, w, h)</code>: Rectangle plein</li>
                <li><code>stroke()</code>: Applique le contour</li>
                <li><code>fill()</code>: Applique le remplissage</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Features avancées possibles:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Undo/Redo (sauvegarde d'états)</li>
                <li>Remplissage de formes (fillStyle)</li>
                <li>Texte sur canvas (fillText, strokeText)</li>
                <li>Filtres et effets (blur, brightness)</li>
                <li>Import d'images comme calques</li>
                <li>Export en différents formats (PNG, JPG, SVG)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}