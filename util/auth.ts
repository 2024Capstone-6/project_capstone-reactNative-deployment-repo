import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthHeaders = async (contentType = false) => {
  const token = await AsyncStorage.getItem('userToken');
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};
