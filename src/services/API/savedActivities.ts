import {
  CreateSavedActivityParams,
  GetSavedActivitiesPageParams,
  GetSavedActivitiesPageResult,
  SavedActivity,
  UpdateSavedActivityParams,
} from '../../shared/types/saved-activities';
import { supabase } from '../supabase';

export const savedActivitiesQueryKey = (userId?: string) =>
  ['saved-activities', userId] as const;

export const savedActivitiesPageQueryKey = ({
  userId,
  page,
  pageSize = 10,
}: GetSavedActivitiesPageParams) =>
  [...savedActivitiesQueryKey(userId), page, pageSize] as const;

export const getSavedActivitiesPage = async ({
  userId,
  page,
  pageSize = 10,
}: GetSavedActivitiesPageParams): Promise<GetSavedActivitiesPageResult> => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!userId) {
    return {
      activities: [],
      totalCount: 0,
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('saved_activities')
    .select('id, title, description, tags, user_id, created_at', {
      count: 'exact',
    })
    .eq('user_id', userId)
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

export const getAllSavedActivities = async (userId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('saved_activities')
    .select('id, title, description, tags, user_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as SavedActivity[] | null) ?? [];
};

export const createSavedActivity = async ({
  userId,
  title,
  description,
  tags,
}: CreateSavedActivityParams) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('saved_activities')
    .insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      tags,
    })
    .select('id, title, description, tags, user_id, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as SavedActivity;
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
    .select('id, title, description, tags, user_id, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as SavedActivity;
};
