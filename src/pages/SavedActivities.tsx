import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ConfirmModal from '../components/ConfirmModal';
import EditSavedActivityModal from '../components/EditSavedActivityModal';
import SavedActivityCard from '../components/SavedActivityCard';
import SavedActivitiesPagination from '../components/SavedActivitiesPagination';
import { useToast } from '../hooks/useToast';
import {
  deleteSavedActivity,
  getSavedActivitiesPage,
  savedActivitiesPageQueryKey,
  savedActivitiesQueryKey,
  updateSavedActivity,
} from '../services/API/savedActivities';
import { useI18n } from '../shared/i18n/useI18n';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { useAuthContext } from '../store/context/AuthProvider';
import { SavedActivity } from '../shared/types/saved-activities';

const PAGE_SIZE = 10;
const SAVED_ACTIVITIES_TOAST_DURATION = 2000;

const SavedActivities = () => {
  const { t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [activityToEdit, setActivityToEdit] = useState<SavedActivity | null>(
    null
  );
  const [activityToDelete, setActivityToDelete] =
    useState<SavedActivity | null>(null);
  const savedActivitiesQuery = useQuery({
    queryKey: savedActivitiesPageQueryKey({
      coupleId: user?.id ?? '',
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    queryFn: () =>
      getSavedActivitiesPage({
        coupleId: user!.id,
        page: currentPage,
        pageSize: PAGE_SIZE,
      }),
    enabled: Boolean(user?.id),
    placeholderData: keepPreviousData,
  });
  const activities = savedActivitiesQuery.data?.activities ?? [];
  const totalCount = savedActivitiesQuery.data?.totalCount ?? 0;
  const isLoading = savedActivitiesQuery.isLoading;
  const error = savedActivitiesQuery.isError
    ? t('savedActivities.loadError')
    : null;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const deleteSavedActivityMutation = useMutation({
    mutationFn: deleteSavedActivity,
    onSuccess: async () => {
      if (!user) {
        return;
      }

      toast.success(t('savedActivities.removeSuccess'), {
        duration: SAVED_ACTIVITIES_TOAST_DURATION,
      });
      setActivityToDelete(null);

      if (activities.length === 1 && currentPage > 1) {
        setCurrentPage(previous => previous - 1);
      }

      await queryClient.invalidateQueries({
        queryKey: savedActivitiesQueryKey(user.id),
      });
    },
    onError: deleteError => {
      console.error('Unable to delete saved activity.', deleteError);
      toast.error(t('savedActivities.removeError'), {
        duration: SAVED_ACTIVITIES_TOAST_DURATION,
      });
    },
  });

  const updateSavedActivityMutation = useMutation({
    mutationFn: updateSavedActivity,
    onSuccess: updatedActivity => {
      if (!user) {
        return;
      }

      queryClient.setQueryData(
        savedActivitiesPageQueryKey({
          coupleId: user.id,
          page: currentPage,
          pageSize: PAGE_SIZE,
        }),
        (current?: { activities: SavedActivity[]; totalCount: number }) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            activities: current.activities.map(activity =>
              activity.id === updatedActivity.id ? updatedActivity : activity
            ),
          };
        }
      );

      setActivityToEdit(null);
      toast.success(t('savedActivities.updateSuccess'), {
        duration: SAVED_ACTIVITIES_TOAST_DURATION,
      });
    },
    onError: editError => {
      console.error('Unable to update saved activity.', editError);
      toast.error(t('savedActivities.updateError'), {
        duration: SAVED_ACTIVITIES_TOAST_DURATION,
      });
    },
  });

  const handleDelete = async () => {
    if (!activityToDelete) {
      return;
    }

    try {
      await deleteSavedActivityMutation.mutateAsync(activityToDelete.id);
    } catch {}
  };

  const handleEdit = async (values: { title: string; description: string }) => {
    if (!activityToEdit) {
      return;
    }

    try {
      await updateSavedActivityMutation.mutateAsync({
        activityId: activityToEdit.id,
        title: values.title,
        description: values.description,
      });
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-bg">
      <EditSavedActivityModal
        activity={activityToEdit}
        isSubmitting={updateSavedActivityMutation.isPending}
        onSave={values => void handleEdit(values)}
        onCancel={() => {
          if (!updateSavedActivityMutation.isPending) {
            setActivityToEdit(null);
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(activityToDelete)}
        isSubmitting={deleteSavedActivityMutation.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setActivityToDelete(null)}
      />

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3">
          <div className="block w-full">
            <h1 className="mb-2 text-2xl font-bold text-text">
              {t('savedActivities.title')}
            </h1>
          </div>
          <div className="flex gap-4">
            <p className="text-textMuted text-sm">
              {t('savedActivities.subtitle')}
            </p>
            <Chip variant="secondary" size="sm">
              {t('savedActivities.savedCount', { count: totalCount })}
            </Chip>
          </div>
        </div>

        {error ? (
          <Card className="space-y-2">
            <p className="font-medium text-text">
              {t('savedActivities.unavailable')}
            </p>
            <p className="text-textMuted text-sm">{error}</p>
          </Card>
        ) : null}

        {isLoading ? (
          <Card>
            <p className="text-textMuted text-sm">
              {t('savedActivities.loading')}
            </p>
          </Card>
        ) : activities.length > 0 ? (
          <>
            <div className="space-y-3">
              {activities.map(activity => (
                <SavedActivityCard
                  key={activity.id}
                  activity={activity}
                  isEditing={
                    updateSavedActivityMutation.isPending &&
                    activityToEdit?.id === activity.id
                  }
                  isDeleting={
                    deleteSavedActivityMutation.isPending &&
                    activityToDelete?.id === activity.id
                  }
                  onEdit={setActivityToEdit}
                  onRemove={setActivityToDelete}
                />
              ))}
            </div>

            <SavedActivitiesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              disabled={isLoading || savedActivitiesQuery.isFetching}
              onPrevious={() => setCurrentPage(previous => previous - 1)}
              onNext={() => setCurrentPage(previous => previous + 1)}
            />
          </>
        ) : (
          <Card className="space-y-2">
            <p className="font-medium text-text">
              {t('savedActivities.emptyTitle')}
            </p>
            <p className="text-textMuted text-sm">
              {t('savedActivities.emptyDescription')}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedActivities;
