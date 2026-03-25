import { Setting, Vibe } from './discover-filters.types';

export type GetSavedActivitiesPageParams = {
  coupleId: string;
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

export type SavedActivity = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  couple_id?: string;
  saved_by?: string;
  created_at?: string;
};
