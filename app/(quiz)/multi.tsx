import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from '@react-navigation/native';

export default function MultiQuizScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center bg-[#ff6b6b]">
      <TouchableOpacity
        className="w-[60%] h-[40%] bg-white rounded-lg p-4 items-center justify-center border border-[#ff6b6b]"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="construct-outline" size={100} color="#ff6b6b" />
        <ThemedText type="title" className="mt-4">
          개발 예정
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
