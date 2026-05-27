import { StyleProp, Text, TextStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface LabelProps extends ViewProps {}

export default function Label({ style, ...rest }: LabelProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const defaultStyle: StyleProp<TextStyle> = [
    {
      fontSize: typography.sizes.label,
      color: colors.neutral[600],
    },
    style,
  ];

  return <Text style={defaultStyle} {...rest} />;
}
