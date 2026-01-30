import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../shared/colors';
import logo1 from '../assets/main-logo/logo1.png';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';
import Input from '../shared/ui/Input';
import { resetPassword } from '../shared/utils/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
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
          Reset Password
        </h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          {success && (
            <div
              className="rounded p-4 text-sm"
              style={{ backgroundColor: '#d4edda', color: '#155724' }}
            >
              Check your email for password reset instructions.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              aria-label="email"
              type="email"
              placeholder="you@example.com"
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
              {isLoading ? 'Sending...' : 'Send Reset Email'}
            </GradientButton>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
