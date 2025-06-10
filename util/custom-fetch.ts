import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTokenRefresh } from '../hooks/useTokenRefresh';

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('userToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  let response = await fetch(`${ENV.API_URL}/${endpoint}`, defaultOptions);

  // 토큰이 만료된 경우 갱신 시도
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${ENV.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        await AsyncStorage.setItem('userToken', data.accessToken);

        // 새로운 토큰으로 요청 재시도
        defaultOptions.headers = {
          ...defaultOptions.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        response = await fetch(`${ENV.API_URL}/${endpoint}`, defaultOptions);
      } else {
        // 리프레시 토큰도 만료된 경우
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Unauthorized');
    }
  }

  return response;
};

export default customFetch;
