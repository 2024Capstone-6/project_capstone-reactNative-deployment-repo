import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface QuizCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: string) => boolean;
}

export function QuizCard({ question, options, currentQuestion, totalQuestions, onAnswer }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleOptionPress = (index: number) => {
    const correct = onAnswer(options[index]);
    setSelectedOption(index);
    setIsCorrect(correct);

    if (correct) {
      setMessage('정답입니다!');
    } else {
      setMessage('틀렸습니다. 다시 선택해주세요.');
      // 1초 후에 선택 초기화
      setTimeout(() => {
        setSelectedOption(null);
        setMessage('');
        setIsCorrect(false);
      }, 1000);
    }
  };

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

      {/* 메시지 표시 */}
      {message && (
        <View className="mb-4">
          <ThemedText className={`text-lg text-center ${message.includes('정답') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </ThemedText>
        </View>
      )}

      {/* 선택지 - 2x2 그리드 */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] h-[80%] justify-center items-center bg-white p-4 rounded-lg border ${
              selectedOption === index
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-[#ff6b6b]'
            }`}
            onPress={() => handleOptionPress(index)}
            disabled={isCorrect}
          >
            <ThemedText className="text-lg text-center">{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
