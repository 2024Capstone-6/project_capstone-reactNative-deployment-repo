import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

// 임시 데이터 - 실제로는 서버에서 받아올 데이터
const rooms = [
  { id: 1, name: '초보자 방', players: 2, maxPlayers: 4 },
  { id: 2, name: '중급자 방', players: 3, maxPlayers: 4 },
  { id: 3, name: '고수 방', players: 1, maxPlayers: 4 },
];

export default function MultiGameScreen() {
  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 mt-8 mb-4">
        <ThemedText type="title">게임 방 목록</ThemedText>
        <TouchableOpacity
          className="bg-[#ff6b6b] px-4 py-2 rounded-lg"
          onPress={() => router.push('/(quiz)/create-room')}
        >
          <ThemedText className="text-white">방 만들기</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            className="bg-white p-4 rounded-lg mb-4 border-2 border-[#ff6b6b]"
            onPress={() => router.push(`/(quiz)/room/${room.id}`)}
          >
            <ThemedText className="text-[#ff6b6b] text-xl font-bold mb-2">{room.name}</ThemedText>
            <ThemedText className="text-[#ff6b6b]">
              {room.players}/{room.maxPlayers}명 참여 중
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
