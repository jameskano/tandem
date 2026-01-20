import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo1 from '../assets/main-logo/logo1.png'
import { COLORS } from '../shared/colors'
import GradientButton from '../ui/GradientButton'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      // TODO: Implement Supabase registration
      console.log('Register attempt:', { email: formData.email })
      // navigate('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ email: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    // TODO: Implement Google sign up
    console.log('Google register clicked')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="px-4 py-6 text-center">
        <Link to="/" className="inline-block">
          <img src={logo1} alt="Tandem Logo" className="w-14 mx-auto mb-4" />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Create Account</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.muted }}>Join us to start your journey</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                formData.password
                  ? undefined
                  : 'At least 6 characters with uppercase, lowercase, and number'
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

            <GradientButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </GradientButton>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: COLORS.muted }} />
            </div>
            <div className="relative flex justify-center text-sm" style={{ color: COLORS.muted }}>
              <span className="px-2" style={{ backgroundColor: COLORS.bg }}>Or sign up with</span>
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
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: COLORS.primary }}
              >
                Sign in
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

export default Register
