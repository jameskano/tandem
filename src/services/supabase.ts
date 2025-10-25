import { createClient } from '@supabase/supabase-js'
import { envSchema } from '../shared/schemas'

// Validate environment variables
const env = envSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Tandem',
})

// Create Supabase client only if credentials are available
export const supabase = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY 
  ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  : null

export { env }
