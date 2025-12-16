import { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Mise à jour de l'état pour afficher le fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Logger l'erreur
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Mettre à jour l'état avec les détails
    this.setState({
      error,
      errorInfo
    });

    // Callback optionnel
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback personnalisé ou par défaut
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.resetError);
      }

      // UI par défaut
      return (
        <div className="min-h-100 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500 p-3 rounded-full">
                <AlertTriangle className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800">Une erreur est survenue</h2>
                <p className="text-red-700">Le composant a rencontré une erreur inattendue</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-800 mb-2">Message d'erreur:</h3>
                <pre className="text-sm text-red-600 overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {this.state.errorInfo && (
              <details className="bg-white rounded-lg p-4 mb-4">
                <summary className="font-bold text-gray-800 cursor-pointer">
                  Stack trace (cliquez pour voir)
                </summary>
                <pre className="text-xs text-gray-600 mt-2 overflow-x-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.resetError}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}