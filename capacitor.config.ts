import type { CapacitorConfig } from '@capacitor/cli';

const isDevServerEnabled = process.env.CAPACITOR_DEV_SERVER === 'true';

const config: CapacitorConfig = {
  appId: 'com.tandem.app',
  appName: 'Tandem',
  webDir: 'dist',
  ...(isDevServerEnabled
    ? {
        server: {
          url: process.env.CAPACITOR_DEV_SERVER_URL ?? 'http://localhost:3000',
          cleartext: true,
        },
      }
    : {}),
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      iconColor: '#FF6B81',
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#FFF7F8',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
