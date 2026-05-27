import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useInputContext } from './Input.context';

interface FormControl extends ViewProps {}

export function FormControl({ style, ...rest }: FormControl) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const { focused, error, editable } = useInputContext();

  const borderColor = error
    ? colors.error[500]
    : focused
      ? colors.primary[500]
      : colors.border.default;

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: editable
        ? colors.background.secondary
        : colors.neutral[200],
      borderWidth: 1,
      borderColor,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
