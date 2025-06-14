import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  console.log('Platform:', Platform.OS);
  console.log('API URLs:', apiUrls);
  console.log('Selected URL:', Platform.select(apiUrls));

  return Platform.select({
    web: apiUrls?.web || 'http://localhost:4000/api',
    android: apiUrls?.android || 'http://10.0.2.2:4000/api',
    ios: apiUrls?.ios || 'http://localhost:4000/api',
    default: apiUrls?.default || 'http://localhost:4000/api',
  });
};

// Socket.IO 서버 URL을 반환하는 함수
const getSocketUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;
  const baseUrl = Platform.select({
    web: apiUrls?.web || 'http://localhost:4000',
    android: apiUrls?.android || 'http://10.0.2.2:4000',
    ios: apiUrls?.ios || 'http://localhost:4000',
    default: apiUrls?.default || 'http://localhost:4000',
  });

  // /api 부분 제거
  return baseUrl?.replace('/api', '');
};

// 환경 설정 객체
export const ENV = {
  API_URL: getApiUrl(),
  SOCKET_URL: getSocketUrl(),
};
