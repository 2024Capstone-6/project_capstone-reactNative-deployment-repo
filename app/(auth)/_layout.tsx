import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: '로그인',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: '회원가입',
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
