import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_meaning: string;
  grammar_furigana: string;
  grammar_level: string;
  grammar_quiz: string[];
}

interface GrammarContentProps {
  grammar: Grammar;
  totalCount: number;
  currentIndex: number;
}

export const GrammarContent: React.FC<GrammarContentProps> = ({ grammar }) => {
  if (!grammar) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>문법이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-pretty text-4xl font-bold mb-1" style={{ color: Colors.tint }}>
          {grammar.grammar}
        </Text>
        <Text className="text-lg text-gray-500 mb-4">{grammar.grammar_furigana}</Text>
        <Text className="text-pretty text-lg text-center">{grammar.grammar_meaning}</Text>
      </View>
    </View>
  );
};
