import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StudyCard } from '@/components/study/StudyCard';

export default function GrammarFlashScreen() {
  const { id, level, grammars: grammarsString, type } = useLocalSearchParams();
  const grammars = JSON.parse(grammarsString as string);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <Text className="text-2xl font-bold text-[#ff6b6b] mb-4">학습이 완료되었습니다!</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#ff6b6b] px-6 py-3 rounded-md">
          <Text className="text-white font-medium">돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StudyCard words={[]} grammars={grammars} type={type as '문법'} onComplete={handleComplete} />
    </View>
  );
}
