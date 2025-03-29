import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ENV } from '@/config/env';

import AIChat from '@/components/conversation/AIChat';
import SituationChat from '@/components/conversation/SituationChat';

interface ChatMessage {
  isAI: boolean;
  text: string;
  jpText?: string;
}

export default function ChatScreen() {
  const { situationId } = useLocalSearchParams();
  const { situationName } = useLocalSearchParams();
  const router = useRouter();
  const [isPracticeMode, setIsPracticeMode] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  useEffect(() => {
    if (isPracticeMode) {
      fetchInitialQuestion();
    }
  }, [isPracticeMode]);

  const fetchInitialQuestion = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`);
      const questions = await response.json();
      if (questions && questions.length > 0) {
        const firstQuestion = questions[0];
        setCurrentQuestion(firstQuestion);
        setMessages([
          {
            isAI: true,
            text: firstQuestion.kr_question,
            jpText: firstQuestion.jp_question,
          },
          {
            isAI: false,
            text: firstQuestion.kr_answer,
          },
        ]);
      }
    } catch (error) {
      console.error('초기 질문 로딩 실패:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const toggleMode = () => {
    setIsPracticeMode(!isPracticeMode);
    setMessages([]); // 모드 전환 시 메시지 초기화
  };

  const updateMessages = (
    isCorrect: boolean,
    jpAnswer?: string,
    krAnswer?: string,
    nextJpQuestion?: string,
    nextKrQuestion?: string,
    nextKrAnswer?: string
  ) => {
    if (isCorrect && jpAnswer && krAnswer) {
      // 이전 메시지들을 필터링하여 마지막 사용자 메시지를 제거
      const filteredMessages = messages.filter((_, index) => index !== messages.length - 1);

      setMessages([
        ...filteredMessages,
        {
          isAI: false,
          text: krAnswer,
          jpText: jpAnswer,
        },
        // 다음 질문이 있으면 바로 추가
        ...(nextKrQuestion && nextJpQuestion && nextKrAnswer
          ? [
              {
                isAI: true,
                text: nextKrQuestion,
                jpText: nextJpQuestion,
              },
              {
                isAI: false,
                text: nextKrAnswer,
              },
            ]
          : []),
      ]);
    }
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      <View className="flex-row items-center justify-center mb-6">
        <Ionicons
          name="arrow-back-outline"
          size={24}
          className="m-1 text-[#ff6b6b]"
          accessibilityLabel="arrow-back-outline icon"
          onPress={handleBack}
        />
        <ThemedText type="title">{situationName}</ThemedText>
        <TouchableOpacity className="justify-end ml-auto p-1 rounded-8 bg-[#ff6b6b]" onPress={toggleMode}>
          <Text className="text-white">{isPracticeMode ? '실전 회화' : '학습 모드'}</Text>
        </TouchableOpacity>
      </View>

      {/* 채팅 내용 */}
      <ScrollView className="flex-1 mt-6" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => (
          <View key={index} className={`flex-row items-start mb-4 ${!message.isAI ? 'justify-end' : ''}`}>
            {message.isAI && <Ionicons name="sparkles-outline" size={22} color="#ff6b6b" style={styles.icon} />}
            <View style={styles.chat}>
              <Text>{message.text}</Text>
              {message.jpText && <Text className="text-gray-500 mt-1">{message.jpText}</Text>}
            </View>
            {!message.isAI && <Ionicons name="person" size={22} color="#ff6b6b" style={styles.icon} />}
          </View>
        ))}
      </ScrollView>

      <View className="flex-1">{isPracticeMode ? <SituationChat onCorrectAnswer={updateMessages} /> : <AIChat />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  chat: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
});
