import { Capacitor } from '@capacitor/core';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const getPlatformClassName = () =>
  isNativeApp() ? 'platform-native' : 'platform-web';
