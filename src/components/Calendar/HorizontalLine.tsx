import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface HorizontalLineProps extends ViewProps {}

export default function HorizontalLine({
  style,
  ...rest
}: HorizontalLineProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      height: 1,
      backgroundColor: colors.primary[50],
      marginBottom: 8,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
