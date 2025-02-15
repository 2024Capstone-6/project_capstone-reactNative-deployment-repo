import { ThemedText } from './ThemedText';
import React from 'react';

type LevelCardProps = {
  level: string;
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
};

export const LevelCard = React.memo(({ level, type = 'default' }: LevelCardProps) => (
  <ThemedText className="test-level" type={type} accessibilityLabel={`${level} level button`}>
    {level}
  </ThemedText>
));
