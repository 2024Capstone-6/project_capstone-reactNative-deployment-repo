import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  return Platform.select({
    web: apiUrls.web,
    android: apiUrls.android,
    ios: apiUrls.ios,
    default: apiUrls.default,
  });
};

// 환경 설정 객체
export const ENV = {
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  API_URL: getApiUrl(),
};
