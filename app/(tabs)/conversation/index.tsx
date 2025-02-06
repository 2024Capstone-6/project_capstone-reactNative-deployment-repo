import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

export default function ConversationScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title">다양한 상황을 선택하여 챗봇과 대화해보세요!</ThemedText>
    </View>
  );
}
