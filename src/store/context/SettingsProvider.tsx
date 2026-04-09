import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Currency } from '../../shared/types/user';
import { useUserSettingsQuery } from '../../hooks/useUserSettingsQuery';
import { useAuthContext } from './AuthProvider';

type SettingsContextType = {
  currency: Currency;
  locale: string;
  onboardingCompleted: boolean;
  isSettingsLoading: boolean;
  setCurrency: Dispatch<SetStateAction<Currency>>;
  setLocale: Dispatch<SetStateAction<string>>;
  setOnboardingCompleted: Dispatch<SetStateAction<boolean>>;
};

const SettingsContext = createContext({} as SettingsContextType);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuthContext();
  const { data: userSettings, isLoading, isFetching } = useUserSettingsQuery();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [locale, setLocale] = useState('en-US');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      setCurrency('USD');
      setLocale('en-US');
      setOnboardingCompleted(false);
      return;
    }

    if (!userSettings) {
      return;
    }

    setCurrency(userSettings.currency);
    setLocale(userSettings.locale);
    setOnboardingCompleted(userSettings.onboarding_completed);
  }, [user, userSettings]);

  const value = useMemo(
    () => ({
      currency,
      locale,
      onboardingCompleted,
      isSettingsLoading: Boolean(user) && (isLoading || isFetching),
      setCurrency,
      setLocale,
      setOnboardingCompleted,
    }),
    [currency, isFetching, isLoading, locale, onboardingCompleted, user]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettingsContext must be used within SettingsProvider');
  return context;
};
