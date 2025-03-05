import { ThemedText } from '@/components/ThemedText';
import { TestSection } from '@/components/TestSection';
import { StageSelectionTabs } from '@/components/StageSelectionTabs';

import { View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import React, { useState } from 'react';

import '../../styles/main.css';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>('단어');

  const handleTabPress = (tab: '단어' | '문법') => {
    setSelectedTab(tab);
  };

  const handleLevelSelect = (level: string) => {
    console.log('선택된 레벨:', level);
    console.log('현재 선택된 탭:', selectedTab);

    router.push({
      pathname: '/(tabs)/study',
      params: {
        level,
        type: selectedTab,
      },
    });
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
            <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} onLevelSelect={handleLevelSelect} />
            <TestSection title="JPT" levels={TEST_LEVELS.JPT} onLevelSelect={handleLevelSelect} />
            <TestSection title="BJT" levels={TEST_LEVELS.BJT} onLevelSelect={handleLevelSelect} />
          </>
        ) : (
          <>
            <TestSection title="JLPT" levels={TEST_LEVELS.JLPT} onLevelSelect={handleLevelSelect} />
            <TestSection title="JPT" levels={TEST_LEVELS.JPT} onLevelSelect={handleLevelSelect} />
            <TestSection title="BJT" levels={TEST_LEVELS.BJT} onLevelSelect={handleLevelSelect} />
          </>
        )}
      </View>
    </View>
  );
};

export default React.memo(HomeScreen);
