import React from 'react'
import { Card } from '../features/ui/Card'
import { Button } from '../features/ui/Button'
// import { DashboardSummary } from '../features/dashboard/DashboardSummary'
import { usePlansStore } from '../state/usePlansStore'
import { useGoalsStore } from '../state/useGoalsStore'
import { useActivitiesStore } from '../state/useActivitiesStore'
import { seedData } from '../shared/seed'
import { useEffect } from 'react'

export const Dashboard: React.FC = () => {
  const { plans, addPlan } = usePlansStore()
  const { goals, addGoal } = useGoalsStore()
  const { activities, addActivity } = useActivitiesStore()

  // Load seed data on first visit
  useEffect(() => {
    if (plans.length === 0) {
      seedData.plans.forEach(addPlan)
    }
    if (goals.length === 0) {
      seedData.goals.forEach(addGoal)
    }
    if (activities.length === 0) {
      seedData.activities.forEach(addActivity)
    }
  }, [plans.length, goals.length, activities.length, addPlan, addGoal, addActivity])

  const upcomingPlans = plans
    .filter(plan => new Date(plan.start_ts) > new Date() && plan.status === 'planned')
    .sort((a, b) => new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime())
    .slice(0, 3)

  const activeGoals = goals.filter(goal => goal.progress < goal.target)
  const completedPlans = plans.filter(plan => plan.status === 'completed')

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
          <p className="text-textMuted">Your relationship overview</p>
        </div>

        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {upcomingPlans.length}
                </div>
                <div className="text-sm text-textMuted">Upcoming Plans</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {activeGoals.length}
                </div>
                <div className="text-sm text-textMuted">Active Goals</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {completedPlans.length}
                </div>
                <div className="text-sm text-textMuted">Completed</div>
              </div>
            </Card>
          </div>

          {/* Next Plan */}
          {upcomingPlans.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-text mb-4">Next Up</h2>
              <div className="space-y-3">
                {upcomingPlans.slice(0, 1).map(plan => (
                  <div key={plan.id} className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-text">{plan.title}</h3>
                        <p className="text-sm text-textMuted">
                          {new Date(plan.start_ts).toLocaleDateString()} at{' '}
                          {new Date(plan.start_ts).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                📅 Plan Activity
              </Button>
              <Button variant="outline" className="justify-start">
                🎯 Set Goal
              </Button>
              <Button variant="outline" className="justify-start">
                📸 Add Photo
              </Button>
              <Button variant="outline" className="justify-start">
                🔍 Discover
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
