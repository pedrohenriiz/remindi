import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface RootProps extends ViewProps {}

export default function Root({ style, ...rest }: RootProps) {
  const { theme } = useTheme();
  const { borderRadius } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: '#FBFBFB',
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
