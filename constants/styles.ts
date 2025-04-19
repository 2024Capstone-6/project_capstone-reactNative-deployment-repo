import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const cardStyles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.6,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.background,
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  front: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  back: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.tint,
  },
});
