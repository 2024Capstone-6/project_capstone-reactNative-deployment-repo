import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import customFetch from '../../util/custom-fetch';
import { TEST_LEVELS } from '@/constants/TestLevels';

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
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'JLPT' | 'JPT' | 'BJT'>('JLPT');

  // 소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    if (!socket || !isConnected) return;

    // 실시간 방 목록 업데이트
    socket.on('roomListUpdate', (updatedRooms: Room[]) => {
      console.log('방 목록 업데이트:', updatedRooms);
      // 닫힌 방이나 게임 중인 방은 제외
      const availableRooms = updatedRooms.filter(
        (room) => room.status === 'lobby' && room.participants.length < MAX_PARTICIPANTS
      );
      setRooms(availableRooms);
    });

    // 방 참가 성공/실패 처리
    socket.on('joinRoomSuccess', (room: Room) => {
      console.log('방 참가 성공:', room);
    });

    socket.on('joinRoomError', (error: any) => {
      console.error('방 참가 실패:', error);
      alert(error?.message || '방 참가에 실패했습니다.');
    });

    // 에러 핸들링
    socket.on('error', (error) => {
      console.error('소켓 에러:', error);
      alert(error?.message || '에러가 발생했습니다.');
    });

    return () => {
      socket.off('roomListUpdate');
      socket.off('joinRoomSuccess');
      socket.off('joinRoomError');
      socket.off('error');
    };
  }, [socket, isConnected]);

  // 방 목록 조회
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await customFetch('quiz-game/rooms');
      if (!response.ok) throw new Error('방 목록을 불러오는데 실패했습니다');
      const data = await response.json();
      // 닫힌 방이나 게임 중인 방은 제외
      const availableRooms = data.filter(
        (room: Room) => room.status === 'lobby' && room.participants.length < MAX_PARTICIPANTS
      );
      setRooms(availableRooms);
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

      if (!socket || !isConnected) {
        alert('소켓 연결이 아직 완료되지 않았습니다.');
        return;
      }

      if (!newRoomName.trim()) {
        alert('방 이름을 입력해주세요.');
        return;
      }

      if (!difficulty) {
        alert('난이도를 선택해주세요.');
        return;
      }

      const response = await customFetch('quiz-game/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoomName.trim(),
          difficulty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '방 생성에 실패했습니다');
      }

      const newRoom = await response.json();
      console.log('방 생성 성공:', newRoom);

      socket.emit('joinRoom', { roomId: newRoom.roomId });
      setIsModalVisible(false);
      setNewRoomName('');
      setDifficulty('');
      handleJoinRoom(newRoom.roomId);
    } catch (error) {
      console.error('방 생성 실패:', error);
      alert(error instanceof Error ? error.message : '방 생성에 실패했습니다.');
    }
  };

  // 방 참가
  const handleJoinRoom = (roomId: string) => {
    if (!socket || !isConnected) {
      alert('소켓 연결이 아직 완료되지 않았습니다.');
      return;
    }

    const room = rooms.find((r) => r.roomId === roomId);
    if (!room) {
      alert('방을 찾을 수 없습니다.');
      return;
    }

    if (room.participants.length >= MAX_PARTICIPANTS) {
      alert('방이 가득 찼습니다.');
      return;
    }

    if (room.status !== 'lobby') {
      alert('이미 게임이 진행 중인 방입니다.');
      return;
    }

    socket.emit('joinRoom', { roomId });
    router.push(`/(quiz)/game/inMulti?roomCode=${roomId}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 방 목록 렌더링
  const renderRoomList = () => {
    if (loading) return <ThemedText>로딩중...</ThemedText>;

    // 닫힌 방이나 게임 중인 방은 제외
    const availableRooms = rooms.filter(
      (room) => room.status === 'lobby' && room.participants.length < MAX_PARTICIPANTS
    );

    if (availableRooms.length === 0) return <ThemedText>현재 참가 가능한 방이 없습니다.</ThemedText>;

    return availableRooms.map((room) => (
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

            {/* 난이도 선택 UI */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                {(['JLPT', 'JPT', 'BJT'] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`flex-1 mx-1 p-2 rounded-md ${
                      selectedCategory === category ? 'bg-[#ff6b6b]' : 'bg-gray-200'
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <ThemedText
                      className={`text-center ${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}
                    >
                      {category}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView className="max-h-32">
                {TEST_LEVELS[selectedCategory].map((level) => (
                  <TouchableOpacity
                    key={level}
                    className={`p-2 mb-1 rounded-md ${difficulty === level ? 'bg-[#ff6b6b]' : 'bg-gray-100'}`}
                    onPress={() => setDifficulty(level)}
                  >
                    <ThemedText className={`text-center ${difficulty === level ? 'text-white' : 'text-gray-700'}`}>
                      {level}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded-md"
                onPress={() => {
                  setIsModalVisible(false);
                  setNewRoomName('');
                  setDifficulty('');
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
