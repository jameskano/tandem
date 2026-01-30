import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the error to an external service here if you have one
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      return (
        <div
          className="flex min-h-screen items-center justify-center p-6"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <div className="w-full max-w-md rounded bg-white p-6 shadow">
            <h2 className="mb-2 text-lg font-bold">Something went wrong</h2>
            <p className="mb-4 text-sm text-gray-600">
              An unexpected error occurred. You can try reloading the page or go
              back home.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded bg-blue-600 px-3 py-2 text-white"
              >
                Reload
              </button>
              <a href="/" className="rounded border px-3 py-2 text-sm">
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
