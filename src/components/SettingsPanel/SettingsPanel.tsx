import React, { useState } from 'react'
import Card from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import { registerPush, scheduleLocal } from '../../services/notifications'
import { generateInviteCode } from '../../shared/utils/format'

const SettingsPanel: React.FC = () => {
  const [inviteCode] = useState(generateInviteCode())
  const [isPushEnabled, setIsPushEnabled] = useState(false)

  const handleEnablePush = async () => {
    try {
      await registerPush((token) => {
        console.log('Push token received:', token)
        setIsPushEnabled(true)
        // Here you would save the token to Supabase
      })
    } catch (error) {
      console.error('Error enabling push notifications:', error)
    }
  }

  const handleTestNotification = async () => {
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(10, 0, 0, 0) // 10 AM tomorrow
      
      await scheduleLocal(
        'Tandem Reminder',
        'Don\'t forget your planned activity!',
        tomorrow
      )
    } catch (error) {
      console.error('Error scheduling notification:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Partner Link */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Partner Link</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Invite Code
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inviteCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-text"
              />
              <Button size="sm" variant="outline">
                Copy
              </Button>
            </div>
            <p className="text-sm text-textMuted mt-2">
              Share this code with your partner to connect your accounts
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">Push Notifications</h3>
              <p className="text-sm text-textMuted">
                Get reminders about your planned activities
              </p>
            </div>
            <Button
              variant={isPushEnabled ? 'primary' : 'outline'}
              size="sm"
              onClick={handleEnablePush}
            >
              {isPushEnabled ? 'Enabled' : 'Enable'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">Test Notification</h3>
              <p className="text-sm text-textMuted">
                Schedule a test notification for tomorrow
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
            >
              Test
            </Button>
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">App Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">Dark Mode</h3>
              <p className="text-sm text-textMuted">
                Switch between light and dark themes
              </p>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">Data Export</h3>
              <p className="text-sm text-textMuted">
                Export your data and memories
              </p>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">About</h2>
        <div className="space-y-2 text-sm text-textMuted">
          <p>Version 1.0.0</p>
          <p>Built with ❤️ for couples</p>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPanel
