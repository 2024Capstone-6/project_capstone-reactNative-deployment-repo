import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../../config/env';

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

  const handlePasswordBlur = () => {
    const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]{6,16}$/;
    if (!passwordRegExp.test(password)) {
      setError('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
      setPwErr(true);
    } else {
      setError('');
      setPwErr(false);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (password !== checkPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setConfirmPwErr(true);
    } else {
      setError('');
      setConfirmPwErr(false);
    }
  };

  const handleEmailBlur = () => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegExp.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      setEmailErr(true);
    } else {
      setError('');
      setEmailErr(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !checkPassword) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      handleEmailBlur();
      if (emailErr) return;

      handlePasswordBlur();
      if (pwErr) return;

      handleConfirmPasswordBlur();
      if (confirmPwErr) return;

      const requestData = {
        name: name.trim(),
        email: email.trim(),
        password,
        social_check: 0 || null,
      };

      console.log('전송할 데이터 타입:', {
        name: typeof name,
        email: typeof email,
        password: typeof password,
      });
      console.log('전체 요청 정보:', {
        url: `${ENV.API_URL}/auth/signup`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });

      const response = await fetch(`${ENV.API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('응답 헤더:', {
        contentType: response.headers.get('content-type'),
        status: response.status,
      });

      const responseText = await response.text();
      console.log('서버 응답 본문:', responseText);

      if (response.ok) {
        alert('회원가입 성공');
        router.replace('/login');
      } else {
        try {
          const data = JSON.parse(responseText);
          setError(data.message || data.errors || '회원가입에 실패했습니다.');
        } catch (e) {
          setError('서버 응답을 처리할 수 없습니다: ' + responseText);
        }
      }
    } catch (err: any) {
      console.error('회원가입 에러:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || '회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <View className="flex-1 h-full items-center justify-center" style={{ backgroundColor: Colors.tint }}>
      <View className="h-[70%] w-[75%] rounded-[8px] p-4 justify-center" style={{ backgroundColor: Colors.background }}>
        <Text style={styles.title}>회원가입</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, emailErr ? styles.inputError : null]}
          placeholder="이름"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={[styles.input, emailErr ? styles.inputError : null]}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          onBlur={handleEmailBlur}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, pwErr ? styles.inputError : null, { flex: 1 }]}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            onBlur={handlePasswordBlur}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, confirmPwErr ? styles.inputError : null, { flex: 1 }]}
            placeholder="비밀번호 확인"
            value={checkPassword}
            onChangeText={setCheckPassword}
            onBlur={handleConfirmPasswordBlur}
            secureTextEntry={!showCheckPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCheckPassword(!showCheckPassword)}>
            <Text>{showCheckPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="rounded-md p-3 mt-4"
          style={{ backgroundColor: Colors.tint }}
        >
          <Text className="text-white text-center font-bold">가입하기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.loginLink}>이미 계정이 있으신가요? 로그인</Text>
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
  inputError: {
    borderColor: 'red',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: 40,
    justifyContent: 'center',
  },
  loginLink: {
    marginTop: 15,
    textAlign: 'center',
    color: Colors.tint,
  },
});
