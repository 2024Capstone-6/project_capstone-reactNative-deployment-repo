import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
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

export default function AIChat({ situationName, messages, setMessages }: AIChatProps) {
  const [inputText, setInputText] = useState('');

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
    <View className="w-full h-[30%] min-h-[100px] max-h-[250px] mb-20 bg-white rounded-lg border-2 border-[#ff6b6b] p-4">
      <TextInput
        className="w-full h-full items-start justify-start"
        multiline
        value={inputText}
        onChangeText={setInputText}
        placeholder="메시지를 입력하세요..."
      />
      <View className="flex-1 items-end justify-end">
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="paper-plane-outline" size={25} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
