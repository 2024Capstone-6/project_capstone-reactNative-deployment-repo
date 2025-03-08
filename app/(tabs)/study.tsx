import React, { useState } from 'react';
import { View } from 'react-native';
import { StageSelectionTabs } from '../../components/StageSelectionTabs';
import { TestLevel } from '../../constants/TestLevels';
import { StudyCard } from '../../components/study/StudyCard';
import { useLocalSearchParams } from 'expo-router';

export default function StudyPage() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [selectedTab, setSelectedTab] = useState<'단어' | '문법'>('단어');

  const selectedLevel: TestLevel = {
    level: level || 'JLPT N5', // 기본값 설정
  };

  const handleTabPress = (tab: '단어' | '문법') => {
    setSelectedTab(tab);
  };

  return (
    <View className="flex-1">
      <StageSelectionTabs selectedLevel={selectedLevel} onTabPress={handleTabPress} />
      <View className="flex-1 p-4">{selectedTab === '단어' ? <StudyCard /> : <StudyCard />}</View>
    </View>
  );
}
