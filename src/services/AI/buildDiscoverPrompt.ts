import type {
  DiscoverFilters,
  DiscoverSuggestion,
} from '../../shared/types/discover-filters.types';

export const buildDiscoverPrompt = (
  filters: DiscoverFilters,
  previousSuggestions: DiscoverSuggestion[] = [],
  round = 1
) => {
  const prompt = filters.prompt?.trim();
  const lines: string[] = [];

  lines.push(
    'You are generating couples activity ideas for an app called Tandem.'
  );
  lines.push('Return exactly 10 unique suggestions.');
  lines.push(
    'Do not be generic. Make the ideas realistic, varied, and actionable.'
  );
  lines.push(`This is generation round ${round}.`);

  if (round >= 2) {
    lines.push('Be more exploratory and less obvious than the first batch.');
  }

  if (round >= 3) {
    lines.push('Prioritize unusual but realistic ideas.');
  }

  lines.push('');
  lines.push('User intent:');
  lines.push(`- Free prompt: ${prompt ? `"${prompt}"` : '(none)'}`);
  if (filters.vibe.length > 0)
    lines.push(`- Vibe/type: ${filters.vibe.join(', ')}`);

  if (filters.setting) lines.push(`- Setting: ${filters.setting}`);

  if (filters.budget) lines.push(`- Budget for two people: ${filters.budget}`);

  if (currency) lines.push(`- Currency: ${currency}`);

  if (filters.time) lines.push(`- Time available: ${filters.time}`);

  if (filters.energy) lines.push(`- Energy level: ${filters.energy}`);

  if (filters.constraints.length > 0)
    lines.push(`- Constraints: ${filters.constraints.join(', ')}`);

  if (filters.weather) lines.push(`- Weather: ${filters.weather}`);

  lines.push('');

  if (previousSuggestions.length > 0) {
    lines.push('Previously generated suggestions to avoid repeating:');
    previousSuggestions.forEach((suggestion, index) => {
      lines.push(
        `${index + 1}. ${suggestion.title}${
          suggestion.description ? ` - ${suggestion.description}` : ''
        }`
      );
    });
    lines.push('');
    lines.push('Generate a completely different set of ideas.');
    lines.push(
      'Do not repeat the same activities, themes, wording, or minor variations.'
    );
    lines.push(
      'Avoid near-duplicates and avoid changing only the location or tiny details.'
    );
    lines.push('');
  }

  lines.push('Diversity requirements:');
  lines.push('- Mix different types of experiences whenever possible.');
  lines.push('- Avoid producing 10 versions of the same kind of plan.');
  lines.push(
    '- Prefer fresh angles if previous ideas already covered common options.'
  );
  lines.push('');
  lines.push('Output format (JSON array):');
  lines.push(
    `[
  {
    "title": "string (short, catchy)",
    "emoji": "string (1 emoji)",
    "description": "1-2 sentences",
    "duration": "string (e.g., '60 min')",
    "estimated_cost": "string (e.g., '$0-10')",
    "setting": "home|outdoors|city|nature|anywhere",
    "vibe": ["romantic","cozy","funny","adventure","creative","foodie","relax","games","culture","nostalgic","surprise"],
    "materials": ["optional list"],
    "steps": ["optional list, max 5"],
    "tags": ["optional short tags"]
  }
]`
  );
  lines.push('');
  lines.push('Rules:');
  lines.push('- Return valid JSON only.');
  lines.push('- If prompt is empty, infer a balanced set of ideas.');
  lines.push(
    '- Keep costs and durations consistent with chosen budget and time.'
  );
  lines.push('- Respect constraints strictly.');
  lines.push('- Prefer ideas that strengthen connection and conversation.');

  return lines.join('\n');
};
