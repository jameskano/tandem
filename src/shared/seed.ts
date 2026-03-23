import { SavedActivity } from './types';
import { DiscoverResult } from './types/discover-filters.types';

export const seedActivities: SavedActivity[] = [
  {
    id: 'activity-1',
    title: 'Pasta Night Challenge',
    emoji: '🍝',
    description: 'Pick a new pasta recipe and cook it together from scratch.',
    duration: '90 min',
    estimated_cost: 'EUR 15-25',
    setting: 'home',
    vibe: ['foodie', 'creative', 'cozy'],
  },
  {
    id: 'activity-2',
    title: 'Sunset Neighborhood Walk',
    emoji: '🌇',
    description:
      'Take a slow evening walk, stop for a drink, and talk without phones.',
    duration: '60 min',
    estimated_cost: 'Free',
    setting: 'city',
    vibe: ['romantic', 'relax'],
  },
  {
    id: 'activity-3',
    title: 'Board Game Rematch',
    emoji: '🎲',
    description:
      'Set up two or three favorite games and keep score for a mini tournament.',
    duration: '2h',
    estimated_cost: 'Free',
    setting: 'home',
    vibe: ['games', 'funny', 'cozy'],
  },
  {
    id: 'activity-4',
    title: 'Museum Afternoon',
    emoji: '🏛️',
    description:
      'Visit a museum or gallery and each choose one piece to talk about.',
    duration: '2h',
    estimated_cost: 'EUR 20-40',
    setting: 'city',
    vibe: ['culture', 'relax'],
  },
  {
    id: 'activity-5',
    title: 'Forest Picnic',
    emoji: '🧺',
    description:
      'Pack simple snacks, find a quiet green spot, and spend the afternoon outside.',
    duration: '3h',
    estimated_cost: 'EUR 10-20',
    setting: 'nature',
    vibe: ['romantic', 'relax', 'cozy'],
  },
  {
    id: 'activity-6',
    title: 'Home Cinema Double Feature',
    emoji: '🎬',
    description:
      'Pick two themed movies, prepare snacks, and turn the living room into a cinema.',
    duration: '3h',
    estimated_cost: 'EUR 5-15',
    setting: 'home',
    vibe: ['cozy', 'nostalgic', 'relax'],
  },
  {
    id: 'activity-7',
    title: 'Pottery Workshop',
    emoji: '🏺',
    description:
      'Book a beginner ceramics class and make something imperfect together.',
    duration: '2h',
    estimated_cost: 'EUR 50-80',
    setting: 'city',
    vibe: ['creative', 'surprise'],
  },
  {
    id: 'activity-8',
    title: 'Beach Morning',
    emoji: '🏖️',
    description:
      'Start early, bring coffee, and spend a calm morning by the water.',
    duration: 'half_day',
    estimated_cost: 'EUR 10-20',
    setting: 'outdoors',
    vibe: ['relax', 'romantic'],
  },
  {
    id: 'activity-9',
    title: 'Coffee Shop Sketch Date',
    emoji: '☕',
    description:
      'Sit in a cafe with notebooks and sketch each other or the room around you.',
    duration: '90 min',
    estimated_cost: 'EUR 10-20',
    setting: 'city',
    vibe: ['creative', 'cozy'],
  },
  {
    id: 'activity-10',
    title: 'Trivia Night at Home',
    emoji: '🧠',
    description:
      'Build a custom trivia round about your relationship and favorite topics.',
    duration: '60 min',
    estimated_cost: 'Free',
    setting: 'home',
    vibe: ['games', 'funny', 'nostalgic'],
  },
  {
    id: 'activity-11',
    title: 'Scenic Bike Ride',
    emoji: '🚲',
    description:
      'Choose an easy route with a stop for pastries or coffee midway.',
    duration: '2h',
    estimated_cost: 'EUR 5-15',
    setting: 'outdoors',
    vibe: ['adventure', 'relax'],
  },
  {
    id: 'activity-12',
    title: 'Farmers Market Lunch',
    emoji: '🥖',
    description:
      'Buy ingredients together at a local market and build lunch from what you find.',
    duration: '2h',
    estimated_cost: 'EUR 20-35',
    setting: 'city',
    vibe: ['foodie', 'relax'],
  },
  {
    id: 'activity-13',
    title: 'Photo Walk Challenge',
    emoji: '📷',
    description: 'Pick a theme and spend an hour taking photos that match it.',
    duration: '60 min',
    estimated_cost: 'Free',
    setting: 'anywhere',
    vibe: ['creative', 'adventure'],
  },
  {
    id: 'activity-14',
    title: 'Bookstore Date',
    emoji: '📚',
    description:
      'Browse separately for 20 minutes and then exchange one recommendation.',
    duration: '90 min',
    estimated_cost: 'EUR 0-25',
    setting: 'city',
    vibe: ['culture', 'cozy'],
  },
  {
    id: 'activity-15',
    title: 'Mini Road Trip',
    emoji: '🚗',
    description:
      'Drive to a nearby town, explore on foot, and try one new place together.',
    duration: 'full_day',
    estimated_cost: 'EUR 40-80',
    setting: 'anywhere',
    vibe: ['adventure', 'surprise'],
  },
  {
    id: 'activity-16',
    title: 'Breakfast in Bed Reset',
    emoji: '🥐',
    description:
      'Slow down, make a proper breakfast, and spend the morning without rushing.',
    duration: '60 min',
    estimated_cost: 'EUR 10-20',
    setting: 'home',
    vibe: ['cozy', 'romantic', 'relax'],
  },
  {
    id: 'activity-17',
    title: 'Live Music Evening',
    emoji: '🎵',
    description: 'Find a small local concert or jazz bar and stay for one set.',
    duration: '2h',
    estimated_cost: 'EUR 20-50',
    setting: 'city',
    vibe: ['culture', 'romantic'],
  },
  {
    id: 'activity-18',
    title: 'Stargazing Escape',
    emoji: '🌌',
    description:
      'Head somewhere dark, bring blankets, and spend time watching the night sky.',
    duration: '2h',
    estimated_cost: 'Free',
    setting: 'nature',
    vibe: ['romantic', 'surprise', 'relax'],
  },
  {
    id: 'activity-19',
    title: 'DIY Dessert Lab',
    emoji: '🍰',
    description:
      'Choose a dessert neither of you has made before and experiment together.',
    duration: '90 min',
    estimated_cost: 'EUR 10-20',
    setting: 'home',
    vibe: ['foodie', 'creative', 'funny'],
  },
  {
    id: 'activity-20',
    title: 'Hidden Spots Day',
    emoji: '🗺️',
    description:
      'Each person picks one underrated local spot and reveals it during the date.',
    duration: 'half_day',
    estimated_cost: 'EUR 15-40',
    setting: 'city',
    vibe: ['surprise', 'adventure', 'culture'],
  },
];

