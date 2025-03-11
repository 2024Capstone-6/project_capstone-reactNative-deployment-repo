import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

interface Word {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
  word_level: string;
  word_quiz: string[];
}

interface WordContentProps {
  word: Word;
  totalCount: number;
  currentIndex: number;
}

export const WordContent: React.FC<WordContentProps> = ({ word }) => {
  if (!word) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>단어가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-pretty text-5xl font-bold mb-1" style={{ color: Colors.tint }}>
          {word.word}
        </Text>
        <Text className="text-lg text-gray-500 mb-4">{word.word_furigana}</Text>
        <Text className="text-pretty text-lg text-center">{word.word_meaning}</Text>
      </View>
    </View>
  );
};
