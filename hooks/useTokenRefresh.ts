import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/config/env';

interface TokenRefreshResult {
  success: boolean;
  error?: string;
}

export const useTokenRefresh = () => {
  const refreshToken = async (refreshToken: string): Promise<TokenRefreshResult> => {
    try {
      const response = await fetch(`${ENV.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }

      const data = await response.json();

      if (!data.accessToken) {
        throw new Error('새로운 액세스 토큰이 없습니다.');
      }

      await AsyncStorage.setItem('userToken', data.accessToken);
      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '토큰 갱신 중 오류가 발생했습니다.',
      };
    }
  };

  return { refreshToken };
};
