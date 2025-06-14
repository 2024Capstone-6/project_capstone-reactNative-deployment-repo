import 'dotenv/config';

export default {
  expo: {
    name: '日本クローバー',
    slug: 'nihon-clover',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#f5f5f5',
      },
      package: 'com.team6.nihonclover',
    },
    plugins: ['expo-router'],
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
  },
};
