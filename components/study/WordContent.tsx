import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/Colors';
import { BookmarkModal } from './BookmarkModal';

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
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [showTranslation, setShowTranslation] = React.useState(false);

  if (!word) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>단어가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={() => setShowTranslation(!showTranslation)} className="mr-2">
          <Ionicons name="language-outline" size={24} color={Colors.tint} />
        </TouchableOpacity>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <Ionicons name="bookmark-outline" size={24} color={Colors.tint} />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-pretty text-4xl font-bold mb-1" style={{ color: Colors.tint }}>
          {word.word}
        </Text>
        {showTranslation && (
          <>
            <Text className="text-lg text-gray-500 mb-4">{word.word_furigana}</Text>
            <Text className="text-pretty text-lg text-center">{word.word_meaning}</Text>
          </>
        )}
      </View>
      <BookmarkModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} wordId={word.word_id} />
    </View>
  );
};
