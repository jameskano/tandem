import React, { useEffect } from 'react';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';

type ConfirmModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  isSubmitting = false,
  onConfirm,
  onCancel,
}) => {
  const { t } = useI18n();

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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <Card
        padding="lg"
        shadow="lg"
        className="w-full max-w-md space-y-5 border-gray-200"
      >
        <div className="space-y-2">
          <h2 id="confirm-modal-title" className="text-xl font-bold text-text">
            {t('confirmModal.title')}
          </h2>
          <p className="text-textMuted text-sm leading-6">
            {t('confirmModal.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outlineSoft"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="sm:min-w-[140px]"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('confirmModal.submitting') : t('confirmModal.submit')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmModal;
