import { z } from 'zod'

export const coupleSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  created_by: z.string().uuid(),
})

export const membershipSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
})

export const savedActivitySchema = z.object({
  id: z.string().uuid(),
  tags: z.array(z.string()),
  couple_id: z.string().uuid(),
  saved_by: z.string().uuid(),
  created_at: z.string().datetime(),
})

export const planSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  title: z.string().min(1),
  start_date_ts: z.string().datetime(),
  tags: z.array(z.string()),
  notes: z.string().nullable().optional(),
  status: z.enum(['planned', 'completed']),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const momentSchema = z.object({
  id: z.string().uuid(),
  couple_id: z.string().uuid(),
  image_path: z.array(z.string()),
  caption: z.string().nullable().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const userDeviceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  platform: z.enum(['ios', 'android']),
  token: z.string().min(1),
  updated_at: z.string().datetime(),
})

export const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1).optional(),
  VITE_APP_NAME: z.string().default('Tandem'),
})

export type Couple = z.infer<typeof coupleSchema>
export type Membership = z.infer<typeof membershipSchema>
export type SavedActivity = z.infer<typeof savedActivitySchema>
export type Plan = z.infer<typeof planSchema>
export type Moment = z.infer<typeof momentSchema>
export type UserDevice = z.infer<typeof userDeviceSchema>
export type Env = z.infer<typeof envSchema>
