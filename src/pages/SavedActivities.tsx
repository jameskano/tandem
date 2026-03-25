import React, { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import EditSavedActivityModal from '../components/EditSavedActivityModal';
import SavedActivityCard from '../components/SavedActivityCard';
import {
  deleteSavedActivity,
  getSavedActivitiesPage,
  updateSavedActivity,
} from '../services/API/savedActivities';
import { ChevronLeft, ChevronRight } from '../shared/icons';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { useAuthContext } from '../store/context/AuthProvider';
import { SavedActivity } from '../shared/types/saved-activities';
import { seedActivities } from '../shared/seed';

const PAGE_SIZE = 10;

const SavedActivities = () => {
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
  const hasActivities = activities.length > 0;

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
      setError('Saved activities could not be loaded right now.');
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
        setError('Saved activities could not be loaded right now.');
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
  }, [currentPage, user]);

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
      setError('The activity could not be removed. Please try again.');
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
      setError('The activity could not be updated. Please try again.');
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text">Saved Activities</h1>
            <p className="text-textMuted text-sm">
              Keep track of the ideas you want to revisit later.
            </p>
          </div>
          <Chip variant="secondary" size="sm">
            {totalCount} saved
          </Chip>
        </div>

        {error ? (
          <Card className="space-y-2">
            <p className="font-medium text-text">
              Saved activities unavailable
            </p>
            <p className="text-textMuted text-sm">{error}</p>
          </Card>
        ) : null}

        {isLoading ? (
          <Card>
            <p className="text-textMuted text-sm">
              Loading saved activities...
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
                Page {currentPage} of {totalPages}
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
                  <span className="ml-1">Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="outlineSoft"
                  size="sm"
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={() => setCurrentPage(previous => previous + 1)}
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Card className="space-y-2">
            <p className="font-medium text-text">No saved activities yet</p>
            <p className="text-textMuted text-sm">
              Save ideas from Discover and they will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedActivities;
