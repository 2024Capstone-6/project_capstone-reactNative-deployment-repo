import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '../contexts/AuthContext';
import { ENV } from '../config/env';

SplashScreen.preventAutoHideAsync();

// 인증 상태에 따른 라우팅을 처리하는 컴포넌트
const InitialLayout = () => {
  const segments = useSegments();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 인증 상태 변경 시 적절한 화면으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  // 토큰 유효성 검사 및 인증 상태 설정
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!token) {
        console.log('No token found');
        setIsAuthenticated(false);
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
        setIsAuthenticated(true);
      } else if (response.status === 401 && refreshToken) {
        // 액세스 토큰이 만료된 경우 리프레시 토큰으로 갱신 시도
        try {
          const refreshResponse = await fetch(`${ENV.API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            await AsyncStorage.setItem('userToken', accessToken);
            setIsAuthenticated(true);
          } else {
            // 리프레시 토큰도 만료된 경우
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          setIsAuthenticated(false);
        }
      } else {
        // 토큰이 유효하지 않은 경우
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
    }
  };

  // 네비게이션 스택 설정
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(conversation)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

// 앱의 루트 레이아웃 설정
export default function RootLayout() {
  // 폰트 로드
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // 앱의 전체 구조 설정 (인증 컨텍스트 및 테마 제공)
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <InitialLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
