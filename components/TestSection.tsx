import { View, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { LevelCard } from './LevelCard';
import React from 'react';
type TestSectionProps = {
  title: string;
  levels: readonly string[];
};

export const TestSection = React.memo(({ title, levels }: TestSectionProps) => (
  <View className="h-[20%] w-full mt-8">
    {/* 시험 종류 제목 */}
    <ThemedText type="defaultRegular" className="mb-2">
      {title}
    </ThemedText>
    {/* 가로 스크롤 가능한 레벨 카드 목록 */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      {levels.map((level, index) => (
        <LevelCard key={`${title}-${level}-${index}`} level={level} />
      ))}
    </ScrollView>
  </View>
));
