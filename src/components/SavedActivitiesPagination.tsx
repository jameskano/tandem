import React from 'react';
import { ChevronLeft, ChevronRight } from '../shared/icons';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';

type SavedActivitiesPaginationProps = {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

const SavedActivitiesPagination: React.FC<SavedActivitiesPaginationProps> = ({
  currentPage,
  totalPages,
  disabled = false,
  onPrevious,
  onNext,
}) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-textMuted">
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
          disabled={currentPage === 1 || disabled}
          onClick={onPrevious}
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="ml-1">{t('common.previous')}</span>
        </Button>
        <Button
          type="button"
          variant="outlineSoft"
          size="sm"
          disabled={currentPage >= totalPages || disabled}
          onClick={onNext}
        >
          <span className="mr-1">{t('common.next')}</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default SavedActivitiesPagination;
