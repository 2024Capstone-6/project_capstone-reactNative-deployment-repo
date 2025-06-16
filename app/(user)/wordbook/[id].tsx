import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAuthHeaders } from '@/util/auth';
import { ENV } from '@/config/env';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';

interface Word {
  word_id: number;
  word: string;
  word_meaning: string;
  word_furigana: string;
}

interface WordBook {
  wordbook_id: number;
  wordbook_title: string;
  word_middle: {
    word: Word;
  }[];
}

export default function WordBookDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('words', words);

  useEffect(() => {
    fetchWordBookContents();
  }, []);

  const fetchWordBookContents = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/words/books`, { headers });

      if (!response.ok) {
        throw new Error('단어장 목록을 불러오는데 실패했습니다.');
      }

      const wordBooks: WordBook[] = await response.json();
      const currentWordBook = wordBooks.find((book) => book.wordbook_id === Number(id));

      console.log('currentWordBook', currentWordBook);
      if (!currentWordBook) {
        throw new Error('단어장을 찾을 수 없습니다.');
      }

      setWords(currentWordBook.word_middle.map((middle) => middle.word));
    } catch (error) {
      console.error('단어장 내용 조회 오류:', error);
      Alert.alert('오류', '단어장 내용을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <View className="flex-row justify-between items-center p-3 border-b border-gray-200">
      <View className="flex-row items-center">
        <Text className="text-md">{item.word}</Text>
        <Text className="text-gray-400 text-sm ml-4">{item.word_furigana}</Text>
      </View>
      <Text className="text-gray-600 text-sm">{item.word_meaning}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleBack = () => router.back();

  const handleFlashCard = () => {
    router.push({
      pathname: '/(user)/wordbook/word_flash',
      params: {
        id,
        level: title,
        words: JSON.stringify(words),
        type: '단어',
      },
    });
  };

  return (
    <View className="flex-1 bg-[#f5f5f5] mt-8 m-4">
      {/* 상단 헤더: 뒤로가기, 제목 */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={handleBack} className="m-4">
          <Ionicons name="arrow-back-outline" size={24} color="#ff6b6b" />
        </TouchableOpacity>
        <ThemedText type="title" className="m-2">
          {title}
        </ThemedText>
      </View>

      <View className="mb-2 bg-[#ff6b6b] rounded-md py-3 px-4">
        <TouchableOpacity onPress={handleFlashCard}>
          <Text className="text-white text-center font-medium">플래시카드로 학습하기</Text>
        </TouchableOpacity>
      </View>

      {/* 단어 목록 */}
      <View className="flex-1 mb-8">
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.word_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="border border-[#ff6b6b] rounded-md bg-white"
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}
