import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { StudyCard } from '../../components/study/StudyCard';
import { useLocalSearchParams } from 'expo-router';
import { ENV } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // 단어 데이터 가져오기
  useEffect(() => {
    const fetchWords = async () => {
      if (type !== '단어') return;

      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${ENV.API_URL}/words`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const filteredWords = data.filter((word: Word) => word.word_level === level);
        setWords(filteredWords);
      } catch (error) {
        console.error('단어 데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [level, type]);

  // 문법 데이터 가져오기
  useEffect(() => {
    const fetchGrammars = async () => {
      if (type !== '문법') return;

      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${ENV.API_URL}/grammars`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const filteredGrammars = data.filter((grammar: Grammar) => grammar.grammar_level === level);
        setGrammars(filteredGrammars);
      } catch (error) {
        console.error('문법 데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrammars();
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
