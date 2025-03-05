import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { TestLevel } from '../constants/TestLevels';

type StageSelectionTabsProps = {
  onTabPress: (tab: '단어' | '문법') => void;
  selectedLevel?: TestLevel;
};

export const StageSelectionTabs = ({ onTabPress, selectedLevel }: StageSelectionTabsProps) => {
  // 현재 선택된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'단어' | '문법'>('단어');

  // 클릭 시 상태 업데이트 및 콜백 함수 호출
  const handlePress = (tab: '단어' | '문법') => {
    setActiveTab(tab);
    onTabPress(tab);
  };

  return (
    <View className="flex-row justify-around sticky top-0">
      {selectedLevel && (
        <View className="w-full mb-4">
          <ThemedText type="subtitle">{selectedLevel.level}</ThemedText>
        </View>
      )}
      <View className={`flex-row justify-around ${selectedLevel ? 'w-full' : ''}`}>
        {/* 단어 탭 버튼 */}
        <TouchableOpacity
          className={`px-5 py-2 ${activeTab === '단어' ? 'border-b-2 border-red-500' : ''}`}
          onPress={() => handlePress('단어')}
        >
          <ThemedText type="defaultRegular" className={activeTab === '단어' ? 'text-red-500' : 'text-gray-500'}>
            단어
          </ThemedText>
        </TouchableOpacity>

        {/* 문법 탭 버튼 */}
        <TouchableOpacity
          className={`px-5 py-2 ${activeTab === '문법' ? 'border-b-2 border-red-500' : ''}`}
          onPress={() => handlePress('문법')}
        >
          <ThemedText type="defaultRegular" className={activeTab === '문법' ? 'text-red-500' : 'text-gray-500'}>
            문법
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
