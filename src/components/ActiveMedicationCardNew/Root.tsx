import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface RootProps extends ViewProps {}

export default function Root({ style, ...rest }: RootProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: colors.primary[50],
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
