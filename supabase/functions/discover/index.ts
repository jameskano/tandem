import { GoogleGenAI } from 'npm:@google/genai';
import { createClient } from 'npm:@supabase/supabase-js';

type Setting = 'home' | 'outdoors' | 'city' | 'nature' | 'anywhere';
type Budget = 'free' | 'low' | 'medium' | 'high' | 'luxury';
type TimeAvailable =
  | '15m'
  | '30m'
  | '60m'
  | '2h'
  | 'half_day'
  | 'full_day'
  | 'multiple_days';
type Energy = 'low' | 'medium' | 'high';
type Vibe =
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
type Constraint =
  | 'no_alcohol'
  | 'no_driving'
  | 'avoid_crowds'
  | 'quiet'
  | 'pet_friendly'
  | 'kid_friendly'
  | 'low_effort'
  | 'no_phone';
type Weather =
  | 'sunny'
  | 'rainy'
  | 'cold'
  | 'hot'
  | 'windy'
  | 'snowy'
  | 'cloudy'
  | 'foggy';

type DiscoverFilters = {
  prompt?: string;
  budget?: Budget;
  time?: TimeAvailable;
  setting?: Setting;
  energy?: Energy;
  vibe?: Vibe[];
  constraints?: Constraint[];
  weather?: Weather;
  city?: string;
  country?: string;
};

type DiscoverSuggestion = {
  title: string;
  emoji?: string;
  description: string;
  duration?: string;
  estimated_cost?: string;
  setting?: Setting;
  vibe?: Vibe[];
};

type DiscoverRequestBody = {
  filters?: DiscoverFilters;
  previousSuggestions?: Array<Partial<DiscoverSuggestion>>;
  round?: number;
  requestedCount?: number;
  currency?: string;
  country?: string | null;
  city?: string | null;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const ai = new GoogleGenAI({
  apiKey: Deno.env.get('GEMINI_API_KEY')!,
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const safeString = (value: unknown, maxLength = 240) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : undefined;

const safeArray = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  maxItems = allowed.length
) => {
  if (!Array.isArray(value)) {
    return [] as T[];
  }

  return value
    .filter(
      (item): item is T =>
        typeof item === 'string' && allowed.includes(item as T)
    )
    .slice(0, maxItems);
};

const safeEnum = <T extends string>(value: unknown, allowed: readonly T[]) =>
  typeof value === 'string' && allowed.includes(value as T)
    ? (value as T)
    : undefined;

const sanitizeSuggestions = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const suggestion = item as Partial<DiscoverSuggestion>;
      const title = safeString(suggestion.title, 80);
      const description = safeString(suggestion.description, 240);

      if (!title || !description) {
        return null;
      }

      return {
        title,
        description,
        emoji: safeString(suggestion.emoji, 8),
        duration: safeString(suggestion.duration, 40),
        estimated_cost: safeString(suggestion.estimated_cost, 40),
        setting: safeEnum(suggestion.setting, [
          'home',
          'outdoors',
          'city',
          'nature',
          'anywhere',
        ] as const),
        vibe: safeArray(suggestion.vibe, [
          'romantic',
          'cozy',
          'funny',
          'adventure',
          'creative',
          'foodie',
          'relax',
          'games',
          'culture',
          'nostalgic',
          'surprise',
        ] as const),
      };
    })
    .filter((item): item is DiscoverSuggestion => item !== null);
};

const getIsPremiumUser = async (req: Request) => {
  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  return (
    user.app_metadata?.plan === 'premium' ||
    user.app_metadata?.subscription_tier === 'premium' ||
    user.user_metadata?.plan === 'premium' ||
    user.user_metadata?.subscription_tier === 'premium' ||
    user.user_metadata?.is_premium === true
  );
};

const buildPromptPayload = ({
  filters,
  previousSuggestions,
  round,
  count,
  currency,
  city,
  country,
}: {
  filters: DiscoverFilters;
  previousSuggestions: DiscoverSuggestion[];
  round: number;
  count: 5 | 10;
  currency: string;
  city?: string;
  country?: string;
}) => ({
  user_request: {
    prompt: safeString(filters.prompt, 500) ?? '',
    budget: filters.budget ?? null,
    time: filters.time ?? null,
    setting: filters.setting ?? null,
    energy: filters.energy ?? null,
    vibe: filters.vibe ?? [],
    constraints: filters.constraints ?? [],
    weather: filters.weather ?? null,
    currency,
    city: city ?? null,
    country: country ?? null,
  },
  generation: {
    count,
    round,
    avoid_titles: previousSuggestions.map(suggestion => suggestion.title),
    previous_suggestions: previousSuggestions.map(suggestion => ({
      title: suggestion.title,
      description: suggestion.description,
      setting: suggestion.setting ?? null,
      vibe: suggestion.vibe ?? [],
    })),
  },
});

