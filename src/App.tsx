import { useState } from 'react';
import CounterProject from './components/CounterProject';
import ClockProject from './components/ClockProject';
import FormProject from './components/FormProject';
import TodoListProject from './components/TodoListProject';
import ThemeContextProject from './context/ThemeContextProject';
import HomePage from './pages/Home';
import UseReducerProject from './components/UseReducerProject';
import CustomHookProject from './components/CustomHookProject';
import UseRefProject from './components/UseRefProject';
import UseMemoProject from './components/UseMemoProject';
import UseCallbackProject from './components/UseCallbackProject';
import PortalsProject from './components/PortalsProject';
import ErrorBoundaryProject from './components/ErrorBoundaryProject';
import LazyLoadingProject from './components/LazyLoadingProject';
import HOCProject from './components/HOCProject';
import RenderPropsProject from './components/RenderPropsProject';

function App() {
  const [currentProject, setCurrentProject] = useState<number | null>(null);

  const handleBack = () => setCurrentProject(null);

  // Router simple basé sur l'ID du projet
  const renderProject = () => {
    switch (currentProject) {
      case 1:
        return <CounterProject onBack={handleBack} />;
      case 2:
        return <ClockProject onBack={handleBack} />;
      case 3:
        return <FormProject onBack={handleBack} />;
      case 4:
        return <TodoListProject onBack={handleBack} />;
      case 5:
        return <ThemeContextProject onBack={handleBack} />;
      case 6:
        return <UseReducerProject onBack={handleBack} />
      case 7:
        return <CustomHookProject onBack={handleBack} />
      case 8:
        return <UseRefProject onBack={handleBack} />
      case 9:
        return <UseMemoProject onBack={handleBack} />
      case 10:
        return <UseCallbackProject onBack={handleBack} />
      case 11:
        return <PortalsProject onBack={handleBack} />
      case 12:
        return <ErrorBoundaryProject onBack={handleBack} />;
      case 13:
        return <LazyLoadingProject onBack={handleBack} />
      case 14:
        return <HOCProject onBack={handleBack} />
      case 15:
        return <RenderPropsProject onBack={handleBack} />
      default:
        return <PlaceholderProject projectId={currentProject!} onBack={handleBack} />;
    }
  };

  if (currentProject) {
    return renderProject();
  }

  return <HomePage onSelectProject={setCurrentProject} />;
}

// Composant placeholder pour les projets non implémentés
function PlaceholderProject({ projectId, onBack }: { projectId: number; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <span>←</span>
        Retour à l'accueil
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Projet #{projectId}
        </h1>
        <p className="text-gray-600 mb-8">
          Ce projet sera implémenté prochainement !
        </p>
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-gray-700">
            Tu peux ajouter ton propre code ici pour implémenter ce projet.
            Chaque projet suit la même structure modulaire.
          </p>
          <p className="text-gray-700 mt-4">
            Crée un nouveau fichier dans <code className="bg-gray-200 px-2 py-1 rounded">src/projects/</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;