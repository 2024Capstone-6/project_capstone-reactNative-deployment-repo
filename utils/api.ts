import { HttpClient } from './httpClient';
import { ApiResponse } from '../types';
import { ERROR_MESSAGES } from '../constants/ErrorMessages';

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<{ accessToken: string; userId: string }>> => {
  try {
    const response = await HttpClient.post<{ accessToken: string; userId: string }>('/auth/signup', {
      name,
      email,
      password,
    });
    return { data: response };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: error instanceof Error ? error.message : ERROR_MESSAGES.REGISTER.REGISTER_FAILED,
    };
  }
};
