import {
  GetSavedActivitiesPageParams,
  GetSavedActivitiesPageResult,
  SavedActivity,
  UpdateSavedActivityParams,
} from '../../shared/types/saved-activities';
import { supabase } from '../supabase';

export const savedActivitiesQueryKey = (coupleId?: string) =>
  ['saved-activities', coupleId] as const;

export const savedActivitiesPageQueryKey = ({
  coupleId,
  page,
  pageSize = 10,
}: GetSavedActivitiesPageParams) =>
  [...savedActivitiesQueryKey(coupleId), page, pageSize] as const;

export const getSavedActivitiesPage = async ({
  coupleId,
  page,
  pageSize = 10,
}: GetSavedActivitiesPageParams): Promise<GetSavedActivitiesPageResult> => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!coupleId) {
    return {
      activities: [],
      totalCount: 0,
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('saved_activities')
    .select('id, title, description, tags, couple_id, saved_by, created_at', {
      count: 'exact',
    })
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    activities: (data as SavedActivity[] | null) ?? [],
    totalCount: count ?? 0,
  };
};

export const getAllSavedActivities = async (coupleId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!coupleId) {
    return [];
  }

  const { data, error } = await supabase
    .from('saved_activities')
    .select('id, title, description, tags, couple_id, saved_by, created_at')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as SavedActivity[] | null) ?? [];
};

export const deleteSavedActivity = async (activityId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('saved_activities')
    .delete()
    .eq('id', activityId);

  if (error) {
    throw error;
  }
};

export const updateSavedActivity = async ({
  activityId,
  title,
  description,
}: UpdateSavedActivityParams) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('saved_activities')
    .update({
      title: title.trim(),
      description: description.trim(),
    })
    .eq('id', activityId)
    .select('id, title, description, tags, couple_id, saved_by, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as SavedActivity;
};
