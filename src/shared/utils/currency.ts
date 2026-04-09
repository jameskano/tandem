import { updateUserSettings } from '../../services/API/userSettings';
import { detectDefaultLocale } from '../../services/API/userSettings';
import { supabase } from '../../services/supabase';
import type { Currency } from '../types/user';

export const detectCurrency = (): Currency => {
  const locale = navigator.language;

  if (locale.startsWith('en-US')) return 'USD';
  return 'EUR';
};

export const syncSettings = async () => {
  const user = (await supabase?.auth.getUser())?.data.user;

  if (!user) return;

  await updateUserSettings({
    userId: user.id,
    patch: {
      currency: detectCurrency(),
      locale: detectDefaultLocale(),
    },
  });
};
