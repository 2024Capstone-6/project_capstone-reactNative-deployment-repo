import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  onComplete?: () => void;
  bookId?: number;
}

export const StudyCard: React.FC<StudyCardProps> = ({ words, grammars, type, onComplete, bookId }) => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const items = type === '단어' ? words : grammars;

  // 학습 진행 상황 저장 함수
  const saveProgress = async (index: number) => {
    try {
      const progressKey = `study_progress_${type}_${level}`;
      await AsyncStorage.setItem(progressKey, index.toString());
    } catch (error) {
      console.error('학습 진행 상황 저장 오류:', error);
    }
  };

  // 학습 진행 상황 불러오기
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progressKey = `study_progress_${type}_${level}`;
        const savedIndex = await AsyncStorage.getItem(progressKey);
        if (savedIndex !== null) {
          const index = parseInt(savedIndex, 10);
          if (!isNaN(index) && index < items.length) {
            setCurrentIndex(index);
          }
        }
      } catch (error) {
        console.error('학습 진행 상황 불러오기 오류:', error);
      }
    };

    loadProgress();
  }, [level, type, items.length]);

  const handleNext = async () => {
    if (currentIndex === items.length - 1) {
      if (onComplete) {
        onComplete();
      }
    } else {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      await saveProgress(newIndex);
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      await saveProgress(newIndex);
    }
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
    <View className="flex-1 h-full top-10 m-4">
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
          placeholder="검색어를 입력하세요"
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
      <View className="flex-row justify-between items-center p-1">
        <TouchableOpacity
          style={{
            ...secondaryButtonStyle,
            width: '25%',
            marginRight: 5,
          }}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={{ color: currentIndex === 0 ? '#ccc' : 'black' }}>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...secondaryButtonStyle,
            width: '35%',
            marginRight: 5,
          }}
        >
          <Text style={{ color: 'black' }}>한번 더</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...primaryButtonStyle,
            width: '35%',
          }}
          onPress={handleNext}
        >
          <Text style={{ color: 'white' }}>{currentIndex === items.length - 1 ? '완료' : '다음'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const buttonStyle = {
  alignItems: 'center' as const,
  padding: 10,
  borderRadius: 5,
  borderColor: '#ff6b6b',
  borderWidth: 1.5,
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ff6b6b',
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'white',
};
