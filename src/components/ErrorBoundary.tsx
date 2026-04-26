import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-ink p-6">
          <div className="max-w-2xl w-full bg-surface border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            
            <div className="flex items-center gap-4 mb-6 text-red-500">
              <AlertTriangle size={32} />
              <h1 className="text-2xl font-display font-bold">System Error Detected</h1>
            </div>

            <div className="space-y-4 mb-8">
              <p className="font-medium text-lg">
                Notre bouclier nucléaire a intercepté une erreur d'affichage.
              </p>
              
              {this.state.error && (
                <div className="bg-bg border border-border rounded-xl p-4 overflow-auto max-h-64 font-mono text-xs text-red-400">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
            >
              <RefreshCw size={18} />
              Redémarrer la matrice (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};
