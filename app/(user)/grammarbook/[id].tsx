import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getAuthHeaders } from '@/util/auth';
import { ENV } from '@/config/env';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';

interface Grammar {
  grammar_id: number;
  grammar: string;
  grammar_furigana: string;
  grammar_meaning: string;
}

interface GrammarBook {
  grammarbook_id: number;
  grammarbook_title: string;
  grammar_middle: {
    grammar: Grammar;
  }[];
}

export default function GrammarBookDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrammarBookContents();
  }, []);

  const fetchGrammarBookContents = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/grammars/books`, { headers });

      if (!response.ok) {
        throw new Error('문법장 목록을 불러오는데 실패했습니다.');
      }

      const grammarBooks: GrammarBook[] = await response.json();
      const currentGrammarBook = grammarBooks.find((book) => book.grammarbook_id === Number(id));

      console.log('currentGrammarBook', currentGrammarBook);

      if (!currentGrammarBook) {
        throw new Error('문법장을 찾을 수 없습니다.');
      }

      setGrammars(currentGrammarBook.grammar_middle.map((middle) => middle.grammar));
    } catch (error) {
      console.error('문법장 내용 조회 오류:', error);
      Alert.alert('오류', '문법장 내용을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderGrammarItem = ({ item }: { item: Grammar }) => (
    <View className="flex-row justify-between items-center p-3 border-b border-gray-200">
      <View className="flex-row items-center">
        <Text className="text-md">{item.grammar}</Text>
        <Text className="text-gray-400 text-sm ml-4">{item.grammar_furigana}</Text>
      </View>
      <Text className="text-gray-600 text-sm">{item.grammar_meaning}</Text>
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
      pathname: '/(user)/grammarbook/grammar_flash',
      params: {
        id,
        level: title,
        grammars: JSON.stringify(grammars),
        type: '문법',
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

      {/* 문법 목록 */}
      <View className="flex-1 mb-8">
        <FlatList
          data={grammars}
          renderItem={renderGrammarItem}
          keyExtractor={(item) => item.grammar_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="border border-[#ff6b6b] rounded-md bg-white"
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}
