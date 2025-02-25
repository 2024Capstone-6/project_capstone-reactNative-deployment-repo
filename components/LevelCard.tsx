import { ThemedText } from './ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type LevelCardProps = {
  level: string;
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
};

export const LevelCard = React.memo(({ level, type = 'default' }: LevelCardProps) => (
  <View style={styles.levelCard}>
    <ThemedText type={type} style={styles.levelText} accessibilityLabel={`${level} level button`}>
      {level}
    </ThemedText>
  </View>
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
