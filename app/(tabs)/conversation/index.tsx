import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ENV } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

// 카테고리 데이터의 타입 정의
interface Category {
  category_id: number;
  category_name: string;
  situations: {
    situation_id: number;
    situation_name: string;
  }[];
}

export default function ConversationScreen() {
  // 현재 확장된 카테고리 버튼의 인덱스를 저장하는 상태
  const [expandedButton, setExpandedButton] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // 컴포넌트 마운트 시 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          setError('로그인이 필요합니다.');
          setCategories([]);
          return;
        }

        const response = await fetch(`${ENV.API_URL}/chatbot/categories-with-situations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('인증이 만료되었습니다. 다시 로그인해주세요.');
            // 토큰 삭제 및 로그인 상태 업데이트
            await AsyncStorage.removeItem('userToken');
            router.replace('/login');
          } else {
            setError('카테고리를 불러오는데 실패했습니다.');
          }
          setCategories([]);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('카테고리 데이터가 배열 형식이 아닙니다:', data);
          setError('데이터 형식이 올바르지 않습니다.');
          setCategories([]);
          return;
        }

        const validCategories = data.filter(
          (category) =>
            category &&
            typeof category.category_id === 'number' &&
            typeof category.category_name === 'string' &&
            Array.isArray(category.situations)
        );

        setCategories(validCategories);
        setError(null);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
        setError('서버 연결에 실패했습니다.');
        setCategories([]);
      }
    };

    if (isSignedIn) {
      fetchCategories();
    } else {
      setError('로그인이 필요합니다.');
      setCategories([]);
    }
  }, [isSignedIn]);

  // 카테고리 버튼 클릭 시 확장/축소 처리
  const handlePress = (buttonIndex: number) => {
    setExpandedButton(expandedButton === buttonIndex ? null : buttonIndex);
  };

  // 상황 선택 시 채팅 화면으로 이동
  const handleSituationPress = (situationId: number, situationName: string) => {
    router.push({
      pathname: '/(conversation)/chat',
      params: { situationId: situationId.toString(), situationName },
    });
  };

  return (
    <View className="flex-1 m-4 p-4 items-start justify-center">
      {/* 상단 안내 텍스트 */}
      <ThemedText type="subtitle" className="mb-1">
        상황에 따른 연습이 필요하신가요?
      </ThemedText>
      <ThemedText type="subtitle" className="mb-3">
        전체적인 피드백을 받을 수 있습니다.
      </ThemedText>
      <ThemedText type="title">다양한 상황을 선택하여</ThemedText>
      <ThemedText type="title" className="mb-4">
        챗봇과 대화해보세요!
      </ThemedText>

      {error ? (
        <View className="w-full items-center justify-center p-4">
          <ThemedText type="subtitle" className="text-red-500">
            {error}
          </ThemedText>
        </View>
      ) : (
        /* 카테고리 목록 */
        categories.map((category, index) => (
          <TouchableOpacity
            key={category.category_id}
            className={`w-full ${
              expandedButton === index ? 'h-[20%]' : 'h-[8%] border-2 border-[#ff6b6b] bg-white'
            } mb-2 rounded-xl items-center justify-center`}
            onPress={() => handlePress(index)}
          >
            {expandedButton === index ? (
              <View className="w-full h-full">
                {/* 카테고리 헤더 */}
                <View className="h-[40%] border-2 border-[#ff6b6b] bg-white rounded-xl items-center justify-center">
                  <Text className="text-xl">{category.category_name}</Text>
                </View>
                {/* 상황 목록 */}
                <ScrollView className="flex-1 w-full" contentContainerStyle={styles.situationContainer}>
                  {category.situations.map((situation) => (
                    <Text
                      key={situation.situation_id}
                      style={styles.situationButton}
                      onPress={() => handleSituationPress(situation.situation_id, situation.situation_name)}
                    >
                      {situation.situation_name}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text className="text-xl">{category.category_name}</Text>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  situationButton: {
    margin: 3,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 3,
    backgroundColor: 'white',
  },
  situationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
});
