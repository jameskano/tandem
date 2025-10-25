import { Activity, Plan, Goal } from '../shared/types'
import { getNextSaturday, addHours } from './utils/date'

export const seedActivities: Activity[] = [
  {
    id: 'a1',
    title: 'Cook a new recipe',
    emoji: '🍝',
    tags: ['home', 'food'],
    description: 'Try cooking a new dish together',
    difficulty: 'medium',
    duration: 60,
    cost: 'low',
    location: 'home'
  },
  {
    id: 'a2',
    title: 'Sunset walk + picnic',
    emoji: '🌅',
    tags: ['outdoor', 'romantic'],
    description: 'Take a walk during sunset and have a picnic',
    difficulty: 'easy',
    duration: 90,
    cost: 'low',
    location: 'outdoor'
  },
  {
    id: 'a3',
    title: 'Board game night',
    emoji: '🎲',
    tags: ['fun', 'home'],
    description: 'Play board games together',
    difficulty: 'easy',
    duration: 120,
    cost: 'free',
    location: 'home'
  },
  {
    id: 'a4',
    title: 'Visit a museum',
    emoji: '🏛️',
    tags: ['culture', 'learning'],
    description: 'Explore a local museum or art gallery',
    difficulty: 'easy',
    duration: 180,
    cost: 'medium',
    location: 'indoor'
  },
  {
    id: 'a5',
    title: 'Hiking adventure',
    emoji: '🥾',
    tags: ['outdoor', 'adventure'],
    description: 'Go on a hiking trail together',
    difficulty: 'hard',
    duration: 240,
    cost: 'free',
    location: 'outdoor'
  },
  {
    id: 'a6',
    title: 'Movie marathon',
    emoji: '🎬',
    tags: ['home', 'entertainment'],
    description: 'Watch a series of movies together',
    difficulty: 'easy',
    duration: 300,
    cost: 'low',
    location: 'home'
  },
  {
    id: 'a7',
    title: 'Dance class',
    emoji: '💃',
    tags: ['active', 'learning'],
    description: 'Take a dance class together',
    difficulty: 'medium',
    duration: 60,
    cost: 'medium',
    location: 'indoor'
  },
  {
    id: 'a8',
    title: 'Beach day',
    emoji: '🏖️',
    tags: ['outdoor', 'relaxing'],
    description: 'Spend a day at the beach',
    difficulty: 'easy',
    duration: 360,
    cost: 'low',
    location: 'outdoor'
  }
]

export const seedPlans: Plan[] = [
  {
    id: 'p1',
    couple_id: 'demo',
    title: 'Homemade sushi night 🍣',
    description: 'Learn to make sushi together',
    start_ts: getNextSaturday().toISOString(),
    end_ts: addHours(getNextSaturday(), 2).toISOString(),
    notes: 'Buy fresh ingredients and watch a tutorial',
    activity_id: 'a1',
    status: 'planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p2',
    couple_id: 'demo',
    title: 'Sunset picnic 🌅',
    description: 'Watch the sunset with a romantic picnic',
    start_ts: addHours(new Date(), 24).toISOString(), // Tomorrow
    end_ts: addHours(new Date(), 25).toISOString(),
    notes: 'Pack some snacks and a blanket',
    activity_id: 'a2',
    status: 'planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const seedGoals: Goal[] = [
  {
    id: 'g1',
    couple_id: 'demo',
    title: 'Try 2 new activities this week',
    description: 'Explore new experiences together',
    target: 2,
    progress: 1,
    unit: 'activities',
    deadline: addHours(new Date(), 168).toISOString(), // 1 week from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'g2',
    couple_id: 'demo',
    title: 'Cook together 4x this month',
    description: 'Share cooking experiences',
    target: 4,
    progress: 1,
    unit: 'times',
    deadline: addHours(new Date(), 720).toISOString(), // 1 month from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'g3',
    couple_id: 'demo',
    title: 'Take 10 photos together',
    description: 'Capture memories',
    target: 10,
    progress: 3,
    unit: 'photos',
    deadline: addHours(new Date(), 720).toISOString(), // 1 month from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const seedData = {
  activities: seedActivities,
  plans: seedPlans,
  goals: seedGoals,
  moments: [] // Empty initially
}
