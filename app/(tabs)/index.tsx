import { ThemedText } from '@/components/ThemedText';
import { View, ScrollView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import '../../styles/main.css';

export default function HomeScreen() {
  return (
    <View className="container m-8 w-[85%] h-[70%]">
      <View style={{ flexDirection: 'row', alignItems: 'center' }} className="mb-8">
        <Ionicons name="sparkles-outline" size={24} color={Colors.tint} className="mr-2" />
        <ThemedText type="title">日本クローバー</ThemedText>
      </View>

      <View className="jlpt-level h-[20%] w-full">
        <ThemedText type="defaultRegular" className="mb-2">
          JLPT
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <ThemedText className="test-level" type="default">
            JLPT N1
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JLPT N2
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JLPT N3
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JLPT N4
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JLPT N5
          </ThemedText>
        </ScrollView>
      </View>

      <View className="jpt-level h-[20%] w-full mt-8">
        <ThemedText type="defaultRegular" className="mb-2">
          JPT
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <ThemedText className="test-level" type="default">
            JPT 850
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JPT 650
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JPT 450
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JPT 350
          </ThemedText>
          <ThemedText className="test-level" type="default">
            JPT 250
          </ThemedText>
        </ScrollView>
      </View>

      <View className="bjt-level w-full h-[20%] mt-8">
        <ThemedText type="defaultRegular" className="mb-2">
          BJT
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <ThemedText className="test-level" type="default">
            BJT 800
          </ThemedText>
          <ThemedText className="test-level" type="default">
            BJT 600
          </ThemedText>
          <ThemedText className="test-level" type="default">
            BJT 530
          </ThemedText>
          <ThemedText className="test-level" type="default">
            BJT 450
          </ThemedText>
        </ScrollView>
      </View>
    </View>
  );
}
