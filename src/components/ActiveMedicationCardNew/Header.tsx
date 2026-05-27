import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface HeaderProps extends ViewProps {}

export default function Header({ style, ...rest }: HeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.primary[200],
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
