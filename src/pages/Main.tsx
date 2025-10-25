import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../features/ui/Button'
import { GradientButton } from '../features/ui/GradientButton'
import { Card } from '../features/ui/Card'
import { Heart, Sparkles } from '../shared/icons'

export const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Heart className="mx-auto text-primary mb-4" size={64} />
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-4">
              Find time for us again.
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
              Plan meaningful activities together, track your progress, and create lasting memories as a couple.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/discover">
              <GradientButton size="lg" className="w-full sm:w-auto">
                <Sparkles className="mr-2" size={20} />
                Discover Activities
              </GradientButton>
            </Link>
            <Link to="/settings">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sync with your partner
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-text mb-2">Set Goals</h3>
              <p className="text-textMuted">
                Create shared goals and track your progress together
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-xl font-semibold text-text mb-2">Plan Activities</h3>
              <p className="text-textMuted">
                Schedule date nights and special moments in advance
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-xl font-semibold text-text mb-2">Capture Moments</h3>
              <p className="text-textMuted">
                Save photos and memories from your time together
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
