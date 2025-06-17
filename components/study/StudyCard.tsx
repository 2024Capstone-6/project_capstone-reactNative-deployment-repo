import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/env';

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

export const StudyCard: React.FC<StudyCardProps> = ({
  words: initialWords,
  grammars: initialGrammars,
  type,
  onComplete,
  bookId,
}) => {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [words, setWords] = useState(initialWords);
  const [grammars, setGrammars] = useState(initialGrammars);
  const [items, setItems] = useState(type === '단어' ? initialWords : initialGrammars);

  // 상태 업데이트 함수를 useCallback으로 메모이제이션
  const updateState = useCallback(async (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
    await saveProgress(nextIndex);
  }, []);

  // type이나 words/grammars가 변경될 때 items 업데이트
  useEffect(() => {
    setItems(type === '단어' ? words : grammars);
  }, [type, words, grammars]);

  // items가 변경될 때 디버깅 로그 추가
  useEffect(() => {}, [items]);

  /*   // currentIndex가 변경될 때 디버깅 로그 추가
  useEffect(() => {
    console.log('currentIndex 업데이트됨:', currentIndex);
  }, [currentIndex]); */

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

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      await saveProgress(newIndex);
    }
  };

  const handleNext = async () => {
    if (currentIndex < items.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      await saveProgress(newIndex);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleRepeat = async () => {
    console.log('한번 더 버튼 클릭됨');
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('토큰:', token);

      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?', [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그인',
            onPress: () => router.push('/login'),
          },
        ]);
        return;
      }

      // 현재 단어 정보 저장
      const currentWord = items[currentIndex];
      console.log('현재 단어:', currentWord);

      console.log('API 요청 시작:', `${ENV.API_URL}/words/repeat-word`);
      // 현재 단어를 10개 뒤로 이동
      const response = await fetch(`${ENV.API_URL}/words/repeat-word`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          learning_level: level,
          offset: 10,
        }),
      });

      console.log('API 응답:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '한번 더 기능 처리 중 오류가 발생했습니다.');
      }

      // 현재 카드 정보 다시 불러오기
      const progressResponse = await fetch(
        `${ENV.API_URL}/words/with-progress?learning_level=${encodeURIComponent(level)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!progressResponse.ok) {
        throw new Error('학습 데이터를 불러오는데 실패했습니다.');
      }

      const updatedData = await progressResponse.json();
      console.log('업데이트된 데이터:', updatedData);

      if (!updatedData || !updatedData.words) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      // 현재 인덱스 유지하면서 데이터 업데이트
      if (type === '단어') {
        const newWords = updatedData.words;
        setWords(newWords);
        setItems(newWords);
      } else {
        const newGrammars = updatedData.grammars;
        setGrammars(newGrammars);
        setItems(newGrammars);
      }

      // 업데이트된 데이터에서 현재 단어의 새로운 위치 찾기
      const newItems = type === '단어' ? updatedData.words : updatedData.grammars;
      const newIndex = newItems.findIndex((item: Word | Grammar) => {
        if (type === '단어') {
          return (item as Word).word_id === (currentWord as Word).word_id;
        } else {
          return (item as Grammar).grammar_id === (currentWord as Grammar).grammar_id;
        }
      });

      if (newIndex !== -1) {
        // 현재 단어의 다음 위치로 이동
        const nextIndex = newIndex + 1;
        if (nextIndex < newItems.length) {
          await updateState(nextIndex);
        }
      }
    } catch (error) {
      console.error('한번 더 기능 오류:', error);
      Alert.alert('오류', error instanceof Error ? error.message : '한번 더 기능 처리 중 문제가 발생했습니다.');
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
          <WordContent
            word={items[currentIndex] as Word}
            totalCount={items.length}
            currentIndex={currentIndex}
            key={`word-${currentIndex}-${(items[currentIndex] as Word)?.word_id}`}
          />
        ) : (
          <GrammarContent
            grammar={items[currentIndex] as Grammar}
            totalCount={items.length}
            currentIndex={currentIndex}
            key={`grammar-${currentIndex}-${(items[currentIndex] as Grammar)?.grammar_id}`}
          />
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
          onPress={() => {
            handleRepeat();
          }}
          activeOpacity={0.7}
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
