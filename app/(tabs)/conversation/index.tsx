import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ConversationScreen() {
  const [expandedButton, setExpandedButton] = useState<number | null>(null);
  const router = useRouter();

  const handlePress = (buttonIndex: number) => {
    setExpandedButton(expandedButton === buttonIndex ? null : buttonIndex);
  };

  const handleSituationPress = (situation: string) => {
    router.push({
      pathname: '/(conversation)/chat',
      params: { situation },
    });
  };

  return (
    <View className="flex-1 m-4 p-4">
      <View className="flex-1 items-start justify-center">
        <ThemedText type="subtitle" className="mb-1">
          상황에 따른 연습이 필요하신가요?
        </ThemedText>
        <ThemedText type="subtitle" className="mb-3">
          전체적인 피드백을 받을 수 있습니다.
        </ThemedText>
        <ThemedText type="title">다양한 상황을 선택하여</ThemedText>
        <ThemedText type="title" className="mb-4">
          챗봇과 대화해보세요!
        </ThemedText>

        <TouchableOpacity
          className={`w-full ${
            expandedButton === 0 ? 'h-[20%]' : 'h-[8%] border-2 border-[#ff6b6b] bg-white'
          } mb-2 rounded-xl items-center justify-center`}
          onPress={() => handlePress(0)}
        >
          {expandedButton === 0 ? (
            <View className="w-full h-full">
              <View className="h-[40%] border-2 border-[#ff6b6b] bg-white rounded-xl items-center justify-center">
                <Text className="text-xl">여행 중</Text>
              </View>
              <View className="flex-row flex-wrap items-start justify-start w-full mt-1">
                <Text style={styles.situationButton} onPress={() => handleSituationPress('공항에서')}>
                  공항에서
                </Text>
                <Text style={styles.situationButton}>호텔에서</Text>
                <Text style={styles.situationButton}>대중교통에서</Text>
                <Text style={styles.situationButton}>관광지에서</Text>
                <Text style={styles.situationButton}>길 묻기</Text>
              </View>
            </View>
          ) : (
            <Text className="text-xl">여행 중</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-full ${
            expandedButton === 1 ? 'h-[20%]' : 'h-[8%] border-2 border-[#ff6b6b] bg-white'
          } mb-2 items-center justify-center rounded-xl`}
          onPress={() => handlePress(1)}
        >
          {expandedButton === 1 ? (
            <View className="w-full h-full">
              <View className="h-[40%] border-2 border-[#ff6b6b] bg-white rounded-xl items-center justify-center">
                <Text className="text-xl">일상생활에서</Text>
              </View>
              <View className="flex-row flex-wrap items-start justify-start w-full mt-1">
                <Text style={styles.situationButton} onPress={() => handleSituationPress('병원에서')}>
                  병원에서
                </Text>
                <Text style={styles.situationButton}>은행에서</Text>
                <Text style={styles.situationButton}>날씨 변화 대응</Text>
                <Text style={styles.situationButton}>대중교통에서</Text>
                <Text style={styles.situationButton}>우편물 수령</Text>
              </View>
            </View>
          ) : (
            <Text className="p-2 text-xl">일상생활에서</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-full ${
            expandedButton === 2 ? 'h-[20%]' : 'h-[8%] border-2 border-[#ff6b6b] bg-white'
          } mb-2 items-center justify-center rounded-xl`}
          onPress={() => handlePress(2)}
        >
          {expandedButton === 2 ? (
            <View className="w-full p-4">
              <Text className="text-lg">기타 관련 추가 내용</Text>
            </View>
          ) : (
            <Text className="text-xl">기타</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  situationButton: {
    margin: 3,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 3,
    backgroundColor: 'white',
  },
});
