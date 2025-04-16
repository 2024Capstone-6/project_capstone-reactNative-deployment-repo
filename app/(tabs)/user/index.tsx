import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { useEffect, useState } from 'react';
import { ENV } from '@/config/env';

interface WordBook {
  wordbook_id: number;
  wordbook_title: string;
}

interface UserProfile {
  uuid: string;
  email: string;
}

export default function UserScreen() {
  const router = useRouter();
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
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

  useEffect(() => {
    fetchUserProfile();
    fetchWordBooks();
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
      <View className="top-0 w-full h-[35%] z-10 rounded-b-[50%] bg-[#ff6b6b] relative">
        {/* 프로필 이미지 */}
        <View className="absolute bottom-[-70px] left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-full bg-white shadow-md"></View>
      </View>
      <View className="items-center mt-20">
        <ThemedText className="text-lg font-bold">{userProfile?.email?.split('@')[0] || '로딩 중...'}</ThemedText>
        <ThemedText className="text-gray-500">{userProfile?.email || '로딩 중...'}</ThemedText>
      </View>
      <View className="items-start m-4">
        <ThemedText className="text-lg text-[#ff6b6b] font-bold mb-2">단어</ThemedText>
        <View className="flex-row w-full h-[100px] mb-4">
          {wordBooks.map((wordBook) => (
            <TouchableOpacity key={wordBook.wordbook_id} style={styles.levelCard}>
              <ThemedText type="default">{wordBook.wordbook_title}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <ThemedText className="text-lg text-[#ff6b6b] font-bold mb-2">문법</ThemedText>
        <View className="flex-row w-full h-[100px] mb-4">
          <TouchableOpacity style={styles.levelCard}>
            <ThemedText type="default">JPT</ThemedText>
          </TouchableOpacity>
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
