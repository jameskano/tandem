import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COLORS } from '../shared/colors'
import GradientButton from '../ui/GradientButton'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import logo1 from '../assets/main-logo/logo1.png'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      // TODO: Implement Supabase login
      console.log('Login attempt:', { email, password })
      // navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ email: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login clicked')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="px-4 py-6 text-center">
        <Link to="/" className="inline-block">
          <img src={logo1} alt="Tandem Logo" className="w-14 mx-auto mb-4" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Welcome Back</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Sign in to continue</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors({ ...errors, email: undefined })
              }}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors({ ...errors, password: undefined })
              }}
              error={errors.password}
              disabled={isLoading}
            />

            <GradientButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </GradientButton>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: COLORS.muted }} />
            </div>
            <div className="relative flex justify-center text-sm" style={{ color: COLORS.muted }}>
              <span className="px-2" style={{ backgroundColor: COLORS.bg }}>Or continue with</span>
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
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: COLORS.primary }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </Card>
      </div>

      {/* Footer Links */}
      <div className="px-4 py-6 text-center text-xs" style={{ color: COLORS.muted }}>
        <Link to="/" className="hover:underline mr-4">
          Home
        </Link>
      </div>
    </div>
  )
}

export default Login
