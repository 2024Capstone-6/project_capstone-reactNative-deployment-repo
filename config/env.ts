import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 플랫폼별 API URL을 반환하는 함수
const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  /*   console.log('Platform:', Platform.OS);
  console.log('Selected URL:', Platform.select(apiUrls)); */

  return Platform.select({
    web: apiUrls.web,
    android: apiUrls.android,
    ios: apiUrls.ios,
    default: apiUrls.default,
  });
};

// 환경 설정 객체
export const ENV = {
  API_URL: getApiUrl(),
};
