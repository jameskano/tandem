import React, { useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import DiscoverResults from '../components/DiscoverResults';
import OnboardingModal from '../components/OnboardingModal';
import RefineFilters from '../components/RefineFilters';
import { useDiscoverSuggestions } from '../hooks/useDiscoverSuggestions';
import useUtils from '../hooks/useUtils';
import { supabase } from '../services/supabase';
import { useI18n } from '../shared/i18n/useI18n';
import type {
  DiscoverBatchSize,
  DiscoverFilters,
  DiscoverResult,
} from '../shared/types/discover-filters.types';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import Textarea from '../shared/ui/Textarea';
import { useAuthContext } from '../store/context/AuthProvider';
import { useDiscoverStore } from '../store/discoverStore';
import { useRevenueCatContext } from '../store/context/RevenueCatProvider';
import { useSettingsContext } from '../store/context/SettingsProvider';
import {
  updateUserSettings,
  userSettingsQueryKey,
} from '../services/API/userSettings';

const Discover: React.FC = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { user } = useAuthContext();
  const {
    hasTandemPro,
    isLoading: isSubscriptionLoading,
    presentPaywallIfNeeded,
  } = useRevenueCatContext();
  const {
    currency,
    onboardingCompleted,
    isSettingsLoading,
    setOnboardingCompleted,
  } = useSettingsContext();
  const locationPrompt =
    typeof location.state?.prompt === 'string'
      ? location.state.prompt
      : undefined;
  const {
    prompt,
    setPrompt,
    batchSize,
    setBatchSize,
    filters,
    setFilters,
    currentBatch,
    setCurrentBatch,
    allGeneratedSuggestions,
    setAllGeneratedSuggestions,
    generationRound,
    setGenerationRound,
    canLoadMore,
    setCanLoadMore,
    isGenerating,
    setIsGenerating,
    selectedSuggestionIds,
    setSelectedSuggestionIds,
    error,
    setError,
    applyLocationPrompt,
  } = useDiscoverStore();
  const { getDiscoverLabelText, getDiscoverPlaceholderText } = useUtils();
  const { generateDiscoverSuggestions } = useDiscoverSuggestions();

  const isPremiumUser = hasTandemPro;

  const activeBatchSize: DiscoverBatchSize = isPremiumUser ? batchSize : 5;

  useEffect(() => {
    if (locationPrompt !== undefined) {
      applyLocationPrompt(locationPrompt, location.key);
    }
  }, [applyLocationPrompt, location.key, locationPrompt]);

  const discoverLabel = useMemo(
    () => getDiscoverLabelText(),
    [getDiscoverLabelText]
  );
  const discoverPlaceholder = useMemo(
    () => getDiscoverPlaceholderText(),
    [getDiscoverPlaceholderText]
  );

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
      const {
        results,
        suggestions,
        canLoadMore: nextCanLoadMore,
      } = await generateDiscoverSuggestions({
        filters: discoverFilters,
        previousSuggestions: loadMore ? allGeneratedSuggestions : [],
        round: nextRound,
        requestCount: activeBatchSize,
      });

      setCurrentBatch(results);
      setAllGeneratedSuggestions(previous =>
        loadMore ? [...previous, ...suggestions] : suggestions
      );
      setGenerationRound(nextRound);
      setCanLoadMore(nextCanLoadMore);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : t('discover.generationFailed')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePremiumBatchSize = async (option: DiscoverBatchSize) => {
    if (hasTandemPro) {
      setBatchSize(option);
      return;
    }

    try {
      const hasAccess = await presentPaywallIfNeeded();
      if (hasAccess) {
        setBatchSize(option);
      }
    } catch (paywallError) {
      console.error('Unable to present RevenueCat paywall.', paywallError);
    }
  };

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
  const hasGeneratedResults = currentBatch.length > 0;

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('User is required to complete onboarding.');
      }

      return updateUserSettings({
        userId: user.id,
        patch: { onboarding_completed: true },
      });
    },
    onSuccess: updatedSettings => {
      setOnboardingCompleted(updatedSettings.onboarding_completed);
      queryClient.setQueryData(userSettingsQueryKey(user?.id), updatedSettings);
    },
  });

  const handleCompleteOnboarding = async () => {
    if (completeOnboardingMutation.isPending) {
      return;
    }

    try {
      await completeOnboardingMutation.mutateAsync();
    } catch (error) {
      console.error('Unable to persist onboarding completion.', error);
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
  };

  return (
    <div className="min-h-full w-full bg-bg">
      <OnboardingModal
        isOpen={Boolean(user) && !isSettingsLoading && !onboardingCompleted}
        isSubmitting={completeOnboardingMutation.isPending}
        onComplete={() => void handleCompleteOnboarding()}
      />

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {t('discover.title')}
          </h1>
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

          <div className="flex flex-col gap-2 sm:flex-wrap">
            <div className="flex flex-wrap gap-2">
              {[5, 10].map(option => {
                const isLockedPremiumOption = option > 5 && !isPremiumUser;

                return (
                  <Button
                    key={option}
                    type="button"
                    onClick={() =>
                      void handlePremiumBatchSize(option as DiscoverBatchSize)
                    }
                    variant="ghost"
                    size="sm"
                    className={chipButtonClassName}
                    disabled={isSubscriptionLoading}
                  >
                    <Chip
                      variant={batchSize === option ? 'primary' : 'secondary'}
                      size="sm"
                      className={chipClassName}
                    >
                      {t('discover.batchSizeOption', { count: option })}
                      {isLockedPremiumOption ? ' Pro' : ''}
                    </Chip>
                  </Button>
                );
              })}
            </div>

            <Button
              size="md"
              disabled={!canGenerate || isGenerating}
              onClick={() => void handleGenerate(false)}
            >
              {isGenerating && generationRound === 0
                ? t('discover.generatingCount', { count: activeBatchSize })
                : t('discover.generateIdeasCount', { count: activeBatchSize })}
            </Button>
          </div>

          <RefineFilters
            filters={filters}
            isPremiumUser={isPremiumUser}
            isSubscriptionLoading={isSubscriptionLoading}
            currency={currency}
            onFiltersChange={setFilters}
            onPresentPaywall={presentPaywallIfNeeded}
          />
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">
              {t('discover.results')}
            </h2>
            <Chip variant="secondary" size="sm">
              {t('discover.ideasCount', { count: currentBatch.length })}
            </Chip>
          </div>

          {error ? (
            <Card className="space-y-2">
              <p className="font-medium text-text">
                {t('discover.generationUnavailable')}
              </p>
              <p className="text-textMuted text-sm">
                {t('discover.generationErrorMessage')}
              </p>
            </Card>
          ) : null}

          {hasGeneratedResults ? (
            <>
              <div className="space-y-3">
                {currentBatch.map(result => (
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

              {canLoadMore ? (
                <div className="flex flex-col items-center pt-2">
                  <Button
                    size="md"
                    variant="primaryOutline"
                    disabled={isGenerating}
                    onClick={() => void handleGenerate(true)}
                  >
                    {isGenerating && generationRound > 0
                      ? t('discover.generatingMoreCount', {
                          count: activeBatchSize,
                        })
                      : t('discover.generateMoreCount', {
                          count: activeBatchSize,
                        })}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <Card className="space-y-2">
              <p className="font-medium text-text">{t('discover.noIdeas')}</p>
              <p className="text-textMuted text-sm">
                {t('discover.noIdeasDescription', { count: activeBatchSize })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
