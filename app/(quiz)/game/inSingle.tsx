import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useEffect, useState } from 'react';
import customFetch from '../../../util/custom-fetch';

interface WordData {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
  word_level: string;
  word_quiz: string[];
}

export default function SingleGameScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const TOTAL_QUESTIONS = 10;

  const fetchNewWord = async () => {
    try {
      setLoading(true);
      const response = await customFetch(`quiz-game/solo?level=${level}`);
      if (!response.ok) {
        throw new Error('단어를 불러오는데 실패했습니다');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setWordData(data);
    } catch (error) {
      console.error('단어 불러오기 실패:', error);
      router.back();
      alert('데이터가 존재하지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewWord();
  }, [level]);

  const handleAnswer = (selectedAnswer: string) => {
    if (!wordData) return false;

    const answer = wordData.word;
    const isCorrect = selectedAnswer === answer;

    if (isCorrect) {
      setTimeout(() => {
        if (currentQuestion < TOTAL_QUESTIONS) {
          setCurrentQuestion((prev) => prev + 1);
          fetchNewWord();
        } else {
          router.push(`/(quiz)/result?level=${level}`);
        }
      }, 1000);
    }
    return isCorrect;
  };

  if (loading) {
    return (
      <View className="flex-1 h-full m-[5%] p-4 top-20 justify-center items-center">
        <ThemedText>로딩중...</ThemedText>
      </View>
    );
  }

  if (!wordData) {
    return (
      <View className="flex-1 h-full m-[5%] p-4 top-20 justify-center items-center">
        <ThemedText>단어를 불러오는데 실패했습니다</ThemedText>
      </View>
    );
  }

  const quizData = {
    question: wordData.word,
    options: wordData.word_quiz,
    currentQuestion,
    totalQuestions: TOTAL_QUESTIONS,
    onAnswer: handleAnswer,
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-20">
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={() => router.push('/(quiz)/single')}
        />
        <ThemedText type="title" className="mt-1 ml-2">
          {level} 레벨 퀴즈
        </ThemedText>
      </View>

      {/* 퀴즈 카드 */}
      <QuizCard {...quizData} />
    </View>
  );
}
