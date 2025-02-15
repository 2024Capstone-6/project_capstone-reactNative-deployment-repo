import { ThemedText } from '@/components/ThemedText';
import { TestSection } from '@/components/TestSection';
import { View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import '../../styles/main.css';

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-end" style={{ backgroundColor: Colors.tint }}>
      <View className="mb-4 p-4 flex-row items-center">
        <Ionicons name="sparkles-outline" size={24} className="mr-2 text-white" accessibilityLabel="Sparkles icon" />
        <ThemedText type="title" className="text-white">
          日本クローバー
        </ThemedText>
      </View>
      <View className="h-[75%] p-4 rounded-t-3xl" style={{ backgroundColor: Colors.background }}>
        <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} />
        <TestSection title="JPT" levels={TEST_LEVELS.JPT} />
        <TestSection title="BJT" levels={TEST_LEVELS.BJT} />
      </View>
    </View>
  );
};

export default React.memo(HomeScreen);
