import React, { useEffect } from 'react';
import PlannerGrid from '../components/PlannerGrid/PlannerGrid';
import { usePlansStore } from '../hooks/usePlansStore';
import { seedData } from '../shared/seed';
import Button from '../shared/ui/Button';

const Planner: React.FC = () => {
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
          <h1 className="mb-2 text-2xl font-bold text-text">Planner</h1>
          <p className="text-textMuted">Schedule your activities together</p>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">This Month</h2>
            <Button>Add Plan</Button>
          </div>

          <PlannerGrid />
        </div>
      </div>
    </div>
  );
};

export default Planner;
