import { supabase } from '../../services/supabase';
import { updateUserSettings } from '../../services/API/userSettings';

export const detectCurrency = () => {
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
      locale: navigator.language,
    },
  });
};
