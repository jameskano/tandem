import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useGoalsStore } from '../../state/useGoalsStore'
import { formatProgress } from '../../shared/utils/format'

export const GoalsList: React.FC = () => {
  const { goals, updateProgress } = useGoalsStore()

  const handleProgressUpdate = (goalId: string, increment: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      const newProgress = Math.max(0, Math.min(goal.target, goal.progress + increment))
      updateProgress(goalId, newProgress)
    }
  }

  if (goals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-text mb-2">No goals yet</h3>
        <p className="text-textMuted mb-4">Create your first goal to start tracking progress together</p>
        <Button>Add Goal</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progressPercentage = (goal.progress / goal.target) * 100
        const isCompleted = goal.progress >= goal.target

        return (
          <Card key={goal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text mb-1">{goal.title}</h3>
                {goal.description && (
                  <p className="text-textMuted text-sm mb-2">{goal.description}</p>
                )}
                <div className="text-sm text-textMuted">
                  {formatProgress(goal.progress, goal.target)}
                </div>
              </div>
              {isCompleted && (
                <div className="text-2xl">🎉</div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Progress Controls */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProgressUpdate(goal.id, -1)}
                disabled={goal.progress <= 0}
              >
                -1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProgressUpdate(goal.id, 1)}
                disabled={goal.progress >= goal.target}
              >
                +1
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleProgressUpdate(goal.id, 5)}
                disabled={goal.progress >= goal.target}
              >
                +5
              </Button>
            </div>

            {goal.deadline && (
              <div className="mt-3 text-xs text-textMuted">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
