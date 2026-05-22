import { Setting, Vibe } from './discover-filters.types';

export type GetSavedActivitiesPageParams = {
  userId: string;
  page: number;
  pageSize?: number;
};

export type GetSavedActivitiesPageResult = {
  activities: SavedActivity[];
  totalCount: number;
};

export type UpdateSavedActivityParams = {
  activityId: string;
  title: string;
  description: string;
};

export type CreateSavedActivityParams = {
  userId: string;
  title: string;
  description: string;
  tags: string[];
};

export type SavedActivity = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  user_id?: string;
  created_at?: string;
};
