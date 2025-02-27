import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  // const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* const handleRegister = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const data = await response.json();
      await AsyncStorage.setItem('userToken', data.token);
      router.replace('/(tabs)');
    } catch (err) {
      setError('회원가입에 실패했습니다.');
    }
  }; */

  return (
    <View className="flex-1 h-full items-center justify-center" style={{ backgroundColor: Colors.tint }}>
      <View className="h-[60%] w-[75%] rounded-[8px] p-4 justify-center" style={{ backgroundColor: Colors.background }}>
        <Text style={styles.title}>Sign Up</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          // onPress={handleRegister}
          className="rounded-md p-3 mt-4"
          style={{ backgroundColor: Colors.tint }}
        >
          <Text className="text-white text-center font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
