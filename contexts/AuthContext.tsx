import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isSignedIn: boolean; // 인증 상태
  setIsSignedIn: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false, // 인증 상태 초기값
  setIsSignedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // 앱 시작 시 토큰 확인
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsSignedIn(!!token); // 토큰 존재 여부에 따라 인증 상태 설정
    };
    checkToken();
  }, []);

  // 전역으로 로그인 상태 제공
  return <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>{children}</AuthContext.Provider>;
}
