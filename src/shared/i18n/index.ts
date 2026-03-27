import { useSettingsContext } from '../../store/context/SettingsProvider';
import en from './locales/en';
import es from './locales/es';
import type {
  AppLanguage,
  TranslationRecord,
  TranslationValue,
} from './types';

export const translations = {
  en,
  es,
} as const;

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export const resolveAppLanguage = (locale?: string): AppLanguage => {
  const normalized =
    locale ??
    (typeof navigator !== 'undefined' ? navigator.language : undefined) ??
    'en-US';

  return normalized.toLowerCase().startsWith('es') ? 'es' : 'en';
};

export const getTranslationValue = (
  source: TranslationRecord,
  path: string
): TranslationValue | undefined => {
  return path.split('.').reduce<TranslationValue | undefined>((current, key) => {
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      key in current
    ) {
      return current[key];
    }

    return undefined;
  }, source);
};

export const useResolvedLanguage = (): AppLanguage => {
  const { locale } = useSettingsContext();
  return resolveAppLanguage(locale);
};
