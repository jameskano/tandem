import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import { useI18n } from '../shared/i18n/useI18n';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { getAuthErrorMessage, updatePassword } from '../shared/utils/auth';

const ResetPassword: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!password) newErrors.password = t('auth.passwordRequired');
    if (!confirmPassword) newErrors.confirm = t('auth.confirmPasswordMissing');
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirm = t('auth.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await updatePassword(password);
      navigate('/login', { state: { message: t('auth.passwordUpdated') } });
    } catch (err: any) {
      setErrors({
        password: getAuthErrorMessage(err, t, 'auth.updatePasswordFailed'),
      });
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
          {t('resetPassword.title')}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('resetPassword.newPassword')}
              type="password"
              placeholder={t('resetPassword.passwordPlaceholder')}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label={t('common.confirmPassword')}
              type="password"
              placeholder={t('resetPassword.passwordPlaceholder')}
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirm: undefined });
              }}
              error={errors.confirm}
              disabled={isLoading}
            />

            <GradientButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('resetPassword.submitting') : t('resetPassword.submit')}
            </GradientButton>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
