import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ENV } from '../../config/env';

interface Room {
  _id: string;
  roomId: string;
  name: string;
  participants: string[];
  status: 'lobby' | 'playing' | 'closed';
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

const MAX_PARTICIPANTS = 8;

export default function MultiGameScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ENV.API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error('방 목록을 불러오는데 실패했습니다');
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('방 목록 불러오기 실패:', error);
      alert('방 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();
  const handleCreateRoom = () => {
    // TODO: 방 생성 기능 구현
  };
  const handleJoinRoom = (roomId: string) => {
    router.push(`/(quiz)/game/inMulti?roomCode=${roomId}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoomList = () => {
    if (loading) {
      return <ThemedText>로딩중...</ThemedText>;
    }

    if (rooms.length === 0) {
      return <ThemedText>현재 생성된 방이 없습니다.</ThemedText>;
    }

    return rooms.map((room) => (
      <TouchableOpacity
        key={room._id}
        className="flex-row justify-between items-center p-2 rounded-md mb-2 bg-white border border-[#ff6b6b]"
        onPress={() => handleJoinRoom(room.roomId)}
      >
        <ThemedText className="text-md">{room.name}</ThemedText>
        <ThemedText className="text-sm text-[#a1a1a1]">
          {room.participants.length}/{MAX_PARTICIPANTS}
        </ThemedText>
      </TouchableOpacity>
    ));
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={handleBack}
        />
        <ThemedText type="title" className="mt-1 ml-2">
          참가할 방을 선택해주세요!
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-8">{renderRoomList()}</View>
      </ScrollView>

      <TouchableOpacity
        className="justify-center items-center w-full mb-8 p-2 bg-[#ff6b6b] rounded-sm"
        onPress={handleCreateRoom}
      >
        <ThemedText className="text-md text-white">방 생성</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
