export const ERROR_MESSAGES = {
  LOGIN: {
    EMPTY_FIELDS: '이메일과 비밀번호를 입력해주세요.',
    INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
    LOGIN_FAILED: '로그인에 실패했습니다.',
    TOKEN_MISSING: 'Token is missing',
  },
  REGISTER: {
    PASSWORD_REQUIREMENTS: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
    INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
    REGISTER_FAILED: '회원가입에 실패했습니다.',
  },
} as const;
