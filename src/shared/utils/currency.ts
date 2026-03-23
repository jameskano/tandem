import { supabase } from '../../services/supabase';

export const detectCurrency = () => {
  const locale = navigator.language;

  if (locale.startsWith('en-US')) return 'USD';
  return 'EUR';
};

export const syncSettings = async () => {
  const user = (await supabase?.auth.getUser())?.data.user;

  if (!user) return;

  await supabase
    ?.from('user_settings')
    .update({
      currency: detectCurrency(),
      locale: navigator.language,
    })
    .eq('user_id', user.id);
};
