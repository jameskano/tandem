import React from 'react'
import { Card } from '../features/ui/Card'
import { Button } from '../features/ui/Button'
import { GoalsList } from '../features/goals/GoalsList'
import { useGoalsStore } from '../state/useGoalsStore'
import { seedData } from '../shared/seed'
import { useEffect } from 'react'

export const Goals: React.FC = () => {
  const { goals, addGoal } = useGoalsStore()

  // Load seed data on first visit
  useEffect(() => {
    if (goals.length === 0) {
      seedData.goals.forEach(addGoal)
    }
  }, [goals.length, addGoal])

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Goals</h1>
          <p className="text-textMuted">Track your progress together</p>
        </div>

        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text">Your Goals</h2>
            <Button>Add Goal</Button>
          </div>

          <GoalsList />
        </div>
      </div>
    </div>
  )
}

export default Goals