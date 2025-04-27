import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENV } from '@/config/env';

interface Message {
  isAI: boolean;
  text: string;
}

interface AIChatProps {
  situationName: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ERROR_MESSAGE = '죄송합니다. 서버와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

export default function AIChat({ situationName, setMessages }: AIChatProps) {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

  const showFeedbackModal = (feedbackText: string) => {
    setFeedback(feedbackText);
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
    }, 10000);
  };

  const handleFeedback = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      showFeedbackModal(data.feedback);
    } catch (error) {
      showFeedbackModal('피드백을 가져오는 중 오류가 발생했습니다.');
    }
  };

  const fetchInitialMessage = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: situationName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages([{ isAI: true, text: data.text }]);
    } catch (error) {
      setMessages([{ isAI: true, text: ERROR_MESSAGE }]);
    }
  };

  const handleSend = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    const userMessage = { isAI: false, text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await fetch(`${ENV.API_URL}/chatbot/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situationName,
          userText: trimmedInput,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { isAI: true, text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { isAI: true, text: ERROR_MESSAGE }]);
    }
  };

  useEffect(() => {
    if (situationName) {
      fetchInitialMessage();
    }
  }, [situationName]);

  return (
    <View className="w-full h-[35%] min-h-[100px] max-h-[250px] mb-20 bg-white rounded-lg border-2 border-[#ff6b6b] p-4">
      <View className="flex-1 p-2">
        <TextInput
          className="w-full h-[80%] items-start justify-start"
          multiline
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
        />
        <View className="flex-row items-center justify-end space-x-4 mt-2">
          <TouchableOpacity onPress={handleFeedback}>
            <Text className="text-sm text-[#ff6b6b] font-semibold border-2 border-[#ff6b6b] rounded-md px-2 py-1">
              피드백
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="paper-plane-outline" size={25} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 피드백 모달 */}
      {feedback && (
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: modalAnimation }],
            },
          ]}
        >
          <Text className="text-md text-pretty text-start">{feedback}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
