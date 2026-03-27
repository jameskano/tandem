import { useCallback, useMemo } from 'react';
import {
  DEFAULT_LANGUAGE,
  getTranslationValue,
  translations,
  useResolvedLanguage,
} from './index';
import type {
  TranslateFn,
  TranslateObjectFn,
  TranslationRecord,
  TranslationValue,
  TranslationVariables,
} from './types';

const interpolate = (value: string, variables?: TranslationVariables) => {
  if (!variables) {
    return value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const replacement = variables[key];
    return replacement === undefined ? `{{${key}}}` : String(replacement);
  });
};

export const useI18n = () => {
  const language = useResolvedLanguage();
  const dictionary = translations[language] as TranslationRecord;
  const fallbackDictionary = translations[DEFAULT_LANGUAGE] as TranslationRecord;

  const tObject = useCallback<TranslateObjectFn>(
    <T = TranslationValue,>(key: string) => {
      const value =
        getTranslationValue(dictionary, key) ??
        getTranslationValue(fallbackDictionary, key);

      return (value ?? key) as T;
    },
    [dictionary, fallbackDictionary]
  );

  const t = useCallback<TranslateFn>(
    (key, variables) => {
      const value = tObject<string>(key);
      return typeof value === 'string' ? interpolate(value, variables) : key;
    },
    [tObject]
  );

  return useMemo(
    () => ({
      language,
      t,
      tObject,
    }),
    [language, t, tObject]
  );
};
