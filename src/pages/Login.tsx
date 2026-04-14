import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { signInWithEmail, signInWithGoogle } from '../shared/utils/auth';
import ResendEmail from '../components/ResendEmail';

const Login: React.FC = () => {
  const { t } = useI18n();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isResendEmailVisible, setIsResendEmailVisible] = useState(false);

  useEffect(() => {
    if (errors.email === 'Email not confirmed') setIsResendEmailVisible(true);
    else setIsResendEmailVisible(false);
  }, [errors.email]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = t('auth.emailRequired');

    if (!password) newErrors.password = t('auth.passwordRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signInWithEmail(email, password);

      console.log('Login attempt:', { email, password });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'Email not confirmed')
        setErrors({ email: error.message });
      else if (error.message === 'Invalid login credentials')
        setErrors({ password: error.message, email: error.message });
      else setErrors({ email: t('auth.loginFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error?.message || t('auth.googleAuthFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Header */}
      <div className="px-4 py-6 text-center">
        <Link to="/" className="inline-block">
          <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-14" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          {t('login.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          {t('login.subtitle')}
        </p>
      </div>

      {/* Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('common.email')}
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label={t('common.password')}
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              disabled={isLoading}
            />

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('login.submitting') : t('login.submit')}
            </GradientButton>

            {isResendEmailVisible && <ResendEmail email={email} />}
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: COLORS.muted }}
              />
            </div>
            <div
              className="relative flex justify-center text-sm"
              style={{ color: COLORS.muted }}
            >
              <span className="px-2" style={{ backgroundColor: COLORS.bg }}>
                {t('login.divider')}
              </span>
            </div>
          </div>

          {/* Google Button (placeholder) */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {t('common.google')}
          </Button>

          {/* Footer */}
          <div className="text-center">
            <span className="text-sm" style={{ color: COLORS.muted }}>
              {t('login.noAccount')}{' '}
              <Link
                to="/register"
                className="font-semibold transition-opacity hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                {t('login.signUp')}
              </Link>
            </span>
          </div>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer Links */}
      <div
        className="px-4 py-6 text-center text-xs"
        style={{ color: COLORS.muted }}
      >
        <Link to="/" className="mr-4 hover:underline">
          {t('common.home')}
        </Link>
      </div>
    </div>
  );
};

export default Login;
