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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../constants/Colors';
import { ENV } from '../../config/env';

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

interface GrammarBook {
  grammarbook_id: number;
  grammarbook_title: string;
  grammar_middle: Array<{
    grammar: {
      grammar_id: number;
      grammar: string;
    };
  }>;
}

interface BookmarkModalProps {
  isVisible: boolean;
  onClose: () => void;
  wordId?: number; // 현재 보고 있는 단어의 ID
  grammarId?: number; // 현재 보고 있는 문법의 ID
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({ isVisible, onClose, wordId, grammarId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [grammarBooks, setGrammarBooks] = useState<GrammarBook[]>([]);
  const [activeTab, setActiveTab] = useState<'word' | 'grammar'>('word');

  // API 호출을 위한 헤더 생성 함수
  const getAuthHeaders = async (contentType = false) => {
    const token = await AsyncStorage.getItem('userToken');
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  // API 응답 처리 함수
  const handleApiResponse = async (response: Response, successMessage: string, errorPrefix: string) => {
    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert('오류', errorData.message || `${errorPrefix}에 실패했습니다.`);
      return false;
    }

    Alert.alert('성공', successMessage);
    return true;
  };

  // 단어장 목록 조회
  const fetchWordBooks = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/words/books`, { headers });

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

  // 문법장 목록 조회
  const fetchGrammarBooks = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/grammars/books`, { headers });

      if (!response.ok) {
        throw new Error('문법장 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setGrammarBooks(data);
    } catch (error) {
      console.error('문법장 목록 조회 오류:', error);
      Alert.alert('오류', '문법장 목록을 불러오는데 실패했습니다.');
    }
  };

  // 모달이 열릴 때마다 단어장/문법장 목록 조회
  useEffect(() => {
    if (isVisible) {
      fetchWordBooks();
      fetchGrammarBooks();
    }
  }, [isVisible]);

  // 단어장 생성
  const createWordBook = async () => {
    if (!newBookTitle.trim()) return;

    try {
      setIsCreating(true);
      const headers = await getAuthHeaders(true);

      const response = await fetch(`${ENV.API_URL}/words/books`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ wordbook_title: newBookTitle }),
      });

      const success = await handleApiResponse(response, '단어장이 생성되었습니다.', '단어장 생성');

      if (success) {
        setShowCreateForm(false);
        setNewBookTitle('');
        fetchWordBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '단어장 생성 중 오류가 발생했습니다.');
      console.error('단어장 생성 오류:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // 단어장에 단어 추가
  const addWordToBook = async (wordbookId: number) => {
    if (!wordId) return;

    try {
      const headers = await getAuthHeaders(true);

      const response = await fetch(`${ENV.API_URL}/words/books/${wordbookId}/words`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ word_id: wordId }),
      });

      const success = await handleApiResponse(response, '단어가 단어장에 추가되었습니다.', '단어 추가');

