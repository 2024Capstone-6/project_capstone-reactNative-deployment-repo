import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const socketInstance = io(ENV.API_URL, {
          auth: {
            token,
          },
        });

        socketInstance.on('connect', () => {
          console.log('Socket connected');
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });

        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();
  }, []);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}
