import type { ComponentType } from 'react';
import { Lock } from 'lucide-react';

interface WithAuthProps {
  isAuthenticated: boolean;
  userRole?: 'user' | 'admin' | 'guest';
}

// HOC withAuth - Protège un composant en vérifiant l'authentification
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  requiredRole?: 'user' | 'admin'
) {
  return function AuthenticatedComponent(props: P & WithAuthProps) {
    const { isAuthenticated, userRole, ...rest } = props;

    // Si pas authentifié
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Accès refusé</h3>
            <p className="text-red-700 mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
              <p>Ce composant est protégé par le HOC <code className="bg-red-100 px-2 py-1 rounded">withAuth</code></p>
            </div>
          </div>
        </div>
      );
    }

    // Si authentifié mais rôle insuffisant
    if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-orange-50 border-2 border-orange-200 rounded-xl p-8 text-center">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Permissions insuffisantes</h3>
            <p className="text-orange-700 mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="bg-white rounded-lg p-4 text-sm">
              <p className="text-gray-700">Rôle requis: <span className="font-bold text-orange-600">{requiredRole}</span></p>
              <p className="text-gray-700">Votre rôle: <span className="font-bold text-gray-600">{userRole}</span></p>
            </div>
          </div>
        </div>
      );
    }

    // Si tout est OK, afficher le composant
    return <Component {...(rest as P)} />;
  };
}