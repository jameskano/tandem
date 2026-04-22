import { FileHeart } from 'lucide-react';
import { Home, Settings } from '../icons';

export const appNavigationItems = [
  { path: '/dashboard', icon: Home, labelKey: 'nav.dashboard' },
  {
    path: '/saved-activities',
    icon: FileHeart,
    labelKey: 'nav.savedActivities',
  },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
] as const;
