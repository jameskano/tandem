import React, { useLayoutEffect, useRef, useState } from 'react';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import { DiscoverResult } from '../shared/types/discover-filters.types';

type DiscoverResultsProps = {
  result: DiscoverResult;
};

const DiscoverResults: React.FC<DiscoverResultsProps> = ({ result }) => {
  const [btnWidth, setBtnWidth] = useState<number>();
  console.log(btnWidth);
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const genRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const saveW = saveRef.current?.offsetWidth ?? 0;
    const genW = genRef.current?.offsetWidth ?? 0;
    setBtnWidth(Math.max(saveW, genW));
  }, []);

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-text">{result.title}</h3>
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
      <div className="flex flex-1 flex-wrap gap-2">
        <Button
          ref={saveRef}
          size="sm"
          variant="primary"
          // className="w-full sm:w-auto"
          style={btnWidth ? { width: btnWidth } : undefined}
        >
          Save
        </Button>
        <Button
          ref={genRef}
          size="sm"
          variant="primaryOutline"
          // className="w-full sm:w-auto"
          style={btnWidth ? { width: btnWidth } : undefined}
        >
          Generate variations
        </Button>
      </div>
    </Card>
  );
};

export default DiscoverResults;
