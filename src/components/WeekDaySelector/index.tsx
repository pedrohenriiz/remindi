import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const DAYS = [
  { label: 'D', value: 0 },
  { label: 'S', value: 1 },
  { label: 'T', value: 2 },
  { label: 'Q', value: 3 },
  { label: 'Q', value: 4 },
  { label: 'S', value: 5 },
  { label: 'S', value: 6 },
];

interface WeekDaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

export function WeekDaySelector({
  selectedDays,
  onChange,
}: WeekDaySelectorProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  function handleToggle(value: number) {
    const isSelected = selectedDays.includes(value);

    if (isSelected) {
      onChange(selectedDays.filter((d) => d !== value));
    } else {
      onChange([...selectedDays, value].sort());
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.xs,
      }}
    >
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.value);

        return (
          <TouchableOpacity
            key={day.value}
            onPress={() => handleToggle(day.value)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: borderRadius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSelected
                ? colors.primary[500]
                : colors.primary[50],
              borderWidth: 1,
              borderColor: isSelected
                ? colors.primary[500]
                : colors.primary[200],
            }}
            testID={`week-day-${day.value}`}
            accessibilityLabel={`week-day-${day.value}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={{
                fontSize: typography.sizes.caption,
                fontWeight: typography.weights.bold,
                color: isSelected ? colors.white : colors.primary[400],
                textTransform: 'uppercase',
              }}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
