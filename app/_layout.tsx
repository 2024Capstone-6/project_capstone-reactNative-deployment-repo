import { useEffect, useState } from 'react';

import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import '../global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ENV } from '@/config/env';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

// 타입 정의
type AuthState = {
  isAuthenticated: boolean | null;
  isLoading: boolean;
};

// 초기 상태
const initialAuthState: AuthState = {
  isAuthenticated: null,
  isLoading: true,
};

SplashScreen.preventAutoHideAsync();

// 인증 상태 관리 훅
const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const router = useRouter();
  const segments = useSegments();
  const { refreshToken } = useTokenRefresh();

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 인증 상태 변경 시 적절한 화면으로 리다이렉트
  useEffect(() => {
    if (authState.isAuthenticated === null) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!authState.isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (authState.isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [authState.isAuthenticated, segments]);

  const clearAuthTokens = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
    } catch (error) {
      console.error('Error clearing auth tokens:', error);
    }
  };

  // 토큰 갱신 처리
  const handleTokenRefresh = async (token: string) => {
    const result = await refreshToken(token);
    if (result.success) {
      setAuthState({ isAuthenticated: true, isLoading: false });
    } else {
      await clearAuthTokens();
      setAuthState({ isAuthenticated: false, isLoading: false });
    }
  };

  // 토큰 유효성 검사 및 인증 상태 설정
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!token) {
        setAuthState({ isAuthenticated: false, isLoading: false });
        return;
      }

      // 프로필 정보 요청
      const response = await fetch(`${ENV.API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setAuthState({ isAuthenticated: true, isLoading: false });
      } else if (response.status === 401 && refreshToken) {
        await handleTokenRefresh(refreshToken);
      } else {
        await clearAuthTokens();
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      await clearAuthTokens();
      setAuthState({ isAuthenticated: false, isLoading: false });
    }
  };

  return authState;
};

// 네비게이션 스택 컴포넌트
const NavigationStack = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(conversation)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

// 앱의 루트 레이아웃
export default function RootLayout() {
  // 폰트 로드
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // 앱의 전체 구조 설정 (인증 컨텍스트 및 테마 제공)
  return (
    <ErrorBoundary>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(conversation)" options={{ headerShown: false }} />
            <Stack.Screen name="(settings)/settings" options={{ headerShown: false }} />
            <Stack.Screen name="(quiz)/single" options={{ headerShown: false }} />
            <Stack.Screen name="(quiz)/multi" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
