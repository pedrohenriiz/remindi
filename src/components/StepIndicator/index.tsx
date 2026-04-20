import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.xs,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isDone = index < currentStep - 1;
        const isActive = index === currentStep - 1;

        const backgroundColor = isDone
          ? colors.success[500]
          : isActive
            ? colors.primary[500]
            : colors.neutral[200];

        const width = isActive ? 40 : 20;

        return (
          <View
            key={index}
            style={{
              height: 8,
              width,
              borderRadius: borderRadius.lg,
              backgroundColor,
            }}
          />
        );
      })}
    </View>
  );
}
