import { TestSection } from '@/components/TestSection';
import { StageSelectionTabs } from '@/components/StageSelectionTabs';

import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import React, { useState } from 'react';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>('단어');

  const handleTabPress = (tab: '단어' | '문법') => {
    setSelectedTab(tab);
  };

  const handleLevelSelect = (level: string) => {
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
      <View className="h-[18%] m-2 p-2 flex-row items-end">
        <Ionicons
          className="ml-2 mb-1.5"
          name="sparkles-outline"
          size={24}
          color="white"
          accessibilityLabel="Sparkles icon"
        />
        <Text className="ml-2 text-white text-3xl font-bold">日本クローバー</Text>
      </View>

      <View className="py-1 px-[5%] h-[80%] rounded-t-3xl flex-1" style={{ backgroundColor: Colors.background }}>
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
