import { ThemedText } from '@/components/ThemedText';
import { TestSection } from '@/components/TestSection';
import { StageSelectionTabs } from '@/components/StageSelectionTabs';

import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';
import { Ionicons } from '@expo/vector-icons';

import React, { useState } from 'react';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>('단어');

  const handleTabPress = (tab: '단어' | '문법') => {
    setSelectedTab(tab);
  };

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: Colors.tint }}>
      <View className="h-[20%] m-2 p-2 flex-row items-end">
        <Ionicons name="sparkles-outline" size={24} color="white" accessibilityLabel="Sparkles icon" />
        <Text className="ml-2 text-white text-3xl font-bold">日本クローバー</Text>
      </View>

      <View className="p-4 h-[80%]  rounded-t-3xl flex-1" style={{ backgroundColor: Colors.background }}>
        {/* 단어/문법 탭 */}
        <StageSelectionTabs onTabPress={handleTabPress} />
        {selectedTab === '단어' ? (
          <>
            <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} />
            <TestSection title="JPT" levels={TEST_LEVELS.JPT} />
            <TestSection title="BJT" levels={TEST_LEVELS.BJT} />
          </>
        ) : (
          <>
            <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} />
            <TestSection title="JPT" levels={TEST_LEVELS.JPT} />
            <TestSection title="BJT" levels={TEST_LEVELS.BJT} />
          </>
        )}
      </View>
    </View>
  );
};

export default React.memo(HomeScreen);
