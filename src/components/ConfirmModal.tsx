import React, { useEffect } from 'react';
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
            Remove saved activity?
          </h2>
          <p className="text-textMuted text-sm leading-6">
            This will remove the activity from the saved list.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outlineSoft"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="sm:min-w-[140px]"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Removing...' : 'Confirm'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmModal;
