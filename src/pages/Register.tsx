import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo1 from '../assets/main-logo/logo1.png';
import { COLORS } from '../shared/colors';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { signUpWithEmail, signInWithGoogle } from '../shared/utils/auth';
import ConfirmEmail from './ConfirmEmail';

const Register: React.FC = () => {
  const navigate = useNavigate();
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
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
          Create Account
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          Join us to start your journey
        </p>
      </div>

      {/* Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={
                formData.password ? undefined : 'At least 8 characters'
              }
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
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
              {isLoading ? 'Creating account...' : 'Create Account'}
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
                Or sign up with
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
            <span className="mr-2">🔵</span>
            Google
          </Button>

          {/* Footer */}
          <div className="text-center">
            <span className="text-sm" style={{ color: COLORS.muted }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold transition-opacity hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                Sign in
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
          Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
