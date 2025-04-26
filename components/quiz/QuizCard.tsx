import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface QuizCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizCard({ question, options, currentQuestion, totalQuestions }: QuizCardProps) {
  return (
    <View className="flex-1 w-full">
      {/* 문제 카드 */}
      <View className="h-[30%] bg-white rounded-lg p-6 shadow-sm border border-[#ff6b6b] mb-8">
        {/* 상단 진행바 */}
        <View className="flex-row items-center mb-6">
          <ThemedText className="text-lg">{currentQuestion}</ThemedText>
          <View className="flex-1 h-2 bg-gray-200 mx-2 rounded-full">
            <View
              className="h-2 bg-[#ff6b6b] rounded-full"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </View>
          <ThemedText className="text-lg">{totalQuestions}</ThemedText>
        </View>
        {/* 문제 텍스트를 감싸는 컨테이너 */}
        <View className="flex-1 justify-center">
          <ThemedText className="text-2xl text-center text-[#ff6b6b]">{question}</ThemedText>
        </View>
      </View>

      {/* 선택지 - 2x2 그리드 */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {options.map((option, index) => (
          <View key={index} className="w-[48%] h-full bg-white p-4 rounded-lg border border-[#ff6b6b] justify-center">
            <ThemedText className="text-lg text-center">{option}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}
