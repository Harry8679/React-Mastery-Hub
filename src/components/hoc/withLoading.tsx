import type { ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface WithLoadingProps {
  isLoading: boolean;
}

// HOC withLoading - Affiche un loader pendant le chargement
export function withLoading<P extends object>(Component: ComponentType<P>) {
  return function LoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
            <p className="text-gray-700 text-lg font-semibold">Chargement en cours...</p>
            <p className="text-gray-500 text-sm mt-2">Ce composant est wrappé avec <code className="bg-gray-100 px-2 py-1 rounded">withLoading</code></p>
          </div>
        </div>
      );
    }

    return <Component {...(rest as P)} />;
  };
}