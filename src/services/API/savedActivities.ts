import { supabase } from '../supabase';

export const getSavedActivities = (userId: string) =>
  supabase?.from('saved_activities').select('*').eq('user_id', userId);
