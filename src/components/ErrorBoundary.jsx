import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white font-sans">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
            <span className="text-5xl mb-4 block">⛈️</span>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              An unexpected error occurred while rendering the weather interface.
            </p>
            <button
              onClick={this.handleReset}
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 active:scale-95"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
