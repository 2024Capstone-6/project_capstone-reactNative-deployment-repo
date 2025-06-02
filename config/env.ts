import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  return Platform.select({
    web: apiUrls?.web || 'http://localhost:4000',
    android: apiUrls?.android || 'http://10.0.2.2:4000',
    ios: apiUrls?.ios || 'http://localhost:4000',
    default: apiUrls?.default || 'http://localhost:4000',
  });
};

// 환경 설정 객체
export const ENV = {
  API_URL: getApiUrl(),
};
