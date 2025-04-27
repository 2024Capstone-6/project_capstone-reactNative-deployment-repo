import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function QuizScreen() {
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
