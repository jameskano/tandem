import { useQuery } from '@tanstack/react-query';
import {
  getUserSettings,
  userSettingsQueryKey,
} from '../services/API/userSettings';
import { supabase } from '../services/supabase';
import { useAuthContext } from '../store/context/AuthProvider';

export const useUserSettingsQuery = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: userSettingsQueryKey(user?.id),
    queryFn: () => getUserSettings(user!.id),
    enabled: Boolean(user?.id && supabase),
  });
};
