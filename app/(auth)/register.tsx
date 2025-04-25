import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../constants/Colors';
import { ERROR_MESSAGES } from '../../constants/ErrorMessages';
import { validateEmail, validatePassword, validatePasswordMatch } from '../../utils/validation';
import { registerUser } from '../../utils/api';
import { navigateToHome } from '../../utils/navigation';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [error, setError] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [confirmPwErr, setConfirmPwErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const handleEmailBlur = () => {
    const { isValid, error } = validateEmail(email);
    setEmailErr(!isValid);
    if (!isValid) {
      setError(error || '');
    }
  };

  const handlePasswordBlur = () => {
    const { isValid, error } = validatePassword(password);
    setPwErr(!isValid);
    if (!isValid) {
      setError(error || '');
    }
  };

  const handleConfirmPasswordBlur = () => {
    const { isValid, error } = validatePasswordMatch(password, checkPassword);
    setConfirmPwErr(!isValid);
    if (!isValid) {
      setError(error || '');
    }
  };

  const handleRegister = async () => {
    try {
      // 입력값 유효성 검사
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);
      const passwordMatchValidation = validatePasswordMatch(password, checkPassword);

      if (!emailValidation.isValid) {
        setError(emailValidation.error || '');
        setEmailErr(true);
        return;
      }

      if (!passwordValidation.isValid) {
        setError(passwordValidation.error || '');
        setPwErr(true);
        return;
      }

      if (!passwordMatchValidation.isValid) {
        setError(passwordMatchValidation.error || '');
        setConfirmPwErr(true);
        return;
      }

      // 회원가입 요청
      const result = await registerUser(name, email, password);

      if (result.error) {
        throw new Error(result.error);
      }

      // 회원가입 성공 처리
      if (result.data) {
        await AsyncStorage.setItem('userToken', result.data.accessToken || '');
        await AsyncStorage.setItem('userId', result.data.userId || '');

        // 성공 메시지 표시
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigateToHome(),
          },
        ]);
      } else {
        // 서버에서 응답이 없지만 에러도 없는 경우 (회원가입 성공)
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigateToHome(),
          },
        ]);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.REGISTER.REGISTER_FAILED);
    }
  };

  return (
    <View style={styles.container}>
      <View className="w-[80%] h-[60%] bg-white rounded-lg p-4 items-center justify-center">
        <Text style={styles.title}>회원가입</Text>
        <TextInput style={styles.input} placeholder="이름" value={name} onChangeText={setName} autoCapitalize="none" />
        <TextInput
          style={[styles.input, emailErr && styles.errorInput]}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          onBlur={handleEmailBlur}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, pwErr && styles.errorInput]}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            onBlur={handlePasswordBlur}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <TouchableOpacity
            className="justify-center items-center"
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? '🙄' : '🫣'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, confirmPwErr && styles.errorInput]}
            placeholder="비밀번호 확인"
            value={checkPassword}
            onChangeText={setCheckPassword}
            onBlur={handleConfirmPasswordBlur}
            secureTextEntry={!showCheckPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <TouchableOpacity
            className="justify-center items-center"
            style={styles.showPasswordButton}
            onPress={() => setShowCheckPassword(!showCheckPassword)}
          >
            <Text>{showCheckPassword ? '🙄' : '🫣'}</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
          <Text>이미 계정이 있으신가요? 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.tint,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Colors.tint,
  },
  input: {
    width: '100%',
    height: 35,
    borderWidth: 1,
    borderColor: Colors.tint,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: Colors.tint,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    color: Colors.tint,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 35,
    backgroundColor: Colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
  },
});
