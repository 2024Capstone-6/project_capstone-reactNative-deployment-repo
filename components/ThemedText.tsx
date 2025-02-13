import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'defaultRegular' | 'pageTitle' | 'title' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({ style, type = 'default', className, ...rest }: ThemedTextProps) {
  return (
    <Text
      className={className}
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'defaultRegular' ? styles.defaultRegular : undefined,
        type === 'pageTitle' ? styles.pageTitle : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultRegular: {
    fontSize: 20,
    fontWeight: 'regular',
    lineHeight: 24,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: 'medium',
    lineHeight: 32,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 25,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#ff6b6b',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
