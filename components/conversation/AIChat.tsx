import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function AIChat() {
  return (
    <View className="flex-1 bottom-8 items-center justify-center">
      {/* 사용자가 입력하는 문구 */}
      <View className="w-full h-[30%] min-h-[100px] max-h-[250px] bg-white rounded-lg border-2 border-[#ff6b6b] p-4 items-flex-start justify-flex-start">
        <TextInput className="w-full h-full items-start justify-start " />

        <View className="flex-1 items-end justify-end">
          <View className="flex-row items-center justify-center">
            <Ionicons name="mic-circle-outline" size={30} color="#ff6b6b" className="mr-1" />
            <Ionicons name="paper-plane-outline" size={25} color="#ff6b6b" />
          </View>
        </View>
      </View>
    </View>
  );
}
