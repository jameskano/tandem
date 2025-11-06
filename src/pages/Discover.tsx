import React from 'react'
import { Card } from '../features/ui/Card'
import { Button } from '../features/ui/Button'
import { Chip } from '../features/ui/Chip'
import { DiscoverList } from '../features/discover/DiscoverList'
import { useActivitiesStore } from '../state/useActivitiesStore'
import { seedData } from '../shared/seed'
import { useEffect } from 'react'

export const Discover: React.FC = () => {
  const { activities, addActivity } = useActivitiesStore()

  // Load seed data on first visit
  useEffect(() => {
    if (activities.length === 0) {
      seedData.activities.forEach(addActivity)
    }
  }, [activities.length, addActivity])

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Discover</h1>
          <p className="text-textMuted">Find new activities to try together</p>
        </div>

        <DiscoverList />
      </div>
    </div>
  )
}
export default Discover;