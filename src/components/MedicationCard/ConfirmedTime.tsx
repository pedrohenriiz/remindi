import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ConfirmedTimeProps extends TextProps {}

export function ConfirmedTime({ style, ...rest }: ConfirmedTimeProps) {
  const { theme } = useTheme();
  const { typography, colors } = theme;

  const defaultStyles = [
    {
      fontSize: typography.sizes.caption,
      color: colors.text.tertiary,
    },
    style,
  ];

  return <Text style={defaultStyles} {...rest} />;
}
