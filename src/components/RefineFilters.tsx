import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  FilterState,
  Vibe,
} from '../shared/types/discover-filters.types';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Chip from '../shared/ui/Chip';
import Dropdown from '../shared/ui/Dropdown';

type RefineFiltersProps = {
  filters: FilterState;
  isPremiumUser: boolean;
  isSubscriptionLoading: boolean;
  currency: string;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onPresentPaywall: () => Promise<unknown>;
};

const RefineFilters: React.FC<RefineFiltersProps> = ({
  filters,
  isPremiumUser,
  isSubscriptionLoading,
  currency,
  onFiltersChange,
  onPresentPaywall,
}) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const translatedDiscoverBudgetOptions = useMemo(() => {
    const currencySymbol = currency === 'USD' ? '$' : '\u20ac';

    return discoverBudgetOptions.map(item => ({
      ...item,
      label: t(item.label).replaceAll('$', currencySymbol),
    }));
  }, [currency, t]);
  const translatedDiscoverTimeOptions = useMemo(
    () => discoverTimeOptions.map(item => ({ ...item, label: t(item.label) })),
    [t]
  );
  const translatedDiscoverSettingOptions = useMemo(
    () =>
      discoverSettingOptions.map(item => ({ ...item, label: t(item.label) })),
    [t]
  );
  const translatedDiscoverVibeOptions = useMemo(
    () => discoverVibeOptions.map(item => ({ ...item, label: t(item.label) })),
    [t]
  );
  const translatedDiscoverEnergyOptions = useMemo(
    () =>
      discoverEnergyOptions.map(item => ({ ...item, label: t(item.label) })),
    [t]
  );
  const translatedDiscoverConstraintsOptions = useMemo(
    () =>
      discoverConstraintsOptions.map(item => ({
        ...item,
        label: t(item.label),
      })),
    [t]
  );
  const translatedDiscoverManualWeatherOptions = useMemo(
    () =>
      discoverManualWeatherOptions.map(item => ({
        ...item,
        label: t(item.label),
      })),
    [t]
  );

  const setFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    if (!isPremiumUser) {
      return;
    }

    onFiltersChange(prev => {
      if (!['constraints', 'vibe'].includes(key) && prev[key] === value) {
        const { [key]: _, ...rest } = prev;
        return rest as FilterState;
      }

      return { ...prev, [key]: value };
    });
  };

  const handleRefineUpgrade = async (
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      await onPresentPaywall();
    } catch (paywallError) {
      console.error('Unable to present RevenueCat paywall.', paywallError);
    }
  };

  const expandHadler = () => setExpanded(prev => !prev);

  const chipButtonClassName =
    '!p-0 hover:bg-transparent !ring-0 !ring-offset-0';
  const chipClassName = 'cursor-pointer px-3 py-1';
  const areRefineFiltersDisabled = !isPremiumUser;

  return (
    <details className="rounded-xl border border-appBorder bg-bg/60 p-4 shadow-sm backdrop-blur-sm transition-colors open:bg-surface/80 dark:bg-surface/40 dark:open:bg-surface/70">
      <summary
        className="flex cursor-pointer list-none flex-row items-center justify-between rounded-lg text-sm font-semibold text-text transition-colors hover:text-primary"
        onClick={expandHadler}
      >
        <div className="flex items-center gap-3">
          <span>{t('discover.refine')}</span>
          {!isPremiumUser ? (
            <Button
              type="button"
              size="sm"
              variant="primaryOutline"
              onClick={event => void handleRefineUpgrade(event)}
              disabled={isSubscriptionLoading}
            >
              {t('discover.unlockPro')}
            </Button>
          ) : null}
        </div>
        <ChevronDown
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </summary>
      <div className="mt-4 space-y-4">
        {!isPremiumUser ? (
          <p className="text-sm text-textMuted">
            {t('discover.refineProHint')}
          </p>
        ) : null}

        <div className="space-y-2">
          <p className="text-sm font-medium text-text">
            {t('discover.budget')}
          </p>
          <div className="flex flex-wrap gap-2">
            {translatedDiscoverBudgetOptions.map(item => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setFilter('budget', item.value)}
                variant="ghost"
                size="sm"
                className={chipButtonClassName}
                disabled={areRefineFiltersDisabled}
              >
                <Chip
                  variant={
                    filters.budget === item.value ? 'primary' : 'secondary'
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
          <p className="text-sm font-medium text-text">
            {t('discover.timeAvailable')}
          </p>
          <div className="flex flex-wrap gap-2">
            {translatedDiscoverTimeOptions.map(item => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setFilter('time', item.value)}
                variant="ghost"
                size="sm"
                className={chipButtonClassName}
                disabled={areRefineFiltersDisabled}
              >
                <Chip
                  variant={filters.time === item.value ? 'primary' : 'secondary'}
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
          <p className="text-sm font-medium text-text">
            {t('discover.setting')}
          </p>
          <div className="flex flex-wrap gap-2">
            {translatedDiscoverSettingOptions.map(item => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setFilter('setting', item.value)}
                variant="ghost"
                size="sm"
                className={chipButtonClassName}
                disabled={areRefineFiltersDisabled}
              >
                <Chip
                  variant={
                    filters.setting === item.value ? 'primary' : 'secondary'
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
          <p className="text-sm font-medium text-text">{t('discover.vibe')}</p>
          <Dropdown
            options={translatedDiscoverVibeOptions}
            value={filters.vibe}
            multiple
            placeholder={t('discover.selectVibe')}
            disabled={areRefineFiltersDisabled}
            onChange={value =>
              setFilter('vibe', Array.isArray(value) ? (value as Vibe[]) : [])
            }
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text">
            {t('discover.energy')}
          </p>
          <div className="flex flex-wrap gap-2">
            {translatedDiscoverEnergyOptions.map(item => (
              <Button
                key={item.value}
                type="button"
                onClick={() => setFilter('energy', item.value)}
                variant="ghost"
                size="sm"
                className={chipButtonClassName}
                disabled={areRefineFiltersDisabled}
              >
                <Chip
                  variant={
                    filters.energy === item.value ? 'primary' : 'secondary'
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
          <p className="text-sm font-medium text-text">
            {t('discover.constraints')}
          </p>
          <Dropdown
            options={translatedDiscoverConstraintsOptions}
            value={filters.constraints}
            multiple
            placeholder={t('discover.selectConstraints')}
            disabled={areRefineFiltersDisabled}
            onChange={value =>
              setFilter(
                'constraints',
                Array.isArray(value) ? (value as Constraint[]) : []
              )
            }
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text">
            {t('discover.weather')}
          </p>
          <Dropdown
            options={translatedDiscoverManualWeatherOptions}
            value={filters.weather}
            placeholder={t('discover.selectWeather')}
            disabled={areRefineFiltersDisabled}
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
  );
};

export default RefineFilters;
