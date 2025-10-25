import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Activity } from '../shared/types'

interface ActivitiesState {
  activities: Activity[]
  savedActivities: string[]
  skippedActivities: string[]
  addActivity: (activity: Activity) => void
  saveActivity: (activityId: string) => void
  skipActivity: (activityId: string) => void
  removeSavedActivity: (activityId: string) => void
  removeSkippedActivity: (activityId: string) => void
  isActivitySaved: (activityId: string) => boolean
  isActivitySkipped: (activityId: string) => boolean
  getSavedActivities: () => Activity[]
  clearAll: () => void
}

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set, get) => ({
      activities: [],
      savedActivities: [],
      skippedActivities: [],
      addActivity: (activity) => 
        set((state) => ({ 
          activities: [...state.activities, activity] 
        })),
      saveActivity: (activityId) => 
        set((state) => ({ 
          savedActivities: [...state.savedActivities, activityId],
          skippedActivities: state.skippedActivities.filter(id => id !== activityId)
        })),
      skipActivity: (activityId) => 
        set((state) => ({ 
          skippedActivities: [...state.skippedActivities, activityId],
          savedActivities: state.savedActivities.filter(id => id !== activityId)
        })),
      removeSavedActivity: (activityId) => 
        set((state) => ({ 
          savedActivities: state.savedActivities.filter(id => id !== activityId) 
        })),
      removeSkippedActivity: (activityId) => 
        set((state) => ({ 
          skippedActivities: state.skippedActivities.filter(id => id !== activityId) 
        })),
      isActivitySaved: (activityId) => 
        get().savedActivities.includes(activityId),
      isActivitySkipped: (activityId) => 
        get().skippedActivities.includes(activityId),
      getSavedActivities: () => {
        const { activities, savedActivities } = get()
        return activities.filter(activity => savedActivities.includes(activity.id))
      },
      clearAll: () => 
        set({ 
          activities: [], 
          savedActivities: [], 
          skippedActivities: [] 
        }),
    }),
    {
      name: 'activities-storage',
    }
  )
)
