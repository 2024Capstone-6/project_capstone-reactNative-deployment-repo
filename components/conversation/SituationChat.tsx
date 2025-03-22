import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SituationChat() {
  return (
    <View className="flex-1 bottom-8 items-center justify-center">
      {/* 빈칸 있는 배열 */}
      <View style={styles.container} className="w-full">
        <Text>SituationChat</Text>
      </View>

      {/* 선택지 나열 0, 1 */}
      <View className="flex-row items-center justify-between mt-2 w-full">
        <View style={styles.container}>
          <Text>SituationChat1</Text>
        </View>
        <View style={styles.container}>
          <Text>SituationChat2</Text>
        </View>
      </View>

      {/* 선택지 나열 2, 3 */}
      <View className="flex-row justify-between mt-2 w-full">
        <View style={styles.container}>
          <Text>SituationChat3</Text>
        </View>
        <View style={styles.container}>
          <Text>SituationChat4</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
