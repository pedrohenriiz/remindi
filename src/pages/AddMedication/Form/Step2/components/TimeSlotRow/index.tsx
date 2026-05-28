import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../../../../../../theme/ThemeProvider';
import { Icon } from '../../../../../../components/Common/Icon';

interface TimeSlotRowProps {
  time: string;
  onDelete?: () => void;
  onTimeChange?: (time: string) => void;
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

export function TimeSlotRow({
  time,
  onDelete,
  onTimeChange,
}: TimeSlotRowProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const [showPicker, setShowPicker] = useState(false);

  function handlePickerChange(_event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      onTimeChange?.(formatDateToTime(date));
    }
  }

  function handleConfirmIOS() {
    setShowPicker(false);
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.background.secondary,
          borderRadius: borderRadius.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: borderRadius.md,
            backgroundColor: colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name='Clock' size={18} color={colors.primary[500]} />
        </View>

        {/* Toque no horário para abrir o picker */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
          style={{ flex: 1, gap: 2 }}
          testID='edit-manual-hour'
        >
          <Text
            style={{
              fontSize: typography.sizes.label,
              fontWeight: typography.weights.semibold,
              color: colors.text.brand,
            }}
          >
            {time}
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.text.tertiary,
            }}
          >
            Toque para editar
          </Text>
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: borderRadius.md,
              backgroundColor: colors.error[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}
            testID='button-delete-hour'
          >
            <Icon name='Trash2' size={16} color={colors.error[500]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Picker Android */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          mode='time'
          display='default'
          value={parseTimeToDate(time)}
          onChange={handlePickerChange}
          is24Hour
          testID='timepicker'
        />
      )}

      {/* Picker iOS */}
      {showPicker && Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.md,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border.default,
          }}
        >
          <DateTimePicker
            mode='time'
            display='spinner'
            value={parseTimeToDate(time)}
            onChange={handlePickerChange}
            is24Hour
            locale='pt-BR'
            style={{ height: 120 }}
          />
          <TouchableOpacity
            onPress={handleConfirmIOS}
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              paddingVertical: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border.default,
            }}
          >
            <Text
              style={{
                fontSize: typography.sizes.label,
                fontWeight: typography.weights.semibold,
                color: colors.primary[500],
              }}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
