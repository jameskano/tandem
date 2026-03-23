import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { signInWithEmail, signInWithGoogle } from '../shared/utils/auth';
import ResendEmail from '../components/ResendEmail';

const Login: React.FC = () => {
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

    if (!email) newErrors.email = 'Email is required';

    if (!password) newErrors.password = 'Password is required';

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
      else setErrors({ email: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
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
          Welcome Back
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          Sign in to continue
        </p>
      </div>

      {/* Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
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
                Or continue with
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
            <span className="mr-2">🔵</span>
            Google
          </Button>

          {/* Footer */}
          <div className="text-center">
            <span className="text-sm" style={{ color: COLORS.muted }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold transition-opacity hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                Sign up
              </Link>
            </span>
          </div>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              Forgot password?
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
          Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
