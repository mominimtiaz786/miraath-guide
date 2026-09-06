import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.islamictools.miraathguide',
  appName: 'Miraath Guide',
  // Written by `ng build mirath-guide-app`; `npx cap sync` copies it into the
  // native projects. Kept separate from the SSR build's dist/mirath-guide.
  webDir: 'dist/mirath-guide-app/browser',
  plugins: {
    SplashScreen: {
      // The app hides this itself once the first route has painted
      // (NativeShellService), so autoHide would only race that.
      launchAutoHide: false,
      backgroundColor: '#17483f',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      // The WebView runs full-screen on both platforms. iOS reserves the strip
      // in CSS via env(safe-area-inset-top); Android cannot (its WebView
      // reports those insets as 0px), so MainActivity pads the content view
      // instead. DARK means light glyphs, which is what the brand green behind
      // the status bar needs.
      overlaysWebView: true,
      style: 'DARK',
    },
  },
  ios: {
    contentInset: 'never',
  },
  android: {
    // The calculation engine is pure client-side arithmetic and every asset is
    // bundled, so the app never needs cleartext network access.
    allowMixedContent: false,
  },
};

export default config;
