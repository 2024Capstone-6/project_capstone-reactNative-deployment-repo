import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface QuizCardProps {
  question: string;
  options: string[];
  onAnswer: (selectedAnswer: string) => boolean;
  timeLimit?: number;
  disabled?: boolean;
  isMultiplayer?: boolean;
}

export function QuizCard({
  question,
  options,
  onAnswer,
  timeLimit = 10,
  disabled = false,
  isMultiplayer = false,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // 문제가 변경될 때마다 상태 초기화
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(timeLimit);
    setShowAnswer(false);
    setMessage('');
    setIsCorrect(false);
  }, [question, timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !showAnswer && !disabled) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCorrect) {
      setShowAnswer(true);
      if (!isMultiplayer) {
        setMessage('시간이 종료되었습니다!');
        setTimeout(() => {
          onAnswer(''); // 빈 답을 전달하여 다음 문제로 넘어가도록 함
        }, 3000);
      }
    }
  }, [timeLeft, showAnswer, disabled, isMultiplayer]);

  const handleOptionPress = (index: number) => {
    if (disabled) return;

    const correct = onAnswer(options[index]);
    setSelectedOption(index);

    if (!isMultiplayer) {
      setIsCorrect(correct);
      if (correct) {
        setMessage('정답입니다!');
      } else {
        setMessage('틀렸습니다.');
      }
    }
  };

  return (
    <View className="flex-1 w-full">
      {/* 문제 카드 */}
      <View className="h-[30%] bg-white rounded-lg p-6 shadow-sm border border-[#ff6b6b] mb-8">
        {/* 상단 진행바와 타이머 */}
        <View className="mb-6">
          <View className="w-full h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${(timeLeft / timeLimit) * 100}%`,
                backgroundColor: timeLeft <= 5 ? '#ef4444' : '#ff6b6b',
              }}
            />
          </View>
        </View>
        {/* 문제 텍스트를 감싸는 컨테이너 */}
        <View className="flex-1 justify-center">
          <Text className="text-4xl font-bold text-center text-[#ff6b6b]">{question}</Text>
        </View>
      </View>

      {/* 메시지 표시 (싱글플레이어 모드에서만) */}
      {!isMultiplayer && message && (
        <View className="mb-4">
          <ThemedText className={`text-lg text-center ${message.includes('정답') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </ThemedText>
        </View>
      )}

      {/* 선택지 - 2x2 그리드 */}
      <View className="flex-row flex-wrap h-[40%] justify-between gap-y-2">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] h-[45%] justify-center items-center bg-white p-2 rounded-lg border ${
              selectedOption === index
                ? isMultiplayer
                  ? 'border-[#ff6b6b] bg-[#ff6b6b]/10'
                  : isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                : showAnswer && !isMultiplayer && onAnswer(option)
                  ? 'border-green-500 bg-green-50'
                  : 'border-[#ff6b6b]'
            } ${disabled ? 'opacity-50' : ''}`}
            onPress={() => handleOptionPress(index)}
            disabled={(!isMultiplayer && isCorrect) || showAnswer || disabled}
          >
            <ThemedText className="text-base text-center">{option}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
