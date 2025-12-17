import { useState } from 'react';
import type { DragEvent } from 'react';
import { ChevronLeft, Code2, GripVertical, Trash2, Image as ImageIcon, FileText, Music } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
}

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'music';
  size: string;
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function DragAndDropProject({ onBack }: ProjectComponentProps) {
  // ==================== EXEMPLE 1: SIMPLE DRAG & DROP ====================
  const [isDragging, setIsDragging] = useState(false);
  const [droppedItem, setDroppedItem] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    setDroppedItem(data);
    setIsDragging(false);
  };

  // ==================== EXEMPLE 2: KANBAN BOARD ====================
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Créer le design', status: 'todo' },
    { id: '2', title: 'Développer les features', status: 'todo' },
    { id: '3', title: 'Écrire les tests', status: 'inProgress' },
    { id: '4', title: 'Review du code', status: 'inProgress' },
    { id: '5', title: 'Déployer en prod', status: 'done' },
  ]);

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleTaskDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask(taskId);
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  const handleColumnDrop = (e: DragEvent<HTMLDivElement>, status: Task['status']) => {
    e.preventDefault();
    
    if (draggedTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTask ? { ...task, status } : task
        )
      );
    }
  };

  // ==================== EXEMPLE 3: REORDER LIST ====================
  const [items, setItems] = useState([
    { id: '1', text: 'Premier élément' },
    { id: '2', text: 'Deuxième élément' },
    { id: '3', text: 'Troisième élément' },
    { id: '4', text: 'Quatrième élément' },
    { id: '5', text: 'Cinquième élément' },
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleListDragStart = (e: DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleListDragOver = (e: DragEvent<HTMLDivElement>, itemId: string) => {
    e.preventDefault();
    if (draggedItem !== itemId) {
      setDragOverItem(itemId);
    }
  };

  const handleListDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDragOverItem(null);
      return;
    }

    const draggedIdx = items.findIndex(item => item.id === draggedItem);
    const targetIdx = items.findIndex(item => item.id === targetId);

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, removed);

    setItems(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // ==================== EXEMPLE 4: FILE UPLOAD ZONE ====================
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isFileZoneDragging, setIsFileZoneDragging] = useState(false);

  const handleFileZoneDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileZoneDragging(true);
  };

  const handleFileZoneDragLeave = () => {
    setIsFileZoneDragging(false);
  };

  const handleFileZoneDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileZoneDragging(false);

    // Simuler l'ajout de fichiers (dans un vrai cas, utiliser e.dataTransfer.files)
    const mockFile: FileItem = {
      id: Date.now().toString(),
      name: `fichier-${files.length + 1}.pdf`,
      type: 'document',
      size: '2.4 MB'
    };

    setFiles(prev => [...prev, mockFile]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="text-blue-500" size={24} />;
      case 'document': return <FileText className="text-green-500" size={24} />;
      case 'music': return <Music className="text-purple-500" size={24} />;
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Drag & Drop</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Drag & Drop API", "DragEvent", "Interactive UI"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: SIMPLE DRAG & DROP */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Drag & Drop Simple
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Source */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Éléments draggables:</h3>
                  <div className="space-y-2">
                    {['🍎 Pomme', '🍌 Banane', '🍊 Orange'].map((item) => (
                      <div
                        key={item}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 bg-white border-2 border-blue-300 rounded-lg cursor-move hover:bg-blue-50 transition-all ${
                          isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Zone de dépôt:</h3>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`h-full min-h-50 border-4 border-dashed rounded-lg flex items-center justify-center transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {droppedItem ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">{droppedItem}</div>
                        <p className="text-sm text-gray-600">Déposé avec succès !</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Déposez un élément ici</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  draggable | onDragStart | onDragEnd | onDragOver | onDrop
                </p>
                <p>💡 Les bases du Drag & Drop avec les événements HTML5</p>
              </div>
            </div>

            {/* EXEMPLE 2: KANBAN BOARD */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Kanban Board
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {(['todo', 'inProgress', 'done'] as const).map((status) => (
                  <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleColumnDrop(e, status)}
                    className={`bg-white rounded-lg p-4 min-h-75 border-2 transition-all ${
                      draggedTask ? 'border-dashed border-purple-300' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      {status === 'todo' && '📝 À faire'}
                      {status === 'inProgress' && '⚡ En cours'}
                      {status === 'done' && '✅ Terminé'}
                      <span className="text-sm font-normal text-gray-500">
                        ({tasks.filter(t => t.status === status).length})
                      </span>
                    </h3>

                    <div className="space-y-2">
                      {tasks
                        .filter(task => task.status === status)
                        .map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleTaskDragStart(e, task.id)}
                            onDragEnd={handleTaskDragEnd}
                            className={`p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-all border border-gray-200 ${
                              draggedTask === task.id ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GripVertical size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-800">{task.title}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Déplace les tâches entre les colonnes pour changer leur statut</p>
              </div>
            </div>

            {/* EXEMPLE 3: REORDER LIST */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Liste Réordonnée
              </h2>

              <div className="bg-white rounded-lg p-6">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleListDragStart(e, item.id)}
                      onDragOver={(e) => handleListDragOver(e, item.id)}
                      onDrop={(e) => handleListDrop(e, item.id)}
                      className={`p-4 rounded-lg cursor-move transition-all flex items-center gap-3 ${
                        draggedItem === item.id
                          ? 'opacity-50 bg-gray-100'
                          : dragOverItem === item.id
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <GripVertical size={20} className="text-gray-400" />
                      <span className="font-medium text-gray-800">{item.text}</span>
                      <span className="ml-auto text-sm text-gray-500">#{items.indexOf(item) + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Glisse-dépose les éléments pour réorganiser la liste</p>
              </div>
            </div>

            {/* EXEMPLE 4: FILE UPLOAD ZONE */}
            <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Zone de Dépôt de Fichiers
              </h2>

              <div
                onDragOver={handleFileZoneDragOver}
                onDragLeave={handleFileZoneDragLeave}
                onDrop={handleFileZoneDrop}
                className={`border-4 border-dashed rounded-xl p-8 transition-all ${
                  isFileZoneDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    {isFileZoneDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ou cliquez pour sélectionner
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{file.name}</div>
                          <div className="text-xs text-gray-500">{file.size}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 bg-orange-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Clique dans la zone pour simuler l'ajout de fichiers</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-cyan-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-cyan-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>draggable</strong>: Attribut HTML pour rendre un élément draggable
              </li>
              <li>
                • <strong>onDragStart</strong>: Déclenché quand on commence à drag
              </li>
              <li>
                • <strong>onDragEnd</strong>: Déclenché quand on termine le drag
              </li>
              <li>
                • <strong>onDragOver</strong>: Déclenché en survolant une zone (preventDefault requis)
              </li>
              <li>
                • <strong>onDrop</strong>: Déclenché quand on drop dans une zone
              </li>
              <li>
                • <strong>dataTransfer</strong>: API pour transférer des données entre drag/drop
              </li>
              <li>
                • <strong>State Management</strong>: Gestion des positions et états
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                {'<div draggable onDragStart={handleDragStart} />'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'<div onDragOver={handleDragOver} onDrop={handleDrop} />'}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">⚠️ Important:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Toujours appeler <code>e.preventDefault()</code> dans <code>onDragOver</code></li>
                <li>Utiliser <code>dataTransfer</code> pour passer des données</li>
                <li>Gérer les états visuels (isDragging, dragOver)</li>
                <li>Pour mobile, utiliser touch events ou une lib comme react-dnd</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}