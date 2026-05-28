import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { useTheme } from '../../../../../../theme/ThemeProvider';
import { MedicationFormData } from '../../../../validationSchema';
import { WeekDaySelector } from '../../components/WeekDaySelector';

interface WeekDaysSectionProps {
  control: Control<MedicationFormData>;
  errors: FieldErrors<MedicationFormData>;
}

export function WeekDaysSection({ control, errors }: WeekDaysSectionProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography, borderRadius } = theme;

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

      {/* Toggle de recorrência */}
      <Controller
        control={control}
        name='recurring'
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.background.secondary,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontSize: typography.sizes.label,
                  fontWeight: typography.weights.medium,
                  color: colors.text.primary,
                }}
              >
                Repetir toda semana
              </Text>
              <Text
                style={{
                  fontSize: typography.sizes.caption,
                  color: colors.text.tertiary,
                }}
              >
                Gera doses automaticamente nos dias selecionados
              </Text>
            </View>

            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{
                false: colors.border.default,
                true: colors.primary[400],
              }}
              thumbColor={
                value ? colors.primary[600] : colors.background.primary
              }
              testID='switch-recurring'
              accessibilityLabel={`switch-recurring`}
              accessibilityState={{ selected: value }}
            />
          </View>
        )}
      />
    </View>
  );
}
