import 'dotenv/config';

module.exports = {
  name: 'NihonClover',
  slug: 'nihon-clover',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo.png',
  userInterfaceStyle: 'light',
  scheme: 'nihonclover',
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ff6b6b'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    bundleIdentifier: 'com.dlatth.nihonclover',
    supportsTablet: true
  },
  android: {
    package: 'com.dlatth.nihonclover',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ff6b6b'
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    '@react-native-google-signin/google-signin'
  ],
  newArchEnabled: true,
  extra: {
    apiUrl: {
      web: process.env.BACKEND_URL,
      android: process.env.BACKEND_URL,
      ios: process.env.BACKEND_URL,
      default: process.env.BACKEND_URL,
    },
    router: {
      origin: false,
    },
    eas: {
      projectId: '40e9fa98-cd5d-40c9-851b-7c643ed2324a',
    },
  },
};
