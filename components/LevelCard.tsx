import { ThemedText } from './ThemedText';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type LevelCardProps = {
  level: string;
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
  onPress?: (level: string) => void;
};

export const LevelCard = React.memo(({ level, type = 'default', onPress }: LevelCardProps) => (
  <TouchableOpacity
    className="test-level"
    onPress={() => onPress?.(level)}
    accessibilityLabel={`${level} level button`}
  >
    <ThemedText type={type}>{level}</ThemedText>
  </TouchableOpacity>
));
