import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import Card from '../shared/ui/Card';
import NotFound from './NotFound';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError() as any;

  const isNotFound =
    error?.status === 404 || /not found/i.test(error?.message || '');

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="px-4 py-6 text-center">
        <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-14" />
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          Oops — an error occurred
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          We ran into a problem. You can try reloading or go back home.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <div>
            <p className="mb-4 text-sm text-gray-600">
              {error?.message ?? 'Unknown error'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded bg-blue-600 px-3 py-2 text-white"
              >
                Reload
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded border px-3 py-2"
              >
                Home
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            If this keeps happening, please contact support.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ErrorPage;
