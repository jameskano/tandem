import type {
  Budget,
  Constraint,
  Energy,
  Setting,
  TimeAvailable,
  Vibe,
  Weather,
} from '../types/discover-filters.types';

export const discoverLabelText = [
  'discover.labelVariants.one',
  'discover.labelVariants.two',
  'discover.labelVariants.three',
  'discover.labelVariants.four',
  'discover.labelVariants.five',
];

export const discoverPlaceholderText = [
  'discover.placeholderVariants.one',
  'discover.placeholderVariants.two',
  'discover.placeholderVariants.three',
  'discover.placeholderVariants.four',
  'discover.placeholderVariants.five',
  'discover.placeholderVariants.six',
  'discover.placeholderVariants.seven',
];

type Option<T extends string> = { value: T; label: string };

export const discoverBudgetOptions: Option<Budget>[] = [
  { value: 'free', label: 'discover.options.budget.free' },
  { value: 'low', label: 'discover.options.budget.low' },
  { value: 'medium', label: 'discover.options.budget.medium' },
  { value: 'high', label: 'discover.options.budget.high' },
  { value: 'luxury', label: 'discover.options.budget.luxury' },
];

export const discoverTimeOptions: Option<TimeAvailable>[] = [
  { value: '15m', label: 'discover.options.time.15m' },
  { value: '30m', label: 'discover.options.time.30m' },
  { value: '60m', label: 'discover.options.time.60m' },
  { value: '2h', label: 'discover.options.time.2h' },
  { value: 'half_day', label: 'discover.options.time.half_day' },
  { value: 'full_day', label: 'discover.options.time.full_day' },
  { value: 'multiple_days', label: 'discover.options.time.multiple_days' },
];

export const discoverSettingOptions: Option<Setting>[] = [
  { value: 'home', label: 'discover.options.setting.home' },
  { value: 'outdoors', label: 'discover.options.setting.outdoors' },
  { value: 'city', label: 'discover.options.setting.city' },
  { value: 'nature', label: 'discover.options.setting.nature' },
  { value: 'anywhere', label: 'discover.options.setting.anywhere' },
];

export const discoverVibeOptions: Option<Vibe>[] = [
  { value: 'romantic', label: 'discover.options.vibe.romantic' },
  { value: 'cozy', label: 'discover.options.vibe.cozy' },
  { value: 'funny', label: 'discover.options.vibe.funny' },
  { value: 'adventure', label: 'discover.options.vibe.adventure' },
  { value: 'creative', label: 'discover.options.vibe.creative' },
  { value: 'foodie', label: 'discover.options.vibe.foodie' },
  { value: 'relax', label: 'discover.options.vibe.relax' },
  { value: 'games', label: 'discover.options.vibe.games' },
  { value: 'culture', label: 'discover.options.vibe.culture' },
  { value: 'nostalgic', label: 'discover.options.vibe.nostalgic' },
  { value: 'surprise', label: 'discover.options.vibe.surprise' },
];

export const discoverEnergyOptions: Option<Energy>[] = [
  { value: 'low', label: 'discover.options.energy.low' },
  { value: 'medium', label: 'discover.options.energy.medium' },
  { value: 'high', label: 'discover.options.energy.high' },
];

export const discoverConstraintsOptions: Option<Constraint>[] = [
  { value: 'no_alcohol', label: 'discover.options.constraints.no_alcohol' },
  { value: 'no_driving', label: 'discover.options.constraints.no_driving' },
  { value: 'avoid_crowds', label: 'discover.options.constraints.avoid_crowds' },
  { value: 'quiet', label: 'discover.options.constraints.quiet' },
  { value: 'pet_friendly', label: 'discover.options.constraints.pet_friendly' },
  { value: 'kid_friendly', label: 'discover.options.constraints.kid_friendly' },
  { value: 'low_effort', label: 'discover.options.constraints.low_effort' },
  { value: 'no_phone', label: 'discover.options.constraints.no_phone' },
];

export const discoverManualWeatherOptions: Option<Exclude<Weather, 'auto'>>[] =
  [
    { value: 'sunny', label: 'discover.options.weather.sunny' },
    { value: 'rainy', label: 'discover.options.weather.rainy' },
    { value: 'cold', label: 'discover.options.weather.cold' },
    { value: 'hot', label: 'discover.options.weather.hot' },
    { value: 'windy', label: 'discover.options.weather.windy' },
    { value: 'snowy', label: 'discover.options.weather.snowy' },
    { value: 'cloudy', label: 'discover.options.weather.cloudy' },
    { value: 'foggy', label: 'discover.options.weather.foggy' },
  ];
