export type Setting = 'home' | 'outdoors' | 'city' | 'nature' | 'anywhere';
export type Budget = 'free' | 'low' | 'medium' | 'high' | 'luxury';
export type TimeAvailable =
  | '15m'
  | '30m'
  | '60m'
  | '2h'
  | 'half_day'
  | 'full_day'
  | 'multiple_days';
export type Energy = 'low' | 'medium' | 'high';
export type Vibe =
  | 'romantic'
  | 'cozy'
  | 'funny'
  | 'adventure'
  | 'creative'
  | 'foodie'
  | 'relax'
  | 'games'
  | 'culture'
  | 'nostalgic'
  | 'surprise';

export type Constraint =
  | 'no_alcohol'
  | 'no_driving'
  | 'avoid_crowds'
  | 'quiet'
  | 'pet_friendly'
  | 'kid_friendly'
  | 'low_effort'
  | 'no_phone';

export type Weather =
  | 'auto'
  | 'sunny'
  | 'rainy'
  | 'cold'
  | 'hot'
  | 'windy'
  | 'snowy'
  | 'cloudy'
  | 'foggy';

export type FilterState = {
  budget?: Budget;
  time?: TimeAvailable;
  setting?: Setting;
  energy?: Energy;
  vibe: Vibe[];
  constraints: Constraint[];
  weather?: Exclude<Weather, 'auto'>;
  city?: string;
  country?: string;
};

export type DiscoverFilters = FilterState & {
  prompt?: string;
};

export type DiscoverSuggestion = {
  title: string;
  emoji?: string;
  description: string;
  duration?: string;
  estimated_cost?: string;
  setting?: Setting;
  vibe?: Vibe[];
  // materials?: string[];
  // steps?: string[];
  // tags?: string[];
};

export type DiscoverResult = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};