export const seedSuggestions: DiscoverResult[] = [
  {
    id: 'cook-a-regional-dinner-0',
    title: '🍲 Cook a Regional Dinner',
    description:
      'Pick a region you both want to visit and cook a full dinner inspired by it.',
    tags: ['EUR 15-30', '90 min', 'home', 'foodie', 'creative', 'cozy'],
  },
  {
    id: 'rainy-day-cafe-hop-1',
    title: '☔ Rainy Day Cafe Hop',
    description:
      'Visit two nearby cafes and rate them on coffee, atmosphere, and playlists.',
    tags: ['EUR 15-25', '2h', 'city', 'cozy', 'relax'],
  },
  {
    id: 'memory-lane-playlist-night-2',
    title: '🎧 Memory Lane Playlist Night',
    description:
      'Build a playlist of songs tied to your relationship and explain each pick.',
    tags: ['Free', '60 min', 'home', 'nostalgic', 'romantic'],
  },
  {
    id: 'botanical-garden-wandering-3',
    title: '🌿 Botanical Garden Wandering',
    description:
      'Take your time through a botanical garden and choose a favorite corner to revisit.',
    tags: ['EUR 10-25', '2h', 'nature', 'relax', 'romantic'],
  },
  {
    id: 'paint-and-talk-session-4',
    title: '🎨 Paint and Talk Session',
    description:
      'Set a timer, paint side by side, and swap canvases halfway through.',
    tags: ['EUR 10-20', '90 min', 'home', 'creative', 'funny'],
  },
  {
    id: 'street-food-date-5',
    title: '🌮 Street Food Date',
    description:
      'Try three different street food spots and compare your favorites.',
    tags: ['EUR 20-35', '2h', 'city', 'foodie', 'adventure'],
  },
  {
    id: 'scenic-train-ride-6',
    title: '🚆 Scenic Train Ride',
    description:
      'Take a short regional train somewhere unfamiliar and explore without a plan.',
    tags: ['EUR 20-45', 'half_day', 'anywhere', 'adventure', 'surprise'],
  },
  {
    id: 'puzzle-and-pastries-7',
    title: '🧩 Puzzle and Pastries',
    description:
      'Pick a puzzle, make tea, and settle in for a calm afternoon together.',
    tags: ['EUR 5-15', '2h', 'home', 'cozy', 'games', 'relax'],
  },
  {
    id: 'rooftop-sunset-check-in-8',
    title: '🌤️ Rooftop Sunset Check-In',
    description:
      'Watch the sunset from a rooftop or viewpoint and do a no-phone life check-in.',
    tags: ['Free', '60 min', 'city', 'romantic', 'relax'],
  },
  {
    id: 'secondhand-treasure-hunt-9',
    title: '🛍️ Secondhand Treasure Hunt',
    description:
      'Browse thrift shops with a low budget and find one funny or useful item each.',
    tags: ['EUR 10-30', '2h', 'city', 'funny', 'surprise'],
  },
  {
    id: 'night-walk-and-hot-chocolate-10',
    title: '🍫 Night Walk and Hot Chocolate',
    description:
      'Take a quiet walk after dark and finish with hot chocolate somewhere warm.',
    tags: ['EUR 8-15', '60 min', 'outdoors', 'cozy', 'romantic'],
  },
  {
    id: 'mini-book-club-11',
    title: '📖 Mini Book Club',
    description:
      'Read the same short story or essay and talk about it over tea.',
    tags: ['Free', '60 min', 'home', 'culture', 'cozy'],
  },
  {
    id: 'easy-hike-and-brunch-12',
    title: '🥾 Easy Hike and Brunch',
    description:
      'Start with a beginner-friendly trail and reward yourselves with brunch afterward.',
    tags: ['EUR 20-35', 'half_day', 'nature', 'adventure', 'relax'],
  },
  {
    id: 'at-home-spa-hour-13',
    title: '🛁 At-Home Spa Hour',
    description:
      'Make the room quiet, use face masks or massage oil, and fully unplug for an hour.',
    tags: ['EUR 10-25', '60 min', 'home', 'relax', 'romantic'],
  },
  {
    id: 'local-history-date-14',
    title: '🕰️ Local History Date',
    description:
      'Choose an old neighborhood or landmark and spend the date learning its story.',
    tags: ['Free', '2h', 'city', 'culture', 'nostalgic'],
  },
  {
    id: 'bake-for-someone-else-15',
    title: '🧁 Bake for Someone Else',
    description:
      'Bake something together and share part of it with a friend, neighbor, or family member.',
    tags: ['EUR 10-20', '90 min', 'home', 'foodie', 'creative'],
  },
  {
    id: 'surprise-stop-date-16',
    title: '🎟️ Surprise Stop Date',
    description:
      'One of you plans three stops and the other only learns each destination on arrival.',
    tags: ['EUR 20-50', 'half_day', 'anywhere', 'surprise', 'adventure'],
  },
  {
    id: 'arcade-challenge-17',
    title: '🕹️ Arcade Challenge',
    description:
      'Spend an hour at an arcade and let the winner choose dessert afterward.',
    tags: ['EUR 15-30', '90 min', 'city', 'games', 'funny'],
  },
  {
    id: 'camp-style-balcony-dinner-18',
    title: '🏕️ Camp-Style Balcony Dinner',
    description:
      'Turn your balcony, terrace, or living room into a mini campsite with simple food and lights.',
    tags: ['EUR 10-20', '90 min', 'home', 'cozy', 'surprise', 'romantic'],
  },
  {
    id: 'sunday-reset-planning-date-19',
    title: '🗓️ Sunday Reset Planning Date',
    description:
      'Sit down with coffee, plan the week together, and add one thing to look forward to.',
    tags: ['Free', '45 min', 'home', 'relax', 'cozy'],
  },
];

export const seedData = {
  activities: seedActivities,
  suggestions: seedSuggestions,
};
