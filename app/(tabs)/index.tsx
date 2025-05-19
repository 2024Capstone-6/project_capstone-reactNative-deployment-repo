import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { TestSection } from '@/components/TestSection';
import { StageSelectionTabs } from '@/components/StageSelectionTabs';
import { Colors } from '@/constants/Colors';
import { TEST_LEVELS } from '@/constants/TestLevels';

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
        <Image source={require('../../assets/images/logo.png')} style={{ width: 40, height: 40 }} />
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
        <View className="flex-1 m-4">
          <TouchableOpacity
            className="w-full h-[20px] justify-center items-center p-2 bg-[#ff6b6b] rounded-lg"
            onPress={() => router.push('/존재하지-않는-페이지')}
          >
            <Text className="text-white">404 페이지 테스트</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(HomeScreen);
