import React from 'react';
import { View, Text } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { useTheme } from '../../../../../../theme/ThemeProvider';
import { MedicationFormData } from '../../../../validationSchema';
import { WeekDaySelector } from '../../../../../../components/WeekDaySelector';

interface WeekDaysSectionProps {
  control: Control<MedicationFormData>;
  errors: FieldErrors<MedicationFormData>;
}

export function WeekDaysSection({ control, errors }: WeekDaysSectionProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.semibold,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        Dias da semana
      </Text>

      <Controller
        control={control}
        name='weekDays'
        render={({ field: { onChange, value } }) => (
          <WeekDaySelector selectedDays={value} onChange={onChange} />
        )}
      />

      {errors.weekDays && (
        <Text
          style={{
            fontSize: typography.sizes.caption,
            color: colors.error[500],
          }}
        >
          {errors.weekDays.message}
        </Text>
      )}
    </View>
  );
}
