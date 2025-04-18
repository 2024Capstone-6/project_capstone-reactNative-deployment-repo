import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

import { Colors } from '../../constants/Colors';
import { ThemedText } from '../ThemedText';
import { WordContent } from './WordContent';
import { GrammarContent } from './GrammarContent';

interface Word {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
  word_level: string;
  word_quiz: string[];
}

interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_meaning: string;
  grammar_furigana: string;
  grammar_level: string;
  grammar_quiz: string[];
  grammar_example: string[];
  grammar_e_meaning: string[];
  grammar_e_card: string[];
  grammar_s_card: string[];
}

interface StudyCardProps {
  words: Word[];
  grammars: Grammar[];
  type: '단어' | '문법';
}

export const StudyCard: React.FC<StudyCardProps> = ({ words, grammars, type }) => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = type === '단어' ? words : grammars;

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRetry = () => {
    // 한번 더 학습 로직 구현
    console.log('한번 더 학습');
    setCurrentIndex(0);
  };

  // 데이터가 없는 경우 처리
  if (!items || items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 h-full top-10 m-4" style={{ backgroundColor: Colors.background }}>
      {/* 레벨 및 뒤로가기 버튼 */}
      {/* 추후 페이지별 분리, 컴포넌트 파일 생성 예정 */}
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={() => router.back()}
        />
        <ThemedText type="pageTitle">
          {level} {type}
        </ThemedText>
      </View>

      {/* 검색 입력 필드 */}
      <View className="flex-row items-center p-1">
        <Ionicons name="search-outline" size={22} className="mr-1 text-[#ff6b6b]" />
        <TextInput
          className="flex-1 border-2 border-[#ff6b6b] rounded-md p-1.5 bg-white"
          placeholder="검색할 단어를 입력하세요"
        />
      </View>

      {/* 학습 컨텐츠 */}
      <View className="h-[70%] border-2 border-[#ff6b6b] rounded-md p-2 m-1 bg-white">
        {type === '단어' ? (
          <WordContent word={words[currentIndex]} totalCount={words.length} currentIndex={currentIndex} />
        ) : (
          <GrammarContent grammar={grammars[currentIndex]} totalCount={grammars.length} currentIndex={currentIndex} />
        )}
      </View>

      {/* 버튼 컨테이너 */}
      <View className="flex-row items-center p-1">
        <TouchableOpacity
          style={{
            alignItems: 'center',
            width: '35%',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 5,
            borderColor: '#ff6b6b',
            borderWidth: 1.5,
            marginRight: 10,
          }}
          onPress={handleRetry}
        >
          <Text style={{ color: 'black' }}>한번 더</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '62%',
            backgroundColor: '#ff6b6b',
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={handleNext}
          disabled={currentIndex === items.length - 1}
        >
          <Ionicons name="arrow-forward-outline" size={18} color="white" className="mr-2" />
          <Text style={{ color: 'white' }}>다음 {type === '단어' ? '단어' : '문법'}로 넘어가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
