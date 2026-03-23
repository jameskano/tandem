import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Currency } from '../../shared/types/user';

type SettingsContextType = {
  currency: Currency;
  locale: string;
  onboardingCompleted: boolean;
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
  const [currency, setCurrency] = useState<Currency>('USD');
  const [locale, setLocale] = useState('en-US');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const value = useMemo(
    () => ({
      currency,
      locale,
      onboardingCompleted,
      setCurrency,
      setLocale,
      setOnboardingCompleted,
    }),
    [currency, locale, onboardingCompleted]
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
