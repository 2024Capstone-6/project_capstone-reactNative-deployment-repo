import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiUrl = () => {
  const apiUrls = Constants.expoConfig?.extra?.apiUrl;

  if (!apiUrls) {
    return 'http://localhost:4000'; // 기본값
  }

  return Platform.select({
    web: apiUrls.web,
    android: apiUrls.android,
    ios: apiUrls.ios,
    default: apiUrls.default,
  });
};

export const ENV = {
  API_URL: getApiUrl(),
};
