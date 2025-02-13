import { ThemedText } from './ThemedText';
import React from 'react';

type TestLevelCardProps = {
  level: string;
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
};

export const TestLevelCard = React.memo(({ level, type = 'default' }: TestLevelCardProps) => (
  <ThemedText className="test-level" type={type} accessibilityLabel={`${level} level button`}>
    {level}
  </ThemedText>
));
