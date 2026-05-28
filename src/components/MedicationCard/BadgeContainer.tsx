import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ContentProps extends ViewProps {}

export function BadgeContainer({ style, ...rest }: ContentProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
