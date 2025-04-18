import { ERROR_MESSAGES } from '@/constants/ErrorMessages';

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegExp.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.REGISTER.INVALID_EMAIL };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]{6,16}$/;
  if (!passwordRegExp.test(password)) {
    return { isValid: false, error: ERROR_MESSAGES.REGISTER.PASSWORD_REQUIREMENTS };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.REGISTER.PASSWORD_MISMATCH };
  }
  return { isValid: true };
};
