import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
          <div className="p-1 rounded-full bg-red-500/10 mb-6">
            <div className="p-3 rounded-full bg-red-500/20 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Micro-Frontend Connection Failed</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            We couldn't connect to the Authentication application. This usually happens if the remote server isn't running or the build entry is missing.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all"
             >
               Retry Connection
             </button>
             <a 
                href="http://localhost:3001/assets/remoteEntry.js" 
                target="_blank"
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-all"
             >
               Verify Auth Server
             </a>
          </div>
          <div className="mt-12 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left w-full max-w-2xl overflow-auto">
             <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Debug Info</p>
             <code className="text-xs text-red-400/80 bg-black/30 p-2 rounded block">
               {this.state.error?.message || "Internal Chunk Load Error"}
             </code>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
