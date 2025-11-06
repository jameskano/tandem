import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { colors } from "../shared/colors";
import { Card } from "../features/ui/Card";
import { Chip } from "../features/ui/Chip";
import { GradientButton } from "../features/ui/GradientButton";
import { OutlineButton } from "../features/ui/OutlineButton";

const Main = () => {
  return (
    <div className="px-4 py-6 space-y-4" style={{ backgroundColor: colors.bg }}>
      <div className="inline-flex items-center gap-2">
        <Heart style={{ color: colors.primary }} />
        <span className="uppercase tracking-wide text-[11px]" style={{ color: colors.textMuted }}>Tandem</span>
      </div>

      <h1 className="text-3xl font-bold leading-tight" style={{ color: colors.text }}>
        Find time for <span style={{ color: colors.primary }}>us</span> again.
      </h1>
      <p className="text-sm" style={{ color: colors.textMuted }}>
        Plan, play, and grow together with thoughtful suggestions and a synced schedule.
      </p>

      <div className="flex flex-col gap-2 pt-1">
        <GradientButton className="w-full text-sm py-3">
          <Sparkles className="inline mr-2 h-4 w-4" />
          Discover activities
        </GradientButton>
        <OutlineButton className="w-full text-sm py-3">
          Sync with your partner
        </OutlineButton>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Card>
          <div className="text-sm font-semibold" style={{ color: colors.text }}>🍝 Cook a new recipe</div>
          <Chip>Suggested</Chip>
        </Card>
        <Card>
          <div className="text-sm font-semibold" style={{ color: colors.text }}>🌅 Sunset walk</div>
          <Chip>Suggested</Chip>
        </Card>
      </div>
    </div>
  );
};
export default Main;
