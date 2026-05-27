import { Text, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useButtonContext } from './Button.context';
import { labelColors, fontSizes } from './Button.styles';

interface LabelProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function Label({ children, style }: LabelProps) {
  const { theme } = useTheme();
  const { typography } = theme;
  const { variant, size } = useButtonContext();

  return (
    <Text
      style={[
        {
          fontSize: fontSizes(size, theme),
          fontWeight: typography.weights.semibold,
          color: labelColors(variant, theme),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
