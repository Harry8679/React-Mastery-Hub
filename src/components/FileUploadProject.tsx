import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { ChevronLeft, Code2, Upload, X, File, Image as ImageIcon, FileText, Music, Video, Check, Loader2 } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// ==================== UTILS ====================
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function FileUploadProject({ onBack }: ProjectComponentProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simuler l'upload avec progression
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
      } else {
        setFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.round(progress) }
              : f
          )
        );
      }
    }, 200);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = Array.from(fileList).map(file => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: 'uploading',
      };

      // Créer preview pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev =>
            prev.map(f =>
              f.id === uploadedFile.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      // Simuler l'upload
      simulateUpload(uploadedFile.id);

      return uploadedFile;
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const completedFiles = files.filter(f => f.status === 'completed').length;
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">File Upload</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Drag & Drop", "File Preview", "Progress"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{files.length}</div>
              <div className="text-sm text-blue-700">Fichiers total</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{completedFiles}</div>
              <div className="text-sm text-green-700">Complétés</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{formatFileSize(totalSize)}</div>
              <div className="text-sm text-purple-700">Taille totale</div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-xl p-12 text-center transition-all mb-6 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400'
            }`}
          >
            <Upload
              className={`mx-auto mb-4 transition-all ${
                isDragging ? 'text-blue-500 scale-110' : 'text-gray-400'
              }`}
              size={64}
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
            </h3>
            <p className="text-gray-600 mb-4">
              ou
            </p>
            <button
              onClick={handleBrowseClick}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Parcourir les fichiers
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            <p className="text-sm text-gray-500 mt-4">
              Formats supportés: Images, Vidéos, Audio, PDF, Documents
            </p>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Fichiers ({files.length})
                </h3>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Tout supprimer
                </button>
              </div>

              <div className="space-y-3">
                {files.map((uploadedFile) => {
                  const Icon = getFileIcon(uploadedFile.file.type);
                  const isImage = uploadedFile.file.type.startsWith('image/');

                  return (
                    <div
                      key={uploadedFile.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Preview or Icon */}
                        <div className="flex-shrink-0">
                          {isImage && uploadedFile.preview ? (
                            <img
                              src={uploadedFile.preview}
                              alt={uploadedFile.file.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
                              <Icon className="text-gray-600" size={32} />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {uploadedFile.file.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatFileSize(uploadedFile.file.size)}
                                {uploadedFile.file.type && (
                                  <span className="ml-2 text-gray-500">
                                    • {uploadedFile.file.type.split('/')[1].toUpperCase()}
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Status Icon */}
                            <div className="ml-4">
                              {uploadedFile.status === 'uploading' && (
                                <Loader2 className="text-blue-500 animate-spin" size={20} />
                              )}
                              {uploadedFile.status === 'completed' && (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="text-white" size={16} />
                                </div>
                              )}
                              {uploadedFile.status === 'error' && (
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <X className="text-white" size={16} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {uploadedFile.status === 'uploading' && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Upload en cours...</span>
                                <span className="text-xs font-semibold text-blue-600">
                                  {uploadedFile.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadedFile.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Completed */}
                          {uploadedFile.status === 'completed' && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Check size={16} />
                              <span>Upload terminé</span>
                            </div>
                          )}

                          {/* Error */}
                          {uploadedFile.status === 'error' && (
                            <div className="text-sm text-red-600">
                              Erreur: {uploadedFile.error || 'Upload échoué'}
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="text-red-500" size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {files.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aucun fichier uploadé
              </h3>
              <p className="text-gray-600">
                Commencez par glisser-déposer ou parcourir vos fichiers
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="mt-8 bg-cyan-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-cyan-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Drag & Drop Events</strong>: onDragEnter, onDragOver, onDrop
              </li>
              <li>
                • <strong>FileReader API</strong>: Création de preview pour images
              </li>
              <li>
                • <strong>useRef</strong>: Référence au input file caché
              </li>
              <li>
                • <strong>Progress Simulation</strong>: setInterval pour simuler l'upload
              </li>
              <li>
                • <strong>File Validation</strong>: Type checking et formatting
              </li>
              <li>
                • <strong>State Management</strong>: Gestion complexe des fichiers
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const reader = new FileReader();
              </p>
              <p className="text-sm text-gray-600 font-mono">
                reader.readAsDataURL(file);
              </p>
              <p className="text-sm text-gray-600 font-mono">
                onDrop={(e) =&gt; handleFiles(e.dataTransfer.files)}
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Features:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Drag & drop intuitif avec feedback visuel</li>
                <li>Preview automatique pour les images</li>
                <li>Barre de progression pour chaque fichier</li>
                <li>Icônes adaptées selon le type de fichier</li>
                <li>Statistiques en temps réel</li>
                <li>Support de multiple files</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Dans une vraie app:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Upload réel vers un serveur (FormData, axios)</li>
                <li>Validation de taille et type côté serveur</li>
                <li>Génération de thumbnails</li>
                <li>Stockage cloud (S3, Cloudinary)</li>
                <li>Gestion des erreurs réseau</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}