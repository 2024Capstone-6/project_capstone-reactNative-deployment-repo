import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { QuizCard } from '@/components/quiz/QuizCard';
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
  currentRound?: number;
  totalRounds?: number;
}

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

export default function MultiGameScreen() {
  const { roomCode } = useLocalSearchParams();
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    choices: string[];
    round: number;
    totalRounds: number;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState<Record<string, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isModal, setIsModal] = useState<string | null>(null);

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

  // 모달 자동 닫기
  useEffect(() => {
    if (isModal) {
      const timer = setTimeout(() => {
        setIsModal(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isModal]);

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return;

    // 초기 방 정보 로드
    fetchRoomInfo();

    // 새 문제 이벤트
    socket.on('newQuestion', (data) => {
      console.log('새 문제:', data);
      setCurrentQuestion(data);
      setIsAnswered(false);
      setIsModal(null);
    });

    // 정답 결과 이벤트
    socket.on('answerResult', (data) => {
      console.log('정답 결과:', data);
      if (data.alreadyAnswered) {
        setIsModal('이미 답변을 제출했습니다.');
      } else if (data.correct) {
        setIsModal(`정답! +${data.totalScore}점`);
      } else {
        setIsModal('오답!');
      }
      setIsAnswered(true);
    });

    // 게임 종료 이벤트
    socket.on('gameOver', (data) => {
      console.log('게임 종료:', data);
      setGameOver(true);
      setFinalScores(data.totalScores);
    });

    // 방 상태 업데이트
    socket.on('roomUpdate', (updatedRoom: Room) => {
      console.log('방 업데이트:', updatedRoom);
      setRoom(updatedRoom);
    });

    // 에러 핸들링
    socket.on('error', (error) => {
      console.error('소켓 에러:', error);
      alert(error?.message || '에러가 발생했습니다.');
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('roomUpdate');
      socket.off('error');
    };
  }, [socket, isConnected, roomCode]);

  // 답변 제출
  const handleAnswer = (selectedAnswer: string): boolean => {
    if (!socket || !isConnected || !roomCode || isAnswered) return false;

    socket.emit('submitAnswer', {
      roomId: roomCode,
      answer: selectedAnswer,
    });

    return false; // QuizCard의 onAnswer 콜백에서 사용
  };

  // 방 나가기
  const handleLeaveRoom = () => {
    if (!socket || !isConnected || !roomCode) return;
    socket.emit('leaveRoom', { roomId: roomCode });
    router.push('/(quiz)/multi');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ThemedText>로딩중...</ThemedText>
      </View>
    );
  }

  if (gameOver) {
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
            게임 종료!
          </ThemedText>
        </View>

        <View className="bg-white rounded-lg p-4 border border-[#ff6b6b]">
          <ThemedText type="subtitle" className="mb-4">
            최종 점수
          </ThemedText>
          {Object.entries(finalScores)
            .sort(([, a], [, b]) => b - a)
            .map(([player, score], index) => (
              <View key={player} className="flex-row justify-between items-center p-2 mb-2 bg-gray-50 rounded-md">
                <ThemedText>
                  {index + 1}위: {player}
                </ThemedText>
                <ThemedText className="font-bold">{score}점</ThemedText>
              </View>
            ))}
        </View>

        <TouchableOpacity className="mt-6 p-4 bg-[#ff6b6b] rounded-md" onPress={handleLeaveRoom}>
          <ThemedText className="text-white text-center">방 나가기</ThemedText>
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
          {room?.name}
        </ThemedText>
      </View>

      {currentQuestion ? (
        <>
          <View className="justify-start mb-2">
            <ThemedText className="text-center text-[#ff6b6b]">
              라운드 {currentQuestion.round}/{currentQuestion.totalRounds}
            </ThemedText>
          </View>
          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.choices}
            onAnswer={handleAnswer}
            timeLimit={10}
            disabled={isAnswered}
            isMultiplayer={true}
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <ThemedText>게임 준비중...</ThemedText>
        </View>
      )}

      {/* 현재 점수 표시 */}
      {room?.totalScores && (
        <View className="mb-4 bg-white/65 rounded-lg p-4 border border-[#ff6b6b]">
          <ThemedText type="subtitle" className="mb-2">
            현재 점수
          </ThemedText>
          <ScrollView className="max-h-32">
            {Object.entries(room.totalScores)
              .sort(([, a], [, b]) => b - a)
              .map(([player, score]) => (
                <View key={player} className="flex-row justify-between items-center p-2 mb-1">
                  <ThemedText>{player}</ThemedText>
                  <ThemedText className="font-bold">{score}점</ThemedText>
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      {/* 모달 */}
      {isModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{isModal}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginVertical: 20,
  },
});