const buildSystemInstruction = (count: 5 | 10, round: number) =>
  `
You generate couples activity ideas for an app called Tandem.
Return exactly ${count} unique suggestions.

Quality bar:
- Make every idea realistic, specific, and immediately usable.
- Avoid generic filler such as "go for dinner" unless it is made distinctive and tailored.
- Favor ideas that strengthen connection, conversation, playfulness, or shared discovery.
- Keep the set varied. Do not produce multiple versions of the same plan.
- Balance cozy, active, creative, practical, playful, and exploratory options whenever the filters allow it.

Personalization:
- Respect the requested budget, time, setting, energy, weather, and constraints strictly.
- Keep durations and cost estimates believable for the requested filters.
- Use the provided city and country when they help make ideas more relevant, but do not invent specific venues unless the user clearly asked for that.
- If the user prompt is empty, infer a balanced and useful set from the filters alone.

Output style:
- Titles should be short, catchy, and natural.
- Descriptions should be concrete and enticing, usually 1-2 sentences.
- Estimated cost should be practical and aligned with the user's currency.
- Use vibes and setting labels consistently with the schema.

Diversity rules:
- Avoid producing ${count} ideas that all feel like the same category.
- Prefer distinct activity shapes, not small rewordings of one idea.
- If one idea is at home, another can be outdoors, another can be creative, another can be food-related, as long as that still fits the filters.

Anti-repetition rules:
- If previous suggestions are provided, do not repeat the same activities, themes, wording, or minor variations.
- Avoid near-duplicates and avoid changing only the location, cuisine, or tiny detail.
- When a prior batch exists, actively search for fresher angles and less obvious options.

Round guidance:
${round >= 2 ? '- Be more exploratory and less obvious than the first batch.' : '- Start with strong, broadly appealing ideas that still feel specific.'}
${round >= 3 ? '- Prioritize unusual but still realistic ideas over standard date suggestions.' : '- Keep novelty balanced with practicality.'}

Return JSON only and follow the provided schema exactly.
`.trim();

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = (await req.json()) as DiscoverRequestBody;
    const filters = body.filters ?? {};
    const isPremium = await getIsPremiumUser(req);
    const requestedCount = body.requestedCount === 10 ? 10 : 5;
    const count = (isPremium ? requestedCount : 5) as 5 | 10;
    const previousSuggestions = isPremium
      ? sanitizeSuggestions(body.previousSuggestions).slice(0, 30)
      : [];
    const round =
      isPremium &&
      previousSuggestions.length > 0 &&
      typeof body.round === 'number'
        ? Math.max(2, Math.min(10, Math.floor(body.round)))
        : 1;
    const currency = safeString(body.currency, 10) ?? 'EUR';
    const city = safeString(filters.city ?? body.city, 120);
    const country = safeString(filters.country ?? body.country, 120);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: JSON.stringify(
        buildPromptPayload({
          filters: {
            prompt: safeString(filters.prompt, 500),
            budget: filters.budget,
            time: filters.time,
            setting: filters.setting,
            energy: filters.energy,
            vibe: safeArray(filters.vibe, [
              'romantic',
              'cozy',
              'funny',
              'adventure',
              'creative',
              'foodie',
              'relax',
              'games',
              'culture',
              'nostalgic',
              'surprise',
            ] as const),
            constraints: safeArray(filters.constraints, [
              'no_alcohol',
              'no_driving',
              'avoid_crowds',
              'quiet',
              'pet_friendly',
              'kid_friendly',
              'low_effort',
              'no_phone',
            ] as const),
            weather: safeEnum(filters.weather, [
              'sunny',
              'rainy',
              'cold',
              'hot',
              'windy',
              'snowy',
              'cloudy',
              'foggy',
            ] as const),
          },
          previousSuggestions,
          round,
          count,
          currency,
          city,
          country,
        })
      ),
      config: {
        systemInstruction: buildSystemInstruction(count, round),
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'array',
          minItems: count,
          maxItems: count,
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              emoji: { type: 'string' },
              description: { type: 'string' },
              duration: { type: 'string' },
              estimated_cost: { type: 'string' },
              setting: {
                type: 'string',
                enum: ['home', 'outdoors', 'city', 'nature', 'anywhere'],
              },
              vibe: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'romantic',
                    'cozy',
                    'funny',
                    'adventure',
                    'creative',
                    'foodie',
                    'relax',
                    'games',
                    'culture',
                    'nostalgic',
                    'surprise',
                  ],
                },
              },
            },
            required: ['title', 'description'],
            additionalProperties: false,
          },
        },
        temperature: round > 1 ? 0.95 : 0.8,
        maxOutputTokens: count === 10 ? 1800 : 1000,
      },
    });

    const parsed = JSON.parse(response.text);
    const suggestions = sanitizeSuggestions(parsed);
    const uniqueSuggestions = suggestions.filter((suggestion, index, array) => {
      const normalizedTitle = suggestion.title.toLowerCase();
      return (
        array.findIndex(
          candidate => candidate.title.toLowerCase() === normalizedTitle
        ) === index
      );
    });

    if (uniqueSuggestions.length !== count) {
      throw new Error(
        'Model returned an invalid number of unique suggestions.'
      );
    }

    return new Response(
      JSON.stringify({
        suggestions: uniqueSuggestions,
        count,
        canLoadMore: isPremium,
        isPremium,
        round,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: 'Failed to generate discover suggestions.' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
