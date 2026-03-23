import React from 'react';
import { HeartIcon } from '../shared/icons';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { DiscoverResult } from '../shared/types/discover-filters.types';

type DiscoverResultsProps = {
  result: DiscoverResult;
  isSelected?: boolean;
  onSave?: (result: DiscoverResult) => void;
};

const DiscoverResults: React.FC<DiscoverResultsProps> = ({
  result,
  isSelected = false,
  onSave,
}) => {
  console.log(isSelected);
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="space-y-1">
            <div className="flex items-start items-center justify-between gap-3">
              <h3 className="min-w-0 flex-1 pr-4 text-lg font-semibold text-text">
                {result.title}
              </h3>
              <HeartIcon
                className={isSelected ? 'fill-current text-primary' : ''}
                size={20}
                aria-hidden="true"
                onClick={() => onSave?.(result)}
              />
            </div>
            <p className="text-textMuted text-sm">{result.description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {result.tags.map(tag => (
          <Chip key={tag} size="sm">
            {tag}
          </Chip>
        ))}
      </div>
    </Card>
  );
};

export default DiscoverResults;
