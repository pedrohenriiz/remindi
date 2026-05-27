import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useInputContext } from './Input.context';

interface FieldProps extends TextInputProps {}

export function Field({ ...rest }: FieldProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const { editable, setFocused } = useInputContext();

  return (
    <TextInput
      style={{
        flex: 1,
        fontSize: typography.sizes.label,
        color: colors.text.primary,
        paddingVertical: spacing.md,
      }}
      placeholderTextColor={colors.text.tertiary}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      editable={editable}
      {...rest}
    />
  );
}
