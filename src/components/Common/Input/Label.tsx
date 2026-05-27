import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface LabelProps extends TextProps {
  children: React.ReactNode;
}

export function Label({ children, style, ...rest }: LabelProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const defaultStyle: StyleProp<TextStyle> = [
    {
      fontSize: typography.sizes.label,
      fontWeight: typography.weights.bold,
      color: colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    style,
  ];

  return (
    <Text style={defaultStyle} {...rest}>
      {children}
    </Text>
  );
}
