import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from '../Common/Icon';

interface TimeSlotRowProps {
  time: string;
  label?: string;
  onDelete?: () => void;
}

export function TimeSlotRow({ time, onDelete }: TimeSlotRowProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  return (
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

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontSize: typography.sizes.label,
            fontWeight: typography.weights.semibold,
            color: colors.text.brand,
          }}
        >
          {time}
        </Text>
      </View>

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
        >
          <Icon name='Trash2' size={16} color={colors.error[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
}
