import React from 'react'
import Card from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import Chip from '../../shared/ui/Chip'
import { useActivitiesStore } from '../../hooks/useActivitiesStore'
import { formatDuration, formatCost, formatDifficulty } from '../../shared/utils/format'

const DiscoverList: React.FC = () => {
  const { 
    activities, 
    saveActivity, 
    skipActivity, 
    isActivitySaved, 
    isActivitySkipped 
  } = useActivitiesStore()

  const handleSave = (activityId: string) => {
    saveActivity(activityId)
  }

  const handleSkip = (activityId: string) => {
    skipActivity(activityId)
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{activity.emoji}</span>
              <div>
                <h3 className="text-lg font-semibold text-text">{activity.title}</h3>
                {activity.description && (
                  <p className="text-textMuted text-sm">{activity.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {activity.tags.map((tag) => (
              <Chip key={tag} variant="default" size="sm">
                {tag}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-textMuted mb-4">
            {activity.duration && (
              <span>⏱️ {formatDuration(activity.duration)}</span>
            )}
            {activity.cost && (
              <span>💰 {formatCost(activity.cost)}</span>
            )}
            {activity.difficulty && (
              <span>💪 {formatDifficulty(activity.difficulty)}</span>
            )}
            {activity.location && (
              <span>📍 {activity.location}</span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant={isActivitySaved(activity.id) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleSave(activity.id)}
              className="flex-1"
            >
              {isActivitySaved(activity.id) ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant={isActivitySkipped(activity.id) ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleSkip(activity.id)}
              className="flex-1"
            >
              {isActivitySkipped(activity.id) ? 'Skipped' : 'Skip'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default DiscoverList
