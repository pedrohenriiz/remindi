import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../../../../../../theme/ThemeProvider';
import { Icon } from '../../../../../../components/Common/Icon';

const INTERVAL_OPTIONS = [4, 6, 8, 12, 24];

interface IntervalSectionProps {
  interval: number | undefined;
  firstDose: string;
  schedules: string[];
  onIntervalChange: (value: number) => void;
  onFirstDoseChange: (value: string) => void;
}

function parseTimeToDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatDateToTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function IntervalSection({
  interval,
  firstDose,
  schedules,
  onIntervalChange,
  onFirstDoseChange,
}: IntervalSectionProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const [showPicker, setShowPicker] = useState(false);

  function handlePickerChange(_event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      onFirstDoseChange(formatDateToTime(date));
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.background.primary,
        gap: spacing.md,
      }}
    >
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
          Intervalo
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {INTERVAL_OPTIONS.map((option) => {
            const isSelected = interval === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onIntervalChange(option)}
                activeOpacity={0.7}
                style={{
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.md,
                  borderRadius: borderRadius.full,
                  backgroundColor: isSelected
                    ? colors.primary[500]
                    : colors.background.secondary,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? colors.primary[500]
                    : colors.border.default,
                }}
                testID={`interval-${option}`}
                accessibilityLabel={`interval-${option}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={{
                    fontSize: typography.sizes.label,
                    fontWeight: typography.weights.semibold,
                    color: isSelected ? colors.white : colors.text.secondary,
                  }}
                >
                  {option}h
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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
          Primeira dose
        </Text>

        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.background.secondary,
            borderWidth: 1,
            borderColor: colors.border.default,
            alignSelf: 'flex-start',
          }}
          testID='first-dose'
        >
          <Text
            style={{
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.semibold,
              color: colors.text.primary,
              flex: 1,
            }}
          >
            {firstDose}
          </Text>
          <Icon
            name='Clock'
            size={16}
            color={colors.text.tertiary}
            style={{ marginLeft: spacing.sm }}
          />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            mode='time'
            display='default'
            value={parseTimeToDate(firstDose)}
            onChange={handlePickerChange}
            is24Hour
          />
        )}
      </View>

      {schedules.length > 0 && (
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
            Horários gerados
          </Text>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}
          >
            {schedules.map((time, index) => (
              <View
                key={`${time}-${index}`}
                style={{
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.md,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.primary[50],
                  borderWidth: 1,
                  borderColor: colors.primary[200],
                }}
                testID={`time-index-${index}`}
              >
                <Text
                  style={{
                    fontSize: typography.sizes.label,
                    fontWeight: typography.weights.semibold,
                    color: colors.primary[600],
                  }}
                >
                  {time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
