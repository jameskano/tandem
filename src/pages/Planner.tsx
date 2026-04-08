import React, { useEffect } from 'react';
import PlannerGrid from '../components/PlannerGrid';
import { usePlansStore } from '../hooks/usePlansStore';
import { seedData } from '../shared/seed';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';

const Planner: React.FC = () => {
  const { t } = useI18n();
  const { plans, addPlan } = usePlansStore();

  // Load seed data on first visit
  useEffect(() => {
    if (plans.length === 0) {
      seedData.plans.forEach(addPlan);
    }
  }, [plans.length, addPlan]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-text">
            {t('planner.title')}
          </h1>
          <p className="text-textMuted">{t('planner.subtitle')}</p>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {t('planner.thisMonth')}
            </h2>
            <Button>{t('planner.addPlan')}</Button>
          </div>

          <PlannerGrid />
        </div>
      </div>
    </div>
  );
};

export default Planner;
