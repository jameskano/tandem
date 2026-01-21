import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plan } from '../shared/types'

interface PlansState {
  plans: Plan[]
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, updates: Partial<Plan>) => void
  deletePlan: (id: string) => void
  getPlan: (id: string) => Plan | undefined
  getPlansByDate: (date: string) => Plan[]
  getUpcomingPlans: (limit?: number) => Plan[]
  getCompletedPlans: () => Plan[]
  clearAll: () => void
}

export const usePlansStore = create<PlansState>()(
  persist(
    (set, get) => ({
      plans: [],
      addPlan: (plan) => 
        set((state) => ({ 
          plans: [...state.plans, plan] 
        })),
      updatePlan: (id, updates) => 
        set((state) => ({ 
          plans: state.plans.map(plan => 
            plan.id === id ? { ...plan, ...updates, updated_at: new Date().toISOString() } : plan
          ) 
        })),
      deletePlan: (id) => 
        set((state) => ({ 
          plans: state.plans.filter(plan => plan.id !== id) 
        })),
      getPlan: (id) => 
        get().plans.find(plan => plan.id === id),
      getPlansByDate: (date) => {
        const targetDate = new Date(date).toDateString()
        return get().plans.filter(plan => 
          new Date(plan.start_date_ts).toDateString() === targetDate
        )
      },
      getUpcomingPlans: (limit = 5) => {
        const now = new Date()
        return get().plans
          .filter(plan => new Date(plan.start_date_ts) > now && plan.status === 'planned')
          .sort((a, b) => new Date(a.start_date_ts).getTime() - new Date(b.start_date_ts).getTime())
          .slice(0, limit)
      },
      getCompletedPlans: () => 
        get().plans.filter(plan => plan.status === 'completed'),
      clearAll: () => 
        set({ plans: [] }),
    }),
    {
      name: 'plans-storage',
    }
  )
)
