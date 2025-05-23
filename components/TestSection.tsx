import { View, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { LevelCard } from './LevelCard';
import React from 'react';

type TestSectionProps = {
  title: string;
  levels: readonly string[];
  onLevelSelect?: (level: string) => void;
};

export const TestSection = React.memo(({ title, levels, onLevelSelect }: TestSectionProps) => (
  <View className="h-[20%] w-full mt-8">
    {/* 종류 */}
    <ThemedText type="defaultRegular" className="mb-2">
      {title}
    </ThemedText>
    {/* 가로 스크롤 레벨 카드 목록 */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      {levels.map((level, index) => (
        <LevelCard key={`${title}-${level}-${index}`} level={level} onPress={onLevelSelect} />
      ))}
    </ScrollView>
  </View>
));
