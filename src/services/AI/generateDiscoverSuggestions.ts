import type {
  DiscoverFilters,
  DiscoverResult,
  DiscoverSuggestion,
} from '../../shared/types/discover-filters.types';
import { buildDiscoverPrompt } from './buildDiscoverPrompt';

type DiscoverApiResponse =
  | DiscoverSuggestion[]
  | {
      suggestions?: DiscoverSuggestion[];
      results?: DiscoverSuggestion[];
      data?: DiscoverSuggestion[];
    };

const readSuggestions = (payload: DiscoverApiResponse) => {
  if (Array.isArray(payload)) {
    return payload;
  }

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
    // setting: suggestion.setting,
    // vibe: Array.isArray(suggestion.vibe) ? suggestion.vibe : [],
    // materials: Array.isArray(suggestion.materials) ? suggestion.materials : [],
    // steps: Array.isArray(suggestion.steps) ? suggestion.steps : [],
    // tags: Array.isArray(suggestion.tags) ? suggestion.tags : [],
  };
};

export const toDiscoverResult = (
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
    // suggestion.setting,
    // ...(suggestion.tags ?? []),
  ].filter((tag): tag is string => Boolean(tag)),
});

export const generateDiscoverSuggestions = async ({
  filters,
  previousSuggestions = [],
  round = 1,
}: {
  filters: DiscoverFilters;
  previousSuggestions?: DiscoverSuggestion[];
  round?: number;
}) => {
  const prompt = buildDiscoverPrompt(filters, previousSuggestions, round);

  const response = await fetch('/api/discover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      filters,
      previousSuggestions,
      round,
    }),
  });

  if (!response.ok) {
    throw new Error(
      'Discover generation failed. Add a POST /api/discover endpoint that returns 10 suggestions in JSON.'
    );
  }

  const payload = (await response.json()) as DiscoverApiResponse;
  const suggestions = readSuggestions(payload)
    .map(normalizeSuggestion)
    .filter(
      (suggestion): suggestion is DiscoverSuggestion => suggestion !== null
    );

  if (suggestions.length === 0) {
    throw new Error('Discover generation returned no valid suggestions.');
  }

  return {
    prompt,
    suggestions,
    results: suggestions.map(toDiscoverResult),
  };
};
