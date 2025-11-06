import React from "react";
import { Plus } from "lucide-react";
import { colors } from "../shared/colors";
import { Card } from "../features/ui/Card";
import { GradientButton } from "../features/ui/GradientButton";
import { OutlineButton } from "../features/ui/OutlineButton";

const Settings = () => {
  return (
    <div className="px-4 py-6 space-y-3" style={{ backgroundColor: colors.bg }}>
      <Card className="space-y-2">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>Partner Link</div>
        <div className="grid grid-cols-2 gap-2">
          <GradientButton className="w-full py-3 text-sm">
            <Plus className="inline mr-1 h-4 w-4" /> Invite
          </GradientButton>
          <OutlineButton className="w-full py-3 text-sm">Copy link</OutlineButton>
        </div>
      </Card>
      <Card className="space-y-2">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>Reminders</div>
        <div className="grid grid-cols-2 gap-2">
          <OutlineButton className="w-full py-3 text-sm">Evening</OutlineButton>
          <OutlineButton className="w-full py-3 text-sm">Weekend</OutlineButton>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
