import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import { BookmarkModal } from './BookmarkModal';

interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_meaning: string;
  grammar_furigana: string;
  grammar_level: string;
  grammar_quiz: string[];
  grammar_example?: string[];
  grammar_e_meaning?: string[];
  grammar_e_card?: string[];
  grammar_s_card?: string[];
}

interface GrammarContentProps {
  grammar: Grammar;
  totalCount: number;
  currentIndex: number;
}

export const GrammarContent: React.FC<GrammarContentProps> = ({ grammar }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  if (!grammar) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>문법이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <TouchableOpacity className="flex-1" onPress={flipCard}>
        <View className="flex-row justify-end">
          {/* 추가적인 버튼 생성을 위한 컨테이너 */}
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Ionicons name="bookmark-outline" size={24} color={Colors.tint} />
          </Pressable>
        </View>
        <View className="flex-1 relative">
          <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
            <View className="flex-1 items-center justify-center">
              <Text className="text-pretty text-5xl font-bold mb-1" style={{ color: Colors.tint }}>
                {grammar.grammar}
              </Text>
              <Text className="text-lg text-gray-500 mb-4">{grammar.grammar_furigana}</Text>
              <Text className="text-pretty text-lg text-center mb-4">{grammar.grammar_meaning}</Text>
              <Text className="text-pretty text-gray-500 text-lg text-center">{grammar.grammar_example}</Text>
              <Text className="text-pretty text-gray-500 text-center">{grammar.grammar_e_meaning}</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
            <View className="flex-1 justify-center items-start p-4">
              <View className="flex-row items-center">
                <Text className="text-pretty text-3xl text-[#ff6b6b]">{grammar.grammar}</Text>
                <Text className="ml-2 text-pretty text-2xl text-[#ff6b6b]">{grammar.grammar_furigana}</Text>
              </View>
              <Text className="text-pretty text-lg">{grammar.grammar_meaning}</Text>

              <Text className="text-pretty mt-10">사용되는 경우</Text>
              {grammar.grammar_s_card &&
                grammar.grammar_s_card.map((example, index) => (
                  <Text key={index} className="text-pretty text-gray-600 mt-2">
                    {example}
                  </Text>
                ))}
              <Text className="text-pretty mt-6">예시</Text>
              {grammar.grammar_e_card &&
                grammar.grammar_e_card.map((example, index) => (
                  <Text key={index} className="text-pretty text-gray-600 mt-2">
                    {example}
                  </Text>
                ))}
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <BookmarkModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        grammarId={grammar.grammar_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
