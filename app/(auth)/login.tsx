import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../contexts/AuthContext'; // 인증 상태 관리
import { ENV } from '../../config/env'; // 백엔드 서버 주소 설정

export default function Login() {
  const router = useRouter();
  const { setIsSignedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      // 입력값 유효성 검사
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      // 로그인 API 요청
      const response = await fetch(`${ENV.API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 에러 처리
      if (!response.ok) {
        throw new Error(
          data.message === 'Invalid credentials'
            ? '이메일 또는 비밀번호가 올바르지 않습니다.'
            : data.message || '로그인에 실패했습니다.'
        );
      }

      // 토큰 검증
      if (!data.accessToken) {
        throw new Error('Token is missing');
      }

      // 로그인 성공 처리
      await AsyncStorage.setItem('userToken', data.accessToken);
      setIsSignedIn(true);

      if (Platform.OS === 'web') {
        window.location.href = '/';
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: Colors.tint }}>
      {/* 헤더 섹션 */}
      <View className="h-[35%] p-4 ml-2 mb-10 flex-col items-start justify-end">
        <Text className="text-white text-4xl font-bold">배우는 즐거움,</Text>
        <Text className="text-white text-4xl font-bold">이곳에서 시작하세요!</Text>
      </View>

      {/* 로그인 폼 */}
      <View className="p-2 h-[65%] rounded-tl-[100px] flex-1" style={{ backgroundColor: Colors.background }}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <ThemedText type="default" className="mt-14 p-1">
          Email
        </ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="이메일을 입력하세요"
        />

        <ThemedText type="default" className="mt-2 p-1">
          Password
        </ThemedText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="비밀번호를 입력하세요"
        />

        {/* 로그인 버튼 */}
        <TouchableOpacity className="bg-[#ff6b6b] p-2.5 rounded-lg mt-2.5" onPress={handleLogin}>
          <Text className="text-white text-center font-semibold text-base">Login</Text>
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity
          className="bg-white p-2.5 rounded-lg mt-2 border border-[#ff6b6b]"
          onPress={() => router.push('/register')}
        >
          <Text className="text-center font-semibold text-base">Sign up</Text>
        </TouchableOpacity>

        {/* 구분선 */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>
      </View>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
