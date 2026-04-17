import { borderRadius } from '../borderRadius';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const lightTheme = {
  name: 'light' as const,
  spacing,
  borderRadius,
  typography,

  colors: {
    background: {
      primary: colors.white,
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[400],
      inverse: colors.white,
      brand: colors.primary[500],
    },
    border: {
      default: colors.neutral[200],
      strong: colors.neutral[300],
      brand: colors.primary[500],
      success: colors.success[400],
      error: colors.error[400],
    },
    status: {
      administered: {
        background: colors.success[100],
        text: colors.success[700],
        icon: colors.success[500],
      },
      pending: {
        background: colors.primary[50],
        text: colors.primary[600],
        icon: colors.primary[400],
      },
      missed: {
        background: colors.error[100],
        text: colors.error[700],
        icon: colors.error[500],
      },
      skipped: {
        background: colors.neutral[100],
        text: colors.neutral[600],
        icon: colors.neutral[400],
      },
    },
    primary: colors.primary,
    secondary: colors.secondary,
    neutral: colors.neutral,
    success: colors.success,
    error: colors.error,
    white: colors.white,
    black: colors.black,
  },
};

export type Theme = typeof lightTheme;
