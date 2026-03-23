import React, { useEffect } from 'react';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import { supabase } from '../services/supabase';
import { syncSettings } from '../shared/utils/currency';

type OnboardingModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onComplete: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  isSubmitting = false,
  onComplete,
}) => {
  useEffect(() => {
    syncSettings();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discover-onboarding-title"
    >
      <Card
        padding="lg"
        shadow="lg"
        className="w-full max-w-md space-y-5 border-gray-200"
      >
        <div className="space-y-2">
          <h2
            id="discover-onboarding-title"
            className="text-center text-2xl font-bold text-primary"
          >
            Welcome to Tandem
          </h2>
          <p className="text-textMuted text-sm leading-6">
            A simple way to discover, save, and plan meaningful time together.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-bg p-4">
          <ul className="text-textMuted space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span>Get ideas that match your mood, time, and budget</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Save your favorites for later</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Plan moments together</span>
            </li>
          </ul>
        </div>

        <Button
          size="md"
          className="w-full"
          disabled={isSubmitting}
          onClick={onComplete}
        >
          {isSubmitting ? 'Saving...' : 'Get started'}
        </Button>
      </Card>
    </div>
  );
};

export default OnboardingModal;
