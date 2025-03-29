import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ENV } from '@/config/env';

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
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [orderIndex, setOrderIndex] = useState(0);
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

  const showModal = (reason: string, isCorrect: boolean) => {
    setFeedback({ message: reason, isCorrect });
    // 모달 애니메이션 시작
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // 5초 후 모달 닫기
    setTimeout(() => {
      Animated.timing(modalAnimation, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFeedback(null));
    }, 3000);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`);
      const questions = await response.json();
      if (questions && questions.length > 0) {
        setCurrentQuestion(questions[0]);
        if (questions.length > 1) {
          setNextQuestion(questions[1]);
        }
      }
    } catch (error) {
      console.error('질문 로딩 실패:', error);
    }
  };

  const handleChoiceSelect = async (choice: string) => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/check-answer/${situationId}/${orderIndex}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedChoice: choice }),
      });

      const data = await response.json();
      const selectedChoice = currentQuestion?.choices.find((c) => c.text === choice);

      if (selectedChoice) {
        showModal(selectedChoice.reason, selectedChoice.is_correct);

        if (selectedChoice.is_correct) {
          // 정답인 경우 대화 내용 업데이트
          if (currentQuestion && nextQuestion) {
            // 현재 정답과 다음 질문을 함께 전달
            onCorrectAnswer(
              true,
              currentQuestion.jp_answer,
              currentQuestion.kr_answer,
              nextQuestion.jp_question,
              nextQuestion.kr_question,
              nextQuestion.kr_answer
            );
          }

          // 5초 후에 다음 질문으로 전환
          setTimeout(() => {
            if (nextQuestion) {
              setCurrentQuestion(nextQuestion);
              setOrderIndex((prev) => prev + 1);
              // 다음 질문 가져오기
              fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`)
                .then((res) => res.json())
                .then((questions) => {
                  const nextIndex = orderIndex + 2;
                  if (questions && questions.length > nextIndex) {
                    setNextQuestion(questions[nextIndex]);
                  } else {
                    setNextQuestion(null);
                  }
                });
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error('답변 전송 실패:', error);
    }
  };

  if (!currentQuestion) {
    return (
      <View className="flex-1 bottom-8 items-center justify-center">
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bottom-8 items-center justify-center">
      {/* 빈칸 있는 배열 */}
      <View style={styles.container} className="w-full">
        <Text className="text-lg">{currentQuestion.blank_answer}</Text>
      </View>

      {/* 선택지 나열 */}
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
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
