import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ENV } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 질문 데이터의 타입 정의
interface Question {
  qna_id: number;
  order_index: number;
  jp_question: string;
  kr_question: string;
  jp_answer: string;
  kr_answer: string;
  blank_answer: string;
  choices: Array<{
    // 선택지 배열
    text: string; // 선택지 텍스트
    is_correct: boolean; // 정답 여부
    reason: string; // 피드백 메시지
  }>;
}

// 채팅 메시지의 타입 정의
interface ChatMessage {
  isAI: boolean;
  text: string;
  jpText?: string;
}

// 부모 컴포넌트로부터 받는 props 타입 정의
interface SituationChatProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function SituationChat({ messages, setMessages }: SituationChatProps) {
  const { situationId } = useLocalSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  // 피드백 모달의 상태를 관리
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [orderIndex, setOrderIndex] = useState(0);
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

  // 컴포넌트 마운트 시 모든 질문 데이터 로드
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            await AsyncStorage.removeItem('userToken');
            router.replace('/login');
            return;
          }
          throw new Error('질문을 불러오는데 실패했습니다.');
        }

        const loadedQuestions = await response.json();
        setQuestions(loadedQuestions);
        if (loadedQuestions?.[0]) {
          setCurrentQuestion(loadedQuestions[0]);
          if (loadedQuestions[1]) {
            setNextQuestion(loadedQuestions[1]);
          }
        }
      } catch (error) {
        console.error('질문 로딩 실패:', error);
        setFeedback({
          message: '질문을 불러오는데 실패했습니다. 다시 시도해주세요.',
          isCorrect: false,
        });
      }
    };

    loadQuestions();
  }, []);

  // 피드백 모달을 표시하는 함수
  const showModal = (
    reason: string,
    isCorrect: boolean,
    selectedChoice?: { is_correct: boolean },
    currentQuestion?: Question,
    nextQuestion?: Question
  ) => {
    setFeedback({ message: reason, isCorrect });
    // 모달이 아래에서 위로 올라오는 애니메이션
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // 4초 후 모달이 아래로 내려가는 애니메이션
    setTimeout(() => {
      Animated.timing(modalAnimation, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setFeedback(null);
        if (selectedChoice?.is_correct && currentQuestion && nextQuestion) {
          const filteredMessages = messages.filter((_, index) => index !== messages.length - 1);
          const newMessages = [
            ...filteredMessages,
            { isAI: false, text: currentQuestion.kr_answer, jpText: currentQuestion.jp_answer },
            { isAI: true, text: nextQuestion.kr_question, jpText: nextQuestion.jp_question },
            { isAI: false, text: nextQuestion.kr_answer },
          ];
          setMessages(newMessages);

          const nextIndex = orderIndex + 1;
          setOrderIndex(nextIndex);
          setCurrentQuestion(nextQuestion);
          if (questions[nextIndex + 1]) {
            setNextQuestion(questions[nextIndex + 1]);
          }
        }
      });
    }, 4000);
  };

  // 사용자가 선택지를 선택했을 때 처리하는 함수
  const handleChoiceSelect = async (choice: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${ENV.API_URL}/chatbot/check-answer/${situationId}/${orderIndex}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedChoice: choice }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          router.replace('/login');
          return;
        }
        throw new Error('답변을 확인하는데 실패했습니다.');
      }

      // 선택한 답변이 정답인지 확인
      const selectedChoice = currentQuestion?.choices.find((c) => c.text === choice);
      if (!selectedChoice || !currentQuestion || !nextQuestion) return;

      // 피드백 모달 표시
      showModal(selectedChoice.reason, selectedChoice.is_correct, selectedChoice, currentQuestion, nextQuestion);
    } catch (error) {
      console.error('답변 전송 실패:', error);
      setFeedback({
        message: '답변을 확인하는데 실패했습니다. 다시 시도해주세요.',
        isCorrect: false,
      });
    }
  };

  // 로딩 상태 표시
  if (!currentQuestion) {
    return (
      <View className="flex-1 bottom-8 items-center justify-center">
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bottom-8 items-center justify-center">
      {/* 빈칸이 있는 질문 표시 */}
      <View style={styles.container} className="w-full">
        <Text className="text-lg">{currentQuestion.blank_answer}</Text>
      </View>

      {/* 선택지 버튼들 */}
      <View className="flex-row flex-wrap justify-between mt-2 w-full">
        {currentQuestion.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.container}
            className="w-[48%] mt-2"
            onPress={() => handleChoiceSelect(choice.text)}
          >
            <Text>{choice.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 피드백 모달 */}
      {feedback && (
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: modalAnimation }],
              backgroundColor: feedback.isCorrect ? '#4CAF50' : '#ff6b6b',
            },
          ]}
        >
          <Text className="text-lg text-center text-white">{feedback.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
