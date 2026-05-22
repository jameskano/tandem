import { supabase } from '../services/supabase';
import { useSettingsContext } from '../store/context/SettingsProvider';
import {
  discoverSettingOptions,
  discoverVibeOptions,
} from '../shared/constants/text-constants';
import { useI18n } from '../shared/i18n/useI18n';
import type {
  DiscoverBatchSize,
  DiscoverFilters,
  DiscoverGenerationResponse,
  DiscoverResult,
  DiscoverSuggestion,
} from '../shared/types/discover-filters.types';

const settingLabelByValue = new Map(
  discoverSettingOptions.map(option => [option.value, option.label])
);
const vibeLabelByValue = new Map(
  discoverVibeOptions.map(option => [option.value, option.label])
);

type DiscoverFunctionPayload = Partial<DiscoverGenerationResponse> & {
  results?: DiscoverSuggestion[];
  data?: DiscoverSuggestion[];
  error?: string;
  details?: string;
};

const readFunctionErrorMessage = async (
  error: unknown,
  payload: DiscoverFunctionPayload | null
) => {
  if (payload?.details) {
    return payload.details;
  }

  if (payload?.error) {
    return payload.error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'context' in error &&
    error.context instanceof Response
  ) {
    try {
      const errorPayload = (await error.context
        .clone()
        .json()) as DiscoverFunctionPayload;

      if (errorPayload.details) {
        return errorPayload.details;
      }

      if (errorPayload.error) {
        return errorPayload.error;
      }
    } catch {
      try {
        const errorText = await error.context.clone().text();

        if (errorText.trim()) {
          return errorText;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
};

const normalizeSuggestion = (
  suggestion: Partial<DiscoverSuggestion>
): DiscoverSuggestion | null => {
  const title = suggestion.title?.trim();
  const description = suggestion.description?.trim();

  if (!title || !description) {
    return null;
  }

  return {
    title,
    description,
    emoji: suggestion.emoji?.trim(),
    duration: suggestion.duration?.trim(),
    estimated_cost: suggestion.estimated_cost?.trim(),
    setting: suggestion.setting,
    vibe: suggestion.vibe,
  };
};

const readSuggestions = (payload: DiscoverFunctionPayload) => {
  if (Array.isArray(payload.suggestions)) {
    return payload.suggestions;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const toDiscoverResult = (
  suggestion: DiscoverSuggestion,
  index: number,
  translateTag: (tag: string) => string
): DiscoverResult => ({
  id: `${suggestion.title}-${index}`.toLowerCase().replace(/\s+/g, '-'),
  title: suggestion.emoji
    ? `${suggestion.emoji} ${suggestion.title}`
    : suggestion.title,
  description: suggestion.description,
  tags: [
    suggestion.estimated_cost,
    suggestion.duration,
    suggestion.setting ? translateTag(suggestion.setting) : undefined,
    ...(suggestion.vibe ?? []).map(translateTag),
  ].filter((tag): tag is string => Boolean(tag)),
});

export const useDiscoverSuggestions = () => {
  const { currency, locale } = useSettingsContext();
  const { t } = useI18n();

  const translateSuggestionTag = (tag: string) => {
    const translationKey =
      settingLabelByValue.get(tag) ?? vibeLabelByValue.get(tag);
    return translationKey ? t(translationKey) : tag;
  };

  const generateDiscoverSuggestions = async ({
    filters,
    previousSuggestions = [],
    round = 1,
    requestCount,
  }: {
    filters: DiscoverFilters;
    previousSuggestions?: DiscoverSuggestion[];
    round?: number;
    requestCount: DiscoverBatchSize;
  }) => {
    if (!supabase) {
      throw new Error('Supabase client is not configured.');
    }

    const { data, error } = await supabase.functions.invoke('discover', {
      body: {
        filters,
        previousSuggestions,
        round,
        requestedCount: requestCount,
        currency,
        locale,
      },
    });

    const payload = (data ?? {}) as DiscoverFunctionPayload;

    if (error) {
      const message = await readFunctionErrorMessage(error, payload);

      throw new Error(message || error.message || 'Discover generation failed.');
    }
    const suggestions = readSuggestions(payload)
      .map(normalizeSuggestion)
      .filter(
        (suggestion): suggestion is DiscoverSuggestion => suggestion !== null
      );

    if (suggestions.length === 0) {
      throw new Error('Discover generation returned no valid suggestions.');
    }

    return {
      suggestions,
      results: suggestions.map((suggestion, index) =>
        toDiscoverResult(suggestion, index, translateSuggestionTag)
      ),
      count:
        payload.count === 10 || payload.count === 5
          ? payload.count
          : suggestions.length >= 10
            ? 10
            : 5,
      canLoadMore: Boolean(payload.canLoadMore),
      isPremium: Boolean(payload.isPremium),
      round: typeof payload.round === 'number' ? payload.round : round,
    } satisfies DiscoverGenerationResponse & { results: DiscoverResult[] };
  };

  return {
    generateDiscoverSuggestions,
    toDiscoverResult: (suggestion: DiscoverSuggestion, index: number) =>
      toDiscoverResult(suggestion, index, translateSuggestionTag),
  };
};