      if (success) {
        fetchWordBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '단어 추가 중 오류가 발생했습니다.');
      console.error('단어 추가 오류:', error);
    }
  };

  // 단어장에서 단어 제거
  const removeWordFromBook = async (wordbookId: number) => {
    if (!wordId) return;

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${ENV.API_URL}/words/books/${wordbookId}/words/${wordId}`, {
        method: 'DELETE',
        headers,
      });

      const success = await handleApiResponse(response, '단어가 단어장에서 제거되었습니다.', '단어 제거');

      if (success) {
        fetchWordBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '단어 제거 중 오류가 발생했습니다.');
      console.error('단어 제거 오류:', error);
    }
  };

  // 단어장 삭제
  const deleteWordBook = async (wordbookId: number) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${ENV.API_URL}/words/books/${wordbookId}`, {
        method: 'DELETE',
        headers,
      });

      const success = await handleApiResponse(response, '단어장이 삭제되었습니다.', '단어장 삭제');

      if (success) {
        fetchWordBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '단어장 삭제 중 오류가 발생했습니다.');
      console.error('단어장 삭제 오류:', error);
    }
  };

  // 문법장 생성
  const createGrammarBook = async () => {
    if (!newBookTitle.trim()) return;

    try {
      setIsCreating(true);
      const headers = await getAuthHeaders(true);

      const response = await fetch(`${ENV.API_URL}/grammars/books`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ grammarbook_title: newBookTitle }),
      });

      const success = await handleApiResponse(response, '문법장이 생성되었습니다.', '문법장 생성');

      if (success) {
        setShowCreateForm(false);
        setNewBookTitle('');
        fetchGrammarBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '문법장 생성 중 오류가 발생했습니다.');
      console.error('문법장 생성 오류:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // 문법장 삭제
  const deleteGrammarBook = async (grammarbookId: number) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${ENV.API_URL}/grammars/books/${grammarbookId}`, {
        method: 'DELETE',
        headers,
      });

      const success = await handleApiResponse(response, '문법장이 삭제되었습니다.', '문법장 삭제');

      if (success) {
        fetchGrammarBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '문법장 삭제 중 오류가 발생했습니다.');
      console.error('문법장 삭제 오류:', error);
    }
  };

  // 문법장에 문법 추가
  const addGrammarToBook = async (grammarbookId: number) => {
    if (!grammarId) return;

    try {
      const headers = await getAuthHeaders(true);

      const response = await fetch(`${ENV.API_URL}/grammars/books/${grammarbookId}/grammars`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ grammar_id: grammarId }),
      });

      const success = await handleApiResponse(response, '문법이 문법장에 추가되었습니다.', '문법 추가');

      if (success) {
        fetchGrammarBooks(); // 목록 새로고침
      }
    } catch (error) {
      Alert.alert('오류', '문법 추가 중 오류가 발생했습니다.');
      console.error('문법 추가 오류:', error);
    }
  };

  // 단어장 항목 렌더링 컴포넌트
  const renderWordBookItem = ({ item }: { item: WordBook }) => (
    <View className="p-3 border-b border-gray-200">
      <View className="flex-row justify-between items-center">
        <Text>{item.wordbook_title}</Text>
        <Text className="text-gray-500">{item.word_middle?.length || 0}개의 단어</Text>
      </View>
      <View className="flex-row justify-end mt-2 space-x-2">
        {wordId && (
          <TouchableOpacity
            className="px-3 py-1 bg-[#ff6b6b] rounded-lg"
            onPress={() => addWordToBook(item.wordbook_id)}
          >
            <Text className="text-white text-sm">추가</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="px-3 py-1 bg-gray-200 rounded-lg" onPress={() => deleteWordBook(item.wordbook_id)}>
          <Text className="text-sm">삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 단어장 생성 폼 컴포넌트
  const renderCreateForm = () => (
    <View className="border-2 border-[#ff6b6b] rounded-xl p-3">
      <TextInput
        className="border-b border-gray-300 p-2 mb-3"
        placeholder={`${activeTab === 'word' ? '단어장' : '문법장'} 이름을 입력하세요`}
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
          onPress={activeTab === 'word' ? createWordBook : createGrammarBook}
          disabled={isCreating || !newBookTitle.trim()}
        >
          <Text className="text-white">{isCreating ? '생성 중...' : '생성하기'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 단어장 목록 컴포넌트
  const renderWordBookList = () => (
    <>
      <TouchableOpacity
        className="flex-row items-center border-2 border-[#ff6b6b] rounded-xl p-1 mb-4"
        onPress={() => setShowCreateForm(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color={Colors.tint} />
        <Text className="ml-2 text-[#ff6b6b]">새로운 폴더 생성하기</Text>
      </TouchableOpacity>
      <FlatList data={wordBooks} keyExtractor={(item) => item.wordbook_id.toString()} renderItem={renderWordBookItem} />
    </>
  );

  // 문법장 항목 렌더링 컴포넌트
  const renderGrammarBookItem = ({ item }: { item: GrammarBook }) => (
    <View className="p-3 border-b border-gray-200">
      <View className="flex-row justify-between items-center">
        <Text>{item.grammarbook_title}</Text>
        <Text className="text-gray-500">{item.grammar_middle?.length || 0}개의 문법</Text>
      </View>
      <View className="flex-row justify-end mt-2 space-x-2">
        {grammarId && (
          <TouchableOpacity
            className="px-3 py-1 bg-[#ff6b6b] rounded-lg"
            onPress={() => addGrammarToBook(item.grammarbook_id)}
          >
            <Text className="text-white text-sm">추가</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="px-3 py-1 bg-gray-200 rounded-lg"
          onPress={() => deleteGrammarBook(item.grammarbook_id)}
        >
          <Text className="text-sm">삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 문법장 목록 컴포넌트
  const renderGrammarBookList = () => (
    <>
      <TouchableOpacity
        className="flex-row items-center border-2 border-[#ff6b6b] rounded-xl p-1 mb-4"
        onPress={() => setShowCreateForm(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color={Colors.tint} />
        <Text className="ml-2 text-[#ff6b6b]">새로운 문법장 생성하기</Text>
      </TouchableOpacity>
      <FlatList
        data={grammarBooks}
        keyExtractor={(item) => item.grammarbook_id.toString()}
        renderItem={renderGrammarBookItem}
      />
    </>
  );

  // 탭 전환 컴포넌트
  const renderTabs = () => {
    return (
      <View className="flex-row mb-4 border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-2 ${activeTab === 'word' ? 'border-b-2 border-[#ff6b6b]' : ''}`}
          onPress={() => setActiveTab('word')}
        >
          <Text className={`text-center ${activeTab === 'word' ? 'text-[#ff6b6b] font-bold' : 'text-gray-500'}`}>
            단어장
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 ${activeTab === 'grammar' ? 'border-b-2 border-[#ff6b6b]' : ''}`}
          onPress={() => setActiveTab('grammar')}
        >
          <Text className={`text-center ${activeTab === 'grammar' ? 'text-[#ff6b6b] font-bold' : 'text-gray-500'}`}>
            문법장
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/30">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white h-[45%] rounded-t-xl p-4">
              {!showCreateForm ? (
                <>
                  {renderTabs()}
                  {activeTab === 'word' ? renderWordBookList() : renderGrammarBookList()}
                </>
              ) : (
                renderCreateForm()
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
