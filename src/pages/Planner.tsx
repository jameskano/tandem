import React from 'react'
import { Card } from '../features/ui/Card'
import { Button } from '../features/ui/Button'
import { PlannerGrid } from '../features/planner/PlannerGrid'
import { usePlansStore } from '../state/usePlansStore'
import { seedData } from '../shared/seed'
import { useEffect } from 'react'

export const Planner: React.FC = () => {
  const { plans, addPlan } = usePlansStore()

  // Load seed data on first visit
  useEffect(() => {
    if (plans.length === 0) {
      seedData.plans.forEach(addPlan)
    }
  }, [plans.length, addPlan])

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Planner</h1>
          <p className="text-textMuted">Schedule your activities together</p>
        </div>

        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text">This Month</h2>
            <Button>Add Plan</Button>
          </div>

          <PlannerGrid />
        </div>
      </div>
    </div>
  )
}
