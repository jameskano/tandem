import React from 'react';
import SettingsPanel from '../components/SettingsPanel';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-text">Settings</h1>
          <p className="text-textMuted">Manage your preferences</p>
        </div>

        <SettingsPanel />
      </div>
    </div>
  );
};

export default Settings;
