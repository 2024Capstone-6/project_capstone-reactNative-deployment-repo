import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function QuizScreen() {
  const { connect, disconnect } = useSocket();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      console.log('퀴즈 페이지 진입, 소켓 연결 시도...');
      connect();
    }

    // 페이지를 벗어날 때 소켓 연결 해제
    return () => {
      console.log('퀴즈 페이지 이탈, 소켓 연결 해제...');
      disconnect();
    };
  }, [isSignedIn]);

  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="mb-8">
        게임 모드를 선택하세요
      </ThemedText>

      <View className="w-full px-8 space-y-4">
        <TouchableOpacity
          className="bg-[#ff6b6b] p-4 rounded-lg items-center"
          onPress={() => router.push('/(quiz)/single')}
        >
          <ThemedText className="text-white text-lg">싱글 게임</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 rounded-lg bg-white border-2 border-[#ff6b6b] items-center mt-2"
          onPress={() => router.push('/(quiz)/multi')}
        >
          <ThemedText className="text-[#ff6b6b] text-lg">멀티 게임</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
