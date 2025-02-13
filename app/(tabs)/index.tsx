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
    <View className="container m-8 w-[85%] h-[70%]">
      <View style={{ flexDirection: 'row', alignItems: 'center' }} className="mb-4">
        <Ionicons
          name="sparkles-outline"
          size={24}
          color={Colors.tint}
          className="mr-2"
          accessibilityLabel="Sparkles icon"
        />
        <ThemedText type="title">日本クローバー</ThemedText>
      </View>

      <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} />
      <TestSection title="JPT" levels={TEST_LEVELS.JPT} />
      <TestSection title="BJT" levels={TEST_LEVELS.BJT} />
    </View>
  );
};

export default React.memo(HomeScreen);
