import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function AIChat() {
  return (
    <View className="flex-1 bottom-8 items-center justify-center">
      {/* 사용자가 입력하는 문구 */}
      <View className="w-full h-[30%] min-h-[100px] max-h-[250px] bg-white rounded-lg border-2 border-[#ff6b6b] p-4 items-flex-start justify-flex-start">
        <Text>사용자가 입력한 문구</Text>

        <View className="flex-1 items-end justify-end">
          <Ionicons name="mic-circle-outline" size={40} color="#ff6b6b" />
        </View>
      </View>
    </View>
  );
}
