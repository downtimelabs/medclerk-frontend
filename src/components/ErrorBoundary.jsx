import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-100 text-dark-900 p-6">
          <div className="max-w-2xl mx-auto bg-white border border-dark-200 rounded-xl p-5 shadow-sm">
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-dark-600 mb-4">Please refresh the page. If the issue persists, share this error with the developer.</p>
            <pre className="text-xs bg-dark-50 p-3 rounded-md overflow-auto whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;


