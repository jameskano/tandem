import React from 'react'
import { Card } from '../features/ui/Card'
import { Button } from '../features/ui/Button'
import { MomentsGrid } from '../features/moments/MomentsGrid'
import { useMomentsStore } from '../state/useMomentsStore'

export const Moments: React.FC = () => {
  const { moments } = useMomentsStore()

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Moments</h1>
          <p className="text-textMuted">Your shared memories</p>
        </div>

        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text">Photo Gallery</h2>
            <Button>Add Photo</Button>
          </div>

          <MomentsGrid />
        </div>
      </div>
    </div>
  )
}
