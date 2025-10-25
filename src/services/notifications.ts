import { PushNotifications } from '@capacitor/push-notifications'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export const registerPush = async (onToken: (token: string) => void): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Push notifications not available on web platform')
    return
  }

  try {
    // Request permissions
    const permStatus = await PushNotifications.requestPermissions()
    
    if (permStatus.receive === 'granted') {
      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register()

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value)
        onToken(token.value)
      })

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ' + JSON.stringify(err))
      })

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification)
      })

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue)
      })
    } else {
      console.warn('Push notification permissions not granted')
    }
  } catch (error) {
    console.error('Error registering push notifications:', error)
  }
}

export const scheduleLocal = async (
  title: string,
  body: string,
  when: Date
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Local notifications not available on web platform')
    return
  }

  try {
    const permStatus = await LocalNotifications.requestPermissions()
    
    if (permStatus.display === 'granted') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: when },
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      })
    } else {
      console.warn('Local notification permissions not granted')
    }
  } catch (error) {
    console.error('Error scheduling local notification:', error)
  }
}

export const cancelAllNotifications = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Local notifications not available on web platform')
    return
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: Date.now() }] })
  } catch (error) {
    console.error('Error canceling notifications:', error)
  }
}
