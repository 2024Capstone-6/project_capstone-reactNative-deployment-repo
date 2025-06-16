import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  console.log('Platform:', Platform.OS);
  console.log('API URLs:', apiUrls);
  console.log('Selected URL:', Platform.select(apiUrls));

  return Platform.select({
    web: apiUrls?.web || 'https://yoajung.store/api',
    android: apiUrls?.android || 'https://yoajung.store/api',
    ios: apiUrls?.ios || 'https://yoajung.store/api',
    default: apiUrls?.default || 'https://yoajung.store/api',
  });
};

// Socket.IO 서버 URL을 반환하는 함수
const getSocketUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;
  const baseUrl = Platform.select({
    web: apiUrls?.web || 'http://52.79.43.250:4000',
    android: apiUrls?.android || 'http://52.79.43.250:4000',
    ios: apiUrls?.ios || 'http://52.79.43.250:4000',
    default: apiUrls?.default || 'http://52.79.43.250:4000',
  });

  // /api 부분 제거
  return baseUrl?.replace('/api', '');
};

// 환경 설정 객체
export const ENV = {
  API_URL: getApiUrl(),
  SOCKET_URL: getSocketUrl(),
};
