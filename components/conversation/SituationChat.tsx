import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  onCorrectAnswer: (isCorrect: boolean, jpAnswer?: string, krAnswer?: string) => void;
}

export default function SituationChat({ onCorrectAnswer }: SituationChatProps) {
  const { situationId } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`);
      const questions = await response.json();
      if (questions && questions.length > 0) {
        setCurrentQuestion(questions[0]);
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
      setFeedback(data.explanation);

      if (data.success && data.nextQnA) {
        // 정답인 경우 대화 내용 업데이트 및 다음 질문으로 이동
        if (currentQuestion) {
          onCorrectAnswer(true, currentQuestion.jp_answer, currentQuestion.kr_answer);
        }
        setCurrentQuestion(data.nextQnA);
        setOrderIndex((prev) => prev + 1);
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
      {/* 피드백 표시 영역 */}
      {feedback && (
        <View style={styles.container} className="w-full mb-2">
          <Text>{feedback}</Text>
        </View>
      )}

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
});
