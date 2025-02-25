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
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title">User</ThemedText>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: Colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
