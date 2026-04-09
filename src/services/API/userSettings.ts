import type { Currency, UserSettings } from '../../shared/types/user';
import { supabase } from '../supabase';

export const userSettingsQueryKey = (userId?: string) =>
  ['user-settings', userId] as const;

const detectDefaultCurrency = (): Currency => {
  const locale = navigator.language;

  if (locale.startsWith('en-US')) {
    return 'USD';
  }

  return 'EUR';
};

export const getDefaultUserSettings = (userId: string): UserSettings => ({
  user_id: userId,
  currency: detectDefaultCurrency(),
  locale: navigator.language || 'en-US',
  country: null,
  city: null,
  onboarding_completed: false,
  push_enabled: false,
  reminder_enabled: false,
});

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data as UserSettings;
  }

  const defaults = getDefaultUserSettings(userId);
  const { data: createdSettings, error: createError } = await supabase
    .from('user_settings')
    .upsert(defaults, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (createError) {
    throw createError;
  }

  return createdSettings as UserSettings;
};

type UpdateUserSettingsInput = {
  userId: string;
  patch: Partial<Omit<UserSettings, 'user_id' | 'created_at'>>;
};

export const updateUserSettings = async ({
  userId,
  patch,
}: UpdateUserSettingsInput): Promise<UserSettings> => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: userId,
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as UserSettings;
};
