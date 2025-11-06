import React from "react";
import { CalendarDays, Compass, Clock, Check } from "lucide-react";
import { colors } from "../shared/colors";
import { Card } from "../features/ui/Card";
import { Chip } from "../features/ui/Chip";
import { GradientButton } from "../features/ui/GradientButton";
import { OutlineButton } from "../features/ui/OutlineButton";

const Stat = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <Card>
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: colors.bg }}>{icon}</div>
      <div>
        <div className="text-xl font-bold" style={{ color: colors.text }}>{value}</div>
        <div className="text-xs" style={{ color: colors.textMuted }}>{label}</div>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="px-4 py-6 space-y-4" style={{ backgroundColor: colors.bg }}>
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>Next up</h3>
          <Chip>Sat 18:00</Chip>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <CalendarDays className="opacity-80" />
          </div>
          <div>
            <div className="font-semibold" style={{ color: colors.text }}>Homemade sushi night 🍣</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>Shopping list ready · 2h</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GradientButton className="w-full py-3 text-sm">Start</GradientButton>
          <OutlineButton className="w-full py-3 text-sm">Reschedule</OutlineButton>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Weekly" value={3} icon={<Compass />} />
        <Stat label="Streak" value={"7d"} icon={<Clock />} />
        <Stat label="Done" value={24} icon={<Check />} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-sm font-semibold" style={{ color: colors.text }}>🌌 Stargazing</div>
          <GradientButton className="mt-2 text-sm py-2">Schedule</GradientButton>
        </Card>
        <Card>
          <div className="text-sm font-semibold" style={{ color: colors.text }}>🏛️ Museum</div>
          <OutlineButton className="mt-2 text-sm py-2">Add</OutlineButton>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <OutlineButton className="justify-start">📅 Plan Activity</OutlineButton>
          <OutlineButton className="justify-start">🎯 Set Goal</OutlineButton>
          <OutlineButton className="justify-start">📸 Add Photo</OutlineButton>
          <OutlineButton className="justify-start">🔍 Discover</OutlineButton>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
