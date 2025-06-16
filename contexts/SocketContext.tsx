import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      if (socket?.connected) {
        console.log('이미 연결된 소켓이 있습니다.');
        return;
      }

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log('토큰이 없어 소켓 연결을 시도하지 않습니다.');
        return;
      }

      const socketInstance = io(ENV.SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        secure: true,
        rejectUnauthorized: false,
      });

      socketInstance.on('connect', () => {
        console.log('소켓 연결 성공');
        setIsConnected(true);
      });

      socketInstance.on('connect_error', (error) => {
        console.log('소켓 연결 에러:', error.message);
        setIsConnected(false);
      });

      socketInstance.on('disconnect', () => {
        console.log('소켓 연결 해제');
        setIsConnected(false);
      });

      setSocket(socketInstance);
    } catch (error) {
      console.error('소켓 연결 중 에러 발생:', error);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  // 컴포넌트 언마운트 시 소켓 연결 해제
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>{children}</SocketContext.Provider>
  );
};
