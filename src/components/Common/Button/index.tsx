import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Icon, IoniconsName } from '../Icon';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: IoniconsName;
  iconRight?: IoniconsName;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const isDisabled = disabled || loading;

  const containerStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.background.primary,
      borderWidth: 2,
      borderColor: colors.primary[500],
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const labelColors = {
    primary: colors.white,
    secondary: colors.primary[500],
    text: colors.primary[500],
  };

  const iconColors = {
    primary: colors.white,
    secondary: colors.primary[500],
    text: colors.primary[500],
  };

  const paddingSizes = {
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  };

  const fontSizes = {
    sm: typography.sizes.caption,
    md: typography.sizes.label,
    lg: typography.sizes.body,
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
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
        containerStyles[variant],
        paddingSizes[size],
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size='small' color={iconColors[variant]} />
      ) : (
        <>
          {iconLeft && (
            <Icon
              name={iconLeft}
              size={iconSizes[size]}
              color={iconColors[variant]}
            />
          )}

          <Text
            style={{
              fontSize: fontSizes[size],
              fontWeight: typography.weights.semibold,
              color: labelColors[variant],
            }}
          >
            {label}
          </Text>

          {iconRight && (
            <Icon
              name={iconRight}
              size={iconSizes[size]}
              color={iconColors[variant]}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
