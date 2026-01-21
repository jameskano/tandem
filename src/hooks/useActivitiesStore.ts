import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ActivitiesState {
  savedActivities: string[]
  skippedActivities: string[]
  saveActivity: (activityId: string) => void
  skipActivity: (activityId: string) => void
  removeSavedActivity: (activityId: string) => void
  removeSkippedActivity: (activityId: string) => void
  isActivitySaved: (activityId: string) => boolean
  isActivitySkipped: (activityId: string) => boolean
  clearAll: () => void
}

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set, get) => ({
      activities: [],
      savedActivities: [],
      skippedActivities: [],
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
      clearAll: () => 
        set({  
          savedActivities: [], 
          skippedActivities: [] 
        }),
    }),
    {
      name: 'activities-storage',
    }
  )
)
