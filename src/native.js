// Bundled into www/native.js for the Android app only (see scripts/build-web.mjs).
// Exposes the Capacitor plugins to script.js, which stays a plain browser script.
import { Capacitor, SystemBars } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';

window.NativeApp = {
  isNative: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform(),
  App,
  Haptics,
  LocalNotifications,
  SplashScreen,
  SystemBars,
};
