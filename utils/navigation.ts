import { router } from 'expo-router';

export const navigateToHome = () => {
  router.replace('/');
};

export const navigateToLogin = () => {
  router.replace('/login');
};
