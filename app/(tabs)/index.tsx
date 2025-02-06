import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="pageTitle">Home</ThemedText>
    </View>
  );
}
