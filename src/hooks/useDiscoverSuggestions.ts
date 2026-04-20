import { supabase } from '../services/supabase';
import { useSettingsContext } from '../store/context/SettingsProvider';
import type {
  DiscoverBatchSize,
  DiscoverFilters,
  DiscoverGenerationResponse,
  DiscoverResult,
  DiscoverSuggestion,
} from '../shared/types/discover-filters.types';

type DiscoverFunctionPayload = Partial<DiscoverGenerationResponse> & {
  results?: DiscoverSuggestion[];
  data?: DiscoverSuggestion[];
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
  index: number
): DiscoverResult => ({
  id: `${suggestion.title}-${index}`.toLowerCase().replace(/\s+/g, '-'),
  title: suggestion.emoji
    ? `${suggestion.emoji} ${suggestion.title}`
    : suggestion.title,
  description: suggestion.description,
  tags: [
    suggestion.estimated_cost,
    suggestion.duration,
    suggestion.setting,
    ...(suggestion.vibe ?? []),
  ].filter((tag): tag is string => Boolean(tag)),
});

export const useDiscoverSuggestions = () => {
  const { currency } = useSettingsContext();

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
      },
    });

    if (error) {
      throw new Error(error.message || 'Discover generation failed.');
    }

    const payload = (data ?? {}) as DiscoverFunctionPayload;
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
      results: suggestions.map(toDiscoverResult),
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
    toDiscoverResult,
  };
};
