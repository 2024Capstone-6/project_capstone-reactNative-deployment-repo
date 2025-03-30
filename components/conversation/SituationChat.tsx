import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ENV } from '@/config/env';

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
    text: string;
    is_correct: boolean;
    reason: string;
  }>;
}

// 부모 컴포넌트로부터 받는 props 타입 정의
interface SituationChatProps {
  onCorrectAnswer: (
    isCorrect: boolean,
    jpAnswer?: string,
    krAnswer?: string,
    nextJpQuestion?: string,
    nextKrQuestion?: string,
    nextKrAnswer?: string
  ) => void;
}

export default function SituationChat({ onCorrectAnswer }: SituationChatProps) {
  const { situationId } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  // 피드백 모달의 상태를 관리
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [orderIndex, setOrderIndex] = useState(0);
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

  // 컴포넌트 마운트 시 질문 데이터 로드
  useEffect(() => {
    fetchQuestions();
  }, []);

  // 피드백 모달을 표시하는 함수
  const showModal = (reason: string, isCorrect: boolean) => {
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
      }).start(() => setFeedback(null));
    }, 4000);
  };

  // 서버에서 질문 데이터를 가져오는 함수
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`);
      const questions = await response.json();
      if (questions?.[0]) {
        setCurrentQuestion(questions[0]);
        if (questions[1]) {
          setNextQuestion(questions[1]);
        }
      }
    } catch (error) {
      console.error('질문 로딩 실패:', error);
    }
  };

  // 사용자가 선택지를 선택했을 때 처리하는 함수
  const handleChoiceSelect = async (choice: string) => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/check-answer/${situationId}/${orderIndex}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedChoice: choice }),
      });

      // 선택한 답변이 정답인지 확인
      const selectedChoice = currentQuestion?.choices.find((c) => c.text === choice);
      if (!selectedChoice) return;

      // 피드백 모달 표시
      showModal(selectedChoice.reason, selectedChoice.is_correct);

      // 정답인 경우 다음 질문으로 진행
      if (selectedChoice.is_correct && currentQuestion && nextQuestion) {
        onCorrectAnswer(
          true,
          currentQuestion.jp_answer,
          currentQuestion.kr_answer,
          nextQuestion.jp_question,
          nextQuestion.kr_question,
          nextQuestion.kr_answer
        );

        // 4초 후 다음 질문으로 전환
        setTimeout(() => {
          setCurrentQuestion(nextQuestion);
          setOrderIndex((prev) => prev + 1);
          // 다음 질문 데이터 로드
          fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`)
            .then((res) => res.json())
            .then((questions) => {
              const nextIndex = orderIndex + 2;
              setNextQuestion(questions?.[nextIndex] || null);
            });
        }, 4000);
      }
    } catch (error) {
      console.error('답변 전송 실패:', error);
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
