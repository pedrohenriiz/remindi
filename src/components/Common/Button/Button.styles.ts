import { Theme } from '../../../theme/themes';

export const getContainerStyles = (variant: string, theme: Theme) =>
  ({
    primary: {
      backgroundColor: theme.colors.primary[500],
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: 2,
      borderColor: theme.colors.primary[500],
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  })[variant];

export const labelColors = (variant: string, theme: Theme) =>
  ({
    primary: theme.colors.white,
    secondary: theme.colors.primary[500],
    text: theme.colors.primary[500],
  })[variant];

export const iconColors = (variant: string, theme: Theme) =>
  ({
    primary: theme.colors.white,
    secondary: theme.colors.primary[500],
    text: theme.colors.primary[500],
  })[variant];

export const paddingSizes = (size: string, theme: Theme) =>
  ({
    sm: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    md: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    lg: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
    },
  })[size];

export const fontSizes = (size: string, theme: Theme) =>
  ({
    sm: theme.typography.sizes.caption,
    md: theme.typography.sizes.label,
    lg: theme.typography.sizes.body,
  })[size];

export const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
} as const;
