import React from 'react';
import { useI18n } from '../shared/i18n/useI18n';
import { Edit, Trash2 } from '../shared/icons';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { SavedActivity } from '../shared/types/saved-activities';

type SavedActivityCardProps = {
  activity: SavedActivity;
  isDeleting?: boolean;
  isEditing?: boolean;
  onEdit?: (activity: SavedActivity) => void;
  onRemove?: (activity: SavedActivity) => void;
};

const SavedActivityCard: React.FC<SavedActivityCardProps> = ({
  activity,
  isDeleting = false,
  isEditing = false,
  onEdit,
  onRemove,
}) => {
  const { t } = useI18n();

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-3 pb-2">
            <h3 className="min-w-0 flex-1 pr-4 text-lg font-semibold text-text">
              {activity.title?.trim() || t('savedActivities.untitled')}
            </h3>
            <div className="flex h-full items-center gap-4">
              <button
                type="button"
                aria-label={t('savedActivities.editAria', {
                  title: activity.title?.trim() || t('savedActivities.untitled'),
                })}
                className="text-textMuted min-h-0 min-w-0 rounded-lg transition-colors hover:bg-bg hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                disabled={isEditing || isDeleting}
                onClick={() => onEdit?.(activity)}
              >
                <Edit size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t('savedActivities.removeAria', {
                  title: activity.title?.trim() || t('savedActivities.untitled'),
                })}
                className="text-textMuted min-h-0 min-w-0 rounded-lg transition-colors hover:bg-bg hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
                disabled={isDeleting || isEditing}
                onClick={() => onRemove?.(activity)}
              >
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="text-textMuted text-sm">
            {activity.description?.trim() || t('savedActivities.noDescription')}
          </p>
        </div>
      </div>

      {activity.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activity.tags.map(tag => (
            <Chip key={`${activity.id}-${tag}`} size="sm">
              {tag}
            </Chip>
          ))}
        </div>
      ) : null}
    </Card>
  );
};

export default SavedActivityCard;
