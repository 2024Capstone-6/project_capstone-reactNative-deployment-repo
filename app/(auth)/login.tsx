import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // 응답 타입 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('서버 응답이 잘못되었습니다. API 서버를 확인해주세요.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      await AsyncStorage.setItem('userToken', data.token);
      console.log('로그인 성공');
      router.replace('/(tabs)');
    } catch (err) {
      console.log('로그인 에러:', err);
      if (err instanceof TypeError && err.message.includes('Network request failed')) {
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      }
    }
  }; */

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: Colors.tint }}>
      <View className="h-[35%] p-4 ml-2 mb-10 flex-col items-start justify-end">
        <Text className="text-white text-4xl font-bold">배우는 즐거움, </Text>
        <Text className="text-white text-4xl font-bold">이곳에서 시작하세요!</Text>
      </View>

      <View className="p-2 h-[65%] rounded-tl-[100px] flex-1" style={{ backgroundColor: Colors.background }}>
        {/* 이메일 입력 */}
        <ThemedText type="default" className="mt-14 p-1">
          Email
        </ThemedText>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* 비밀번호 입력 */}
        <ThemedText type="default" className="mt-2 p-1">
          Password
        </ThemedText>

        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        {/* 로그인 버튼 */}
        <TouchableOpacity className="bg-[#ff6b6b] p-2.5 rounded-lg mt-2.5" /* onPress={handleLogin} */>
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
