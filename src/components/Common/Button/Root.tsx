import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { ButtonContext } from './Button.context';
import { getContainerStyles, paddingSizes } from './Button.styles';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface RootProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Root({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: RootProps) {
  const { theme } = useTheme();
  const { spacing, borderRadius } = theme;

  const isDisabled = disabled || loading;

  return (
    <ButtonContext.Provider
      value={{ variant, size, loading, disabled: !!isDisabled }}
    >
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            borderRadius: borderRadius.lg,
            opacity: isDisabled ? 0.5 : 1,
            width: fullWidth ? '100%' : undefined,
          },
          getContainerStyles(variant, theme),
          paddingSizes(size, theme),
          style,
        ]}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    </ButtonContext.Provider>
  );
}
