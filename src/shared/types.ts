export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Couple {
  id: string
  created_at: string
  updated_at: string
}

export interface Membership {
  user_id: string
  couple_id: string
  role: 'owner' | 'member'
  created_at: string
}

export interface Activity {
  id: string
  title: string
  emoji: string
  tags: string[]
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  duration?: number // in minutes
  cost?: 'free' | 'low' | 'medium' | 'high'
  location?: 'home' | 'outdoor' | 'indoor' | 'travel'
}

export interface Plan {
  id: string
  couple_id: string
  title: string
  description?: string
  start_ts: string
  end_ts: string
  notes?: string
  activity_id?: string
  status: 'planned' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  couple_id: string
  title: string
  description?: string
  target: number
  progress: number
  unit: string
  deadline?: string
  created_at: string
  updated_at: string
}

export interface Moment {
  id: string
  couple_id: string
  url: string
  caption?: string
  created_at: string
  updated_at: string
}

export interface NotificationToken {
  user_id: string
  fcm_token: string
  platform: 'ios' | 'android' | 'web'
  updated_at: string
}

export interface AppState {
  user: User | null
  couple: Couple | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface DashboardStats {
  weeklyActivities: number
  streak: number
  completed: number
  nextPlan?: Plan
}

export interface DiscoverActivity extends Activity {
  isSaved: boolean
  isSkipped: boolean
}
