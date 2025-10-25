import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Couple } from '../shared/types'

interface UserState {
  user: User | null
  couple: Couple | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setCouple: (couple: Couple | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      couple: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      setCouple: (couple) => set({ couple }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ 
        user: null, 
        couple: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        couple: state.couple,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
