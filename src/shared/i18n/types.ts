export type AppLanguage = 'en' | 'es';

export type TranslationPrimitive = string | number | boolean | null;
export type TranslationValue =
  | TranslationPrimitive
  | TranslationRecord
  | TranslationValue[];

export type TranslationRecord = {
  [key: string]: TranslationValue;
};

export type TranslationVariables = Record<string, string | number>;

export type TranslateFn = (
  key: string,
  variables?: TranslationVariables
) => string;

export type TranslateObjectFn = <T = TranslationValue>(key: string) => T;
