import { ThemedText } from '@/components/ThemedText';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';

export default function UserScreen() {
  const router = useRouter();

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
        <ThemedText className="text-lg font-bold">dlatth</ThemedText>
        <ThemedText className="text-gray-500">test02@gmail.com</ThemedText>
      </View>
      <View className="items-start m-4">
        <ThemedText className="text-lg text-[#ff6b6b] font-bold mb-2">단어</ThemedText>
        <View className="flex-row w-full h-[100px] mb-4">
          <TouchableOpacity style={styles.levelCard}>
            <ThemedText type="default">중간고사</ThemedText>
          </TouchableOpacity>
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
