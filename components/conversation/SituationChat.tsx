import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SituationChat() {
  return (
    <View className="flex-1 p-[5%] bottom-2 m-4">
      <Text>SituationChat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
});
