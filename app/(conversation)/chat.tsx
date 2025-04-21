import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { ENV } from '@/config/env';

import AIChat from '@/components/conversation/AIChat';
import SituationChat from '@/components/conversation/SituationChat';

// 채팅 메시지의 타입 정의
interface ChatMessage {
  isAI: boolean; // AI가 보낸 메시지인지 사용자가 보낸 메시지인지 구분
  text: string;
  jpText?: string;
}

export default function ChatScreen() {
  const { situationId, situationName } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // 학습 모드(true)와 실전 회화 모드(false)를 구분하는 상태
  const [isPracticeMode, setIsPracticeMode] = useState(true);
  // 채팅 메시지 목록을 관리하는 상태
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 현재 질문 정보를 저장하는 상태
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  // 학습 모드일 때 초기 질문을 가져옴
  useEffect(() => {
    if (isPracticeMode) {
      fetchInitialQuestion();
    } else {
      setMessages([]); // 실전 회화 모드로 전환 시 메시지 초기화
    }
  }, [isPracticeMode]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 초기 질문을 서버에서 가져오는 함수
  const fetchInitialQuestion = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/questions/${situationId}`);
      const questions = await response.json();
      if (questions?.[0]) {
        const firstQuestion = questions[0];
        setCurrentQuestion(firstQuestion);
        // 초기 메시지 설정: AI의 질문과 사용자의 답변
        setMessages([
          { isAI: true, text: firstQuestion.kr_question, jpText: firstQuestion.jp_question },
          { isAI: false, text: firstQuestion.kr_answer },
        ]);
      }
    } catch (error) {
      console.error('초기 질문 로딩 실패:', error);
    }
  };

  // 뒤로 가기 버튼 핸들러
  const handleBack = () => router.back();

  // 학습 모드와 실전 회화 모드를 전환하는 함수
  const toggleMode = () => {
    setIsPracticeMode(!isPracticeMode);
  };

  return (
    <View className="flex-1 h-full m-[5%] p-4 top-10">
      {/* 상단 헤더: 뒤로가기, 제목, 모드 전환 버튼 */}
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

      {/* 채팅 메시지 목록 */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 mt-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View key={index} className={`flex-row items-start mb-4 ${!message.isAI ? 'justify-end' : ''}`}>
            {message.isAI && <Ionicons name="sparkles-outline" size={22} color="#ff6b6b" style={styles.icon} />}
            <View style={[styles.chat, !message.isAI && styles.userChat]}>
              <Text style={[!message.isAI && styles.userText]}>{message.text}</Text>
              {message.jpText && <Text className="text-gray-500 mt-1">{message.jpText}</Text>}
            </View>
            {!message.isAI && <Ionicons name="person" size={22} color="#ff6b6b" style={styles.icon} />}
          </View>
        ))}
      </ScrollView>

      {/* 하단 채팅 입력 영역: 모드에 따라 다른 컴포넌트 표시 */}
      <View className="flex-1 justify-end">
        {isPracticeMode ? (
          <SituationChat messages={messages} setMessages={setMessages} />
        ) : (
          <AIChat situationName={situationName as string} messages={messages} setMessages={setMessages} />
        )}
      </View>
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
  userChat: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  userText: {
    color: 'white',
  },
});
