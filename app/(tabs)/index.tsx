import { ThemedText } from '@/components/ThemedText';
import { TestSection } from '@/components/TestSection';
import { StageSelectionTabs } from '@/components/StageSelectionTabs';

import { View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';
import { Ionicons } from '@expo/vector-icons';

import React, { useState } from 'react';

import '../../styles/main.css';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>('단어');

  const handleTabPress = (tab: '단어' | '문법') => {
    setSelectedTab(tab);
  };

  return (
    <View className="flex-1 h-full" style={{ backgroundColor: Colors.tint }}>
      <View className="h-[20%] p-4 flex-row items-end">
        <Ionicons name="sparkles-outline" size={24} className="m-2 text-white" accessibilityLabel="Sparkles icon" />
        <ThemedText type="title" className="text-white">
          日本クローバー
        </ThemedText>
      </View>

      <View className="p-2 h-[80%]  rounded-t-3xl flex-1" style={{ backgroundColor: Colors.background }}>
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
