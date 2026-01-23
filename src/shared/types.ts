export type User = {
  id: string
  email: string
  user_metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export type Couple = {
  id: string
  created_at: string
  created_by: string
}

export type Membership = {
  id: string
  couple_id: string
  user_id: string
  created_at: string
}

export type SavedActivity = {
  id: string
  tags: string[]
  couple_id: string
  saved_by: string
  created_at: string
}

export type Plan = {
  id: string
  couple_id: string
  title: string
  start_date_ts: string
  tags: string[]
  notes?: string | null
  status: 'planned' | 'completed'
  created_by: string
  created_at: string
  updated_at: string
}

export type Moment = {
  id: string
  couple_id: string
  image_path: string[]
  caption?: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type UserDevice = {
  id: string
  user_id: string
  platform: 'ios' | 'android'
  token: string
  updated_at: string
}

export type AppState = {
  isAuthenticated: boolean
  isLoading: boolean
}

export type DashboardStats = {
  weeklyActivities: number
  streak: number
  completed: number
  nextPlan?: Plan
}

export type envSchema = {
  VITE_SUPABASE_URL: string,
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: string,
  VITE_APP_NAME: string,
}
