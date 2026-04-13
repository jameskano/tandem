import React, { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import EditSavedActivityModal from '../components/EditSavedActivityModal';
import SavedActivityCard from '../components/SavedActivityCard';
import {
  deleteSavedActivity,
  getSavedActivitiesPage,
  updateSavedActivity,
} from '../services/API/savedActivities';
import { useI18n } from '../shared/i18n/useI18n';
import { ChevronLeft, ChevronRight } from '../shared/icons';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { useAuthContext } from '../store/context/AuthProvider';
import { SavedActivity } from '../shared/types/saved-activities';
import { seedActivities } from '../shared/seed';

const PAGE_SIZE = 10;

const SavedActivities = () => {
  const { t } = useI18n();
  const { user } = useAuthContext();
  const [activities, setActivities] = useState<SavedActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<SavedActivity | null>(
    null
  );
  const [activityToDelete, setActivityToDelete] =
    useState<SavedActivity | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadSavedActivities = async (page: number, coupleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSavedActivitiesPage({
        coupleId,
        page,
        pageSize: PAGE_SIZE,
      });

      setActivities(data.activities);
      setTotalCount(data.totalCount);
    } catch (loadError) {
      console.error('Unable to fetch saved activities.', loadError);
      setError(t('savedActivities.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSavedActivitiesPage({
          coupleId: user.id,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setActivities(data.activities);
        setTotalCount(data.totalCount);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        console.error('Unable to fetch saved activities.', loadError);
        setError(t('savedActivities.loadError'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [currentPage, t, user]);

  const handleDelete = async () => {
    if (!activityToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSavedActivity(activityToDelete.id);
      setActivityToDelete(null);

      if (activities.length === 1 && currentPage > 1) {
        setCurrentPage(previous => previous - 1);
        return;
      }

      if (!user) {
        setActivities([]);
        setTotalCount(0);
        return;
      }

      await loadSavedActivities(currentPage, user.id);
    } catch (deleteError) {
      console.error('Unable to delete saved activity.', deleteError);
      setError(t('savedActivities.removeError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (values: { title: string; description: string }) => {
    if (!activityToEdit) {
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      const updatedActivity = await updateSavedActivity({
        activityId: activityToEdit.id,
        title: values.title,
        description: values.description,
      });

      setActivities(previous =>
        previous.map(activity =>
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      );
      setActivityToEdit(null);
    } catch (editError) {
      console.error('Unable to update saved activity.', editError);
      setError(t('savedActivities.updateError'));
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg">
      <EditSavedActivityModal
        activity={activityToEdit}
        isSubmitting={isEditing}
        onSave={values => void handleEdit(values)}
        onCancel={() => {
          if (!isEditing) {
            setActivityToEdit(null);
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(activityToDelete)}
        isSubmitting={isDeleting}
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
        ) : true ? (
          <>
            <div className="space-y-3">
              {seedActivities.map((activity: any) => (
                <SavedActivityCard
                  key={activity.id}
                  activity={activity}
                  isEditing={isEditing && activityToEdit?.id === activity.id}
                  isDeleting={
                    isDeleting && activityToDelete?.id === activity.id
                  }
                  onEdit={setActivityToEdit}
                  onRemove={setActivityToDelete}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <p className="text-textMuted text-sm">
                {t('savedActivities.page', {
                  current: currentPage,
                  total: totalPages,
                })}
              </p>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="outlineSoft"
                  size="sm"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage(previous => previous - 1)}
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  <span className="ml-1">{t('common.previous')}</span>
                </Button>
                <Button
                  type="button"
                  variant="outlineSoft"
                  size="sm"
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={() => setCurrentPage(previous => previous + 1)}
                >
                  <span className="mr-1">{t('common.next')}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
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
