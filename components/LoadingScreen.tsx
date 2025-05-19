import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading your learning journey...' }: LoadingScreenProps) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image
          source={require('../assets/images/Clover.gif')}
          style={styles.logo}
          contentFit="contain"
          transition={1000}
        />
        <Text style={styles.title}>Nihon Clover</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});
