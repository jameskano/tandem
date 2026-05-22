import { create } from 'zustand';
import type { SetStateAction } from 'react';
import type {
  DiscoverBatchSize,
  DiscoverResult,
  DiscoverSuggestion,
  FilterState,
} from '../shared/types/discover-filters.types';

const initialFilters: FilterState = {
  vibe: [],
  constraints: [],
};

const resolveNextState = <T>(value: SetStateAction<T>, previous: T): T =>
  typeof value === 'function' ? (value as (prev: T) => T)(previous) : value;

type DiscoverState = {
  prompt: string;
  batchSize: DiscoverBatchSize;
  filters: FilterState;
  currentBatch: DiscoverResult[];
  allGeneratedSuggestions: DiscoverSuggestion[];
  generationRound: number;
  canLoadMore: boolean;
  isGenerating: boolean;
  selectedSuggestionIds: string[];
  error: string | null;
  appliedLocationPromptKey: string | null;
  applyLocationPrompt: (prompt: string, locationKey: string) => void;
  setPrompt: (prompt: string) => void;
  setBatchSize: (batchSize: DiscoverBatchSize) => void;
  setFilters: (filters: SetStateAction<FilterState>) => void;
  setCurrentBatch: (currentBatch: DiscoverResult[]) => void;
  setAllGeneratedSuggestions: (
    suggestions: SetStateAction<DiscoverSuggestion[]>
  ) => void;
  setGenerationRound: (generationRound: number) => void;
  setCanLoadMore: (canLoadMore: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setSelectedSuggestionIds: (
    selectedSuggestionIds: SetStateAction<string[]>
  ) => void;
  setError: (error: string | null) => void;
};

export const useDiscoverStore = create<DiscoverState>(set => ({
  prompt: '',
  batchSize: 5,
  filters: initialFilters,
  currentBatch: [],
  allGeneratedSuggestions: [],
  generationRound: 0,
  canLoadMore: false,
  isGenerating: false,
  selectedSuggestionIds: [],
  error: null,
  appliedLocationPromptKey: null,
  applyLocationPrompt: (prompt, locationKey) =>
    set(state =>
      state.appliedLocationPromptKey === locationKey
        ? state
        : { prompt, appliedLocationPromptKey: locationKey }
    ),
  setPrompt: prompt => set({ prompt }),
  setBatchSize: batchSize => set({ batchSize }),
  setFilters: filters =>
    set(state => ({ filters: resolveNextState(filters, state.filters) })),
  setCurrentBatch: currentBatch => set({ currentBatch }),
  setAllGeneratedSuggestions: suggestions =>
    set(state => ({
      allGeneratedSuggestions: resolveNextState(
        suggestions,
        state.allGeneratedSuggestions
      ),
    })),
  setGenerationRound: generationRound => set({ generationRound }),
  setCanLoadMore: canLoadMore => set({ canLoadMore }),
  setIsGenerating: isGenerating => set({ isGenerating }),
  setSelectedSuggestionIds: selectedSuggestionIds =>
    set(state => ({
      selectedSuggestionIds: resolveNextState(
        selectedSuggestionIds,
        state.selectedSuggestionIds
      ),
    })),
  setError: error => set({ error }),
}));
