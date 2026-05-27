import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ButtonContainerProps extends ViewProps {}

export default function ButtonContainer({
  style,
  ...rest
}: ButtonContainerProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
