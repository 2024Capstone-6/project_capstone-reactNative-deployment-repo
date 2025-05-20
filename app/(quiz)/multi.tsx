import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEST_LEVELS } from '@/constants/TestLevels';

export default function SingleGameScreen() {
  const handleBack = () => router.back();

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      {/* 상단 헤더: 뒤로가기, 제목 */}
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={handleBack}
        />
        <ThemedText type="title" className="mt-1 ml-2">
          참가할 방을 선택해주세요!
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <TouchableOpacity
            className="flex-row justify-between items-center p-2 rounded-md mb-2 bg-white border border-[#ff6b6b]"
            onPress={() => router.push(`/(quiz)/game/inMulti`)}
          >
            <ThemedText className="text-md">방 이름</ThemedText>
            <ThemedText className="text-sm text-[#a1a1a1]">1/4</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
