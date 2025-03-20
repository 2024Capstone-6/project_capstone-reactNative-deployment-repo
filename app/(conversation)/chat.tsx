import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChatScreen() {
  const { situation } = useLocalSearchParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={handleBack}
        />
        <ThemedText type="pageTitle">{situation}</ThemedText>
        <TouchableOpacity className="items-center justify-end ml-auto p-1 rounded-8 bg-[#ff6b6b]">
          <Text className="text-white">실전 회화</Text>
        </TouchableOpacity>
      </View>

      {/* 채팅 내용 */}
      <View className="flex-1 p-2">
        {/* AI 메시지 */}
        <View className="flex-row items-center">
          <Ionicons name="sparkles-outline" size={22} color="#ff6b6b" className="mr-2" />
          <View style={[styles.chat]}>
            <Text adjustsFontSizeToFit numberOfLines={1}>
              AI
            </Text>
          </View>
        </View>

        {/* 사용자 메시지 */}
        <View className="flex-row items-center justify-end">
          <View style={[styles.chat]}>
            <Text adjustsFontSizeToFit numberOfLines={1}>
              User
            </Text>
          </View>
          <Ionicons name="person" size={22} color="#ff6b6b" className="ml-2" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chat: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    height: 'auto',
    maxWidth: '80%',
    padding: 5,
    margin: 3,
    backgroundColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
});
