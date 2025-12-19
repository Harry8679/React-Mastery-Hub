import { useState, useEffect } from 'react';
import { ChevronLeft, Code2, X, ChevronRight, ChevronLeft as ChevronLeftIcon, Search, Grid3x3, Grid2x2, Image as ImageIcon, Download } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Image {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
  category: string;
  author: string;
  likes: number;
}

// ==================== MOCK DATA ====================
const IMAGES: Image[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: 'Mountain Landscape',
    category: 'Nature',
    author: 'John Doe',
    likes: 234,
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    title: 'Golden Retriever',
    category: 'Animals',
    author: 'Jane Smith',
    likes: 456,
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
    title: 'City Skyline',
    category: 'Urban',
    author: 'Mike Johnson',
    likes: 189,
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400',
    title: 'Ocean Waves',
    category: 'Nature',
    author: 'Sarah Lee',
    likes: 567,
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    title: 'Cute Puppy',
    category: 'Animals',
    author: 'Tom Brown',
    likes: 890,
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
    title: 'Night City',
    category: 'Urban',
    author: 'Emily Chen',
    likes: 345,
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: 'Forest Path',
    category: 'Nature',
    author: 'David Wilson',
    likes: 432,
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    title: 'Cat Portrait',
    category: 'Animals',
    author: 'Lisa Anderson',
    likes: 678,
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    title: 'Urban Street',
    category: 'Urban',
    author: 'Chris Martin',
    likes: 234,
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
    title: 'Sunset Beach',
    category: 'Nature',
    author: 'Anna Garcia',
    likes: 789,
  },
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    title: 'Adorable Kitten',
    category: 'Animals',
    author: 'Robert Taylor',
    likes: 923,
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
    title: 'Downtown',
    category: 'Urban',
    author: 'Jennifer White',
    likes: 456,
  },
];

// ==================== COMPOSANTS ====================

// Image Card
interface ImageCardProps {
  image: Image;
  onClick: () => void;
}

function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={image.thumbnail}
        alt={image.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1">{image.title}</h3>
          <div className="flex items-center justify-between text-sm">
            <span>By {image.author}</span>
            <span>❤️ {image.likes}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-full text-xs font-semibold">
        {image.category}
      </div>
    </div>
  );
}

// Lightbox
interface LightboxProps {
  images: Image[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

function Lightbox({ images, currentIndex, onClose, onNext, onPrevious }: LightboxProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `${currentImage.title}.jpg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronLeftIcon size={32} className="text-white" />
      </button>

      {/* Image */}
      <div className="max-w-5xl w-full">
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />

        {/* Info */}
        <div className="mt-4 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">{currentImage.title}</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
            <span>By {currentImage.author}</span>
            <span>•</span>
            <span>{currentImage.category}</span>
            <span>•</span>
            <span>❤️ {currentImage.likes} likes</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Download size={18} />
              Télécharger
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 text-center text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentIndex === images.length - 1}
        className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronRight size={32} className="text-white" />
      </button>
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function ImageGalleryProject({ onBack }: ProjectComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('small');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(IMAGES.map((img) => img.category)))];

  const filteredImages = IMAGES.filter((img) => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const previousImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🖼️ Image Gallery</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Gallery", "Lightbox", "Filters"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre ou auteur..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Grid Size */}
              <div className="flex gap-2">
                <button
                  onClick={() => setGridSize('small')}
                  className={`p-2 rounded-lg transition-all ${
                    gridSize === 'small'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Petite grille"
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setGridSize('large')}
                  className={`p-2 rounded-lg transition-all ${
                    gridSize === 'large'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Grande grille"
                >
                  <Grid2x2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  {filteredImages.length} image{filteredImages.length > 1 ? 's' : ''} trouvée{filteredImages.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCategory !== 'All' && `Catégorie: ${selectedCategory}`}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredImages.length > 0 ? (
            <div
              className={`grid gap-4 mb-8 ${
                gridSize === 'small'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {filteredImages.map((image, index) => (
                <ImageCard key={image.id} image={image} onClick={() => openLightbox(index)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Aucune image trouvée</p>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-gray-500" />
              Concepts Image Gallery :
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Grid Layout</strong>: Responsive grid avec 2 tailles
              </li>
              <li>
                • <strong>Lightbox</strong>: Modal plein écran avec navigation
              </li>
              <li>
                • <strong>Filters</strong>: Catégories et recherche
              </li>
              <li>
                • <strong>Keyboard Navigation</strong>: Esc, ←, → dans lightbox
              </li>
              <li>
                • <strong>Hover Effects</strong>: Zoom et overlay info
              </li>
              <li>
                • <strong>Image Optimization</strong>: Thumbnails + full size
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const filteredImages = images.filter(img =&gt;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                matchesCategory && matchesSearch
              </p>
              <p className="text-sm text-gray-600 font-mono">
                );
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">💡 Features:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Lightbox avec navigation clavier (←, →, Esc)</li>
                <li>Filtrage par catégorie</li>
                <li>Recherche en temps réel</li>
                <li>2 tailles de grille (3x4 ou 2x3)</li>
                <li>Téléchargement d'images</li>
                <li>Compteur de likes</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">🎯 Use Cases:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Portfolio photographe</li>
                <li>E-commerce (produits)</li>
                <li>Site immobilier</li>
                <li>Galerie d'art</li>
                <li>Blog voyage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </div>
  );
}