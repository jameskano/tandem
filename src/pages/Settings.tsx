import React from 'react'
import SettingsPanel from '../components/SettingsPanel/SettingsPanel'

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
          <p className="text-textMuted">Manage your preferences</p>
        </div>

        <SettingsPanel />
      </div>
    </div>
  )
}

export default Settings