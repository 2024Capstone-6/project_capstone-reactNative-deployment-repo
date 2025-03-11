import { ThemedText } from './ThemedText';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';

type LevelCardProps = {
  level: string;
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
  onPress?: (level: string) => void;
};

export const LevelCard = React.memo(({ level, type = 'default', onPress }: LevelCardProps) => (
  <TouchableOpacity
    style={styles.levelCard}
    className="test-level"
    onPress={() => onPress?.(level)}
    accessibilityLabel={`${level} level button`}
  >
    <ThemedText type={type}>{level}</ThemedText>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  levelCard: {
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 10,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    textAlign: 'center',
  },
});
