import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../assets/main-logo/logo1.png';
import { COLORS } from '../shared/colors';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { signUpWithEmail, signInWithGoogle } from '../shared/utils/auth';
import ConfirmEmail from './ConfirmEmail';

const Register: React.FC = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password);

      console.log('Register attempt:', { email: formData.email });

      setRegisteredEmail(formData.email);
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return <ConfirmEmail email={registeredEmail} />;
  }

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
          {t('register.title')}
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          {t('register.subtitle')}
        </p>
      </div>

      {/* Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <Input
              label={t('common.email')}
              type="email"
              name="email"
              placeholder={t('register.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label={t('common.password')}
              type="password"
              name="password"
              placeholder={t('register.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={
                formData.password ? undefined : t('register.passwordHelper')
              }
              disabled={isLoading}
            />

            <Input
              label={t('common.confirmPassword')}
              type="password"
              name="confirmPassword"
              placeholder={t('register.passwordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <GradientButton
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('register.submitting') : t('register.submit')}
            </GradientButton>
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
                {t('register.divider')}
              </span>
            </div>
          </div>

          {/* Google Button (placeholder) */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            {t('common.google')}
          </Button>

          {/* Footer */}
          <div className="text-center">
            <span className="text-sm" style={{ color: COLORS.muted }}>
              {t('register.alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="font-semibold transition-opacity hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                {t('register.signIn')}
              </Link>
            </span>
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

export default Register;
