import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import customFetch from '../../../util/custom-fetch';

interface Room {
  _id: string;
  roomId: string;
  name: string;
  participants: string[];
  status: 'lobby' | 'playing' | 'closed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  difficulty: string;
  maxParticipants: number;
  readyStatus?: Record<string, boolean>;
  totalScores?: Record<string, number>;
}

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

export default function InMultiGameScreen() {
  const { roomCode } = useLocalSearchParams();
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStart, setIsStart] = useState(false);

  // 방 정보 조회
  const fetchRoomInfo = async () => {
    try {
      setLoading(true);
      const response = await customFetch(`quiz-game/rooms/${roomCode}`);
      if (!response.ok) throw new Error('방 정보를 불러오는데 실패했습니다');
      const data = await response.json();
      setRoom(data);
    } catch (error) {
      console.error('방 정보 불러오기 실패:', error);
      alert('방 정보를 불러오는데 실패했습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return;

    // 방 참가 성공/실패 처리
    socket.on('joinRoomSuccess', (roomData: Room) => {
      console.log('방 참가 성공:', roomData);
      setRoom(roomData);
    });

    socket.on('joinRoomError', (error: any) => {
      console.error('방 참가 실패:', error);
      alert(error?.message || '방 참가에 실패했습니다.');
      router.back();
    });

    // 방 상태 업데이트
    socket.on('roomUpdate', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    // 게임 시작
    socket.on('gameStarted', () => {
      console.log('게임 시작됨');
      setIsStart(true);
      // TODO: 게임 화면으로 전환
    });

    // 에러 핸들링
    socket.on('error', (error) => {
      console.error('소켓 에러:', error);
      alert(error?.message || '에러가 발생했습니다.');
    });

    return () => {
      socket.off('joinRoomSuccess');
      socket.off('joinRoomError');
      socket.off('roomUpdate');
      socket.off('gameStarted');
      socket.off('error');
    };
  }, [socket, isConnected, roomCode]);

  // 초기 방 정보 로드
  useEffect(() => {
    fetchRoomInfo();
  }, [roomCode]);

  // 방 나가기
  const handleLeaveRoom = () => {
    if (!socket || !isConnected || !roomCode) return;
    socket.emit('leaveRoom', { roomId: roomCode });
    router.back();
  };

  // 준비하기
  const handleReady = () => {
    if (!socket || !isConnected || !roomCode) return;
    socket.emit('ready', { roomId: roomCode, ready: true });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ThemedText>로딩중...</ThemedText>
      </View>
    );
  }

  if (!room) {
    return (
      <View className="flex-1 justify-center items-center">
        <ThemedText>방을 찾을 수 없습니다.</ThemedText>
        <TouchableOpacity className="mt-4 p-2 bg-[#ff6b6b] rounded-md" onPress={() => router.back()}>
          <ThemedText className="text-white">뒤로 가기</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      <View className="flex-row items-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={handleLeaveRoom}
        />
        <ThemedText type="title" className="mt-1 ml-2">
          {room.name}
        </ThemedText>
      </View>

      {/* 방 정보 */}
      <View className="mb-6 p-4 bg-white rounded-lg border border-[#ff6b6b]">
        <ThemedText className="mb-2">난이도: {room.difficulty}</ThemedText>
        <ThemedText>
          참가자: {room.participants.length}/{room.maxParticipants}
        </ThemedText>
        {/* <ThemedText>상태: {room.status === 'lobby' ? '대기중' : '게임중'}</ThemedText> */}
      </View>

      {/* 참가자 목록 */}
      <View className="mb-6">
        <ThemedText type="subtitle" className="mb-2">
          참가자 목록
        </ThemedText>
        <ScrollView className="max-h-40">
          {room.participants.map((participant, index) => (
            <View
              key={index}
              className={`flex-row items-center p-2 mb-1 rounded-md border border-[#ff6b6b] ${
                room.readyStatus?.[participant] ? 'bg-[#ff6b6b]' : 'bg-white'
              }`}
            >
              <ThemedText>{participant}</ThemedText>
              {room.readyStatus?.[participant] && (
                <ThemedText className="flex-1 text-right mr-2 text-white">✔ 준비완료</ThemedText>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 준비 버튼 */}
      {room.status === 'lobby' && (
        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity className="px-6 py-2 bg-[#ff6b6b] rounded-md" onPress={handleReady}>
            <ThemedText className="text-white">준비</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity className="px-6 py-2 bg-white rounded-md border border-[#ff6b6b]" onPress={handleLeaveRoom}>
            <ThemedText className="text-[#ff6b6b]">방 나가기</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
