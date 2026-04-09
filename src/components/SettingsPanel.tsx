import React, { useState } from 'react'
import Card from '../shared/ui/Card'
import Button from '../shared/ui/Button'
import { useI18n } from '../shared/i18n/useI18n'
import { registerPush, scheduleLocal } from '../services/notifications'
import { generateInviteCode } from '../shared/utils/format'

const SettingsPanel: React.FC = () => {
  const { t } = useI18n()
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
        t('settings.reminderTitle'),
        t('settings.reminderBody'),
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
        <h2 className="text-lg font-semibold text-text mb-4">{t('settings.partnerLink')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('settings.inviteCode')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inviteCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-text"
              />
              <Button size="sm" variant="outline">
                {t('common.copy')}
              </Button>
            </div>
            <p className="text-sm text-textMuted mt-2">
              {t('settings.inviteDescription')}
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">{t('settings.notifications')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">{t('settings.pushNotifications')}</h3>
              <p className="text-sm text-textMuted">
                {t('settings.pushDescription')}
              </p>
            </div>
            <Button
              variant={isPushEnabled ? 'primary' : 'outline'}
              size="sm"
              onClick={handleEnablePush}
            >
              {isPushEnabled ? t('settings.enabled') : t('settings.enable')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">{t('settings.testNotification')}</h3>
              <p className="text-sm text-textMuted">
                {t('settings.testDescription')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
            >
              {t('settings.test')}
            </Button>
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">{t('settings.appSettings')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">{t('settings.darkMode')}</h3>
              <p className="text-sm text-textMuted">
                {t('settings.darkModeDescription')}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t('settings.toggle')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text">{t('settings.dataExport')}</h3>
              <p className="text-sm text-textMuted">
                {t('settings.dataExportDescription')}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t('settings.export')}
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">{t('settings.about')}</h2>
        <div className="space-y-2 text-sm text-textMuted">
          <p>{t('settings.version')}</p>
          <p>{t('settings.builtForCouples')}</p>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPanel
