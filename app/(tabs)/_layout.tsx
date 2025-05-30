import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '@/constants/Colors';

// 탭 아이콘 타입 정의
type TabIconName = 'home' | 'book' | 'chatbubbles' | 'person';

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversation/index"
        options={{
          title: '대화',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz/index"
        options={{
          title: '퀴즈',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user/index"
        options={{
          title: '프로필',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
