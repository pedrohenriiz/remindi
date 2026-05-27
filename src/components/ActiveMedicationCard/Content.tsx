import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ContentProps extends ViewProps {}

export default function Content({ style, ...rest }: ContentProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    { gap: spacing.sm, flex: 1 },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
