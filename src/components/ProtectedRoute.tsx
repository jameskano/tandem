import { Navigate } from 'react-router-dom';
import { useI18n } from '../shared/i18n/useI18n';
import { useAuthContext } from '../store/context/AuthProvider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
