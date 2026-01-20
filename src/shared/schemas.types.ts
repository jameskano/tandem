export type User = {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type Couple = {
  id: string
  created_at: string
  updated_at: string
}

export type Membership = {
  user_id: string
  couple_id: string
  role: 'owner' | 'member'
  created_at: string
}

export type Activity = {
  id: string
  title: string
  emoji: string
  tags: string[]
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  duration?: number
  cost?: 'free' | 'low' | 'medium' | 'high'
  location?: 'home' | 'outdoor' | 'indoor' | 'travel'
}

export type Plan = {
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

export type Moment = {
  id: string
  couple_id: string
  url: string
  caption?: string
  created_at: string
  updated_at: string
}

export type NotificationToken = {
  user_id: string
  fcm_token: string
  platform: 'ios' | 'android' | 'web'
  updated_at: string
}

export type Env = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string
  VITE_APP_NAME?: string
}
