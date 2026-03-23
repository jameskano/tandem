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
  'Find and plan your next activity',
  'Tell me what you’re in the mood for',
  'What would you like to discover or plan?',
  'Looking for something fun to do together?',
  "Let's plan something amazing",
];

export const discoverPlaceholderText = [
  'Plan a romantic dinner date tonight...',
  'Organize a cozy movie night at home...',
  'Plan a sunset walk and picnic today...',
  'Cook a special breakfast together...',
  'Plan an afternoon adventure in the city...',
  "Organize a couples' game night tonight...",
  "Book a couples' spa or wellness activity...",
];

type Option<T extends string> = { value: T; label: string };

export const discoverBudgetOptions: Option<Budget>[] = [
  { value: 'free', label: 'Free' },
  { value: 'low', label: '$' },
  { value: 'medium', label: '$$' },
  { value: 'high', label: '$$$' },
  { value: 'luxury', label: 'Luxury' },
];

export const discoverTimeOptions: Option<TimeAvailable>[] = [
  { value: '15m', label: '15 min' },
  { value: '30m', label: '30 min' },
  { value: '60m', label: '60 min' },
  { value: '2h', label: '2 hr' },
  { value: 'half_day', label: 'Half day' },
  { value: 'full_day', label: 'Full day' },
  { value: 'multiple_days', label: 'Multiple days' },
];

export const discoverSettingOptions: Option<Setting>[] = [
  { value: 'home', label: 'Home' },
  { value: 'outdoors', label: 'Outdoors' },
  { value: 'city', label: 'City' },
  { value: 'nature', label: 'Nature' },
  { value: 'anywhere', label: 'Anywhere' },
];

export const discoverVibeOptions: Option<Vibe>[] = [
  { value: 'romantic', label: 'Romantic' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'funny', label: 'Funny' },
  { value: 'adventure', label: 'Adventurous' },
  { value: 'creative', label: 'Creative' },
  { value: 'foodie', label: 'Foodie' },
  { value: 'relax', label: 'Relax' },
  { value: 'games', label: 'Games' },
  { value: 'culture', label: 'Culture' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'surprise', label: 'Surprise' },
];

export const discoverEnergyOptions: Option<Energy>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const discoverConstraintsOptions: Option<Constraint>[] = [
  { value: 'no_alcohol', label: 'No alcohol' },
  { value: 'no_driving', label: 'No driving' },
  { value: 'avoid_crowds', label: 'Avoid crowds' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'pet_friendly', label: 'Pet-friendly' },
  { value: 'kid_friendly', label: 'Kid-friendly' },
  { value: 'low_effort', label: 'Low effort' },
  { value: 'no_phone', label: 'No phone' },
];

export const discoverManualWeatherOptions: Option<Exclude<Weather, 'auto'>>[] =
  [
    { value: 'sunny', label: 'Sunny' },
    { value: 'rainy', label: 'Rainy' },
    { value: 'cold', label: 'Cold' },
    { value: 'hot', label: 'Hot' },
    { value: 'windy', label: 'Windy' },
    { value: 'snowy', label: 'Snowy' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'foggy', label: 'Foggy' },
  ];
