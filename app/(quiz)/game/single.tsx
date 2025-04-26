import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { QuizCard } from '@/components/quiz/QuizCard';

export default function SingleGameScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams();

  // 임시 데이터
  const mockQuizData = {
    question: '行方不明',
    options: ['ゆくえふめ', 'ゆくえふめい', 'いくえふめ', 'いくえふめい'],
    currentQuestion: 4,
    totalQuestions: 10,
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-20">
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
          {level} 레벨 퀴즈
        </ThemedText>
      </View>

      {/* 퀴즈 카드 */}
      <QuizCard {...mockQuizData} />
    </View>
  );
}
