import { Animated } from 'react-native';

export const createFlipAnimation = () => {
  const flipAnimation = new Animated.Value(0);

  const flipToFront = () => {
    Animated.spring(flipAnimation, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const flipToBack = () => {
    Animated.spring(flipAnimation, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return {
    flipAnimation,
    frontInterpolate,
    backInterpolate,
    flipToFront,
    flipToBack,
  };
};
