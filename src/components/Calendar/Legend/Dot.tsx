import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface DotProps extends ViewProps {
  color: string;
}

export default function Dot({ color, style, ...rest }: DotProps) {
  const { theme } = useTheme();
  const { borderRadius } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      width: 7,
      height: 7,
      borderRadius: borderRadius.full,
      backgroundColor: color,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
