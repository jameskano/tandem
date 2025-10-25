import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Goal } from '../shared/types'

interface GoalsState {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  getGoal: (id: string) => Goal | undefined
  updateProgress: (id: string, progress: number) => void
  getActiveGoals: () => Goal[]
  getCompletedGoals: () => Goal[]
  getGoalsByDeadline: (deadline: string) => Goal[]
  clearAll: () => void
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      addGoal: (goal) => 
        set((state) => ({ 
          goals: [...state.goals, goal] 
        })),
      updateGoal: (id, updates) => 
        set((state) => ({ 
          goals: state.goals.map(goal => 
            goal.id === id ? { ...goal, ...updates, updated_at: new Date().toISOString() } : goal
          ) 
        })),
      deleteGoal: (id) => 
        set((state) => ({ 
          goals: state.goals.filter(goal => goal.id !== id) 
        })),
      getGoal: (id) => 
        get().goals.find(goal => goal.id === id),
      updateProgress: (id, progress) => 
        set((state) => ({ 
          goals: state.goals.map(goal => 
            goal.id === id ? { ...goal, progress, updated_at: new Date().toISOString() } : goal
          ) 
        })),
      getActiveGoals: () => 
        get().goals.filter(goal => goal.progress < goal.target),
      getCompletedGoals: () => 
        get().goals.filter(goal => goal.progress >= goal.target),
      getGoalsByDeadline: (deadline) => 
        get().goals.filter(goal => goal.deadline === deadline),
      clearAll: () => 
        set({ goals: [] }),
    }),
    {
      name: 'goals-storage',
    }
  )
)
