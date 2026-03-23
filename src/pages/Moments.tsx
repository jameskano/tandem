import React from 'react';
import MomentsGrid from '../components/MomentsGrid';
import { useMomentsStore } from '../hooks/useMomentsStore';
import Button from '../shared/ui/Button';

const Moments: React.FC = () => {
  const { moments } = useMomentsStore();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-text">Moments</h1>
          <p className="text-textMuted">Your shared memories</p>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">Photo Gallery</h2>
            <Button>Add Photo</Button>
          </div>

          <MomentsGrid />
        </div>
      </div>
    </div>
  );
};

export default Moments;
