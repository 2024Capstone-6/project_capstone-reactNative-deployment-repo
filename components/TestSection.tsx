import { View, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { TestLevelCard } from './TestLevelCard';
import React from 'react';

type TestSectionProps = {
  title: string;
  levels: readonly string[];
};

export const TestSection = React.memo(({ title, levels }: TestSectionProps) => (
  <View className="h-[20%] w-full mt-8">
    <ThemedText type="defaultRegular" className="mb-2">
      {title}
    </ThemedText>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
      {levels.map((level, index) => (
        <TestLevelCard key={`${title}-${level}-${index}`} level={level} />
      ))}
    </ScrollView>
  </View>
));
