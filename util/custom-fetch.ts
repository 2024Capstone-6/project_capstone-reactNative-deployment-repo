import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`[customFetch] 요청 시작: ${endpoint}`, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body,
  });

  const token = await AsyncStorage.getItem('userToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  console.log('[customFetch] 토큰 상태:', {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
  });

  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const defaultOptions: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(`${ENV.API_URL}/${endpoint}`, defaultOptions);
  console.log(`[customFetch] 첫 번째 응답:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  // 토큰이 만료된 경우 갱신 시도
  if (response.status === 401 && refreshToken) {
    console.log('[customFetch] 토큰 만료 감지, 갱신 시도');
    try {
      const refreshResponse = await fetch(`${ENV.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('[customFetch] 토큰 갱신 응답:', {
        status: refreshResponse.status,
        statusText: refreshResponse.statusText,
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        console.log('[customFetch] 새로운 토큰 발급 성공');
        await AsyncStorage.setItem('userToken', data.accessToken);

        // 새로운 토큰으로 요청 재시도 (원래 요청의 모든 옵션 유지)
        const retryOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${data.accessToken}`,
          },
        };
        console.log('[customFetch] 새로운 토큰으로 요청 재시도');
        response = await fetch(`${ENV.API_URL}/${endpoint}`, retryOptions);
        console.log('[customFetch] 재시도 응답:', {
          status: response.status,
          statusText: response.statusText,
        });
      } else {
        console.log('[customFetch] 토큰 갱신 실패');
        // 리프레시 토큰도 만료된 경우
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.error('[customFetch] 토큰 갱신 중 에러:', error);
      throw new Error('Unauthorized');
    }
  }

  return response;
};

export default customFetch;
