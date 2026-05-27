import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface IconContainerProps extends ViewProps {}

export default function IconContainer({ style, ...rest }: IconContainerProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      width: 52,
      height: 52,
      borderRadius: borderRadius.full,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing.md,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
