import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

type StageSelectionTabsProps = {
  onTabPress: (tab: '단어' | '문법') => void;
};

export const StageSelectionTabs = ({ onTabPress }: StageSelectionTabsProps) => {
  // 내부적으로 어떤 탭이 활성화되었는지 관리
  const [activeTab, setActiveTab] = useState<'단어' | '문법'>('단어');

  const handlePress = (tab: '단어' | '문법') => {
    setActiveTab(tab);
    onTabPress(tab);
  };

  return (
    <View className="flex-row justify-around sticky top-0">
      {/* 단어 탭 */}
      <TouchableOpacity
        className={`px-5 py-2 ${activeTab === '단어' ? 'border-b-2 border-red-500' : ''}`}
        onPress={() => handlePress('단어')}
      >
        <ThemedText type="defaultRegular" className={activeTab === '단어' ? 'text-red-500' : 'text-gray-500'}>
          단어
        </ThemedText>
      </TouchableOpacity>

      {/* 문법 탭 */}
      <TouchableOpacity
        className={`px-5 py-2 ${activeTab === '문법' ? 'border-b-2 border-red-500' : ''}`}
        onPress={() => handlePress('문법')}
      >
        <ThemedText type="defaultRegular" className={activeTab === '문법' ? 'text-red-500' : 'text-gray-500'}>
          문법
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
