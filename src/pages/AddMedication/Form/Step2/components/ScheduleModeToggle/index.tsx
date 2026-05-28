import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../../theme/ThemeProvider';

export type ScheduleMode = 'manual' | 'interval';

interface ScheduleModeToggleProps {
  mode: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
}

const OPTIONS: { label: string; value: ScheduleMode }[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Por intervalo', value: 'interval' },
];

export function ScheduleModeToggle({
  mode,
  onChange,
}: ScheduleModeToggleProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.sm,
      }}
    >
      {OPTIONS.map((option) => {
        const isActive = mode === option.value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive
                ? colors.primary[500]
                : colors.background.secondary,
              height: 82,
            }}
            testID={`schedule-mode-${option.value}`}
            accessibilityLabel={`schedule-mode-${option.value}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={{
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.semibold,
                color: isActive ? colors.white : colors.black,
                textTransform: 'uppercase',
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
