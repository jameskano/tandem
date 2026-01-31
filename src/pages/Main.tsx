import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../assets/main-logo/logo1.png';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import GradientButton from '../shared/ui/GradientButton';

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="px-4 py-8 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <img src={logo1} alt="Tandem Logo" className="mx-auto mb-4 w-20" />
            <h1 className="mb-4 text-4xl font-bold text-text md:text-6xl">
              Find time for us again.
            </h1>
            <p className="text-textMuted mx-auto max-w-2xl text-lg md:text-xl">
              Plan meaningful activities together and create lasting memories as
              a couple.
            </p>
          </div>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <GradientButton size="lg" className="w-full sm:w-auto">
                Register
              </GradientButton>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <div className="mb-3 text-3xl">🎯</div>
              <h3 className="mb-2 text-xl font-semibold text-text">
                Discover New Experiences
              </h3>
              <p className="text-textMuted">
                Find new activities to try together
              </p>
            </Card>

            <Card className="text-center">
              <div className="mb-3 text-3xl">📅</div>
              <h3 className="mb-2 text-xl font-semibold text-text">
                Plan Activities
              </h3>
              <p className="text-textMuted">
                Schedule date nights and special moments in advance
              </p>
            </Card>

            <Card className="text-center">
              <div className="mb-3 text-3xl">📸</div>
              <h3 className="mb-2 text-xl font-semibold text-text">
                Capture Moments
              </h3>
              <p className="text-textMuted">
                Save photos and memories from your time together
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
