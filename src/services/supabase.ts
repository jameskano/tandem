import { createClient } from '@supabase/supabase-js'

// Create Supabase client only if credentials are available
export const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY 
  ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
  : null
