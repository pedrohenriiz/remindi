import { Text, TextProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface ErrorProps extends TextProps {
  error?: string;
}

export function Error({ error }: ErrorProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  if (!error) return null;

  return (
    <Text
      style={{ fontSize: typography.sizes.caption, color: colors.error[500] }}
    >
      {error}
    </Text>
  );
}
