import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
/* import { ENV } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage'; */

interface WordBook {
  wordbook_id: number;
  wordbook_title: string;
  word_middle: Array<{
    word: {
      word_id: number;
      word: string;
    };
  }>;
}

interface BookmarkModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({ isVisible, onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);

  /*   // 단어장 목록 조회
  const fetchWordBooks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${ENV.API_URL}/words/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('단어장 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setWordBooks(data);
    } catch (error) {
      console.error('단어장 목록 조회 오류:', error);
      Alert.alert('오류', '단어장 목록을 불러오는데 실패했습니다.');
    }
  };

  // 모달이 열릴 때마다 단어장 목록 조회
  useEffect(() => {
    if (isVisible) {
      fetchWordBooks();
    }
  }, [isVisible]); */

  /*   // 단어장 생성
  const createWordBook = async () => {
    try {
      setIsCreating(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${ENV.API_URL}/words/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wordbook_title: newBookTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('오류', errorData.message || '단어장 생성에 실패했습니다.');
        return;
      }

      Alert.alert('성공', '단어장이 생성되었습니다.');
      setShowCreateForm(false);
      setNewBookTitle('');
      // fetchWordBooks(); // 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '단어장 생성 중 오류가 발생했습니다.');
      console.error('단어장 생성 오류:', error);
    } finally {
      setIsCreating(false);
    }
  }; */

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/30">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white h-[45%] rounded-t-xl p-4">
              {!showCreateForm ? (
                <>
                  <TouchableOpacity
                    className="flex-row items-center border-2 border-[#ff6b6b] rounded-xl p-1 mb-4"
                    onPress={() => setShowCreateForm(true)}
                  >
                    <Ionicons name="add-circle-outline" size={24} color={Colors.tint} />
                    <Text className="ml-2 text-[#ff6b6b]">새로운 폴더 생성하기</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={wordBooks}
                    keyExtractor={(item) => item.wordbook_id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity className="p-3 border-b border-gray-200 flex-row justify-between items-center">
                        <Text>{item.wordbook_title}</Text>
                        <Text className="text-gray-500">{item.word_middle?.length || 0}개의 단어</Text>
                      </TouchableOpacity>
                    )}
                  />
                </>
              ) : (
                <View className="border-2 border-[#ff6b6b] rounded-xl p-3">
                  <TextInput
                    className="border-b border-gray-300 p-2 mb-3"
                    placeholder="폴더 이름을 입력하세요"
                    value={newBookTitle}
                    onChangeText={setNewBookTitle}
                  />
                  <View className="flex-row justify-end space-x-2">
                    <TouchableOpacity
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onPress={() => {
                        setShowCreateForm(false);
                        setNewBookTitle('');
                      }}
                    >
                      <Text>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="px-4 py-2 bg-[#ff6b6b] rounded-lg"
                      // onPress={createWordBook}
                      disabled={isCreating || !newBookTitle.trim()}
                    >
                      <Text className="text-white">{isCreating ? '생성 중...' : '생성하기'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
