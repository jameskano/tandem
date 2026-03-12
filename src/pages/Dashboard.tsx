import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { COLORS } from '../shared/colors';
import { usePlansStore } from '../hooks/usePlansStore';
import { seedData } from '../shared/seed';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import Chip from '../shared/ui/Chip';
import GradientButton from '../shared/ui/GradientButton';
import Textarea from '../shared/ui/Textarea';
import useUtils from '../hooks/useUtils';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const { getDiscoverLabelText, getDiscoverPlaceholderText } = useUtils();
  const discoverLabel = useMemo(
    () => getDiscoverLabelText(),
    [getDiscoverLabelText]
  );
  const discoverPlaceholder = useMemo(
    () => getDiscoverPlaceholderText(),
    [getDiscoverPlaceholderText]
  );

  const canGenerate = prompt.trim().length > 0;

  return (
    <div
      className="flex flex-1 flex-col space-y-4 px-4 py-6"
      style={{ backgroundColor: COLORS.bg }}
    >
      <h1
        className="text-2xl font-bold text-text"
        style={{ color: COLORS.text }}
      >
        Discover
      </h1>
      <Card className="space-y-4">
        <Textarea
          label={discoverLabel}
          placeholder={discoverPlaceholder}
          autoResize
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button size="md" disabled={!canGenerate}>
            Generate ideas
          </Button>
        </div>
        <div>
          <Link
            to="/discover"
            state={{ prompt }}
            className="py-4 text-sm font-medium"
            style={{ color: COLORS.primary }}
          >
            More options
          </Link>
        </div>
      </Card>

      <div className="flex flex-1 flex-col gap-y-3">
        <div className="flex h-full w-full items-center justify-center">
          No upcoming Plans
        </div>
        {/* <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-semibold"
              style={{ color: COLORS.text }}
            >
              Next up
            </h3>
            <Chip>Sat 18:00</Chip>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <CalendarDays className="opacity-80" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: COLORS.text }}>
                Homemade sushi night
              </div>
              <div className="text-xs" style={{ color: COLORS.muted }}>
                Shopping list done, with jazz music playlist
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GradientButton className="w-full py-3 text-sm">
              Completed
            </GradientButton>
            <Button variant="primaryOutline" className="w-full py-3 text-sm">
              Reschedule
            </Button>
          </div>
        </Card> */}

        {/* <Card>
          <div className="text-center">
            <p className="mb-1 text-2xl font-bold text-accent">
              {upcomingPlans.length}
            </p>
            <p className="text-textMuted text-sm">Upcoming Plans</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="mb-1 text-2xl font-bold text-secondary">
              {completedPlans.length}
            </p>
            <p className="text-textMuted text-sm">Completed</p>
          </div>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
