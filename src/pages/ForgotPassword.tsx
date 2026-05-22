import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { getAuthErrorMessage, resetPassword } from '../shared/utils/auth';

const ForgotPassword: React.FC = () => {
  const { t } = useI18n();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmail('');
      toast.success(t('forgotPassword.success'));
    } catch (err: any) {
      setError(getAuthErrorMessage(err, t, 'auth.resetEmailFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="px-4 py-6 text-center">
        <Link to="/" className="inline-block">
          <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-14" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          {t('forgotPassword.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          {t('forgotPassword.subtitle')}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('common.email')}
              aria-label={t('common.email')}
              type="email"
              placeholder={t('forgotPassword.emailPlaceholder')}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
              disabled={isLoading}
            />

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
            </GradientButton>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
