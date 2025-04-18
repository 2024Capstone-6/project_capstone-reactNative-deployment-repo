import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ENV } from '../../config/env';
import { StudyCard } from '../../components/study/StudyCard';

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

export default function StudyPage() {
  const params = useLocalSearchParams<{ level: string; type: string }>();
  const level = params.level;
  const type = params.type;

  const [words, setWords] = useState<Word[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);

  // API 호출을 위한 헤더 생성 함수
  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // 데이터 가져오기 함수
  const fetchData = async (endpoint: string, filterFn: (item: any) => boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`${endpoint} 데이터를 불러오는데 실패했습니다.`);
      }

      const data = await response.json();
      return data.filter(filterFn);
    } catch (error) {
      console.error(`${endpoint} 데이터 불러오기 실패:`, error);
      return [];
    }
  };

  // 단어 데이터 가져오기
  useEffect(() => {
    const loadWords = async () => {
      if (type !== '단어') return;

      setLoading(true);
      const filteredWords = await fetchData('words', (word: Word) => word.word_level === level);
      setWords(filteredWords);
      setLoading(false);
    };

    loadWords();
  }, [level, type]);

  // 문법 데이터 가져오기
  useEffect(() => {
    const loadGrammars = async () => {
      if (type !== '문법') return;

      setLoading(true);
      const filteredGrammars = await fetchData('grammars', (grammar: Grammar) => grammar.grammar_level === level);
      setGrammars(filteredGrammars);
      setLoading(false);
    };

    loadGrammars();
  }, [level, type]);

  return (
    <View className="flex-1 p-[5%]">
      {loading ? (
        <Text>로딩 중...</Text>
      ) : (
        <StudyCard
          words={type === '단어' ? words : []}
          grammars={type === '문법' ? grammars : []}
          type={type as '단어' | '문법'}
        />
      )}
    </View>
  );
}
