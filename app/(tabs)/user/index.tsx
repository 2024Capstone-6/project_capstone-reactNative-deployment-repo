import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../../constants/Colors';
import { useEffect, useState } from 'react';
import { ENV } from '@/config/env';
interface WordBook {
  wordbook_id: number;
  wordbook_title: string;
}

interface GrammarBook {
  grammarbook_id: number;
  grammarbook_title: string;
}

interface UserProfile {
  uuid: string;
  email: string;
}

export default function UserScreen() {
  const router = useRouter();
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [grammarBooks, setGrammarBooks] = useState<GrammarBook[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

  const fetchUserProfile = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${ENV.API_URL}/profile`, { headers });

      if (!response.ok) {
        throw new Error('사용자 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

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

  useEffect(() => {
    fetchUserProfile();
    fetchWordBooks();
    fetchGrammarBooks();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Token removed successfully'); // 확인용

      if (Platform.OS === 'web') {
        window.location.href = '/';
      } else {
        router.push('/(auth)/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View className="flex-1">
      <View className="top-0 w-full h-[25%] z-10 rounded-b-[80%] bg-[#ff6b6b] relative">
        {/* 프로필 이미지 */}
        <View className="absolute bottom-[-70px] left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-full bg-white shadow-md items-center justify-center">
          <Ionicons name="person-outline" size={70} color={Colors.tint} />
        </View>
      </View>
      <View className="items-center mt-20">
        <ThemedText className="text-lg font-bold">{userProfile?.email?.split('@')[0] || '로딩 중...'}</ThemedText>
        <ThemedText className="text-gray-500">{userProfile?.email || '로딩 중...'}</ThemedText>
      </View>
      <View className="items-start m-4">
        <ThemedText className="text-lg text-[#ff6b6b] font-bold mb-2">단어</ThemedText>
        <View className="flex-row w-full h-[100px] mb-4">
          {/* 가로 스크롤 레벨 카드 목록 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {wordBooks.map((wordBook) => (
              <TouchableOpacity key={wordBook.wordbook_id} style={styles.levelCard}>
                <ThemedText type="default">{wordBook.wordbook_title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ThemedText className="text-lg text-[#ff6b6b] font-bold mb-2">문법</ThemedText>
        <View className="flex-row w-full h-[100px] mb-4">
          {/* 가로 스크롤 레벨 카드 목록 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {grammarBooks.map((grammarBook) => (
              <TouchableOpacity key={grammarBook.grammarbook_id} style={styles.levelCard}>
                <ThemedText type="default">{grammarBook.grammarbook_title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  levelCard: {
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 10,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    textAlign: 'center',
  },
  logoutButton: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: Colors.tint,
    paddingVertical: 4,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
