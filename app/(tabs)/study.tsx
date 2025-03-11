import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TestLevel } from '../../constants/TestLevels';
import { StudyCard } from '../../components/study/StudyCard';
import { useLocalSearchParams } from 'expo-router';
import { ENV } from '../../config/env';

interface Word {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
  word_level: string;
  word_quiz: string[];
}

export default function StudyPage() {
  const { level, type } = useLocalSearchParams<{ level: string; type: string }>();
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>(type as '단어' | '문법');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`${ENV.API_URL}/words`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
  }, [level]);

  return (
    <View className="flex-1 p-[5%]">
      {loading ? (
        <Text>로딩 중...</Text>
      ) : selectedTab === '단어' ? (
        <StudyCard words={words} type={selectedTab} />
      ) : null}
    </View>
  );
}
