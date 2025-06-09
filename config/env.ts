import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  return Platform.select({
    web: apiUrls?.web || 'http://52.79.43.250:4000/ ',
    android: apiUrls?.android || 'http://52.79.43.250:4000',
    ios: apiUrls?.ios || 'http://52.79.43.250:4000',
    default: apiUrls?.default || 'http://52.79.43.250:4000',
  });
};

// 환경 설정 객체
export const ENV = {
  API_URL: getApiUrl(),
};
