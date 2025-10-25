import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Moment } from '../shared/types'

interface MomentsState {
  moments: Moment[]
  addMoment: (moment: Moment) => void
  updateMoment: (id: string, updates: Partial<Moment>) => void
  deleteMoment: (id: string) => void
  getMoment: (id: string) => Moment | undefined
  getMomentsByDate: (date: string) => Moment[]
  getRecentMoments: (limit?: number) => Moment[]
  clearAll: () => void
}

export const useMomentsStore = create<MomentsState>()(
  persist(
    (set, get) => ({
      moments: [],
      addMoment: (moment) => 
        set((state) => ({ 
          moments: [...state.moments, moment] 
        })),
      updateMoment: (id, updates) => 
        set((state) => ({ 
          moments: state.moments.map(moment => 
            moment.id === id ? { ...moment, ...updates, updated_at: new Date().toISOString() } : moment
          ) 
        })),
      deleteMoment: (id) => 
        set((state) => ({ 
          moments: state.moments.filter(moment => moment.id !== id) 
        })),
      getMoment: (id) => 
        get().moments.find(moment => moment.id === id),
      getMomentsByDate: (date) => {
        const targetDate = new Date(date).toDateString()
        return get().moments.filter(moment => 
          new Date(moment.created_at).toDateString() === targetDate
        )
      },
      getRecentMoments: (limit = 10) => 
        get().moments
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit),
      clearAll: () => 
        set({ moments: [] }),
    }),
    {
      name: 'moments-storage',
    }
  )
)
