import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DiscoverResults from '../components/DiscoverResults';
import OnboardingModal from '../components/OnboardingModal';
import { useDiscoverSuggestions } from '../hooks/useDiscoverSuggestions';
import useUtils from '../hooks/useUtils';
import { supabase } from '../services/supabase';
import { seedSuggestions } from '../shared/seed';
import {
  discoverBudgetOptions,
  discoverConstraintsOptions,
  discoverEnergyOptions,
  discoverManualWeatherOptions,
  discoverSettingOptions,
  discoverTimeOptions,
  discoverVibeOptions,
} from '../shared/constants/text-constants';
import type {
  Constraint,
  DiscoverFilters,
  DiscoverResult,
  DiscoverSuggestion,
  FilterState,
  Vibe,
} from '../shared/types/discover-filters.types';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import Dropdown from '../shared/ui/Dropdown';
import Textarea from '../shared/ui/Textarea';
import { useAuthContext } from '../store/context/AuthProvider';
import { useSettingsContext } from '../store/context/SettingsProvider';

const Discover: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const { onboardingCompleted, setOnboardingCompleted } = useSettingsContext();
  const initialPrompt = location.state?.prompt;
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    vibe: [],
    constraints: [],
  });
  const [currentBatch, setCurrentBatch] = useState<DiscoverResult[]>([]);
  const [allGeneratedSuggestions, setAllGeneratedSuggestions] = useState<
    DiscoverSuggestion[]
  >([]);
  const [generationRound, setGenerationRound] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const { getDiscoverLabelText, getDiscoverPlaceholderText } = useUtils();
  const { generateDiscoverSuggestions } = useDiscoverSuggestions();

  const discoverLabel = useMemo(
    () => getDiscoverLabelText(),
    [getDiscoverLabelText]
  );
  const discoverPlaceholder = useMemo(
    () => getDiscoverPlaceholderText(),
    [getDiscoverPlaceholderText]
  );

  const setFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => {
      if (!['constraints', 'vibe'].includes(key) && prev[key] === value) {
        const { [key]: _, ...rest } = prev;
        return rest as FilterState;
      }

      return { ...prev, [key]: value };
    });
  };

  const handleGenerate = async (loadMore = false) => {
    if (isGenerating) {
      return;
    }

    const nextRound = loadMore ? generationRound + 1 : 1;
    const discoverFilters: DiscoverFilters = {
      ...filters,
      prompt,
    };

    setIsGenerating(true);
    setError(null);

    try {
      const { results, suggestions } = await generateDiscoverSuggestions({
        filters: discoverFilters,
        previousSuggestions: loadMore ? allGeneratedSuggestions : [],
        round: nextRound,
      });

      setCurrentBatch(results);
      setAllGeneratedSuggestions(previous =>
        loadMore ? [...previous, ...suggestions] : suggestions
      );
      setGenerationRound(nextRound);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Discover generation failed.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const expandHadler = () => setExpanded(prev => !prev);

  const chipButtonClassName =
    '!p-0 hover:bg-transparent !ring-0 !ring-offset-0';
  const chipClassName = 'cursor-pointer px-3 py-1';

  const hasFilters =
    Boolean(filters.budget) ||
    Boolean(filters.time) ||
    Boolean(filters.setting) ||
    Boolean(filters.energy) ||
    Boolean(filters.weather) ||
    filters.vibe.length > 0 ||
    filters.constraints.length > 0;

  const canGenerate = prompt.trim().length > 0 || hasFilters;
  // const hasGeneratedResults = currentBatch.length > 0;
  const hasGeneratedResults = seedSuggestions.length > 0;

  const visibleResults =
    currentBatch.length > 0 ? currentBatch : seedSuggestions;

  const handleCompleteOnboarding = async () => {
    if (isCompletingOnboarding) {
      return;
    }

    setIsCompletingOnboarding(true);

    try {
      if (user && supabase) {
        await supabase
          .from('user_settings')
          .update({ onboarding_completed: true })
          .eq('user_id', user.id);
      }

      setOnboardingCompleted(true);
    } catch (error) {
      console.error('Unable to persist onboarding completion.', error);
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  const handleSaveSuggestion = async (result: DiscoverResult) => {
    if (!user || !supabase) {
      return;
    }

    setSelectedSuggestionIds(previous =>
      previous.includes(result.id)
        ? previous.filter(id => id !== result.id)
        : [...previous, result.id]
    );

    // try {
    //   const { data: membership, error: membershipError } = await supabase
    //     .from('memberships')
    //     .select('couple_id')
    //     .eq('user_id', user.id)
    //     .limit(1)
    //     .maybeSingle();

    //   if (membershipError) {
    //     throw membershipError;
    //   }

    //   if (!membership?.couple_id) {
    //     throw new Error('No couple membership found for this user.');
    //   }

    //   // TODO: Expand the saved_activities schema to persist full suggestion data
    //   // like title and description, and remove the unique(couple_id) constraint if
    //   // you want to store multiple saved activities per couple.
    //   const { error: saveError } = await supabase
    //     .from('saved_activities')
    //     .upsert(
    //       {
    //         couple_id: membership.couple_id,
    //         saved_by: user.id,
    //         tags: [result.title, ...result.tags],
    //       },
    //       { onConflict: 'couple_id' }
    //     );

    //   if (saveError) {
    //     throw saveError;
    //   }
    // } catch (saveError) {
    //   setSelectedSuggestionIds(previous =>
    //     previous.filter(savedId => savedId !== result.id)
    //   );
    //   console.error('Unable to save suggestion.', saveError);
    // }
  };

  return (
    <div className="min-h-screen w-full bg-bg">
      <OnboardingModal
        isOpen={Boolean(user) && !onboardingCompleted}
        isSubmitting={isCompletingOnboarding}
        onComplete={() => void handleCompleteOnboarding()}
      />

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Discover</h1>
        </div>

        <Card className="space-y-4">
          <div className="space-y-3">
            <Textarea
              label={discoverLabel}
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              placeholder={discoverPlaceholder}
              autoResize
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              size="md"
              disabled={!canGenerate || isGenerating}
              onClick={() => void handleGenerate(false)}
            >
              {isGenerating && generationRound === 0
                ? 'Generating...'
                : 'Generate ideas'}
            </Button>
          </div>

          <details className="rounded-lg border border-gray-200 bg-white/60 p-4">
            <summary
              className="flex cursor-pointer list-none flex-row items-center justify-between text-sm font-semibold text-text"
              onClick={expandHadler}
            >
              Refine
              <ChevronDown
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </summary>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Budget</p>
                <div className="flex flex-wrap gap-2">
                  {discoverBudgetOptions.map(item => (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter('budget', item.value)}
                      variant="ghost"
                      size="sm"
                      className={chipButtonClassName}
                    >
                      <Chip
                        variant={
                          filters.budget === item.value
                            ? 'primary'
                            : 'secondary'
                        }
                        size="sm"
                        className={chipClassName}
                      >
                        {item.label}
                      </Chip>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Time available</p>
                <div className="flex flex-wrap gap-2">
                  {discoverTimeOptions.map(item => (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter('time', item.value)}
                      variant="ghost"
                      size="sm"
                      className={chipButtonClassName}
                    >
                      <Chip
                        variant={
                          filters.time === item.value ? 'primary' : 'secondary'
                        }
                        size="sm"
                        className={chipClassName}
                      >
                        {item.label}
                      </Chip>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Setting</p>
                <div className="flex flex-wrap gap-2">
                  {discoverSettingOptions.map(item => (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter('setting', item.value)}
                      variant="ghost"
                      size="sm"
                      className={chipButtonClassName}
                    >
                      <Chip
                        variant={
                          filters.setting === item.value
                            ? 'primary'
                            : 'secondary'
                        }
                        size="sm"
                        className={chipClassName}
                      >
                        {item.label}
                      </Chip>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Vibe</p>
                <Dropdown
                  options={discoverVibeOptions}
                  value={filters.vibe}
                  multiple
                  placeholder="Select vibe"
                  onChange={value =>
                    setFilter(
                      'vibe',
                      Array.isArray(value) ? (value as Vibe[]) : []
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Energy</p>
                <div className="flex flex-wrap gap-2">
                  {discoverEnergyOptions.map(item => (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter('energy', item.value)}
                      variant="ghost"
                      size="sm"
                      className={chipButtonClassName}
                    >
                      <Chip
                        variant={
                          filters.energy === item.value
                            ? 'primary'
                            : 'secondary'
                        }
                        size="sm"
                        className={chipClassName}
                      >
                        {item.label}
                      </Chip>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Constraints</p>
                <Dropdown
                  options={discoverConstraintsOptions}
                  value={filters.constraints}
                  multiple
                  placeholder="Select constraints"
                  onChange={value =>
                    setFilter(
                      'constraints',
                      Array.isArray(value) ? (value as Constraint[]) : []
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-text">Weather</p>
                <Dropdown
                  options={discoverManualWeatherOptions}
                  value={filters.weather}
                  placeholder="Select weather"
                  onChange={value =>
                    setFilter(
                      'weather',
                      (value || undefined) as FilterState['weather']
                    )
                  }
                />
              </div>
            </div>
          </details>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Results</h2>
            <Chip variant="secondary" size="sm">
              {currentBatch.length} ideas
            </Chip>
          </div>

          {error ? (
            <Card className="space-y-2">
              <p className="font-medium text-text">Generation unavailable</p>
              <p className="text-textMuted text-sm">{error}</p>
            </Card>
          ) : null}

          {hasGeneratedResults ? (
            <>
              <div className="space-y-3">
                {visibleResults.map(result => (
                  <DiscoverResults
                    key={result.id}
                    result={result}
                    isSelected={selectedSuggestionIds.includes(result.id)}
                    onSave={savedResult =>
                      void handleSaveSuggestion(savedResult)
                    }
                  />
                ))}
              </div>

              <div className="flex flex-col items-center pt-2">
                <Button
                  size="md"
                  variant="primaryOutline"
                  disabled={isGenerating}
                  onClick={() => void handleGenerate(true)}
                >
                  {isGenerating && generationRound > 0
                    ? 'Generating 10 more...'
                    : 'Generate 10 more'}
                </Button>
              </div>
            </>
          ) : (
            <Card className="space-y-2">
              <p className="font-medium text-text">No ideas yet</p>
              <p className="text-textMuted text-sm">
                Generate a first batch to see 10 suggestions here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
