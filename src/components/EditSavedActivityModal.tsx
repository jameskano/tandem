import React, { useEffect, useState } from 'react';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Input from '../shared/ui/Input';
import Textarea from '../shared/ui/Textarea';
import { SavedActivity } from '../shared/types/saved-activities';

type EditSavedActivityModalProps = {
  activity: SavedActivity | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSave: (values: { title: string; description: string }) => void;
};

const EditSavedActivityModal: React.FC<EditSavedActivityModalProps> = ({
  activity,
  isSubmitting = false,
  onCancel,
  onSave,
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const isOpen = Boolean(activity);

  useEffect(() => {
    if (!isOpen || !activity) {
      return;
    }

    setTitle(activity.title ?? '');
    setDescription(activity.description ?? '');
    setTitleError(undefined);
  }, [activity, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !activity) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setTitleError(t('editSavedActivity.titleRequired'));
      return;
    }

    setTitleError(undefined);
    onSave({
      title: trimmedTitle,
      description: trimmedDescription,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-saved-activity-title"
    >
      <Card
        padding="lg"
        shadow="lg"
        className="w-full max-w-xl space-y-5 border-gray-200"
      >
        <div className="space-y-2">
          <h2
            id="edit-saved-activity-title"
            className="text-xl font-bold text-text"
          >
            {t('editSavedActivity.title')}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label={t('common.title')}
            value={title}
            onChange={event => setTitle(event.target.value)}
            error={titleError}
            placeholder={t('editSavedActivity.titlePlaceholder')}
            maxLength={120}
            disabled={isSubmitting}
          />

          <Textarea
            label={t('common.description')}
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder={t('editSavedActivity.descriptionPlaceholder')}
            autoResize
            height={140}
            disabled={isSubmitting}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outlineSoft"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="sm:min-w-[140px]"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('editSavedActivity.submitting')
                : t('editSavedActivity.submit')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditSavedActivityModal;
