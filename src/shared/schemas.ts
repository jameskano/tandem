import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const coupleSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const membershipSchema = z.object({
  user_id: z.string().uuid(),
  couple_id: z.string().uuid(),
  role: z.enum(['owner', 'member']),
  created_at: z.string().datetime(),
})

export const activitySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  emoji: z.string().min(1),
  tags: z.array(z.string()),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  duration: z.number().positive().optional(),
  cost: z.enum(['free', 'low', 'medium', 'high']).optional(),
  location: z.enum(['home', 'outdoor', 'indoor', 'travel']).optional(),
})

export const planSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  start_ts: z.string().datetime(),
  end_ts: z.string().datetime(),
  notes: z.string().optional(),
  activity_id: z.string().uuid().optional(),
  status: z.enum(['planned', 'completed', 'cancelled']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const goalSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  target: z.number().positive(),
  progress: z.number().min(0),
  unit: z.string().min(1),
  deadline: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const momentSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  url: z.string().url(),
  caption: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const notificationTokenSchema = z.object({
  user_id: z.string().uuid(),
  fcm_token: z.string().min(1),
  platform: z.enum(['ios', 'android', 'web']),
  updated_at: z.string().datetime(),
})

export const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_APP_NAME: z.string().default('Tandem'),
})

export type User = z.infer<typeof userSchema>
export type Couple = z.infer<typeof coupleSchema>
export type Membership = z.infer<typeof membershipSchema>
export type Activity = z.infer<typeof activitySchema>
export type Plan = z.infer<typeof planSchema>
export type Goal = z.infer<typeof goalSchema>
export type Moment = z.infer<typeof momentSchema>
export type NotificationToken = z.infer<typeof notificationTokenSchema>
export type Env = z.infer<typeof envSchema>
