import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';

// import SituationChat from '@/components/conversation/SituationChat';
import AIChat from '@/components/conversation/AIChat';
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
        <TouchableOpacity className="justify-end ml-auto p-1 rounded-8 bg-[#ff6b6b]">
          <Text className="text-white">실전 회화</Text>
        </TouchableOpacity>
      </View>

      {/* 채팅 내용 */}
      <ScrollView className="flex-1 mt-6" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* AI 메시지 */}
        <View className="flex-row items-start mb-4">
          <Ionicons name="sparkles-outline" size={22} color="#ff6b6b" style={styles.icon} />
          <View style={styles.chat}>
            {/* 학습이면 저장된 문장, 실전이면 AI가 보낸 문장 */}
            <Text>안녕하세요! {situation}에 대해 도움이 필요하신가요?</Text>
          </View>
        </View>

        {/* 사용자 메시지 */}
        <View className="flex-row items-start justify-end mb-4">
          <View style={styles.chat}>
            {/* 학습이면 한국어버전, 실전이면 사용자가 입력한 문장 */}
            <Text>네, 도움이 필요합니다.</Text>
          </View>
          <Ionicons name="person" size={22} color="#ff6b6b" style={styles.icon} />
        </View>
      </ScrollView>

      <View className="flex-1">
        {/* <SituationChat /> */}
        <AIChat />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  chat: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
});
