import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

export default function QuizScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title">퀴즈를 풀어보세요!</ThemedText>
    </View>
  );
}
