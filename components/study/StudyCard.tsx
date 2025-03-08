import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Colors } from '../../constants/Colors';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordContent } from './WordContent';
import { GrammarContent } from './GrammarContent';
import { useLocalSearchParams } from 'expo-router';

export const StudyCard = () => {
  const { level, type } = useLocalSearchParams<{ level: string; type: string }>();

  return (
    <View className="flex-1 h-full top-8 m-4" style={{ backgroundColor: Colors.background }}>
      {/* 레벨 및 뒤로가기 버튼 */}
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
        />
        {type === '단어' ? (
          <ThemedText type="pageTitle">{level} 단어</ThemedText>
        ) : (
          <ThemedText type="pageTitle">{level} 문법</ThemedText>
        )}
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
        {type === '단어' ? <WordContent /> : <GrammarContent />}
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
          onPress={() => {}}
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
          onPress={() => {}}
        >
          <Ionicons name="arrow-forward-outline" size={18} color="white" className="mr-2" />
          <Text style={{ color: 'white' }}>다음으로 넘어가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
