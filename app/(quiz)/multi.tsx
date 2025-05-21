import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ENV } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

const MAX_PARTICIPANTS = 8;

interface Room {
  _id: string;
  roomId: string;
  name: string;
  participants: string[];
  status: 'lobby' | 'playing' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

export default function MultiGameScreen() {
  const { isSignedIn } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // 방 목록 조회
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ENV.API_URL}/api/rooms`);
      if (!response.ok) throw new Error('방 목록을 불러오는데 실패했습니다');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('방 목록 불러오기 실패:', error);
      alert('방 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 방 생성
  const handleCreateRoom = async () => {
    try {
      if (!isSignedIn) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${ENV.API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '방 생성에 실패했습니다');
      }

      const newRoom = await response.json();
      setRooms([...rooms, newRoom]);
      setIsModalVisible(false);
      setNewRoomName('');
    } catch (error) {
      console.error('방 생성 실패:', error);
      alert(error instanceof Error ? error.message : '방 생성에 실패했습니다.');
    }
  };

  // 방 참가
  const handleJoinRoom = (roomId: string) => {
    router.push(`/(quiz)/game/inMulti?roomCode=${roomId}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 방 목록 렌더링
  const renderRoomList = () => {
    if (loading) return <ThemedText>로딩중...</ThemedText>;
    if (rooms.length === 0) return <ThemedText>현재 생성된 방이 없습니다.</ThemedText>;

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
          onPress={() => router.back()}
        />
        <ThemedText type="title" className="mt-1 ml-2">
          참가할 방을 선택해주세요!
        </ThemedText>
      </View>

      {/* 방 목록 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-8">{renderRoomList()}</View>
      </ScrollView>

      {/* 방 생성 버튼 */}
      <TouchableOpacity
        className="justify-center items-center w-full mb-8 p-2 bg-[#ff6b6b] rounded-sm"
        onPress={() => setIsModalVisible(true)}
      >
        <ThemedText className="text-md text-white">방 생성</ThemedText>
      </TouchableOpacity>

      {/* 방 생성 모달 */}
      <Modal transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <ThemedText type="title" className="mb-4">
              방 생성
            </ThemedText>
            <TextInput
              className="border border-gray-300 rounded-md p-2 mb-4"
              placeholder="방 이름을 입력하세요"
              value={newRoomName}
              onChangeText={setNewRoomName}
            />
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded-md"
                onPress={() => {
                  setIsModalVisible(false);
                  setNewRoomName('');
                }}
              >
                <ThemedText>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-2 bg-[#ff6b6b] rounded-md" onPress={handleCreateRoom}>
                <ThemedText className="text-white">생성</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
