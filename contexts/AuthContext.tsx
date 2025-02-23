import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // 앱 시작 시 토큰 확인
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsSignedIn(!!token);
    };
    checkToken();
  }, []);

  return <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>{children}</AuthContext.Provider>;
}
